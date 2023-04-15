import type { AppType } from "next/app";
import '@fontsource/public-sans';

import { api } from "~/utils/api";
import { CssVarsProvider } from "@mui/joy";
import { mergedTheme } from "~/theme/mui";
import { NavBar } from "~/components/app/NavBar";

const MyApp: AppType = ({
  Component,
  pageProps: pageProps,
}) => {
  return (
    <CssVarsProvider defaultMode="dark" theme={mergedTheme}>
      <NavBar />

      <Component {...pageProps} />
    </CssVarsProvider>
  );
};

export default api.withTRPC(MyApp);
