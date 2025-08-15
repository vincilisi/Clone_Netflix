// src/components/Footer.tsx
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className=" text-gray-300 dark:text-gray-200 py-10 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 ">

                {/* Logo e descrizione */}
                <div className="flex flex-col items-start space-y-4">
                    <h1 className="text-2xl font-bold text-white dark:text-gray-100">MovieZone</h1>
                    <p className="text-sm">
                        Il miglior posto per scoprire film e serie TV. Sempre aggiornato, sempre cool.
                    </p>
                </div>

                {/* Link utili */}
                <div className="flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold text-white dark:text-gray-100 mb-2">Link utili</h2>
                    <Link href="/" className="hover:text-white dark:hover:text-gray-50 transition">Home</Link>
                    <Link href="/film" className="hover:text-white dark:hover:text-gray-50 transition">Film</Link>
                    <Link href="/serieTV" className="hover:text-white dark:hover:text-gray-50 transition">Serie TV</Link>
                    <Link href="/contatti" className="hover:text-white dark:hover:text-gray-50 transition">Contatti</Link>
                </div>

                {/* Social */}
                <div className="flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold text-white dark:text-gray-100 mb-2">Seguici</h2>
                    <div className="flex space-x-4 mt-2">
                        <a href="#" className="hover:text-white dark:hover:text-gray-50 transition"><FaFacebookF /></a>
                        <a href="#" className="hover:text-white dark:hover:text-gray-50 transition"><FaTwitter /></a>
                        <a href="#" className="hover:text-white dark:hover:text-gray-50 transition"><FaInstagram /></a>
                        <a href="#" className="hover:text-white dark:hover:text-gray-50 transition"><FaYoutube /></a>
                    </div>
                </div>

            </div>

            {/* Copyright */}
            <div className="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} MovieZone. Tutti i diritti riservati.
                Sito creato da Vincenzo Antonino Lisitano
            </div>
        </footer>
    );
}
