import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchTrendingMovies() {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch trending movies');
    const data = await res.json();
    return data.results;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const movies = await fetchTrendingMovies();

        for (const movie of movies) {
            await prisma.movie.upsert({
                where: { tmdbId: movie.id },
                update: {
                    title: movie.title,
                    overview: movie.overview,
                    releaseDate: movie.release_date ? new Date(movie.release_date) : null,
                    posterPath: movie.poster_path,
                    type: 'MOVIE',
                },
                create: {
                    tmdbId: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    releaseDate: movie.release_date ? new Date(movie.release_date) : null,
                    posterPath: movie.poster_path,
                    type: 'MOVIE',
                },
            });
        }

        res.status(200).json({ message: 'Trending movies updated' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    } finally {
        await prisma.$disconnect();
    }
}
