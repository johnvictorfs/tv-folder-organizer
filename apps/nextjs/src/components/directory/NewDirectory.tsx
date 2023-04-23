import { newDirectorySchema } from '@local/validators'
import {
  Add,
} from '@mui/icons-material'
import { Button, Input, Modal, ModalDialog, FormControl, FormHelperText } from '@mui/joy'
import { Skeleton } from '@mui/lab'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { FileTree } from '~/components/directory/FileTree'
import { ErrorableFormControl } from '~/components/inputs/ErrorableFormControl'
import { api } from '~/utils/api'
import { useZodForm } from '~/utils/forms'
import { useDebounced } from '~/utils/input'

export const NewDirectory: React.FC = () => {
  const { register, unregister, handleSubmit, setValue, reset, clearErrors, formState: { errors } } = useZodForm({
    schema: newDirectorySchema,
    defaultValues: {
      category: '',
      location: '',
      updateFrequencyInMinutes: 60,
    },
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [basePath, setBasePath] = useState('~')

  const debouncedBasePath = useDebounced(basePath, 1200)
  const utils = api.useContext()

  const closeModal = () => {
    setModalOpen(false)
    reset()
  }

  const addDirectory = api.directory.add.useMutation({
    onSuccess() {
      reset()
      closeModal()
      toast.success('Directory added successfully')
      void utils.directory.all.invalidate()
    },
  })

  useEffect(() => {
    register('location')

    return () => {
      unregister('location')
    }
  }, [register, unregister])

  const { data: directoryTree } = api.directory.getDirectoryStructure.useQuery(
    {
      includeHiddenDirectories: false,
      currentPath: debouncedBasePath,
    },
    {
      enabled: modalOpen,
    },
  )

  return (
    <>
      <Button onClick={() => setModalOpen(true)} endDecorator={<Add />}>
        Add Directory
      </Button>

      <Modal
        open={modalOpen}
        onClose={closeModal}
      >
        <ModalDialog size="lg"
          sx={{
            p: 2,
            minHeight: 200,
            width: {
              xs: '100%',
              sm: '100%',
              md: '50vw',
              lg: '50vw',
            },
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void handleSubmit(data => {
                addDirectory.mutate(data)
              })(event)
            }}
          >
            Adding new Directory to be tracked

            <FormControl>
              <Input
                sx={{ mt: 2 }}
                placeholder="Category (Ex: Movies, TV Shows, etc)"
                error={!!errors.category}
                {...register('category')}
              />

              <FormHelperText>
                {errors.category?.message}
              </FormHelperText>
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
