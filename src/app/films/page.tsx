import VetrinaFilm from '@/app/components/VetrinaFilm&SrieTV';
import { Genre, Item } from '@/app/components/types';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

function mapToItem(data: any, genreName: string): Item | null {
    if (!data.title || !data.poster_path) return null;
    return {
        id: data.id,
        title: data.title,
        img: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        media_type: 'movie',
        overview: data.overview,
        genre: genreName
    };
}

export default async function FilmPage() {
    const genreRes = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=it-IT`, { cache: 'no-store' });
    const genreData = await genreRes.json();
    const genres: Genre[] = genreData.genres;

    const filmsByGenre: Record<number, Item[]> = {};

    for (const genre of genres) {
        const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=it-IT&with_genres=${genre.id}&sort_by=popularity.desc&page=1`);
        const data = await res.json();
        const items = data.results.map((f: any) => mapToItem(f, genre.name)).filter(Boolean);
        filmsByGenre[genre.id] = items;
    }

    return <VetrinaFilm genres={genres} filmsByGenre={filmsByGenre} />;
}
