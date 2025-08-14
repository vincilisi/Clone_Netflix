'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Item {
    id: number;
    title: string;
    img: string;
    media_type: 'tv';
}

interface Genre {
    id: number;
    name: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function VetrinaSerieTV() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [seriesByGenre, setSeriesByGenre] = useState<Record<number, Item[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function mapToItem(data: any): Item | null {
        if (!data.name || !data.poster_path) return null;

        return {
            id: data.id,
            title: data.name,
            img: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
            media_type: 'tv',
        };
    }

    useEffect(() => {
        async function fetchGenresAndSeries() {
            try {
                setLoading(true);

                const genreRes = await fetch(
                    `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=it-IT`
                );
                const genreData = await genreRes.json();
                const genreList: Genre[] = genreData.genres;
                setGenres(genreList);

                const results: Record<number, Item[]> = {};

                for (const genre of genreList) {
                    const allItems: Item[] = [];

                    const firstRes = await fetch(
                        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=it-IT&with_genres=${genre.id}&sort_by=popularity.desc&page=1`
                    );
                    const firstData = await firstRes.json();
                    const totalPages = Math.min(firstData.total_pages, 5);

                    if (firstData.results) {
                        allItems.push(...firstData.results.map(mapToItem).filter(Boolean));
                    }

                    for (let page = 2; page <= totalPages; page++) {
                        const res = await fetch(
                            `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=it-IT&with_genres=${genre.id}&sort_by=popularity.desc&page=${page}`
                        );
                        const data = await res.json();
                        if (data.results) {
                            allItems.push(...data.results.map(mapToItem).filter(Boolean));
                        }
                    }

                    const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());
                    results[genre.id] = uniqueItems;
                }

                setSeriesByGenre(results);
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

        fetchGenresAndSeries();
    }, []);

    if (loading) return <div className="text-white text-center">Caricamento...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="w-full px-4 space-y-12 mt-8 text-center">
            {genres.map((genre) => (
                <Section
                    key={genre.id}
                    title={`📺 ${genre.name}`}
                    items={seriesByGenre[genre.id] || []}
                />
            ))}
        </div>
    );
}

function Section({ title, items }: { title: string; items: Item[] }) {
    return (
        <div>
            <h2 className="text-white text-2xl font-bold mb-4">{title}</h2>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={items.length < 5 ? items.length : 5}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    320: { slidesPerView: 1 },   // schermi piccoli
                    640: { slidesPerView: 2 },   // schermi medi piccoli
                    768: { slidesPerView: 3 },   // tablet/medi
                    1024: { slidesPerView: Math.min(items.length, 5) }, // grandi schermi
                }}
            >
                {items.map((item) => (
                    <SwiperSlide key={`${title}-${item.id}`}>
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
                                <div className="p-2 flex-grow flex items-center justify-center text-center text-sm text-white">
                                    <span className="truncate">{item.title}</span>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
