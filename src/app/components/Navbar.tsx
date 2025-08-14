'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({
        list: false,
        account: false,
    });
    const [mounted, setMounted] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setMounted(true);

        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
                setDropdownOpen({ list: false, account: false });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (name: 'list' | 'account') => {
        setDropdownOpen(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleLinkClick = () => {
        setMenuOpen(false);
        setDropdownOpen({ list: false, account: false });
    };

    if (!mounted) return null;

    return (
        <nav
            ref={navRef}
            className="relative flex items-center justify-between px-6 py-3 bg-color text-color"
        >
            {/* Logo */}
            <Link href="/" className="cursor-pointer" onClick={handleLinkClick}>
                <Image src="/images/logo.png" alt="logo" width={50} height={50} />
            </Link>

            {/* Hamburger (mobile + tablet) */}
            <button
                className="lg:hidden flex flex-col justify-center items-center gap-1 text-color"
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Menu"
                aria-expanded={menuOpen}
            >
                <span className="block w-6 h-0.5 bg-current"></span>
                <span className="block w-6 h-0.5 bg-current"></span>
                <span className="block w-6 h-0.5 bg-current"></span>
            </button>

            {/* Menu links */}
            <ul
                className={`flex-col lg:flex-row list-none gap-6 absolute lg:static top-full left-0 w-full lg:w-auto p-4 lg:p-0 transition-all z-40 bg-color
        ${menuOpen ? 'flex' : 'hidden'} lg:flex`}
            >
                {/* Home */}
                <li>
                    <Link
                        href="/"
                        className="font-semibold block py-1 lg:py-0 text-color hover-color"
                        onClick={handleLinkClick}
                    >
                        Home
                    </Link>
                </li>

                {/* La mia lista */}
                <li className="relative group">
                    <button
                        className="font-semibold bg-transparent border-none w-full text-left lg:w-auto lg:text-center text-color hover-color"
                        onClick={() => toggleDropdown('list')}
                        aria-haspopup="menu"
                        aria-expanded={dropdownOpen.list}
                    >
                        La mia lista
                    </button>

                    {/* Visibile se: stato aperto (qualsiasi device) OR hover (solo desktop) */}
                    <ul
                        className={[
                            'absolute left-0 top-full mt-2 rounded shadow-md min-w-[160px] p-2 z-50 bg-color',
                            'hidden opacity-0 transition-opacity duration-200',
                            dropdownOpen.list ? 'block opacity-100' : '',
                            'lg:group-hover:block lg:group-hover:opacity-100',
                        ].join(' ')}
                        role="menu"
                    >
                        <li>
                            <Link
                                href="/movie/film"
                                className="block px-2 py-1 text-color hover-color"
                                onClick={handleLinkClick}
                                role="menuitem"
                            >
                                Film
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/movie/serie-tv"
                                className="block px-2 py-1 text-color hover-color"
                                onClick={handleLinkClick}
                                role="menuitem"
                            >
                                Serie TV
                            </Link>
                        </li>
                    </ul>
                </li>

                {/* Account */}
                <li className="relative group">
                    <button
                        className="font-semibold bg-transparent border-none w-full text-left lg:w-auto lg:text-center text-color hover-color"
                        onClick={() => toggleDropdown('account')}
                        aria-haspopup="menu"
                        aria-expanded={dropdownOpen.account}
                    >
                        Account
                    </button>

                    {/* Stessa logica: click OR hover */}
                    <ul
                        className={[
                            'absolute left-0 top-full mt-2 rounded shadow-md min-w-[160px] p-2 z-50 bg-color',
                            'hidden opacity-0 transition-opacity duration-200',
                            dropdownOpen.account ? 'block opacity-100' : '',
                            'lg:group-hover:block lg:group-hover:opacity-100',
                        ].join(' ')}
                        role="menu"
                    >
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 text-color hover-color"
                                onClick={handleLinkClick}
                                role="menuitem"
                            >
                                Login
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block px-4 py-2 text-color hover-color"
                                onClick={handleLinkClick}
                                role="menuitem"
                            >
                                Register
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>

            {/* Theme toggle */}
            <div className="ml-auto lg:ml-4">
                <ThemeToggle />
            </div>
        </nav>
    );
}
