import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./globals.css";
import Navbar from "@/app/components/Navbar";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Navbar />    {/* qui appare la navbar */}
        {children}    {/* qui appare la pagina corrente */}
      </body>
    </html>
  );
}
