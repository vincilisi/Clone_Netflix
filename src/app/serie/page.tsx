import VetrinaSerieTV from '@/app/components/VetrinaFilm&SrieTV';
import { Genre, Item } from '@/app/components/types';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

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

export default async function SerieTVPage() {
    const genreRes = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=it-IT`, { cache: 'no-store' });
    const genreData = await genreRes.json();
    const genres: Genre[] = genreData.genres;

    const seriesByGenre: Record<number, Item[]> = {};

    for (const genre of genres) {
        const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=it-IT&with_genres=${genre.id}&sort_by=popularity.desc&page=1`);
        const data = await res.json();
        const items = data.results.map((s: any) => mapToItem(s, genre.name)).filter(Boolean);
        seriesByGenre[genre.id] = items;
    }

    return <VetrinaSerieTV genres={genres} itemsByGenre={seriesByGenre} />;
}
