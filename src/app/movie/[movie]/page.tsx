import VetrinaFilm from '@/app/components/VetrinaFilm';
import VetrinaSerieTV from '@/app/components/VetrinaSerie';
import { notFound } from 'next/navigation';

interface Props {
    params: {
        movie: string;
    };
}

export default async function MoviePage({
    params,
}: {
    params: { movie: string };
}) {
    const type = params.movie;

    if (type === 'film') return <VetrinaFilm />;
    if (type === 'serie-tv') return <VetrinaSerieTV />;
    return notFound();
}

