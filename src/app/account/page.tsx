"use client";

import { useState } from "react";
import Image from "next/image";

export default function AccountPage() {
    const [profiles, setProfiles] = useState([
        { id: 1, name: "Mario", avatar: "/images/avatar1.png" },
        { id: 2, name: "Luisa", avatar: "/images/avatar2.png" },
    ]);

    const [activeProfile, setActiveProfile] = useState(profiles[0]);

    return (
        <div className="flex flex-col items-center px-6 py-12 text-white bg-black min-h-screen">
            {/* Titolo */}
            <h1 className="text-3xl font-bold mb-8">Gestisci Account</h1>

            {/* Sezione profili */}
            <div className="w-full max-w-4xl bg-neutral-900 rounded-2xl shadow-lg p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4">Profili</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {profiles.map((profile) => (
                        <button
                            key={profile.id}
                            onClick={() => setActiveProfile(profile)}
                            className={`flex flex-col items-center transition-transform ${activeProfile.id === profile.id ? "scale-105" : "opacity-70"
                                }`}
                        >
                            <Image
                                src={profile.avatar}
                                alt={profile.name}
                                width={120}
                                height={120}
                                className="rounded-lg"
                            />
                            <span className="mt-2">{profile.name}</span>
                        </button>
                    ))}

                    {/* Aggiungi nuovo profilo */}
                    <button
                        onClick={() =>
                            setProfiles([
                                ...profiles,
                                {
                                    id: Date.now(),
                                    name: "Nuovo",
                                    avatar: "/images/default-avatar.png",
                                },
                            ])
                        }
                        className="flex flex-col items-center justify-center border-2 border-gray-500 border-dashed rounded-lg p-6 hover:border-white"
                    >
                        <span className="text-3xl">+</span>
                        <span className="mt-2 text-sm">Aggiungi</span>
                    </button>
                </div>
            </div>

            {/* Sezione dati account */}
            <div className="w-full max-w-4xl bg-neutral-900 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Dati account</h2>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 text-sm text-gray-300">Nome</label>
                        <input
                            type="text"
                            defaultValue="Mario"
                            className="w-full p-2 rounded-lg bg-neutral-800 text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-gray-300">Cognome</label>
                        <input
                            type="text"
                            defaultValue="Rossi"
                            className="w-full p-2 rounded-lg bg-neutral-800 text-white"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm text-gray-300">Email</label>
                        <input
                            type="email"
                            defaultValue="mario.rossi@example.com"
                            className="w-full p-2 rounded-lg bg-neutral-800 text-white"
                        />
                    </div>
                    <div className="sm:col-span-2 flex justify-between items-center">
                        <button
                            type="button"
                            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                        >
                            Salva modifiche
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
