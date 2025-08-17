'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function AuthContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') || 'login';

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            if (mode === 'register') {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;

                if (data.user) {
                    await supabase.from('profiles').insert({
                        id: data.user.id,
                        username: email.split('@')[0],
                        avatar_url: null,
                    });
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }

            setTimeout(() => {
                router.push('/');
            }, 500);
        } catch (err: any) {
            setErrorMsg(err.message || 'Errore durante l’autenticazione.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="relative min-h-screen bg-color text-color flex items-center justify-center transition-colors duration-300">
            {/* Sfondo stile Netflix */}
            <div className="absolute inset-0 bg-[url('/netflix-bg.jpg')] bg-cover bg-center opacity-40"></div>
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            {/* Form contenitore */}
            <form
                onSubmit={handleSubmit}
                className="relative z-10 bg-color bg-opacity-90 p-8 rounded-lg w-full max-w-md space-y-6 shadow-lg"
            >
                <h2 className="text-3xl font-bold text-center">
                    {mode === 'login' ? 'Accedi a WolfFlix' : 'Registrati su WolfFlix'}
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="w-full p-3 rounded bg-gray-800 text-white pr-10 focus:outline-none focus:ring-2 focus:ring-red-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 p-3 rounded text-white font-semibold transition duration-200"
                    disabled={loading}
                >
                    {loading ? 'Caricamento...' : mode === 'login' ? 'Accedi' : 'Registrati'}
                </button>

                {/* Switch tra login e registrazione */}
                <div className="text-center text-sm mt-4">
                    {mode === 'login' ? (
                        <>
                            <p>Non hai un account?</p>
                            <button
                                type="button"
                                onClick={() => router.push('?mode=register')}
                                className="hover-color underline mt-1"
                            >
                                Registrati qui
                            </button>
                        </>
                    ) : (
                        <>
                            <p>Hai già un account?</p>
                            <button
                                type="button"
                                onClick={() => router.push('?mode=login')}
                                className="hover-color underline mt-1"
                            >
                                Accedi qui
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
