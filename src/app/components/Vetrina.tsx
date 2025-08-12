'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';

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
                if (!dataPopMovies.results) throw new Error('Film popolari non trovati');
                setPopMovies(dataPopMovies.results.slice(0, 10).map((f: any) => mapToItem(f)));

                const resPopTV = await fetch(
                    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=it-IT&page=1`
                );
                const dataPopTV = await resPopTV.json();
                if (!dataPopTV.results) throw new Error('Serie TV popolari non trovate');
                setPopTV(dataPopTV.results.slice(0, 10).map((tv: any) => mapToItem(tv, true)));

                const resNowMovies = await fetch(
                    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=it-IT&page=1`
                );
                const dataNowMovies = await resNowMovies.json();
                if (!dataNowMovies.results) throw new Error('Film del momento non trovati');
                setNowMovies(dataNowMovies.results.slice(0, 5).map((f: any) => mapToItem(f)));

                const resNowTV = await fetch(
                    `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=it-IT&page=1`
                );
                const dataNowTV = await resNowTV.json();
                if (!dataNowTV.results) throw new Error('Serie TV del momento non trovate');
                setNowTV(dataNowTV.results.slice(0, 5).map((tv: any) => mapToItem(tv, true)));

                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Errore sconosciuto');
            } finally {
                setLoading(false);
            }
        }

        if (!API_KEY) {
            setError('API Key TMDB non trovata. Controlla .env.local e che sia NEXT_PUBLIC_TMDB_API_KEY');
            setLoading(false);
            return;
        }

        fetchData();
    }, [API_KEY]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (
        popMovies.length === 0 &&
        popTV.length === 0 &&
        nowMovies.length === 0 &&
        nowTV.length === 0
    ) {
        return <div>Nessun dato ricevuto</div>;
    }

    return (
        <div className="w-full px-4 space-y-10">
            <Section title="Film Popolari" items={popMovies} />
            <Section title="Serie TV Popolari" items={popTV} />
            <Section title="Film del Momento" items={nowMovies} />
            <Section title="Serie TV del Momento" items={nowTV} />
        </div>
    );
}

function Section({ title, items }: { title: string; items: Item[] }) {
    return (
        <div>
            <h2 className="text-white text-xl font-bold mb-4">{title}</h2>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={items.length < 5 ? items.length : 5}
                navigation
                pagination={{ clickable: true }}
            >
                {items.map((item) => (
                    <SwiperSlide key={`${item.media_type}-${item.id}`}>
                        <Link
                            href={`/${item.media_type}/${item.id}`}
                            className="block hover:scale-[1.02] transition-transform duration-200"
                        >
                            <div className="bg-gray-800 rounded-lg overflow-hidden h-[300px] flex flex-col">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-[200px] object-cover"
                                    loading="lazy"
                                />
                                <div className="p-2 text-white flex-grow flex items-center justify-center text-center text-sm truncate">
                                    {item.title}
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
