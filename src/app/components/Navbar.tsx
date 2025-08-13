'use client';

import Image from 'next/image';
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const film = 'film';
    const serietv = 'serie-tv';
    const [menuOpen, setMenuOpen] = useState(false); // hamburger mobile

    return (
        <nav className="relative flex items-center justify-between px-6 bg-color mt-3">

            {/* Logo */}
            <Link href="/" className="cursor-pointer">
                <Image
                    src="/images/logo.png"
                    alt='netflix-logo'
                    width={50}
                    height={50}
                />
            </Link>

            {/* Hamburger mobile */}
            <button
                className="md:hidden text-color"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span className="block w-6 h-0.5 bg-current mb-1"></span>
                <span className="block w-6 h-0.5 bg-current mb-1"></span>
                <span className="block w-6 h-0.5 bg-current"></span>
            </button>

            {/* Menu links */}
            <ul className={`flex-col md:flex-row list-none gap-8 text-color absolute md:static top-full left-0 md:top-auto md:left-auto bg-color md:bg-transparent w-full md:w-auto p-4 md:p-0 transition-all
                ${menuOpen ? "flex" : "hidden"} md:flex`}>

                {/* Home */}
                <li>
                    <Link href="/" className="font-semibold hover-color cursor-pointer block py-1 md:py-0">
                        Home
                    </Link>
                </li>

                {/* La mia lista - dropdown */}
                <li className="relative group">
                    <button className="font-semibold hover-color cursor-pointer bg-transparent border-none w-full text-left md:w-auto md:text-center">
                        La mia lista
                    </button>
                    <ul className="absolute left-0 md:top-full md:left-0 bg-color rounded shadow-md min-w-[140px] p-2 z-50 hidden group-hover:block">
                        <li>
                            <Link href={`/movie/${film}`} className="font-semibold hover-color cursor-pointer block px-2 py-1 rounded">
                                Film
                            </Link>
                        </li>
                        <li>
                            <Link href={`/movie/${serietv}`} className="font-semibold hover-color cursor-pointer block px-2 py-1 rounded">
                                Serie TV
                            </Link>
                        </li>
                    </ul>
                </li>

                {/* Account - dropdown */}
                <li className="relative group">
                    <button className="font-semibold hover-color cursor-pointer bg-transparent border-none w-full text-left md:w-auto md:text-center">
                        Account
                    </button>
                    <ul className="absolute left-0 md:top-full md:left-0 bg-color rounded shadow-md min-w-[140px] p-2 z-50 hidden group-hover:block">
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-[#330000] rounded">
                                Login
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-[#330000] rounded">
                                Register
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>

            {/* Theme toggle */}
            <div className="ml-auto md:ml-4">
                <ThemeToggle />
            </div>
        </nav>
    );
}
