// types.ts
export type Item = {
    id: number;
    title: string;
    img: string;
    media_type: "movie" | "tv";
    overview?: string;
    genre: string;
};
export type Genre =
    {
        id: number;
        name: string;
    }