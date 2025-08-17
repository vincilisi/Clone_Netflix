import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "WolfFlix",
  description: "Guarda film e serie con Supabase e Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
