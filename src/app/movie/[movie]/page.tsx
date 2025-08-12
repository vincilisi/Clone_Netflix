import VetrinaFilm from '@/app/components/VetrinaFilm';
import VetrinaSerieTV from '@/app/components/VetrinaSerie';
import { notFound } from 'next/navigation';

// Tipi ufficiali di Next.js 15
interface MoviePageProps {
    params: Promise<{
        movie: string;
    }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
    const { movie: type } = await params;

    if (type === 'film') return <VetrinaFilm />;
    if (type === 'serie-tv') return <VetrinaSerieTV />;
    return notFound();
}
