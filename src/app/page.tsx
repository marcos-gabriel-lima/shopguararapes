import Link from "next/link";
import { MOVIES } from "@/lib/data";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PosterCard } from "@/components/PosterCard";
import { CityPill, MenuButton } from "@/components/TopChrome";

export default function HomePage() {
  const showing = MOVIES.filter((m) => m.status === "showing");
  const featured = showing.slice(0, 3);
  const emAlta = [...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <div>
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur">
        <CityPill />
        <div className="ml-auto">
          <MenuButton />
        </div>
      </div>

      {/* Carrossel destaque */}
      <section className="pt-1">
        <HeroCarousel movies={featured} />
      </section>

      {/* Banner */}
      <div className="mx-4 mt-5 flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-6 text-center text-xs text-muted">
        Espaço publicitário
      </div>

      {/* Em Alta */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between px-4">
          <h2 className="text-xl font-extrabold">Em Alta</h2>
          <Link href="/filmes" className="text-xs font-semibold text-accent">
            Ver tudo
          </Link>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
          {emAlta.map((m) => (
            <PosterCard key={m.id} movie={m} className="w-32 shrink-0" />
          ))}
        </div>
      </section>

      {/* Estreias */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between px-4">
          <h2 className="text-xl font-extrabold">Em breve</h2>
          <Link href="/filmes" className="text-xs font-semibold text-accent">
            Ver tudo
          </Link>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
          {MOVIES.filter((m) => m.status === "coming").map((m) => (
            <PosterCard key={m.id} movie={m} className="w-32 shrink-0" />
          ))}
        </div>
      </section>
    </div>
  );
}
