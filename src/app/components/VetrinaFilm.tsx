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
    media_type: 'movie';
}

interface Genre {
    id: number;
    name: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default function VetrinaFilm() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [filmsByGenre, setFilmsByGenre] = useState<Record<number, Item[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function mapToItem(data: any): Item | null {
        if (!data.title || !data.poster_path) return null;

        return {
            id: data.id,
            title: data.title,
            img: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
            media_type: 'movie',
        };
    }

    useEffect(() => {
        async function fetchGenresAndFilms() {
            try {
                setLoading(true);

                const genreRes = await fetch(
                    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=it-IT`
                );
                const genreData = await genreRes.json();
                const genreList: Genre[] = genreData.genres;
                setGenres(genreList);

                const results: Record<number, Item[]> = {};

                for (const genre of genreList) {
                    const allItems: Item[] = [];

                    const firstRes = await fetch(
                        `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=it-IT&with_genres=${genre.id}&sort_by=popularity.desc&page=1`
                    );
                    const firstData = await firstRes.json();
                    const totalPages = Math.min(firstData.total_pages, 5);

                    if (firstData.results) {
                        allItems.push(...firstData.results.map(mapToItem).filter(Boolean));
                    }

                    for (let page = 2; page <= totalPages; page++) {
                        const res = await fetch(
                            `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=it-IT&with_genres=${genre.id}&sort_by=popularity.desc&page=${page}`
                        );
                        const data = await res.json();
                        if (data.results) {
                            allItems.push(...data.results.map(mapToItem).filter(Boolean));
                        }
                    }

                    const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());
                    results[genre.id] = uniqueItems;
                }

                setFilmsByGenre(results);
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

        fetchGenresAndFilms();
    }, []);

    if (loading) return <div className="text-white text-center">Caricamento...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="w-full px-4 space-y-12 mt-8 text-center">
            {genres.map((genre) => (
                <Section
                    key={genre.id}
                    title={`🎬 ${genre.name}`}
                    items={filmsByGenre[genre.id] || []}
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
            >
                {items.map((item) => (
                    <SwiperSlide key={`${title}-${item.id}`}>
                        <Link
                            href={`/${item.media_type}s/${item.id}`}
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
