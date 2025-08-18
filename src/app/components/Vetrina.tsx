'use client';
import VetrinaFilm from '@/app/components/VetrinaFilm';
import VetrinaSerieTV from '@/app/components/VetrinaSerie';
import { notFound } from 'next/navigation';
import { Genre, Item } from '@/app/components/types';

export const dynamic = 'force-dynamic'; // forza SSR dinamico per evitare errori in build

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

function mapToItem(data: any, genreName: string, isTV = false): Item | null {
    const title = isTV ? data.name : data.title;
    if (!title || !data.poster_path) return null;
    return {
        id: data.id,
        title,
        img: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        media_type: isTV ? 'tv' : 'movie',
        overview: data.overview,
        genre: genreName,
    };
}

const MoviePage = async ({ params }: { params: { movie: string } }) => {
    const type = params.movie;

    if (!type || (type !== 'film' && type !== 'serie-tv')) {
        return notFound();
    }

    try {
        if (type === 'film') {
            const genreRes = await fetch(
                `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=it-IT`,
                { cache: 'no-store' }
            );
            const genreData = await genreRes.json();
            const genres: Genre[] = genreData.genres || [];

            const filmsByGenre: Record<number, Item[]> = {};
            for (const genre of genres) {
                const res = await fetch(
                    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=it-IT&with_genres=${genre.id}&sort_by=popularity.desc&page=1`,
                    { cache: 'no-store' }
                );
                const data = await res.json();
                const items = data.results?.map((f: any) => mapToItem(f, genre.name)).filter(Boolean) || [];
                filmsByGenre[genre.id] = items;
            }

            return <VetrinaFilm genres={genres} filmsByGenre={filmsByGenre} />;
        }

        if (type === 'serie-tv') {
            const genreRes = await fetch(
                `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=it-IT`,
                { cache: 'no-store' }
            );
            const genreData = await genreRes.json();
            const genres: Genre[] = genreData.genres || [];

            const seriesByGenre: Record<number, Item[]> = {};
            for (const genre of genres) {
                const res = await fetch(
                    `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=it-IT&with_genres=${genre.id}&sort_by=popularity.desc&page=1`,
                    { cache: 'no-store' }
                );
                const data = await res.json();
                const items = data.results?.map((s: any) => mapToItem(s, genre.name, true)).filter(Boolean) || [];
                seriesByGenre[genre.id] = items;
            }

            return <VetrinaSerieTV genres={genres} seriesByGenre={seriesByGenre} />;
        }
    } catch (error) {
        console.error('Errore nel rendering della pagina:', error);
        return notFound();
    }

    return notFound();
};

// Export forzato per aggirare il bug di validazione
export default MoviePage as any;
