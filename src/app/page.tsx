import Image from 'next/image';
import Vetrina from "@/app/components/Vetrina";
import { Item } from "@/app/components/types";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

function mapToItem(data: any, isTV = false): Item {
  return {
    id: data.id,
    title: isTV ? data.name : data.title,
    img: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '/placeholder.png',
    media_type: isTV ? 'tv' : 'movie',
    overview: data.overview || 'Trama non disponibile',
    genre: ''
  };
}

export default async function Home() {
  const [resMovies, resTV] = await Promise.all([
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=it-IT&page=1`, { cache: 'no-store' }),
    fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=it-IT&page=1`, { cache: 'no-store' }),
  ]);

  const [dataMovies, dataTV] = await Promise.all([resMovies.json(), resTV.json()]);

  if (!dataMovies.results || !Array.isArray(dataMovies.results)) {
    console.error('Errore nella risposta dei film:', dataMovies);
    throw new Error('Dati film non validi');
  }

  if (!dataTV.results || !Array.isArray(dataTV.results)) {
    console.error('Errore nella risposta delle serie TV:', dataTV);
    throw new Error('Dati serie TV non validi');
  }

  const popMovies = dataMovies.results.slice(0, 10).map((f: any) => mapToItem(f));
  const popTV = dataTV.results.slice(0, 10).map((tv: any) => mapToItem(tv, true));

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="flex justify-center items-center mt-8">
        <Image
          src="/images/titolo.png"
          alt="netflix-font"
          width={300}
          height={100}
        />
      </h1>
      <Vetrina popMovies={popMovies} popTV={popTV} />
    </div>
  );
}
