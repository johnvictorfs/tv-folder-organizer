import { Button, Modal, ModalDialog } from '@mui/joy'
import { useState } from 'react'

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
  const [operations, setOperations] = useState<string[]>([])
  const organizeDirectory = api.directory.organize.useMutation({
    onSuccess(data) {
      setOperations(data.operations)
    },
  })

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg">
        <pre style={{ overflowY: 'auto' }}>
          {preview && (
            JSON.stringify(preview, null, 2)
          )}
        </pre>

        <ul>
          {operations.map((operation) => (
            <li key={operation}>
              {operation}
            </li>
          ))}
        </ul>

        <Button onClick={() => organizeDirectory.mutate({ directoryId })}>Organize</Button>
      </ModalDialog>
    </Modal>
  )
}
