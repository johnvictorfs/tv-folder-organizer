import { Modal, ModalDialog } from '@mui/joy'

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
  const { data: preview } = api.directory.previewOrganization.useQuery({ directoryId }, {
    enabled: open,
  })

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg">
        <pre style={{ overflowY: 'auto' }}>
          {preview && (
            JSON.stringify(preview, null, 2)
          )}
        </pre>
      </ModalDialog>
    </Modal>
  )
}
