import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return ( 
    <>
    <Head>
      <title>Itz Lingo</title>
      <meta name="description" content="Crafted by ParindaTech Innovates" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Component {...pageProps} />
  </>
  );
}
