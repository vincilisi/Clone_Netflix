'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function AuthContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                    // crea profilo in tabella profiles
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

            // redirect alla home
            router.push('/');
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold">{mode === 'login' ? 'Login' : 'Register'}</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 rounded bg-gray-800 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="w-full p-2 rounded bg-gray-800 text-white pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
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
                    className="w-full bg-indigo-600 hover:bg-indigo-500 p-2 rounded text-white font-semibold"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
                </button>
            </form>
        </div>
    );
}
