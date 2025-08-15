'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface ItemDetails {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string;
    release_date?: string;
    first_air_date?: string;
}

interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export default function FilmPage() {
    const { id } = useParams();
    const [item, setItem] = useState<ItemDetails | null>(null);
    const [cast, setCast] = useState<CastMember[]>([]);
    const [showExtra, setShowExtra] = useState(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // 1. Info del film/serie
                const resItem = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=it-IT`
                );
                const dataItem = await resItem.json();
                setItem(dataItem);

                // 2. Cast
                const resCast = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=it-IT`
                );
                const dataCast = await resCast.json();
                setCast(dataCast.cast?.slice(0, 6) || []);

                // 3. Trailer
                const resTrailer = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
                );
                const dataTrailer = await resTrailer.json();
                const trailer = dataTrailer.results?.find(
                    (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
                );
                setTrailerKey(trailer?.key || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) return <div className="text-white text-center mt-20">Caricamento in corso...</div>;
    if (!item) return <div className="text-white text-center mt-20">Film non trovato</div>;

    return (
        <div className="p-4 text-white flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">{item.title || item.name}</h1>
            <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="rounded-lg mb-4 shadow-lg"
            />
            <p className="mb-2">Data di uscita: {item.release_date || item.first_air_date}</p>
            <p className="max-w-2xl text-center mb-4">{item.overview}</p>

            <button
                onClick={() => {
                    setShowExtra(!showExtra);
                    if (!showExtra) {
                        setTimeout(() => {
                            document.getElementById('extra')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }
                }}
                className="bg-red-600 hover:bg-red-700 transition-colors px-6 py-2 rounded-full text-white mb-4"
            >
                {showExtra ? 'Chiudi Extra' : 'Mostra Extra'}
            </button>

            {showExtra && (
                <div id="extra" className="w-full max-w-4xl flex flex-col items-center space-y-6 relative">
                    {/* Sfondo sfocato trailer */}
                    {trailerKey && (
                        <div className="absolute inset-0 bg-black/80 -z-10 rounded-lg" />
                    )}

                    {/* Cast */}
                    {cast.length > 0 && (
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
                    )}

                    {/* Trailer */}
                    {trailerKey ? (
                        <iframe
                            width="100%"
                            height="400"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0`}
                            title="Trailer"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="rounded-lg shadow-lg"
                        />
                    ) : (
                        <p className="text-white">Trailer non disponibile</p>
                    )}
                </div>
            )}
        </div>
    );
}
