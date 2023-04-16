import dayjs from 'dayjs'
import { Delete } from "@mui/icons-material"
import { Box, Button, Card, IconButton, Typography } from "@mui/joy"
import { Skeleton } from "@mui/material"

import { type Directory } from "@acme/db"

export type DirectoryCardProps = {
  directory?: Directory
}

export const DirectoryCard: React.FC<DirectoryCardProps> = ({
  directory
}) => {
  return (
    <Card>
      <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
        {directory ? directory.category : <Skeleton width="35%" />}
      </Typography>

      <Typography level="body2">
        {directory ? directory.location : <Skeleton width="55%" />}
      </Typography>

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
      >
        <Delete />
      </IconButton>

      <Box sx={{ display: 'flex', mt: 5 }}>
        <Typography level="body3" sx={{ mt: 1 }}>
          {directory ? (
            <>
              Updated {dayjs(directory.updatedAt).fromNow()}
            </>
          ) : (
            <Skeleton width={100} />
          )}
        </Typography>

        <Button
          variant="outlined"
          size="sm"
          color="primary"
          aria-label={`Organize ${directory?.location} (${directory?.category}) now`}
          sx={{ ml: 'auto', fontWeight: 600 }}
          disabled={!directory}
        >
          {directory ? 'Organize now' : <Skeleton width={92} />}
        </Button>
      </Box>
    </Card>
  )
}