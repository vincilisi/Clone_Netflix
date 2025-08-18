"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) console.error("Errore nel recupero utente:", error);
            setUser(user);
        };
        getUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => authListener?.subscription.unsubscribe();
    }, []);

    // Chiudi dropdown se clicchi fuori
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setDropdownOpen(false);
    };

    return (
        <nav className="bg-color text-color px-6 py-4 flex justify-between items-center relative transition-colors duration-300">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold hover-color">
                WolfFlix
            </Link>

            {/* Menu centrale (desktop) */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6 text-sm">
                <Link href="/" className="hover-color transition">Home</Link>
                <Link href="/movie/film" className="hover-color transition">Film</Link>
                <Link href="/movie/serie-tv" className="hover-color transition">Serie TV</Link>
            </div>

            {/* Utente + Tema a destra */}
            <div className="flex items-center space-x-4" ref={dropdownRef}>
                <ThemeToggle />

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="flex items-center space-x-2 hover-color text-sm"
                        >
                            <span>Benvenuto, {user.email}</span>
                            <ChevronDownIcon className="h-4 w-4" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 text-sm z-50 bg-color border border-gray-600 rounded shadow-lg">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 hover-color"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Profilo
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 hover-color"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/auth"
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                    >
                        Login
                    </Link>
                )}

                {/* Hamburger mobile */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                >
                    {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>

            {/* Menu mobile */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-color flex flex-col items-center md:hidden space-y-2 py-2 text-sm z-40">
                    <Link href="/" className="hover-color w-full text-center py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link href="/movie/film" className="hover-color w-full text-center py-2" onClick={() => setMobileMenuOpen(false)}>Film</Link>
                    <Link href="/movie/serie-tv" className="hover-color w-full text-center py-2" onClick={() => setMobileMenuOpen(false)}>Serie TV</Link>
                </div>
            )}
        </nav>
    );
}
