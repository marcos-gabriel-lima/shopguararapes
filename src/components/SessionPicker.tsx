"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@/lib/types";
import { dateParts } from "@/lib/format";

export function SessionPicker({ sessions }: { sessions: Session[] }) {
  const router = useRouter();

  const dates = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.date))).sort(),
    [sessions],
  );
  const [activeDate, setActiveDate] = useState(dates[0]);

  const daySessions = sessions
    .filter((s) => s.date === activeDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  if (dates.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-surface p-6 text-muted">
        Nenhuma sessão disponível no momento.
      </p>
    );
  }

  return (
    <div>
      {/* Seletor de datas */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
        {dates.map((d) => {
          const p = dateParts(d);
          const active = d === activeDate;
          return (
            <button
              key={d}
              onClick={() => setActiveDate(d)}
              className={`flex min-w-[64px] flex-col items-center rounded-xl border px-3 py-2 transition ${
                active
                  ? "border-accent bg-accent text-background"
                  : "border-border bg-surface text-foreground hover:border-accent/60"
              }`}
            >
              <span className="text-[11px] uppercase opacity-80">
                {p.isToday ? "Hoje" : p.weekday}
              </span>
              <span className="text-lg font-bold leading-none">{p.day}</span>
              <span className="text-[11px] opacity-80">{p.month}</span>
            </button>
          );
        })}
      </div>

      {/* Horários */}
      <div className="mt-5 space-y-4">
        {daySessions.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-accent">
                {s.format} · {s.audio}
              </span>
              <span className="text-xs text-muted">Sala {s.room}</span>
            </div>
            <button
              onClick={() => router.push(`/sessao/${s.id}`)}
              className="ml-auto rounded-lg border border-info/50 px-5 py-2.5 text-sm font-bold text-info transition hover:bg-info hover:text-white"
            >
              {s.time}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
