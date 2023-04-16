import { useEffect, useState } from "react"

import {
  Add,
} from '@mui/icons-material'
import { Skeleton } from '@mui/lab'
import { Button, Input, Modal, ModalDialog, FormControl, FormHelperText } from "@mui/joy"
import { toast } from "react-toastify"
import { useForm } from 'react-hook-form'

import { type RouterInputs, api } from "~/utils/api"
import { FileTree } from "~/components/directory/FileTree"
import { ErrorableFormControl } from "~/components/inputs/ErrorableFormControl"
import { useDebounced } from "~/utils/input"

export const NewDirectory: React.FC = () => {
  const { register, unregister, handleSubmit, setValue, reset, clearErrors, formState: { errors } } = useForm<
    RouterInputs['directory']['add']
  >({
    defaultValues: {
      category: '',
      location: '',
      updateFrequencyInMinutes: 60
    }
  });

  const [modalOpen, setModalOpen] = useState(false)
  const [basePath, setBasePath] = useState('~')

  const debouncedBasePath = useDebounced(basePath, 1200)

  const closeModal = () => {
    setModalOpen(false)
    reset()
  }

  const addDirectory = api.directory.add.useMutation({
    onSuccess() {
      reset()
      closeModal()
      toast.success("Directory added successfully");
    }
  })

  useEffect(() => {
    register('location', { required: 'Select a directory' });

    return () => {
      unregister('location');
    };
  }, [register, unregister]);

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
        onClose={closeModal}
      >
        <ModalDialog size="lg" sx={{
          p: 2,
          minHeight: 200,
          width: {
            xs: '100%',
            sm: '100%',
            md: '50vw',
            lg: '50vw'
          }
        }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit(data => {
                addDirectory.mutate(data)
              })(event)
            }}>
            Adding new Directory to be tracked

            <FormControl>
              <Input
                sx={{ mt: 2 }}
                placeholder="Category (Ex: Movies, TV Shows, etc)"
                error={!!errors.category}
                {...register('category', { required: 'Select or create a new Category' })}
              />

              <FormHelperText>{errors.category?.message}</FormHelperText>
            </FormControl>

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
              <ErrorableFormControl errorMessage={errors.location?.message}>
                <FileTree
                  rootPath={directoryTree}
                  onSelectPath={(path) => {
                    setValue('location', path)
                    clearErrors('location')
                  }}
                />
              </ErrorableFormControl>
            ) : (
              <Skeleton />
            )}

            <Button
              loading={addDirectory.isLoading}
              sx={{ mt: 2, mb: 2 }}
              type="submit"
            >
              Add directory
            </Button>
          </form>
        </ModalDialog>
      </Modal>
    </>
  )
}
