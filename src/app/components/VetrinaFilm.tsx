'use client';

import { useState } from 'react';
import PreviewModal from './previewModal';
import { Item, Genre } from './types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

type VetrinaProps = {
    genres: Genre[];
    itemsByGenre: Record<number, Item[]>;
    isTV?: boolean;
};

export default function Vetrina({ genres, itemsByGenre, isTV = false }: VetrinaProps) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [videoKey, setVideoKey] = useState<string | undefined>();

    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const BASE_URL = 'https://api.themoviedb.org/3';

    async function fetchTrailer(item: Item) {
        try {
            const endpoint = isTV ? 'tv' : 'movie';
            const res = await fetch(`${BASE_URL}/${endpoint}/${item.id}/videos?api_key=${API_KEY}&language=it-IT`);
            const data = await res.json();
            const trailer = data.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
            setVideoKey(trailer ? trailer.key : undefined);
        } catch (err) {
            console.error('Errore nel fetch del trailer:', err);
        }
    }

    return (
        <div className="w-full px-4 space-y-12 mt-8 text-center">
            {genres.map((genre) => (
                <Section
                    key={genre.id}
                    title={`${isTV ? '📺' : '🎬'} ${genre.name}`}
                    items={itemsByGenre[genre.id] || []}
                    onItemClick={(item) => {
                        setSelectedItem(item);
                        fetchTrailer(item);
                    }}
                />
            ))}

            {selectedItem && (
                <PreviewModal
                    item={selectedItem}
                    videoKey={videoKey}
                    onClose={() => {
                        setSelectedItem(null);
                        setVideoKey(undefined);
                    }}
                />
            )}
        </div>
    );
}

function Section({
    title,
    items,
    onItemClick
}: {
    title: string;
    items: Item[];
    onItemClick: (item: Item) => void;
}) {
    return (
        <div>
            <h2 className="text-white text-2xl font-bold mb-4">{title}</h2>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                navigation
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: Math.min(items.length, 5) },
                }}
            >
                {items.map((item) => (
                    <SwiperSlide key={`${title}-${item.id}`}>
                        <div
                            onClick={() => onItemClick(item)}
                            className="cursor-pointer block hover:scale-[1.02] transition-transform duration-200"
                        >
                            <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col h-[600px] md:h-[500px] lg:h-[500px]">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-[500px] object-cover md:h-[500px] lg:h-[500px]"
                                    loading="lazy"
                                />
                                <div className="p-2 flex-grow flex items-center justify-center text-center text-sm text-white">
                                    <span className="truncate">{item.title}</span>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
