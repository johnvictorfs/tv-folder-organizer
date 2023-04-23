import { ArrowForward, CreateNewFolder, DriveFileMove } from '@mui/icons-material'
import { Button, Divider, List, ListItem, ListItemButton, ListItemDecorator, Modal, ModalDialog, Typography } from '@mui/joy'
import { toast } from 'react-toastify'

import { api } from '~/utils/api'

export type OrganizerDirectoryProps = {
  open: boolean
  onClose: () => void
  directoryId: string
}

export const OrganizerDirectory: React.FC<OrganizerDirectoryProps> = ({
  open,
  onClose,
  directoryId,
}) => {
  const { data: preview, isInitialLoading: isInitialLoadingPreview } = api.directory.previewOrganization.useQuery({ directoryId }, {
    enabled: open,
  })

  const { data: directory } = api.directory.get.useQuery({ id: directoryId }, {
    enabled: open,
  })

  const utils = api.useContext()

  const organizeDirectory = api.directory.organize.useMutation({
    onSuccess() {
      toast.success('Directory organized successfully')
      void utils.directory.get.invalidate({ id: directoryId })
      void utils.directory.all.invalidate()

      onClose()
    },
  })

  const nothingToOrganize = !isInitialLoadingPreview && !preview?.fileStructure.children.length

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg">
        <List>
          <Typography level="body2">
            Organization Preview
          </Typography>

          <Divider sx={{ my: 2 }} />

          {preview?.operations.map((operation) => (
            <ListItem key={`${operation.type} ${operation.from} ${operation.to}}`} sx={{ my: 1 }}>
              <ListItemButton sx={{ borderRadius: 8, cursor: 'initial' }} >
                <ListItemDecorator>
                  {operation.type === 'move' && (
                    <DriveFileMove />
                  )}

                  {operation.type === 'create' && (
                    <CreateNewFolder color="success" />
                  )}
                </ListItemDecorator>

                {directory && (
                  <>
                    <Typography level="body2">
                      {operation.from?.split(`${directory.location}/`)}
                    </Typography>

                    {operation.from && <ArrowForward color="success" sx={{ mx: 2 }} />}

                    <Typography level="body2">
                      {operation.to?.split(`${directory.location}/`)}
                    </Typography>
                  </>
                )}
              </ListItemButton>
            </ListItem>
          ))}

          {nothingToOrganize && (
            <Typography level="body2" sx={{ my: 2 }}>
              Nothing to organize in this directory.
            </Typography>
          )}
        </List>

        <Button
          onClick={() => organizeDirectory.mutate({ directoryId })}
          loading={organizeDirectory.isLoading || isInitialLoadingPreview}
          disabled={nothingToOrganize}
        >
          Apply Organization
        </Button>
      </ModalDialog>
    </Modal>
  )
}
