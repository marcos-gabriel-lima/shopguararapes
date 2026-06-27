import Link from "next/link";
import { CINEMA } from "@/lib/data";
import { CinemaSessions } from "@/components/CinemaSessions";

export default function CinemasPage() {
  return (
    <div>
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur">
        <Link
          href="/"
          aria-label="Voltar"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="truncate text-lg font-bold">{CINEMA.name}</h1>
        <span className="ml-auto rounded-full border border-border bg-surface px-3 py-2 text-sm">
          ♡
        </span>
      </div>

      {/* Abas Sessões / Detalhes */}
      <div className="flex px-4">
        <span className="flex-1 border-b-2 border-info pb-3 text-center text-base font-bold">
          Sessões
        </span>
        <span className="flex-1 border-b-2 border-transparent pb-3 text-center text-base font-bold text-muted">
          Detalhes
        </span>
      </div>

      <CinemaSessions />
    </div>
  );
}
