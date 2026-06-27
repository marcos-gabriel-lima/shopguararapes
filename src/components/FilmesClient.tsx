"use client";

import { useMemo, useState } from "react";
import type { Movie } from "@/lib/types";
import { GENRES } from "@/lib/data";
import { PosterCard } from "@/components/PosterCard";
import { CityPill, MenuButton } from "@/components/TopChrome";

type TabKey = "showing" | "coming";

export function FilmesClient({ showing, coming }: { showing: Movie[]; coming: Movie[] }) {
  const [tab, setTab] = useState<TabKey>("showing");
  const [genre, setGenre] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const base = tab === "showing" ? showing : coming;
    const q = query.trim().toLowerCase();
    return base.filter((m) => {
      const matchGenre = !genre || genre === "Estreias" || m.genres.includes(genre);
      const matchQuery =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.originalTitle?.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q));
      return matchGenre && matchQuery;
    });
  }, [tab, genre, query, showing, coming]);

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

        {/* Busca */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar filme ou gênero…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Limpar" className="text-muted">
                ✕
              </button>
            )}
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
                tab === key ? "border-info text-foreground" : "border-transparent text-muted"
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
                active ? "border-accent bg-accent text-background" : "border-info/40 text-info"
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
          {query ? `Nada encontrado para “${query}”.` : "Nenhum filme encontrado para esse filtro."}
        </p>
      )}
    </div>
  );
}
