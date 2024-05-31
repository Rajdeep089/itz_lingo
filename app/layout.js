import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import 'tailwindcss/tailwind.css'
import icon from "../public/next.svg"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Itz Lingo",
  description: "Crafted by ParindaTech Innovates",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href={icon}/>
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
