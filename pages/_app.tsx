import "../styles/globals.css";
import type { AppProps } from "next/app";
import "primereact/resources/themes/mdc-dark-indigo/theme.css"; //app theme i.e dark, light, and material
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; //utility-css
import { ReactElement, ReactNode, useRef } from "react";
import { NextPage } from "next";
import { SWRConfig } from "swr";
import axios from "axios";
import { SessionProvider } from "next-auth/react";
import MyLayout from "../components/Layouts/MyLayout";
import { Toast } from "primereact/toast";
import localFont from "@next/font/local";
import { PROJECT_NAME } from "../lib/fixed";
import Head from "next/head";

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
  const toast = useRef(null);
  const ComponentToUse = (
    <>
      <Head>
        <title>{PROJECT_NAME}</title>
        <meta property="og:title" content={PROJECT_NAME} key="title" />
        <meta property="og:author" content="https://github.com/zekaryas1" />
        <meta
          property="og:description"
          content="A template based code-generator that helps you automate your custom code generation."
          key="description"
        />
      </Head>
      <Toast ref={toast} style={{ zIndex: 1000 }} />
      <Component {...pageProps} />
    </>
  );

  const onError = (error: any, key: any) => {
    if (error.status !== 403 && error.status !== 404) {
      //@ts-ignore
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Something went wrong - ${error.message}`,
        life: 3000,
      });
    }
  };

  const SWROption = {
    onError: onError,
    fetcher: (url: string) => axios.get(url).then((res) => res.data),
  };

  if (Component.getLayout) {
    return (
      <SessionProvider session={session}>
        <SWRConfig value={SWROption}>
          <main className={myFont.className}>
            {Component.getLayout(ComponentToUse)}
          </main>
        </SWRConfig>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={session}>
      <SWRConfig value={SWROption}>
        <main className={myFont.className}>
          <MyLayout>{ComponentToUse}</MyLayout>
        </main>
      </SWRConfig>
    </SessionProvider>
  );
}
