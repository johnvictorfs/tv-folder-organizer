import { useState } from "react"

import {
  Add,
} from '@mui/icons-material'
import { api } from "~/utils/api"
import { Button, Modal, ModalDialog } from "@mui/joy"
import { Skeleton } from '@mui/lab'
import { FileTree } from "~/components/directory/FileTree"

export const NewDirectory: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [includeHiddenDirectories, _setIncludeHiddenDirectories] = useState(false)
  const [currentDirectory, setCurrentDirectory] = useState<string>()

  const { data: directoryTree } = api.directory.getDirectoryStructure.useQuery(
    { currentPath: currentDirectory, includeHiddenDirectories },
    {
      enabled: modalOpen
    }
  );

  return (
    <>
      <Button onClick={() => setModalOpen(true)} endDecorator={<Add />}>
        Add Directory
      </Button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <ModalDialog size="lg" sx={{ p: 2, minHeight: 200, minWidth: 700 }}>
          Adding new Directory to be tracked

          {directoryTree ? (
            <FileTree
              directoryTree={directoryTree}
              onChangeDirectory={setCurrentDirectory}
            />
          ) : (
            <Skeleton />
          )}
        </ModalDialog>
      </Modal>
    </>
  )
}
