// src/app/profile/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const [username, setUsername] = useState("Wolf User");
    const [email] = useState("wolf@example.com");
    const [language, setLanguage] = useState("it");
    const [autoplay, setAutoplay] = useState(true);
    const [kidsMode, setKidsMode] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
            {/* Header */}
            <h1 className="text-3xl font-bold mb-8">Il tuo profilo</h1>

            {/* Card profilo */}
            <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-2xl shadow-lg">
                {/* Avatar + Nome */}
                <div className="flex items-center gap-6 mb-6">
                    <Image
                        src="/images/avatar.png" // avatar placeholder
                        alt="Avatar"
                        width={80}
                        height={80}
                        className="rounded-full border-2 border-red-600"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{username}</h2>
                        <p className="text-sm text-gray-400">{email}</p>
                    </div>
                </div>

                {/* Impostazioni */}
                <div className="space-y-6">
                    {/* Nome utente */}
                    <div>
                        <label className="block mb-2 text-gray-300">Nome profilo</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-neutral-800 text-white p-2 rounded-md border border-gray-700"
                        />
                    </div>

                    {/* Lingua */}
                    <div>
                        <label className="block mb-2 text-gray-300">Lingua</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-neutral-800 text-white p-2 rounded-md border border-gray-700"
                        >
                            <option value="it">Italiano</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                        </select>
                    </div>

                    {/* Kids Mode */}
                    <div className="flex items-center justify-between">
                        <span>Modalità Kids</span>
                        <input
                            type="checkbox"
                            checked={kidsMode}
                            onChange={() => setKidsMode(!kidsMode)}
                            className="w-5 h-5"
                        />
                    </div>

                    {/* Autoplay */}
                    <div className="flex items-center justify-between">
                        <span>Autoplay Trailer</span>
                        <input
                            type="checkbox"
                            checked={autoplay}
                            onChange={() => setAutoplay(!autoplay)}
                            className="w-5 h-5"
                        />
                    </div>
                </div>

                {/* Pulsanti azione */}
                <div className="mt-8 flex justify-between">
                    <Link href="/account">
                        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition">
                            <Settings size={20} /> Gestisci account
                        </button>
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition">
                        <LogOut size={20} /> Esci
                    </button>
                </div>
            </div>
        </div>
    );
}
