import { MOVIES } from "./data";
import { hash } from "./hash";
import type { Classification, Movie, MovieStatus } from "./types";

/**
 * Camada de catálogo. Se houver TMDB_ACCESS_TOKEN no ambiente, busca os filmes
 * reais em cartaz/em breve via API do TMDB. Caso contrário, usa o catálogo
 * estático de exemplo (data.ts). Em qualquer falha de rede, cai no estático.
 */

const TOKEN = process.env.TMDB_ACCESS_TOKEN;
const API = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

export function tmdbEnabled(): boolean {
  return !!TOKEN;
}

const GENRE_MAP: Record<number, string> = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  10402: "Música",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção Científica",
  53: "Suspense",
  10752: "Guerra",
  37: "Faroeste",
};

const PALETTE: [string, string][] = [
  ["#2563eb", "#0f172a"],
  ["#dc2626", "#1e3a8a"],
  ["#7c3aed", "#0f172a"],
  ["#0ea5e9", "#0c4a6e"],
  ["#ea580c", "#3b0764"],
  ["#16a34a", "#0f172a"],
];

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function tmdbGet<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!TOKEN) return null;
  const qs = new URLSearchParams({ language: "pt-BR", region: "BR", ...params });
  try {
    const res = await fetch(`${API}${path}?${qs}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

interface TmdbListItem {
  id: number;
  title: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  genre_ids?: number[];
  vote_average?: number;
  release_date?: string;
  adult?: boolean;
}

function mapListItem(raw: TmdbListItem, status: MovieStatus): Movie {
  const poster = PALETTE[hash(String(raw.id)) % PALETTE.length];
  const genres = (raw.genre_ids ?? []).map((g) => GENRE_MAP[g]).filter(Boolean).slice(0, 3);
  return {
    id: String(raw.id),
    slug: `${raw.id}-${slugify(raw.title)}`,
    title: raw.title,
    originalTitle: raw.original_title !== raw.title ? raw.original_title : undefined,
    synopsis: raw.overview?.trim() || "Sinopse em breve.",
    genres: genres.length ? genres : ["Cinema"],
    durationMin: 0,
    classification: raw.adult ? "18" : "12",
    director: "",
    cast: [],
    releaseDate: raw.release_date ?? "",
    status,
    preSale: status === "coming",
    rating: raw.vote_average ?? 0,
    poster,
    posterUrl: raw.poster_path ? `${IMG}/w780${raw.poster_path}` : undefined,
  };
}

interface TmdbDetail extends TmdbListItem {
  runtime?: number;
  genres?: { id: number; name: string }[];
  credits?: {
    cast?: { name: string }[];
    crew?: { job: string; name: string }[];
  };
}

const VALID_CERT: Classification[] = ["L", "10", "12", "14", "16", "18"];

async function fetchCertification(id: number): Promise<Classification> {
  const data = await tmdbGet<{ results: { iso_3166_1: string; release_dates: { certification: string }[] }[] }>(
    `/movie/${id}/release_dates`,
  );
  const br = data?.results?.find((r) => r.iso_3166_1 === "BR");
  const cert = br?.release_dates?.map((d) => d.certification).find((c) => c);
  const norm = cert === "Livre" || cert === "L" ? "L" : cert;
  return (VALID_CERT.includes(norm as Classification) ? norm : "?") as Classification;
}

async function fetchDetail(id: number): Promise<Movie | null> {
  const raw = await tmdbGet<TmdbDetail>(`/movie/${id}`, { append_to_response: "credits" });
  if (!raw) return null;
  const status: MovieStatus =
    raw.release_date && new Date(raw.release_date) > new Date("2026-06-27") ? "coming" : "showing";
  const base = mapListItem(raw, status);
  const director = raw.credits?.crew?.find((c) => c.job === "Director")?.name ?? "";
  const cast = (raw.credits?.cast ?? []).slice(0, 4).map((c) => c.name);
  const classification = await fetchCertification(id);
  return {
    ...base,
    genres: raw.genres?.map((g) => g.name).slice(0, 3) ?? base.genres,
    durationMin: raw.runtime ?? 0,
    director,
    cast,
    classification,
  };
}

// ---- API pública (assíncrona, agnóstica de origem) ----

export async function getShowingMovies(): Promise<Movie[]> {
  if (TOKEN) {
    const data = await tmdbGet<{ results: TmdbListItem[] }>("/movie/now_playing", { page: "1" });
    if (data?.results?.length) {
      return data.results.slice(0, 18).map((m) => mapListItem(m, "showing"));
    }
  }
  return MOVIES.filter((m) => m.status === "showing");
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  if (TOKEN) {
    const data = await tmdbGet<{ results: TmdbListItem[] }>("/movie/upcoming", { page: "1" });
    if (data?.results?.length) {
      return data.results.slice(0, 12).map((m) => mapListItem(m, "coming"));
    }
  }
  return MOVIES.filter((m) => m.status === "coming");
}

export async function getMovieById(id: string): Promise<Movie | undefined> {
  if (TOKEN && /^\d+$/.test(id)) {
    return (await fetchDetail(Number(id))) ?? undefined;
  }
  return MOVIES.find((m) => m.id === id);
}

export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
  if (TOKEN) {
    const leadingId = slug.split("-")[0];
    if (/^\d+$/.test(leadingId)) return getMovieById(leadingId);
  }
  return MOVIES.find((m) => m.slug === slug);
}
