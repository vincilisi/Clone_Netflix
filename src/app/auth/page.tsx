'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const param = searchParams.get('mode');
        if (param === 'register') setMode('register');
        else setMode('login');
    }, [searchParams]);

    const handleAuth = async () => {
        setLoading(true);
        setError(null);

        if (mode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
            else router.push('/account');
        } else {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) setError(error.message);
            else router.push('/account');
        }

        setLoading(false);
    };

    const handleGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/account` },
        });
        if (error) setError(error.message);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-4">
            <h1 className="text-3xl font-bold mb-8">{mode === 'login' ? 'Accedi' : 'Registrati'}</h1>

            <div className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded bg-gray-800 text-white"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 rounded bg-gray-800 text-white"
                />

                {error && <p className="text-red-500">{error}</p>}

                <button
                    onClick={handleAuth}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 p-3 rounded font-bold transition-colors"
                >
                    {loading ? 'Caricamento...' : mode === 'login' ? 'Accedi' : 'Registrati'}
                </button>

                <button
                    onClick={handleGoogle}
                    className="bg-white text-black p-3 rounded font-bold mt-2 transition-colors"
                >
                    Continua con Google
                </button>

                <p className="text-gray-400 text-sm mt-2">
                    {mode === 'login' ? "Non hai un account?" : "Hai già un account?"}{' '}
                    <button
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className="text-white underline"
                    >
                        {mode === 'login' ? 'Registrati' : 'Accedi'}
                    </button>
                </p>
            </div>
        </div>
    );
}
