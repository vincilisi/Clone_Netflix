'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PreviewModal from './previewModal';

interface Item {
    id: number;
    title: string;
    img: string;
    media_type: 'movie' | 'tv';
}

export default function Vetrina() {
    const [popMovies, setPopMovies] = useState<Item[]>([]);
    const [popTV, setPopTV] = useState<Item[]>([]);
    const [nowMovies, setNowMovies] = useState<Item[]>([]);
    const [nowTV, setNowTV] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const BASE_URL = 'https://api.themoviedb.org/3';

    function mapToItem(data: any, isTV = false): Item {
        return {
            id: data.id,
            title: isTV ? data.name : data.title,
            img: data.poster_path
                ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                : '/placeholder.png',
            media_type: isTV ? 'tv' : 'movie',
        };
    }

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const resPopMovies = await fetch(
                    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=it-IT&page=1`
                );
                const dataPopMovies = await resPopMovies.json();
                setPopMovies(dataPopMovies.results.slice(0, 10).map((f: any) => mapToItem(f)));

                const resPopTV = await fetch(
                    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=it-IT&page=1`
                );
                const dataPopTV = await resPopTV.json();
                setPopTV(dataPopTV.results.slice(0, 10).map((tv: any) => mapToItem(tv, true)));

                const resNowMovies = await fetch(
                    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=it-IT&page=1`
                );
                const dataNowMovies = await resNowMovies.json();
                setNowMovies(dataNowMovies.results.slice(0, 5).map((f: any) => mapToItem(f)));

                const resNowTV = await fetch(
                    `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=it-IT&page=1`
                );
                const dataNowTV = await resNowTV.json();
                setNowTV(dataNowTV.results.slice(0, 5).map((tv: any) => mapToItem(tv, true)));

                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Errore sconosciuto');
            } finally {
                setLoading(false);
            }
        }

        if (!API_KEY) {
            setError('API Key TMDB non trovata. Controlla .env.local');
            setLoading(false);
            return;
        }

        fetchData();


        const oneDay = 24 * 60 * 60 * 1000;
        const interval = setInterval(fetchData, oneDay);

        return () => clearInterval(interval);
    }, [API_KEY]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="w-full px-4 space-y-10">
            <Section title="Film Popolari" items={popMovies} onItemClick={setSelectedItem} />
            <Section title="Serie TV Popolari" items={popTV} onItemClick={setSelectedItem} />
            <Section title="Film del Momento" items={nowMovies} onItemClick={setSelectedItem} />
            <Section title="Serie TV del Momento" items={nowTV} onItemClick={setSelectedItem} />

            {selectedItem && (
                <PreviewModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}

function Section({ title, items, onItemClick }: { title: string; items: Item[]; onItemClick: (item: Item) => void }) {
    return (
        <div className='text-center'>
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
                            className='cursor-pointer block hover:scale-[1.02] transition-transform duration-200'
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
