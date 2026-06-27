import Link from "next/link";
import type { Movie } from "@/lib/types";
import { MoviePoster } from "./MoviePoster";
import { ClassBadge } from "./ClassBadge";

/** Card vertical de filme usado nas grades e carrosséis horizontais. */
export function PosterCard({ movie, className = "" }: { movie: Movie; className?: string }) {
  return (
    <Link href={`/filme/${movie.slug}`} className={`group block ${className}`}>
      <div className="relative overflow-hidden rounded-xl">
        <MoviePoster movie={movie} />
        <div className="absolute left-1.5 top-1.5">
          <ClassBadge classification={movie.classification} size="sm" />
        </div>
        {movie.preSale && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-violet-600 to-blue-600 py-1.5 text-center text-xs font-bold text-white">
            PRÉ-VENDA
          </div>
        )}
      </div>
      {movie.releaseLabel ? (
        <div className="mt-1.5 rounded-md bg-surface-2 py-1 text-center text-xs font-medium text-muted">
          {movie.releaseLabel}
        </div>
      ) : null}
      <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-tight">{movie.title}</h3>
    </Link>
  );
}
