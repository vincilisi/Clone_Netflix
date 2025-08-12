import Image from 'next/image';

interface Params {
    params: {
        media_type: 'movie' | 'tv';
        id: string;
    };
}

interface Detail {
    id: number;
    title?: string;
    name?: string;
    genres: { id: number; name: string }[];
    release_date?: string;
    first_air_date?: string;
    overview: string;
    poster_path: string | null;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function getDetails(media_type: string, id: string): Promise<Detail> {
    const res = await fetch(
        `${BASE_URL}/${media_type}/${id}?api_key=${API_KEY}&language=it-IT`,
        { next: { revalidate: 60 * 60 } } // cache per 1h
    );
    if (!res.ok) throw new Error('Dettagli non trovati');
    return res.json();
}

export default async function DetailPage({ params }: Params) {
    const { media_type, id } = params;

    if (!API_KEY) {
        return <div className="text-red-500">API key TMDB mancante</div>;
    }

    let data: Detail;
    try {
        data = await getDetails(media_type, id);
    } catch (error) {
        return <div className="text-red-500">Errore nel caricamento dei dettagli</div>;
    }

    const title = media_type === 'tv' ? data.name || 'Titolo non disponibile' : data.title || 'Titolo non disponibile';
    const year = (data.release_date || data.first_air_date || '').slice(0, 4);
    const genres = data.genres.map((g) => g.name).join(', ') || 'N/A';
    const imgUrl = data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : '/placeholder.png';

    return (
        <main className="max-w-4xl mx-auto p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">{title} {year && `(${year})`}</h1>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-full h-[320px]">
                    <Image
                        src={imgUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 256px"
                        style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                        priority={true}
                    />
                </div>
                <div>
                    <p className="mb-2"><strong>Genere:</strong> {genres}</p>
                    <p><strong>Trama:</strong> {data.overview || 'Nessuna trama disponibile.'}</p>
                </div>
            </div>
        </main>
    );
}