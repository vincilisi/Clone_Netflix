"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
    // Avatar fissi predefiniti
    const avatarOptions = [
        "https://api.dicebear.com/6.x/avataaars/png?seed=1",
        "https://api.dicebear.com/6.x/avataaars/png?seed=2",
        "https://api.dicebear.com/6.x/avataaars/png?seed=3",
        "https://api.dicebear.com/6.x/avataaars/png?seed=4",
        "https://api.dicebear.com/6.x/avataaars/png?seed=5",
        "https://api.dicebear.com/6.x/avataaars/png?seed=6",
    ];

    const [profiles, setProfiles] = useState([
        { id: 1, name: "", avatar: avatarOptions[0] },
        { id: 2, name: "", avatar: avatarOptions[1] },
    ]);

    const [activeProfile, setActiveProfile] = useState(profiles[0]);
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Gestione aggiunta nuovo profilo
    const [showAddProfile, setShowAddProfile] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
    const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
    const [newProfileName, setNewProfileName] = useState("");

    const handleAddProfile = () => {
        const avatar = uploadedAvatar || selectedAvatar;
        const newProfile = {
            id: Date.now(),
            name: newProfileName || "Nuovo",
            avatar,
        };
        setProfiles([...profiles, newProfile]);
        setActiveProfile(newProfile);
        setNewProfileName("");
        setUploadedAvatar(null);
        setSelectedAvatar(avatarOptions[0]);
        setShowAddProfile(false);
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setUploadedAvatar(reader.result as string);
        reader.readAsDataURL(file);
    };

    const updateProfileName = (name: string) => {
        const updatedProfiles = profiles.map((p) =>
            p.id === activeProfile.id ? { ...p, name } : p
        );
        setProfiles(updatedProfiles);
        setActiveProfile({ ...activeProfile, name });
    };

    return (
        <div className="flex flex-col items-center px-6 py-12 text-white bg-black min-h-screen">
            {/* Sezione profili */}
            <div className="w-full max-w-4xl bg-neutral-900 rounded-2xl shadow-lg p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4">Profili</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {profiles.map((profile) => (
                        <button
                            key={profile.id}
                            onClick={() => setActiveProfile(profile)}
                            className={`flex flex-col items-center transition-transform ${activeProfile.id === profile.id
                                ? "scale-105 border-2 border-red-600 rounded-lg"
                                : "opacity-70"
                                }`}
                            aria-label={`Seleziona profilo ${profile.name || "Nuovo"}`}
                        >
                            <Image
                                src={profile.avatar}
                                alt={`Avatar profilo ${profile.name || "Nuovo"}`}
                                width={120}
                                height={120}
                                className="rounded-lg"
                            />
                            <span className="mt-2">{profile.name || "Nuovo"}</span>
                        </button>
                    ))}

                    {/* Aggiungi nuovo profilo */}
                    <button
                        onClick={() => setShowAddProfile(!showAddProfile)}
                        className="flex flex-col items-center justify-center border-2 border-gray-500 border-dashed rounded-lg p-6 hover:border-white"
                        aria-label="Aggiungi nuovo profilo"
                    >
                        <span className="text-3xl">+</span>
                        <span className="mt-2 text-sm">Aggiungi</span>
                    </button>
                </div>

                {/* Sezione aggiungi profilo */}
                {showAddProfile && (
                    <div className="mt-6 bg-neutral-800 p-4 rounded-lg space-y-4">
                        <label htmlFor="newProfileName" className="block text-sm text-gray-300">
                            Nome profilo
                        </label>
                        <input
                            id="newProfileName"
                            type="text"
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                            placeholder="Inserisci nome"
                            className="w-full p-2 rounded-lg bg-neutral-700 text-white"
                        />

                        <label className="block text-sm text-gray-300">Scegli un avatar</label>
                        <div className="flex gap-2 overflow-x-auto">
                            {avatarOptions.map((avatar) => (
                                <button
                                    key={avatar}
                                    onClick={() => setSelectedAvatar(avatar)}
                                    className={`border-2 rounded-lg ${selectedAvatar === avatar ? "border-red-600" : "border-transparent"
                                        }`}
                                    aria-label="Seleziona avatar predefinito"
                                >
                                    <Image
                                        src={avatar}
                                        alt="Avatar predefinito"
                                        width={60}
                                        height={60}
                                        className="rounded-lg"
                                    />
                                </button>
                            ))}

                            {/* Upload da dispositivo */}
                            <label
                                htmlFor="avatarUpload"
                                className="flex flex-col items-center justify-center w-16 h-16 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer text-gray-400 hover:border-white hover:text-white"
                                aria-label="Carica avatar dal dispositivo"
                            >
                                <span className="text-2xl">+</span>
                                <input
                                    id="avatarUpload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleUpload}
                                />
                            </label>

                            {uploadedAvatar && (
                                <Image
                                    src={uploadedAvatar}
                                    alt="Avatar caricato"
                                    width={60}
                                    height={60}
                                    className="rounded-lg"
                                />
                            )}
                        </div>

                        <button
                            onClick={handleAddProfile}
                            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                            aria-label="Aggiungi profilo"
                        >
                            Aggiungi profilo
                        </button>
                    </div>
                )}
            </div>

            {/* Sezione dati account */}
            <div className="w-full max-w-4xl bg-neutral-900 rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold mb-4">Dati account</h2>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                        <label htmlFor="activeProfileName" className="block mb-2 text-sm text-gray-300">
                            Nome profilo
                        </label>
                        <input
                            id="activeProfileName"
                            type="text"
                            value={activeProfile.name}
                            onChange={(e) => updateProfileName(e.target.value)}
                            placeholder="Inserisci nome"
                            className="w-full p-2 rounded-lg bg-neutral-800 text-white"
                        />
                    </div>

                    <div className="relative sm:col-span-2">
                        <label htmlFor="newPassword" className="block mb-2 text-sm text-gray-300">
                            Nuova Password
                        </label>
                        <input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Inserisci nuova password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 rounded-lg bg-neutral-800 text-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="sm:col-span-2 flex justify-between items-center">
                        <Link
                            href="./profile"
                            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition text-center inline-block"
                            aria-label="Salva modifiche"
                        >
                            Salva modifiche
                        </Link>
                        <button
                            type="button"
                            className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
