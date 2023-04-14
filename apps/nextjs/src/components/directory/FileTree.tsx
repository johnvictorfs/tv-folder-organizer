import type { RouterOutputs } from "@acme/api"
import { Folder, FolderOpen } from "@mui/icons-material";
import { SvgIcon, type SvgIconProps, styled } from "@mui/joy"
import { TreeItem, type TreeItemProps, TreeView, treeItemClasses, type TreeItemContentProps } from "@mui/lab"
import { Collapse, Skeleton } from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";
import { useSpring, animated } from '@react-spring/web';
import { useState } from "react";
import { api } from "~/utils/api";

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = styled((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  marginRight: 20,
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${theme.palette.text.primary}`
  }
}));

export type FileTreeItemProps = {
  directoryPath: string
  includeHiddenDirectories: boolean
  expanded: string[]
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  directoryPath,
  includeHiddenDirectories,
  expanded
}) => {
  const { data: directoryTree, isFetched } = api.directory.getDirectoryStructure.useQuery(
    {
      currentPath: directoryPath,
      includeHiddenDirectories,
    },
    {
      enabled: expanded.includes(directoryPath)
    }
  );

  const hasNoSubDirectories = isFetched && !directoryTree?.subDirectories.length

  // Don't split rooth path by '/', so it's not empty
  const folderName = directoryPath === '/' ? directoryPath : directoryPath.split('/').pop()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Typings for TreeItemContentProps are incorrect
  const contentProps: TreeItemContentProps = {
    style: {
      borderRadius: 8,
      padding: 12,
      marginTop: 4
    }
  }

  return (
    <StyledTreeItem
      nodeId={directoryPath}
      label={folderName}
      expandIcon={hasNoSubDirectories ? null : <Folder color="success" />}
      collapseIcon={hasNoSubDirectories ? null : <FolderOpen color="action" />}
      ContentProps={contentProps}
    >
      {directoryTree?.subDirectories.map((directory) => (
        <FileTreeItem
          key={directory}
          directoryPath={`${directoryPath}/${directory}`}
          includeHiddenDirectories={includeHiddenDirectories}
          expanded={expanded}
        />
      ))}

      {!isFetched && !directoryTree && (
        <StyledTreeItem ContentProps={contentProps} nodeId={directoryPath + 'sub'} label={<Skeleton />} />
      )}
    </StyledTreeItem>
  )
}

export type FileTreeProps = {
  rootPath: RouterOutputs['directory']['getDirectoryStructure']
}

export const FileTree: React.FC<FileTreeProps> = ({ rootPath: directoryTree }) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  return (
    <TreeView
      aria-label="file system navigator"
      defaultEndIcon={<CloseSquare />}
      expanded={expanded}
      selected={selected}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        mt: 2,
        maxHeight: 600
      }}
    >
      <FileTreeItem
        directoryPath={directoryTree.currentLocation}
        includeHiddenDirectories={false}
        expanded={expanded}
      />
    </TreeView>
  )
}
