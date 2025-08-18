'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import PreviewModal from './previewModal';
import { Item } from './types';

interface VetrinaProps {
    popMovies: Item[];
    popTV: Item[];
}

export default function Vetrina({ popMovies, popTV }: VetrinaProps) {
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

    function Section({ title, items }: { title: string; items: Item[] }) {
        return (
            <div className="text-center mb-10">
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
                        <SwiperSlide key={item.id}>
                            <div
                                onClick={() => { setSelectedItem(item); fetchTrailer(item); }}
                                className="cursor-pointer block hover:scale-[1.02] transition-transform duration-200"
                            >
                                <img src={item.img} alt={item.title} className="w-full rounded-lg" loading="lazy" />
                                <span className="text-white text-sm mt-1 block truncate">{item.title}</span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    }

    return (
        <div className="w-full px-4">
            <Section title="Film Popolari" items={popMovies} />
            <Section title="Serie TV Popolari" items={popTV} />

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
