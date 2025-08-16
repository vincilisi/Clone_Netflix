'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PreviewModal from './previewModal';
import { Item, Genre } from './types';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default function VetrinaSerieTV() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [seriesByGenre, setSeriesByGenre] = useState<Record<number, Item[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [videoKey, setVideoKey] = useState<string | undefined>();

    function mapToItem(data: any, genreName: string): Item | null {
        if (!data.name || !data.poster_path) return null;
        return {
            id: data.id,
            title: data.name,
            img: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
            media_type: 'tv',
            overview: data.overview,
            genre: genreName
        };
    }

    useEffect(() => {
        async function fetchGenresAndSeries() {
            try {
                setLoading(true);

                const genreRes = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-EN`);
                const genreData = await genreRes.json();
                const genreList: Genre[] = genreData.genres;
                setGenres(genreList);

                const results: Record<number, Item[]> = {};

                for (const genre of genreList) {
                    const allItems: Item[] = [];

                    const firstRes = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-EN&with_genres=${genre.id}&sort_by=popularity.desc&page=1`);
                    const firstData = await firstRes.json();
                    const totalPages = Math.min(firstData.total_pages, 5);

                    if (firstData.results) {
                        allItems.push(...firstData.results.map((s: any) => mapToItem(s, genre.name)).filter(Boolean));
                    }

                    for (let page = 2; page <= totalPages; page++) {
                        const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-EN&with_genres=${genre.id}&sort_by=popularity.desc&page=${page}`);
                        const data = await res.json();
                        if (data.results) {
                            allItems.push(...data.results.map((s: any) => mapToItem(s, genre.name)).filter(Boolean));
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

    async function fetchTrailer(item: Item) {
        const res = await fetch(`${BASE_URL}/tv/${item.id}/videos?api_key=${API_KEY}&language=en-EN`);
        const data = await res.json();
        const trailer = data.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
        setVideoKey(trailer ? trailer.key : undefined);
    }

    if (loading) return <div className="text-white text-center py-20">Caricamento...</div>;
    if (error) return <div className="text-red-500 text-center py-20">{error}</div>;

    return (
        <div className="w-full px-4 space-y-12 mt-8 text-center">
            {genres.map((genre) => (
                <Section
                    key={genre.id}
                    title={`📺 ${genre.name}`}
                    items={seriesByGenre[genre.id] || []}
                    onItemClick={(item) => { setSelectedItem(item); fetchTrailer(item); }}
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

function Section({ title, items, onItemClick }: { title: string; items: Item[]; onItemClick: (item: Item) => void }) {
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
