'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface TV {
    name: string;
    first_air_date: string;
    genres: { name: string }[];
    overview: string;
    poster_path: string;
    created_by: { name: string }[];
}

interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

interface Trailer {
    key: string;
    site: string;
    type: string;
    name: string;
}

export default function TVPage() {
    const { id } = useParams();
    const [tv, setTV] = useState<TV | null>(null);
    const [cast, setCast] = useState<CastMember[]>([]);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTV() {
            try {
                const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=it-IT`);
                if (!res.ok) throw new Error('Serie TV non trovata');
                const data = await res.json();
                setTV(data);

                const creditsRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=it-IT`);
                const creditsData = await creditsRes.json();
                setCast(creditsData.cast.slice(0, 6)); // primi 6 attori

                const videosRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=it-IT`);
                const videosData = await videosRes.json();
                const trailer = videosData.results.find((v: Trailer) => v.type === 'Trailer' && v.site === 'YouTube');
                setTrailerKey(trailer?.key || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Errore sconosciuto');
            }
        }

        if (id) fetchTV();
    }, [id]);

    if (error) return <div className="text-red-500 p-6">{error}</div>;
    if (!tv) return <div className="text-white p-6">Caricamento...</div>;

    return (
        <div className="p-6 text-white max-w-5xl mx-auto space-y-8">
            {/* Titolo e poster */}
            <div className="flex flex-col md:flex-row gap-6">
                <img
                    src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                    alt={tv.name}
                    className="w-full md:w-64 rounded shadow-lg"
                />
                <div>
                    <h1 className="text-4xl font-bold mb-2">{tv.name}</h1>
                    <p><strong>Data di uscita:</strong> {tv.first_air_date}</p>
                    <p><strong>Genere:</strong> {tv.genres.map((g) => g.name).join(', ')}</p>
                    <p><strong>Creatori:</strong> {tv.created_by.map((c) => c.name).join(', ') || 'Sconosciuti'}</p>
                </div>
            </div>

            {/* Trama */}
            <div>
                <h2 className="text-2xl font-semibold mb-2">Trama</h2>
                <p className="text-gray-200">{tv.overview}</p>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Cast Principale</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {cast.map((actor) => (
                            <div key={actor.id} className="bg-gray-800 p-2 rounded text-center">
                                <img
                                    src={
                                        actor.profile_path
                                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                            : '/placeholder.png'
                                    }
                                    alt={actor.name}
                                    className="w-full h-48 object-cover rounded mb-2"
                                />
                                <p className="font-bold">{actor.name}</p>
                                <p className="text-sm text-gray-300">"{actor.character}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trailer */}
            {trailerKey && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
                    <div className="aspect-video">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerKey}`}
                            title="Trailer"
                            allowFullScreen
                            className="w-full h-full rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
