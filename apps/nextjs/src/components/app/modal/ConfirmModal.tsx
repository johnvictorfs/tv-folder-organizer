import { CheckCircleRounded, InfoRounded, WarningRounded } from '@mui/icons-material'
import { Box, Button, Divider, Modal, ModalDialog, Typography } from '@mui/joy'

export type ConfirmModalProps = {
  open: boolean
  onClose: () => void
  onCancel?: () => void
  onConfirm: () => void
  title: React.ReactNode
  description: React.ReactNode
  /**
   * @default "Cancel"
   */
  cancelText?: React.ReactNode
  /**
   * @default "Confirm"
   */
  confirmText?: React.ReactNode
  /**
   * @default "info"
   */
  variant?: 'warning' | 'success' | 'info'
  /**
   * @default false
   */
  loading?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  variant = 'info',
  loading = false,
  title,
  description,
}) => {
  const icon = {
    warning: <WarningRounded />,
    success: <CheckCircleRounded />,
    info: <InfoRounded />,
  }[variant]

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <ModalDialog
        aria-labelledby="confirm-dialog-modal-title"
        aria-describedby="confirm-dialog-modal-description"
      >
        <Typography
          id="confirm-dialog-modal-title"
          component="h2"
          startDecorator={icon}
        >
          {title}
        </Typography>

        <Divider />

        <Typography id="confirm-dialog-modal-description" textColor="text.tertiary">
          {description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => {
              onCancel?.()
              onClose()
            }}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button variant="solid" color="danger" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </Box>
      </ModalDialog>
    </Modal >
  )
}
