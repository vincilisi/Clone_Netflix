'use client';

import { useEffect, useState, useRef } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid';

type ThemeOption = 'system' | 'light' | 'dark';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<ThemeOption>('system');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Applica il tema
    const applyTheme = (selected: ThemeOption) => {
        if (selected === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', prefersDark);
        } else {
            document.documentElement.classList.toggle('dark', selected === 'dark');
        }
    };

    // Carica il tema salvato
    useEffect(() => {
        const saved = localStorage.getItem('theme') as ThemeOption | null;
        const initial = saved || 'system';
        setTheme(initial);
        applyTheme(initial);
    }, []);

    // Chiudi dropdown se clicchi fuori
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: ThemeOption) => {
        setTheme(option);
        localStorage.setItem('theme', option);
        applyTheme(option);
        setDropdownOpen(false);
    };

    const icon = {
        system: <ComputerDesktopIcon className="h-5 w-5 text-lime-400" />,
        light: <SunIcon className="h-5 w-5 text-yellow-400" />,
        dark: <MoonIcon className="h-5 w-5 text-red-500" />,
    };

    const label = {
        system: 'PC',
        light: 'Chiaro',
        dark: 'Scuro',
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 px-3 py-2 rounded bg-color text-color hover-color transition duration-300 text-sm"
            >
                {icon[theme]}
                <span>{label[theme]}</span>
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-color border border-gray-600 rounded shadow-lg z-50">
                    <button
                        onClick={() => handleSelect('system')}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm hover-color"
                    >
                        <ComputerDesktopIcon className="h-4 w-4" />
                        <span>PC</span>
                    </button>
                    <button
                        onClick={() => handleSelect('light')}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm hover-color"
                    >
                        <SunIcon className="h-4 w-4" />
                        <span>Chiaro</span>
                    </button>
                    <button
                        onClick={() => handleSelect('dark')}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm hover-color"
                    >
                        <MoonIcon className="h-4 w-4" />
                        <span>Scuro</span>
                    </button>
                </div>
            )}
        </div>
    );
}
