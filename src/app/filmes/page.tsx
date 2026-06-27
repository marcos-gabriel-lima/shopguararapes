import { getShowingMovies, getUpcomingMovies } from "@/lib/catalog";
import { FilmesClient } from "@/components/FilmesClient";

export default async function FilmesPage() {
  const [showing, coming] = await Promise.all([getShowingMovies(), getUpcomingMovies()]);
  return <FilmesClient showing={showing} coming={coming} />;
}
