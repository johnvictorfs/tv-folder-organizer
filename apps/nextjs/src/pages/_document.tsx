
import { useTheme } from '@mui/joy'
import { getInitColorSchemeScript } from '@mui/joy/styles'
import { Html, Head, Main, NextScript } from 'next/document'

/**
 * https://mui.com/joy-ui/main-features/dark-mode-optimization/
 */
export default function Document() {
  const theme = useTheme()

  return (
    <Html>
      <Head>
        <meta name="description" content="Personal AIssistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body
        style={{
          backgroundColor: theme.vars.palette.background.body,
          color: theme.vars.palette.text.primary,
        }}
      >
        {getInitColorSchemeScript({ defaultMode: 'dark' })}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
