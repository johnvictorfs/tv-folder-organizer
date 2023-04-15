import { useMemo, useState } from "react"

import {
  Add,
} from '@mui/icons-material'
import { api } from "~/utils/api"
import { Button, Input, Modal, ModalDialog } from "@mui/joy"
import { Skeleton } from '@mui/lab'
import { FileTree } from "~/components/directory/FileTree"
import { useDebounced } from "~/utils/input"
import { toast } from "react-toastify"

export const NewDirectory: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [basePath, setBasePath] = useState('~')
  const [category, setCategory] = useState('')
  const [selectedPath, setSelectedPath] = useState('')

  const debouncedBasePath = useDebounced(basePath, 1200)

  const addDirectory = api.directory.add.useMutation({
    onSuccess() {
      setCategory('')
      setSelectedPath('')
      setModalOpen(false)
      toast.success("Directory added to be tracked successfully");
    }
  })

  const { data: directoryTree } = api.directory.getDirectoryStructure.useQuery(
    {
      includeHiddenDirectories: false,
      currentPath: debouncedBasePath
    },
    {
      enabled: modalOpen
    }
  );

  const createButtonMessage = useMemo(() => {
    if (!selectedPath) {
      return 'Select a directory'
    }

    if (!category) {
      return 'Enter a category'
    }

    return `Add '${selectedPath}' to be tracked as '${category}'`
  }, [selectedPath, category])

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

          <Input
            sx={{ mt: 2 }}
            placeholder="Category (Ex: Movies, TV Shows, etc)"
            value={category}
            onChange={({ target }) => {
              setCategory(target.value)
            }}
          />

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
            <FileTree rootPath={directoryTree} onSelectPath={setSelectedPath} />
          ) : (
            <Skeleton />
          )}

          <Button
            loading={addDirectory.isLoading}
            sx={{ mt: 2 }}
            disabled={!category || !selectedPath}
            onClick={() => {
              addDirectory.mutate({
                category,
                location: selectedPath
              })
            }}
          >
            {createButtonMessage}
          </Button>
        </ModalDialog>
      </Modal>
    </>
  )
}
