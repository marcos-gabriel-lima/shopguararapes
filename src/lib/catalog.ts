import { MOVIES } from "./data";
import type { Movie } from "./types";

/**
 * Camada de catálogo (estática). Lê os filmes do catálogo de exemplo (data.ts).
 * As funções são assíncronas para manter uma API estável caso um dia você
 * queira plugar uma fonte de dados externa.
 */

export async function getShowingMovies(): Promise<Movie[]> {
  return MOVIES.filter((m) => m.status === "showing");
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  return MOVIES.filter((m) => m.status === "coming");
}

export async function getMovieById(id: string): Promise<Movie | undefined> {
  return MOVIES.find((m) => m.id === id);
}

export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
  return MOVIES.find((m) => m.slug === slug);
}
