import Image from 'next/image';
import Vetrina from './components/Vetrina'; // Client Component
import { Item } from './components/types';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
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
  // Server-side fetch dei dati
  const [resMovies, resTV] = await Promise.all([
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=it-IT&page=1`, { next: { revalidate: 86400 } }),
    fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=it-IT&page=1`, { next: { revalidate: 86400 } })
  ]);

  const [dataMovies, dataTV] = await Promise.all([resMovies.json(), resTV.json()]);

  const popMovies = dataMovies.results.slice(0, 10).map((f: any) => mapToItem(f));
  const popTV = dataTV.results.slice(0, 10).map((tv: any) => mapToItem(tv, true));

  // Passa i dati a Vetrina (client component)
  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="mt-8">
        <Image src="/images/titolo.png" alt="netflix-font" width={300} height={100} />
      </h1>
      <Vetrina popMovies={popMovies} popTV={popTV} />
    </div>
  );
}
