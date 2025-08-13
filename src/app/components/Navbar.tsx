'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({
        list: false,
        account: false,
    });

    const toggleDropdown = (name: string) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    return (
        <nav className="relative flex items-center justify-between px-6 py-3 bg-[#001f3f] text-white">
            {/* Logo */}
            <Link href="/" className="cursor-pointer">
                <Image src="/images/logo.png" alt="netflix-logo" width={50} height={50} />
            </Link>

            {/* Hamburger mobile */}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="block w-6 h-0.5 bg-white mb-1"></span>
                <span className="block w-6 h-0.5 bg-white mb-1"></span>
                <span className="block w-6 h-0.5 bg-white"></span>
            </button>

            {/* Menu links */}
            <ul
                className={`flex-col md:flex-row list-none gap-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#001f3f] md:bg-transparent p-4 md:p-0 transition-all z-40
        ${menuOpen ? 'flex' : 'hidden'} md:flex`}
            >
                {/* Home */}
                <li>
                    <Link href="/" className="font-semibold hover:text-[#FF851B] block py-1 md:py-0">
                        Home
                    </Link>
                </li>

                {/* La mia lista */}
                <li className="relative group">
                    <button
                        className="font-semibold hover:text-[#FF851B] bg-transparent border-none w-full text-left md:w-auto md:text-center"
                        onClick={() => toggleDropdown('list')}
                    >
                        La mia lista
                    </button>
                    <ul
                        className={`absolute left-0 bg-[#001f3f] rounded shadow-md min-w-[140px] p-2 z-50
              ${dropdownOpen.list ? 'block' : 'hidden'} md:block md:opacity-0 md:group-hover:opacity-100 md:pointer-events-auto transition-opacity duration-200`}
                    >
                        <li>
                            <Link href="/movies/film" className="block px-2 py-1 hover:text-[#FFD700]">
                                Film
                            </Link>
                        </li>
                        <li>
                            <Link href="/tv/serie-tv" className="block px-2 py-1 hover:text-[#FFD700]">
                                Serie TV
                            </Link>
                        </li>
                    </ul>
                </li>

                {/* Account */}
                <li className="relative group">
                    <button
                        className="font-semibold hover:text-[#FF851B] bg-transparent border-none w-full text-left md:w-auto md:text-center"
                        onClick={() => toggleDropdown('account')}
                    >
                        Account
                    </button>
                    <ul
                        className={`absolute left-0 bg-[#001f3f] rounded shadow-md min-w-[140px] p-2 z-50
              ${dropdownOpen.account ? 'block' : 'hidden'} md:block md:opacity-0 md:group-hover:opacity-100 md:pointer-events-auto transition-opacity duration-200`}
                    >
                        <li>
                            <a href="#" className="block px-4 py-2 hover:text-[#FFD700]">
                                Login
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 hover:text-[#FFD700]">
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
