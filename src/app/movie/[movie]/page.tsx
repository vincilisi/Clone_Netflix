// src/app/movie/[movie]/page.tsx
import Vetrina from '@/app/components/VetrinaFilm&SrieTV';
import { notFound } from 'next/navigation';
import { Genre, Item } from '@/app/components/types';

export const dynamic = 'force-dynamic'; // forza SSR dinamico

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

interface MoviePageProps {
    params: Promise<{ movie: string }>;
}

const MoviePage = async ({ params }: MoviePageProps) => {
    const resolvedParams = await params; // ✅ await obbligatorio
    const type = resolvedParams?.movie;

    if (!type || (type !== 'film' && type !== 'serie-tv')) return notFound();
    if (!API_KEY) throw new Error('NEXT_PUBLIC_TMDB_API_KEY non definita');

    const isTV = type === 'serie-tv';

    try {
        const genreRes = await fetch(
            `${BASE_URL}/genre/${isTV ? 'tv' : 'movie'}/list?api_key=${API_KEY}&language=it-IT`,
            { cache: 'no-store' }
        );
        const genreData = await genreRes.json();
        const genres: Genre[] = genreData.genres || [];

        const itemsByGenre: Record<number, Item[]> = {};
        for (const genre of genres) {
            const res = await fetch(
                `${BASE_URL}/discover/${isTV ? 'tv' : 'movie'}?api_key=${API_KEY}&language=it-IT&with_genres=${genre.id}&sort_by=popularity.desc&page=1`,
                { cache: 'no-store' }
            );
            const data = await res.json();
            const items = data.results?.map((d: any) => mapToItem(d, genre.name, isTV)).filter(Boolean) || [];
            itemsByGenre[genre.id] = items;
        }

        return <Vetrina genres={genres} itemsByGenre={itemsByGenre} isTV={isTV} />;
    } catch (err) {
        console.error('Errore nel rendering della pagina:', err);
        return notFound();
    }
};

export default MoviePage;
