import * as React from 'react'
import { Box, Grid, Sheet } from '@mui/joy'
import { NewDirectory } from '~/components/directory/NewDirectory'

export const NavBar: React.FC = () => {
  const navBarHeight = 64

  return (
    <>
      <Box sx={(theme) => ({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.popup - 1,
        height: navBarHeight
      })}>
        <Sheet color="neutral">
          <Grid container sx={{
            p: 1
          }}>
            {/* Left Aligned */}
            <Grid>
              <NewDirectory />
            </Grid>

            <Grid sx={{ flexGrow: 1 }} />

            {/* Right Aligned */}
          </Grid>
        </Sheet>
      </Box>

      <Box
        sx={{
          height: navBarHeight
        }}
      />
    </>
  )
}
