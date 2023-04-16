
import { CssVarsProvider } from '@mui/joy'
import type { AppType } from 'next/app'

import { NavBar } from '~/components/app/NavBar'
import { ToastContainer } from '~/components/toasts/ToastContainer'
import { mergedTheme } from '~/theme/mui'
import { api } from '~/utils/api'

import '@fontsource/public-sans'
import 'react-toastify/dist/ReactToastify.css'
import '~/utils/dayjs'

const MyApp: AppType = ({
  Component,
  pageProps: pageProps,
}) => {
  return (
    <CssVarsProvider defaultMode="dark" theme={mergedTheme}>
      <NavBar />

      <ToastContainer />

      <Component {...pageProps} />
    </CssVarsProvider>
  )
}

export default api.withTRPC(MyApp)
