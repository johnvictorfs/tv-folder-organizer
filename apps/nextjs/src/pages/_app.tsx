import type { AppType } from "next/app";

import { CssVarsProvider } from "@mui/joy";

import { api } from "~/utils/api";
import { mergedTheme } from "~/theme/mui";
import { NavBar } from "~/components/app/NavBar";
import { ToastContainer } from "~/components/toasts/ToastContainer";

import '@fontsource/public-sans';
import 'react-toastify/dist/ReactToastify.css';

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
  );
};

export default api.withTRPC(MyApp);
