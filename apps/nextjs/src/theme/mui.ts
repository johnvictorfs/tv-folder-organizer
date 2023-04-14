// https://mui.com/joy-ui/guides/using-joy-ui-and-material-ui-together/#case-b-material-ui-in-a-joy-ui-projectimport { deepmerge } from '@mui/utils';
import { deepmerge } from '@mui/utils'
// import {
//   experimental_extendTheme as extendMuiTheme
// } from '@mui/material/styles'
import colors from '@mui/joy/colors'
import {
  type ColorSystem,
  extendTheme as extendJoyTheme
} from '@mui/joy/styles'
import { experimental_extendTheme as extendMuiTheme } from '@mui/material'

const { unstable_sxConfig: muiSxConfig, ...muiTheme } = extendMuiTheme({
  // This is required to point to `var(--joy-*)` because we are using
  // `CssVarsProvider` from Joy UI.
  cssVarPrefix: 'joy',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: colors.blue[500]
        },
        grey: colors.grey,
        error: {
          main: colors.red[500]
        },
        info: {
          main: colors.purple[500]
        },
        success: {
          main: colors.green[500]
        },
        warning: {
          main: colors.yellow[200]
        },
        common: {
          white: '#FFF',
          black: '#09090D'
        },
        divider: colors.grey[200],
        text: {
          primary: colors.grey[800],
          secondary: colors.grey[600]
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: colors.blue[600]
        },
        grey: colors.grey,
        error: {
          main: colors.red[600]
        },
        info: {
          main: colors.purple[600]
        },
        success: {
          main: colors.green[600]
        },
        warning: {
          main: colors.yellow[300]
        },
        common: {
          white: '#FFF',
          black: '#09090D'
        },
        divider: colors.grey[800],
        text: {
          primary: colors.grey[100],
          secondary: colors.grey[300]
        }
      }
    }
  }
})

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
}

const palette: RecursivePartial<ColorSystem['palette']> = {
  success: {
    softBg: '#08831a'
  },
  warning: {
    softBg: '#c3670f'
  },
  danger: {
    softBg: '#eb0b3e'
  },
  info: {
    softBg: '#390c93'
  }
}

const { unstable_sxConfig: joySxConfig, ...joyTheme } = extendJoyTheme({
  colorSchemes: {
    light: { palette },
    dark: { palette }
  }
})

const mergedTheme = ({
  ...muiTheme,
  ...joyTheme,
  colorSchemes: deepmerge(muiTheme.colorSchemes, joyTheme.colorSchemes),
  typography: {
    ...muiTheme.typography,
    ...joyTheme.typography
  }
} as unknown) as ReturnType<typeof extendJoyTheme>

mergedTheme.generateCssVars = (colorScheme) => ({
  css: {
    ...muiTheme.generateCssVars(colorScheme).css,
    ...joyTheme.generateCssVars(colorScheme).css
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  vars: deepmerge(
    muiTheme.generateCssVars(colorScheme).vars,
    joyTheme.generateCssVars(colorScheme).vars
  )
})

mergedTheme.unstable_sxConfig = {
  ...muiSxConfig,
  ...joySxConfig
}

export { mergedTheme }
