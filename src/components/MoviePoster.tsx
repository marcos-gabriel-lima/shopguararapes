import Image from "next/image";
import type { Movie } from "@/lib/types";

/** Pôster do filme: usa a imagem real (TMDB) e cai no gradiente como fallback. */
export function MoviePoster({
  movie,
  className = "",
  sizes = "(max-width: 480px) 50vw, 240px",
  priority = false,
}: {
  movie: Movie;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (movie.posterUrl) {
    return (
      <div className={`relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-surface-2 ${className}`}>
        <Image
          src={movie.posterUrl}
          alt={`Pôster de ${movie.title}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  // Fallback estilizado (sem imagem)
  const [c1, c2] = movie.poster;
  const word = movie.title.split(/[:\s]/).filter((w) => w.length > 2)[0] ?? movie.title;
  return (
    <div
      className={`relative flex aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-xl ${className}`}
      style={{ background: `linear-gradient(150deg, ${c1}, ${c2})` }}
    >
      <span className="px-2 text-center text-lg font-black uppercase leading-none tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,.6)]">
        {word}
      </span>
      <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
        {movie.genres[0]}
      </span>
    </div>
  );
}
