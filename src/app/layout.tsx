// src/app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar"
import Footer from "./components/footer"
import { ThemeProvider } from "./components/ThemeContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="bg-black text-white min-h-screen flex flex-col">
        <Navbar />
        <ThemeProvider>
          <main className="flex-1">{children}</main>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
