// src/scripts/checkMovies.ts
import 'dotenv/config';
import fetch from 'node-fetch';

const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
    console.error("❌ Errore: manca la variabile TMDB_API_KEY in .env");
    process.exit(1);
}

async function getMovies() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=it-IT&page=1`);
        if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);

        const data = await res.json();
        console.log("🎬 Film trovati:");
        data.results.forEach((movie: any, i: number) => {
            console.log(`${i + 1}. ${movie.title} (${movie.release_date})`);
        });
    } catch (err) {
        console.error("❌ Errore durante la chiamata a TMDB:", err);
    }
}

getMovies();
