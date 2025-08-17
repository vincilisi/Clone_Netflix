'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import PreviewModal from './previewModal';
import { Item } from './types';

export default function Vetrina({ popMovies, popTV }: { popMovies: Item[]; popTV: Item[] }) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [videoKey, setVideoKey] = useState<string | undefined>();

    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const BASE_URL = 'https://api.themoviedb.org/3';

    async function fetchTrailer(item: Item) {
        try {
            const res = await fetch(`${BASE_URL}/${item.media_type}/${item.id}/videos?api_key=${API_KEY}&language=it-IT`);
            const data = await res.json();
            const trailer = data.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
            setVideoKey(trailer ? trailer.key : undefined);
        } catch (err) {
            console.error('Errore nel fetch del trailer:', err);
        }
    }

    return (
        <div className="w-full px-4 space-y-10">
            <Section title="Film Popolari" items={popMovies} onItemClick={(item) => { setSelectedItem(item); fetchTrailer(item); }} />
            <Section title="Serie TV Popolari" items={popTV} onItemClick={(item) => { setSelectedItem(item); fetchTrailer(item); }} />

            {selectedItem && (
                <PreviewModal
                    item={selectedItem}
                    videoKey={videoKey}
                    onClose={() => { setSelectedItem(null); setVideoKey(undefined); }}
                />
            )}
        </div>
    );
}

function Section({ title, items, onItemClick }: { title: string; items: Item[]; onItemClick: (item: Item) => void }) {
    return (
        <div className="text-center">
            <h2 className="text-white text-xl font-bold mb-4">{title}</h2>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                navigation
                breakpoints={{
                    0: { slidesPerView: 2 },
                    640: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                }}
            >
                {items.map((item) => (
                    <SwiperSlide key={item.id} className="flex justify-center">
                        <div
                            onClick={() => onItemClick(item)}
                            className="cursor-pointer block hover:scale-[1.02] transition-transform duration-200"
                        >
                            <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col h-full max-w-[500px]">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full object-cover aspect-[2/3]"
                                    loading="lazy"
                                />
                                <div className="relative group p-2 flex-grow flex items-center justify-center text-center text-sm text-white">
                                    <span className="truncate">{item.title}</span>
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-xs whitespace-normal text-center">
                                        {item.title}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
