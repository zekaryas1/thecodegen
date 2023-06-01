import "../styles/globals.css";
import type { AppProps } from "next/app";
import "primereact/resources/themes/mdc-dark-indigo/theme.css"; //app theme i.e dark, light, and material
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; //utility-css
import { ReactElement, ReactNode, createContext, useRef } from "react";
import { NextPage } from "next";
import { SWRConfig } from "swr";
import axios from "axios";
import { SessionProvider } from "next-auth/react";
import MyLayout from "../components/Layouts/MyLayout";
import { Toast } from "primereact/toast";
import localFont from "@next/font/local";
import MyHead from "../components/MyHead";
import { GLOBAL_STYLES, REQUEST_REFRESH_INTERVAL } from "../lib/fixed";
import { MyToast, ToastContext } from "../components/MyToast";

const myFont = localFont({ src: "./fonts/Dank Mono Regular.otf" });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  auth?: any;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const toast = useRef<Toast>(null);

  const ComponentToUse = (
    <ToastContext.Provider
      value={{
        showSuccess: (detail?: string) => {
          return MyToast.showSuccess(toast, detail);
        },
        showError: (detail?: string) => {
          return MyToast.showSuccess(toast, detail);
        },
      }}
    >
      <MyHead />
      <Toast ref={toast} style={{ zIndex: 1000 }} />
      <Component {...pageProps} />
    </ToastContext.Provider>
  );

  const onError = (error: any, key: any) => {
    if (error.status !== 403 && error.status !== 404) {
      //@ts-ignore
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Something went wrong - ${error.message}: is DB working?`,
        life: 3000,
      });
    }
  };

  const SWROption = {
    onError: onError,
    refreshInterval: REQUEST_REFRESH_INTERVAL,
    fetcher: (url: string) => axios.get(url).then((res) => res.data),
  };

  return (
    <SessionProvider session={session}>
      <SWRConfig value={SWROption}>
        <main
          className={myFont.className}
          style={GLOBAL_STYLES.forLinearGradient}
        >
          {Component.getLayout ? (
            Component.getLayout(ComponentToUse)
          ) : (
            <MyLayout>{ComponentToUse}</MyLayout>
          )}
        </main>
      </SWRConfig>
    </SessionProvider>
  );
}
