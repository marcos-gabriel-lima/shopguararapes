"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Movie } from "@/lib/types";
import { MoviePoster } from "./MoviePoster";
import { ClassBadge } from "./ClassBadge";
import { duration } from "@/lib/format";

export function HeroCarousel({ movies }: { movies: Movie[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  }

  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x-mandatory overflow-x-auto"
      >
        {movies.map((movie, i) => (
          <Link
            key={movie.id}
            href={`/filme/${movie.slug}`}
            className="snap-center w-full shrink-0 px-4"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <MoviePoster
                movie={movie}
                priority={i === 0}
                sizes="(max-width: 480px) 100vw, 448px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                {!movie.posterUrl && (
                  <h2 className="text-3xl font-black tracking-tight text-white drop-shadow">
                    {movie.title}
                  </h2>
                )}
                <p className="text-sm font-semibold text-white/90 drop-shadow">
                  {movie.durationMin > 0 ? `${duration(movie.durationMin)}  ·  ` : ""}
                  {movie.genres[0]}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80 drop-shadow">
                    Cinema
                  </span>
                  <ClassBadge classification={movie.classification} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {movies.map((m, i) => (
          <span
            key={m.id}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-accent" : "w-1.5 bg-surface-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
