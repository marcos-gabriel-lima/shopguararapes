"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string; icon: (active: boolean) => React.ReactNode };

const TABS: Tab[] = [
  {
    href: "/",
    label: "Início",
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/filmes",
    label: "Filmes",
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M3 10h18M8 6 6 10M13 6l-2 4M18 6l-2 4" strokeLinecap="round" className={a ? "stroke-background" : ""} />
      </svg>
    ),
  },
  {
    href: "/cinemas",
    label: "Cinemas",
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="11" rx="1.5" />
        <path d="M7 20h10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/noticias",
    label: "Notícias",
    icon: (a) => (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 9h8M8 13h8M8 17h5" strokeLinecap="round" className={a ? "stroke-background" : ""} />
      </svg>
    ),
  },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-surface/95 backdrop-blur">
      <ul className="flex items-stretch justify-around px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2">
        {TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className="mx-auto flex flex-col items-center gap-1"
              >
                <span
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition ${
                    active ? "bg-accent/15 text-accent" : "text-muted"
                  }`}
                >
                  {tab.icon(active)}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
