'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import ThemeToggle from '../components/ThemeToggle';

export default function AuthContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') || 'login';

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

            router.push('/');
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center">
            {/* Background overlay tipo Netflix */}
            <div className="absolute inset-0 bg-[url('/netflix-bg.jpg')] bg-cover bg-center opacity-40"></div>
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            {/* Form contenitore */}
            <div className="relative z-10 w-full max-w-md bg-black bg-opacity-80 rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {mode === 'login' ? 'Accedi' : 'Registrati'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 p-3 rounded text-white font-semibold transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Caricamento...' : mode === 'login' ? 'Accedi' : 'Registrati'}
                    </button>
                </form>

                {/* Theme toggle in basso */}
                <div className="flex justify-center mt-6">
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}
