import { CINEMA } from "@/lib/data";

export function CityPill() {
  return (
    <button className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="currentColor">
        <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
      </svg>
      {CINEMA.city}
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function MenuButton() {
  return (
    <button
      aria-label="Menu"
      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
      </svg>
    </button>
  );
}

export function Avatar({ initial = "M" }: { initial?: string }) {
  return (
    <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-base font-black text-background">
      {initial}
    </span>
  );
}
