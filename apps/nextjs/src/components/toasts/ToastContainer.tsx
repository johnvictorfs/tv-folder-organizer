import '@fontsource/public-sans';

import { styled } from "@mui/joy";
import { ToastContainer as BaseToastContainer, Zoom, type ToastContainerProps } from 'react-toastify';

export const ToastContainer = styled((props: ToastContainerProps) => (
  <BaseToastContainer
    {...props}
    theme="dark"
    position="bottom-center"
    draggable
    hideProgressBar
    transition={Zoom} />
))(
  (({ theme }) => ({
    '.Toastify__toast': {
      backgroundColor: theme.vars.palette.background.level1,
      borderRadius: 32,
      minHeight: 48
    },
    '.Toastify__toast-body': {
      backgroundColor: theme.vars.palette.background.level1
    },
    '.Toastify__close-button': {
      marginTop: 8,
      marginRight: 8
    }
  }))
)