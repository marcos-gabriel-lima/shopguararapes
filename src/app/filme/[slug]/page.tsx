import Link from "next/link";
import { notFound } from "next/navigation";
import { MOVIES, getMovieBySlug, getSessionsForMovie } from "@/lib/data";
import { MoviePoster } from "@/components/MoviePoster";
import { ClassBadge } from "@/components/ClassBadge";
import { SessionPicker } from "@/components/SessionPicker";
import { duration } from "@/lib/format";

export function generateStaticParams() {
  return MOVIES.map((m) => ({ slug: m.slug }));
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) notFound();

  const sessions = getSessionsForMovie(movie.id);
  const isShowing = movie.status === "showing";

  return (
    <div>
      {/* Banner topo */}
      <div className="relative">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${movie.poster[0]}, ${movie.poster[1]})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative px-4 pb-5 pt-3">
          <Link
            href="/filmes"
            aria-label="Voltar"
            className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <div className="mt-6 flex gap-4">
            <div className="w-28 shrink-0">
              <MoviePoster movie={movie} className="shadow-xl shadow-black/40" />
            </div>
            <div className="pt-2">
              <h1 className="text-2xl font-black leading-tight text-white">{movie.title}</h1>
              <p className="mt-1 text-sm text-white/80">{movie.genres.join(", ")}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
                <ClassBadge classification={movie.classification} />
                {movie.durationMin > 0 && <span>{duration(movie.durationMin)}</span>}
                {isShowing && movie.rating > 0 && (
                  <span className="font-bold text-accent">★ {movie.rating.toFixed(1)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sinopse */}
      <section className="px-4 pt-2">
        <p className="text-sm leading-relaxed text-foreground/90">{movie.synopsis}</p>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="text-muted">Direção:</dt>
            <dd>{movie.director}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted">Elenco:</dt>
            <dd className="line-clamp-1">{movie.cast.join(", ")}</dd>
          </div>
        </dl>
      </section>

      {/* Sessões */}
      <section className="mt-6 px-4">
        <h2 className="text-lg font-extrabold">
          {isShowing ? "Sessões" : movie.releaseLabel ?? "Em breve"}
        </h2>
        <p className="mb-4 text-sm text-muted">
          Cinépolis Guararapes · Shopping Guararapes
        </p>
        {isShowing ? (
          <SessionPicker sessions={sessions} />
        ) : (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="text-4xl">🍿</p>
            <p className="mt-2 font-semibold">
              {movie.preSale ? "Ingressos em pré-venda em breve" : "Estreia em breve"}
            </p>
            <p className="text-sm text-muted">
              {movie.releaseLabel ?? movie.releaseDate.split("-").reverse().join("/")}
            </p>
            <Link
              href="/filmes"
              className="mt-4 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-background"
            >
              Ver filmes em cartaz
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
