"use client";
import { useEffect, useState } from "react";
import { Item } from "./types";
import Link from "next/link";

export default function PreviewModal({ item, onClose }: { item: Item; onClose: () => void }) {
    const [videoKey, setVideoKey] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTrailer() {
            const res = await fetch(
                `https://api.themoviedb.org/3/${item.media_type}/${item.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-En`
            );
            const data = await res.json();
            const trailer = data.results?.find(
                (vid: any) => vid.site === 'YouTube' && vid.type === 'Trailer'
            );
            setVideoKey(trailer?.key || null);
        }
        fetchTrailer();
    }, [item]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div
                className="absolute inset-0 bg-cover bg-center blur-lg opacity-50"
                style={{ backgroundImage: `url(${item.img})` }}
            />
            <div className="relative z-10 w-full max-w-4xl p-4 flex flex-col items-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-2xl"
                >
                    ✕
                </button>

                {videoKey ? (
                    <iframe
                        width="100%"
                        height="500"
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                        title={item.title}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="rounded-lg"
                    />
                ) : (
                    <p className="text-white mb-4">Trailer non disponibile</p>
                )}

                <Link
                    href={item.media_type === 'movie' ? `/film/${item.id}` : `/serieTV/${item.id}`}
                    className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                    Vai alla pagina {item.media_type === 'movie' ? 'del film' : 'della serie TV'}
                </Link>


            </div>
        </div>
    );
}
