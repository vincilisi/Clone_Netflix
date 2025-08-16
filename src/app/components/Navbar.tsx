'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { supabase } from '../../lib/supabaseClient';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({
        list: false,
        account: false,
    });
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const navRef = useRef<HTMLElement>(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setMounted(true);

        const touchCheck =
            typeof window !== 'undefined' &&
            (navigator.maxTouchPoints > 0 || /iPad|iPhone|Android/.test(navigator.userAgent));
        setIsTouchDevice(touchCheck);

        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
                setDropdownOpen({ list: false, account: false });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // Recupera utente corrente
        supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));

        // Listener login/logout
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            listener.subscription.unsubscribe();
        };
    }, []);

    const toggleDropdown = (name: string) => {
        setDropdownOpen((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const handleLinkClick = () => {
        setMenuOpen(false);
        setDropdownOpen({ list: false, account: false });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    if (!mounted) return null;

    return (
        <nav ref={navRef} className="relative flex items-center justify-between px-6 py-3 bg-color text-color">
            <Link href="/" className="cursor-pointer" onClick={handleLinkClick}>
                <Image src="/images/logo.png" alt="logo" width={50} height={50} />
            </Link>

            {/* Hamburger */}
            <button
                className="lg:hidden flex flex-col justify-center items-center gap-1 bg-white"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
            >
                <span className="block w-6 h-0.5 bg-color"></span>
                <span className="block w-6 h-0.5 bg-color"></span>
                <span className="block w-6 h-0.5 bg-color"></span>
            </button>

            {/* Menu links */}
            <ul
                className={`flex-col lg:flex-row list-none gap-6 absolute lg:static top-full left-0 w-full lg:w-auto p-4 lg:p-0 transition-all z-40 bg-color ${menuOpen ? 'flex' : 'hidden'
                    } lg:flex`}
            >
                <li>
                    <Link
                        href="/"
                        className="font-semibold block py-1 lg:py-0 text-color hover-color"
                        onClick={handleLinkClick}
                    >
                        Home
                    </Link>
                </li>

                <li className="relative group">
                    <button
                        className="font-semibold bg-transparent border-none w-full text-left lg:w-auto lg:text-center text-color hover-color"
                        onClick={() => toggleDropdown('list')}
                    >
                        La mia lista
                    </button>
                    <ul
                        className={`absolute left-0 rounded shadow-md min-w-[140px] p-2 z-50 bg-color transition-opacity duration-200 ${dropdownOpen.list ? 'block' : isTouchDevice ? 'hidden' : 'lg:block lg:opacity-0 lg:group-hover:opacity-100 lg:pointer-events-auto'
                            }`}
                    >
                        <li>
                            <Link
                                href="/movie/film"
                                className="block px-2 py-1 text-color hover-color"
                                onClick={handleLinkClick}
                            >
                                Film
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/movie/serie-tv"
                                className="block px-2 py-1 text-color hover-color"
                                onClick={handleLinkClick}
                            >
                                Serie TV
                            </Link>
                        </li>
                    </ul>
                </li>

                <li className="relative group">
                    <button
                        className="font-semibold bg-transparent border-none w-full text-left lg:w-auto lg:text-center text-color hover-color"
                        onClick={() => toggleDropdown('account')}
                    >
                        {user ? user.email : 'Account'}
                    </button>
                    <ul
                        className={`absolute left-0 rounded shadow-md min-w-[140px] p-2 z-50 bg-color transition-opacity duration-200 ${dropdownOpen.account ? 'block' : isTouchDevice ? 'hidden' : 'lg:block lg:opacity-0 lg:group-hover:opacity-100 lg:pointer-events-auto'
                            }`}
                    >
                        {user ? (
                            <>
                                <li>
                                    <Link
                                        href="/account"
                                        className="block px-4 py-2 text-color hover-color"
                                        onClick={handleLinkClick}
                                    >
                                        Profilo
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-color hover-color"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        href="/auth?mode=login"
                                        className="block px-4 py-2 text-color hover-color"
                                        onClick={handleLinkClick}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/auth?mode=register"
                                        className="block px-4 py-2 text-color hover-color"
                                        onClick={handleLinkClick}
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </li>
            </ul>

            <div className="ml-auto lg:ml-4">
                <ThemeToggle />
            </div>
        </nav>
    );
}
