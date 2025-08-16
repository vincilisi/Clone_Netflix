'use client';

import Link from 'next/link';
import { Item } from './types';

interface PreviewModalProps {
    item: Item;
    onClose: () => void;
    videoKey?: string;
}

export default function PreviewModal({ item, onClose, videoKey }: PreviewModalProps) {
    return (
        <div className="fixed inset-0 z-50 overflow-auto flex justify-center items-start min-h-screen">
            {/* Background sfocato */}
            <div
                className="fixed inset-0 w-full h-full"
                style={{
                    backgroundImage: `url(${item.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(15px)',
                }}
            />
            {/* Overlay semi-trasparente */}
            <div className="fixed inset-0 bg-black/50" />

            {/* Contenuto */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-4xl p-4 mt-20">
                {/* Bottone chiudi */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-2xl z-20"
                >
                    ✕
                </button>

                {/* Titolo */}
                <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
                    {item.title}
                </h2>

                {/* Trailer */}
                {videoKey ? (
                    <iframe
                        className="rounded-lg mb-4 w-full max-w-[800px] sm:max-w-[90%]"
                        style={{ height: 500 }}
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                        title={item.title}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                ) : (
                    <p className="text-white mb-4">Trailer non disponibile</p>
                )}

                {/* Info responsive */}
                <div className="w-full text-center text-white space-y-2">
                    {/* Medium screens: titolo + genere */}
                    <p className="hidden sm:block lg:hidden text-sm text-gray-300">
                        {item.media_type === 'movie' ? 'Film' : 'Serie TV'} • {item.genre || 'Genere non disponibile'}
                    </p>

                    {/* Large screens: titolo + genere + trama + bottone */}
                    <div className="hidden lg:flex flex-col items-center space-y-2">
                        <p className="text-sm text-gray-300">
                            {item.media_type === 'movie' ? 'Film' : 'Serie TV'} • {item.genre || 'Genere non disponibile'}
                        </p>
                        <p className="text-sm text-gray-200 line-clamp-2 max-w-3xl text-center">
                            {item.overview || 'Trama non disponibile'}...
                        </p>
                        <Link
                            href={item.media_type === 'movie' ? `/film/${item.id}` : `/serieTV/${item.id}`}
                            className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Vai alla pagina {item.media_type === 'movie' ? 'del film' : 'della serie TV'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
