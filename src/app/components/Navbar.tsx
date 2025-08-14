'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({
        list: false,
        account: false,
    });
    const [mounted, setMounted] = useState(false); // ✅ evita hydration error

    // Montaggio client
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleDropdown = (name: string) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    if (!mounted) return null; // non renderizzare SSR fino a quando non siamo sul client

    return (
        <nav className="relative flex items-center justify-between px-6 py-3 bg-color text-color">
            {/* Logo */}
            <Link href="/" className="cursor-pointer">
                <Image src="/images/logo.png" alt="logo" width={50} height={50} />
            </Link>

            {/* Hamburger mobile */}
            <button
                className="md:hidden flex flex-col justify-center items-center gap-1"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
            >
                <span className="block w-6 h-0.5 bg-color"></span>
                <span className="block w-6 h-0.5 bg-color"></span>
                <span className="block w-6 h-0.5 bg-color"></span>
            </button>

            {/* Menu links */}
            <ul
                className={`flex-col md:flex-row list-none gap-6 absolute md:static top-full left-0 w-full md:w-auto p-4 md:p-0 transition-all z-40 bg-color
          ${menuOpen ? 'flex' : 'hidden'} md:flex`}
            >
                {/* Home */}
                <li>
                    <Link href="/" className="font-semibold block py-1 md:py-0 text-color hover-color">
                        Home
                    </Link>
                </li>

                {/* La mia lista */}
                <li className="relative group">
                    <button
                        className="font-semibold bg-transparent border-none w-full text-left md:w-auto md:text-center text-color hover-color"
                        onClick={() => toggleDropdown('list')}
                    >
                        La mia lista
                    </button>
                    <ul
                        className={`absolute left-0 rounded shadow-md min-w-[140px] p-2 z-50 bg-color
              ${dropdownOpen.list ? 'block' : 'hidden'} md:block md:opacity-0 md:group-hover:opacity-100 md:pointer-events-auto transition-opacity duration-200`}
                    >
                        <li>
                            <Link href="/movie/film" className="block px-2 py-1 text-color hover-color">
                                Film
                            </Link>
                        </li>
                        <li>
                            <Link href="/movie/serie-tv" className="block px-2 py-1 text-color hover-color">
                                Serie TV
                            </Link>
                        </li>
                    </ul>
                </li>

                {/* Account */}
                <li className="relative group">
                    <button
                        className="font-semibold bg-transparent border-none w-full text-left md:w-auto md:text-center text-color hover-color"
                        onClick={() => toggleDropdown('account')}
                    >
                        Account
                    </button>
                    <ul
                        className={`absolute left-0 rounded shadow-md min-w-[140px] p-2 z-50 bg-color
              ${dropdownOpen.account ? 'block' : 'hidden'} md:block md:opacity-0 md:group-hover:opacity-100 md:pointer-events-auto transition-opacity duration-200`}
                    >
                        <li>
                            <a href="#" className="block px-4 py-2 text-color hover-color">
                                Login
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 text-color hover-color">
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
