"use client";

import { useState } from "react";
import { MOVIES, GENRES } from "@/lib/data";
import { PosterCard } from "@/components/PosterCard";
import { CityPill, MenuButton } from "@/components/TopChrome";

type TabKey = "showing" | "coming";

export default function FilmesPage() {
  const [tab, setTab] = useState<TabKey>("showing");
  const [genre, setGenre] = useState<string | null>(null);

  const list = MOVIES.filter((m) => {
    const matchTab =
      tab === "showing" ? m.status === "showing" : m.status === "coming";
    const matchGenre =
      !genre ||
      genre === "Estreias" ||
      m.genres.includes(genre);
    return matchTab && matchGenre;
  });

  return (
    <div>
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
          <CityPill />
          <span className="ml-1 truncate text-lg font-bold">Filmes</span>
          <div className="ml-auto">
            <MenuButton />
          </div>
        </div>

        {/* Abas */}
        <div className="flex px-4">
          {(
            [
              ["showing", "Em cartaz"],
              ["coming", "Em breve"],
            ] as [TabKey, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 border-b-2 pb-3 pt-1 text-center text-base font-bold transition ${
                tab === key
                  ? "border-info text-foreground"
                  : "border-transparent text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros de gênero */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-4">
        {GENRES.map((g) => {
          const active = genre === g;
          return (
            <button
              key={g}
              onClick={() => setGenre(active ? null : g)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-accent bg-accent text-background"
                  : "border-info/40 text-info"
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Grade */}
      <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-6 px-4">
        {list.map((m) => (
          <PosterCard key={m.id} movie={m} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted">
          Nenhum filme encontrado para esse filtro.
        </p>
      )}
    </div>
  );
}
