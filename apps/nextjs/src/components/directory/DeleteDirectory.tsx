import { type Directory } from "@acme/db"
import { Delete } from "@mui/icons-material"
import { IconButton } from "@mui/joy"
import { useState } from "react"
import { toast } from "react-toastify"

import { ConfirmModal } from "~/components/app/modal/ConfirmModal"
import { api } from "~/utils/api"

export type DeleteDirectoryProps = {
  directory?: Directory
}

export const DeleteDirectory: React.FC<DeleteDirectoryProps> = ({
  directory
}) => {
  const [deleteModal, setDeleteModal] = useState(false)

  const utils = api.useContext()

  const deleteDirectory = api.directory.delete.useMutation({
    onSuccess() {
      setDeleteModal(false)
      toast.success("Stopped tracking directory successfully")
      void utils.directory.all.invalidate()
    }
  })

  return (
    <>
      {directory && (
        <ConfirmModal
          open={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={() => deleteDirectory.mutate({ id: directory.id })}
          description={
            <>
              Are you sure you want to stop tracking this directory?

              <br />
              <br />

              <code>{directory.location}</code> ({directory.category})
            </>
          }
          title="Removing Directory"
          variant="warning"
          loading={deleteDirectory.isLoading}
        />
      )}

      <IconButton
        aria-label={`Delete ${directory?.location} (${directory?.category})`}
        variant="plain"
        color="neutral"
        size="sm"
        sx={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          '&:hover': {
            color: 'danger.500'
          }
        }}
        disabled={!directory}
        onClick={() => setDeleteModal(true)}
      >
        <Delete />
      </IconButton>
    </>
  )
}
