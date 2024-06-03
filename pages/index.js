import Image from "next/image";
import { Inter } from "next/font/google";
import Meta from "@/components/meta";
import Navbar from '@/components/Navbar'
import HeroSection from './components/HeroSection'
import UserSection from './components/UserSection'

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  return (
    <main
      className={`${inter.className}`}
    >
      <Meta title="Itz Lingo" description="Crafted by ParindaTech Innovates" />
      <Navbar />
      <HeroSection />
      <UserSection />
    </main>
  );
}
