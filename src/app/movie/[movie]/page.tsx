import VetrinaFilm from '@/app/components/VetrinaFilm';
import VetrinaSerieTV from '@/app/components/VetrinaSerie';
import { notFound } from 'next/navigation';
import { Genre, Item } from '@/app/components/types';

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

async function fetchByGenre(endpoint: string, genres: Genre[], isTV = false) {
    const result: Record<number, Item[]> = {};
    for (const genre of genres) {
        const res = await fetch(
            `${BASE_URL}/discover/${endpoint}?api_key=${API_KEY}&language=it-IT&with_genres=${genre.id}&sort_by=popularity.desc&page=1`
        );
        const data = await res.json();
        const items =
            data.results?.map((d: any) => mapToItem(d, genre.name, isTV)).filter(Boolean) || [];
        result[genre.id] = items;
    }
    return result;
}

const MoviePage = async ({ params }: { params: { movie: string } }) => {
    // ✅ await params prima di usare le proprietà
    const awaitedParams = await params;
    const type = awaitedParams.movie;

    if (!API_KEY) {
        throw new Error('NEXT_PUBLIC_TMDB_API_KEY non è definita nelle variabili d\'ambiente');
    }

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
            const filmsByGenre = await fetchByGenre('movie', genres);
            return <VetrinaFilm genres={genres} itemsByGenre={filmsByGenre} />;
        }

        if (type === 'serie-tv') {
            const genreRes = await fetch(
                `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=it-IT`,
                { cache: 'no-store' }
            );
            const genreData = await genreRes.json();
            const genres: Genre[] = genreData.genres || [];
            const seriesByGenre = await fetchByGenre('tv', genres, true);
            return <VetrinaSerieTV genres={genres} seriesByGenre={seriesByGenre} />;
        }
    } catch (error) {
        console.error('Errore nel rendering della pagina:', error);
        return notFound();
    }

    return notFound();
};

export default MoviePage;
