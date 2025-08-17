'use client';

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
    return (
        <footer className="bg-color text-color py-10 px-4 transition-colors duration-300">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo e descrizione */}
                <div className="flex flex-col items-start space-y-4">
                    <h1 className="text-2xl font-bold text-color">MovieZone</h1>
                    <p className="text-sm">
                        Il miglior posto per scoprire film e serie TV. Sempre aggiornato, sempre cool.
                    </p>
                </div>

                {/* Link utili */}
                <div className="flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold text-color mb-2">Link utili</h2>
                    <Link href="/" className="hover-color transition">Home</Link>
                    <Link href="/film" className="hover-color transition">Film</Link>
                    <Link href="/serieTV" className="hover-color transition">Serie TV</Link>
                    <Link href="/contatti" className="hover-color transition">Contatti</Link>
                </div>

                {/* Social */}
                <div className="flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold text-color mb-2">Seguici</h2>
                    <div className="flex space-x-4 mt-2">
                        <a href="#" className="hover-color transition"><FaFacebookF /></a>
                        <a href="#" className="hover-color transition"><FaTwitter /></a>
                        <a href="#" className="hover-color transition"><FaInstagram /></a>
                        <a href="#" className="hover-color transition"><FaYoutube /></a>
                    </div>
                </div>
            </div>

            {/* Theme toggle opzionale */}
            <div className="mt-8 flex justify-center">
            </div>

            {/* Copyright */}
            <div className="mt-10 text-center text-sm text-color opacity-70">
                © {new Date().getFullYear()} MovieZone. Tutti i diritti riservati. Sito creato da Vincenzo Antonino Lisitano
            </div>
        </footer>
    );
}
