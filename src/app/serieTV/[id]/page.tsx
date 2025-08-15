'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface SerieDetails {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    first_air_date: string;
}

interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export default function SeriePage() {
    const params = useParams();
    const { id } = params;
    const [serie, setSerie] = useState<SerieDetails | null>(null);
    const [cast, setCast] = useState<CastMember[]>([]);
    const [showExtra, setShowExtra] = useState(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            // 1. Info della serie
            const resSerie = await fetch(
                `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-EN`
            );
            const dataSerie = await resSerie.json();
            setSerie(dataSerie);

            // 2. Cast
            const resCast = await fetch(
                `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-EN`
            );
            const dataCast = await resCast.json();
            setCast(dataCast.cast.slice(0, 6)); // primi 6 attori

            // 3. Trailer
            const resTrailer = await fetch(
                `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-EN`
            );
            const dataTrailer = await resTrailer.json();
            const trailer = dataTrailer.results.find(
                (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
            );
            setTrailerKey(trailer?.key || null);
        }

        fetchData();
    }, [id]);

    if (!serie) return <div>Loading...</div>;

    return (
        <div className="p-4 text-white flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">{serie.name}</h1>
            <img
                src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`}
                alt={serie.name}
                className="rounded-lg mb-4"
            />
            <p className="mb-2">Prima trasmissione: {serie.first_air_date}</p>
            <p className="max-w-2xl text-center mb-4">{serie.overview}</p>

            <button
                onClick={() => setShowExtra(!showExtra)}
                className="bg-red-600 hover:bg-red-700 transition-colors px-6 py-2 rounded-full text-white mb-4"
            >
                {showExtra ? 'Chiudi Extra' : 'Mostra Extra'}
            </button>

            {showExtra && (
                <div className="w-full max-w-4xl flex flex-col items-center space-y-4">
                    {/* Cast */}
                    <div className="w-full grid grid-cols-3 md:grid-cols-6 gap-4">
                        {cast.map(actor => (
                            <div key={actor.id} className="flex flex-col items-center">
                                {actor.profile_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                        alt={actor.name}
                                        className="rounded-lg"
                                    />
                                ) : (
                                    <div className="w-20 h-28 bg-gray-700 rounded-lg" />
                                )}
                                <span className="text-xs text-center mt-1">{actor.name}</span>
                                <span className="text-xs text-gray-300 text-center">{actor.character}</span>
                            </div>
                        ))}
                    </div>

                    {/* Trailer */}
                    {trailerKey ? (
                        <iframe
                            width="100%"
                            height="400"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0`}
                            title="Trailer"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    ) : (
                        <p>Trailer non disponibile</p>
                    )}
                </div>
            )}
        </div>
    );
}
