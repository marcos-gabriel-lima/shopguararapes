"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MOVIES, SESSIONS } from "@/lib/data";
import type { Session } from "@/lib/types";
import { dateParts, duration } from "@/lib/format";
import { ClassBadge } from "./ClassBadge";
import { MoviePoster } from "./MoviePoster";
import { useBooking } from "@/context/BookingContext";

export function CinemaSessions() {
  const router = useRouter();
  const { setSession } = useBooking();

  const dates = useMemo(
    () => Array.from(new Set(SESSIONS.map((s) => s.date))).sort(),
    [],
  );
  const [activeDate, setActiveDate] = useState(dates[0]);

  function choose(session: Session) {
    setSession(session.id);
    router.push(`/sessao/${session.id}`);
  }

  // filmes com sessões no dia
  const moviesToday = MOVIES.filter((m) =>
    SESSIONS.some((s) => s.movieId === m.id && s.date === activeDate),
  );

  return (
    <div>
      {/* Datas */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-surface px-4 py-3">
        {dates.map((d) => {
          const p = dateParts(d);
          const active = d === activeDate;
          return (
            <button
              key={d}
              onClick={() => setActiveDate(d)}
              className={`flex min-w-[70px] flex-col items-center rounded-xl px-3 py-2 transition ${
                active ? "bg-surface-2 text-foreground" : "text-muted"
              }`}
            >
              <span className="text-base font-bold leading-tight">
                {p.isToday ? "Hoje" : p.weekday}
              </span>
              <span className="text-sm">
                {String(p.day).padStart(2, "0")}/{String(p.month)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filtrar */}
      <div className="flex items-center gap-2 px-4 py-4 text-info">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
        </svg>
        <span className="font-semibold">Filtrar</span>
      </div>

      {/* Sessões por filme */}
      <div className="space-y-4 px-4 pb-4">
        {moviesToday.map((movie) => {
          const sessions = SESSIONS.filter(
            (s) => s.movieId === movie.id && s.date === activeDate,
          ).sort((a, b) => a.time.localeCompare(b.time));
          const formats = Array.from(new Set(sessions.map((s) => s.format)));
          const audios = Array.from(new Set(sessions.map((s) => s.audio)));

          return (
            <div key={movie.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex gap-3">
                <div className="relative w-20 shrink-0">
                  <MoviePoster movie={movie} />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white">
                      ▶
                    </span>
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold leading-tight">{movie.title}</h3>
                  <p className="mt-0.5 text-sm text-muted">{movie.genres.join(", ")}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                    <ClassBadge classification={movie.classification} size="sm" />
                    <span>{duration(movie.durationMin)}</span>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="my-4 h-px bg-border" />

              {/* chips formato/áudio */}
              <div className="flex flex-wrap gap-2">
                {[...formats.map((f) => (f === "2D" ? "NORMAL" : f)), ...audios].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md bg-info px-3 py-1.5 text-xs font-bold uppercase text-white"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* horários */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => choose(s)}
                    className="rounded-lg border border-info/50 py-2.5 text-base font-bold text-info transition hover:bg-info hover:text-white"
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
