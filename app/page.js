"use client"
// import 'tailwindcss/tailwind.css'
import Navbar from '@/components/Navbar'
import HeroSection from './components/HeroSection'
import UserSection from './components/UserSection'
// import Head from 'next/head'
// import icon from "../public/next.svg"

export default function Home() {
  return (
    <div>
      {/* <Head>
      <link rel="icon" href={icon} />
      </Head> */}
      <Navbar />
      <HeroSection />
      <UserSection />
    </div>
  );
}
