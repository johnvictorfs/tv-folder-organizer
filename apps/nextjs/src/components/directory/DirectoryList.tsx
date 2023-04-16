import { Grid, type GridProps } from "@mui/joy"

import { DirectoryCard } from "~/components/directory/DirectoryCard"
import { api } from "~/utils/api"

export const DirectoryList: React.FC = () => {
  const { data: directories } = api.directory.all.useQuery()

  const gridItemProps: GridProps = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3
  }

  if (!directories) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 4 }, (_, i) => (
          <Grid key={i} {...gridItemProps}>
            <DirectoryCard />
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Grid container spacing={2}>
      {directories.map((directory) => (
        <Grid key={directory.id} {...gridItemProps}>
          <DirectoryCard directory={directory} />
        </Grid>
      ))}
    </Grid>
  )
}
