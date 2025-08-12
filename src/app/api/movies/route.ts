import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=it-IT&page=1`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Errore nel fetch da TMDB');

        const data = await res.json();
        // Puoi trasformare i dati se vuoi qui, oppure mandarli così
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Errore sconosciuto' },
            { status: 500 }
        );
    }
}
