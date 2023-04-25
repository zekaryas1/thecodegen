import Head from "next/head";
import { PROJECT_NAME } from "../lib/fixed";

function MyHead() {
  return (
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
  );
}

export default MyHead;
