import SocketProvider from "@/context/SocketProvider";
import "@/styles/globals.css";
import Head from "next/head";
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return ( 
    <>
    <Head>
      <title>Itz Lingo</title>
      <meta name="description" content="Crafted by ParindaTech Innovates" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
    <SocketProvider>
    <Component {...pageProps} />
  </SocketProvider>
  </>
  );
}
