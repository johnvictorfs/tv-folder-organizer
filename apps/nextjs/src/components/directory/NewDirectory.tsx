import { useState } from "react"

import {
  Add,
} from '@mui/icons-material'
import { api } from "~/utils/api"
import { Button, Input, Modal, ModalDialog } from "@mui/joy"
import { Skeleton } from '@mui/lab'
import { FileTree } from "~/components/directory/FileTree"
import { useDebounced } from "~/utils/input"

export const NewDirectory: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [basePath, setBasePath] = useState('~')

  const debouncedBasePath = useDebounced(basePath, 1200)

  const { data: directoryTree } = api.directory.getDirectoryStructure.useQuery(
    {
      includeHiddenDirectories: false,
      currentPath: debouncedBasePath
    },
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

          {directoryTree && (
            <Input
              sx={{ mt: 2 }}
              placeholder="Base Path"
              defaultValue={directoryTree?.currentLocation}
              onChange={({ target }) => {
                setBasePath(target.value)
              }}
            />
          )}

          {directoryTree ? (
            <FileTree rootPath={directoryTree} />
          ) : (
            <Skeleton />
          )}
        </ModalDialog>
      </Modal>
    </>
  )
}
