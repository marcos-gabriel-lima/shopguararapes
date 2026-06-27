export type MovieStatus = "showing" | "coming";

export type Classification = "L" | "6" | "10" | "12" | "14" | "16" | "18" | "?";

export interface Movie {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  synopsis: string;
  genres: string[];
  durationMin: number;
  classification: Classification;
  director: string;
  cast: string[];
  releaseDate: string; // ISO date
  releaseLabel?: string; // ex.: "Estreia 29/07"
  status: MovieStatus;
  preSale?: boolean;
  rating: number; // 0-10
  /** Dois hex usados como fallback do pôster (gradiente). */
  poster: [string, string];
  /** URL do pôster real (TMDB). */
  posterUrl?: string;
}

export type Format = "2D" | "3D" | "IMAX";
export type Audio = "Dublado" | "Legendado";

export interface Session {
  id: string;
  movieId: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  room: number;
  format: Format;
  audio: Audio;
  price: number;
}

export type TicketType = "inteira" | "meia";

export interface TicketSelection {
  inteira: number;
  meia: number;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string; // dd/mm/yyyy HH:mm
  author: string;
  category: string;
  image: [string, string];
  imageUrl?: string;
}
