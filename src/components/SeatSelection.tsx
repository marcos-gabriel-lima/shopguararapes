"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Movie, Session } from "@/lib/types";
import { ROWS, SEATS_PER_ROW, AISLE_AFTER, occupiedSeats } from "@/lib/seats";
import { useBooking } from "@/context/BookingContext";
import { brl, longDate } from "@/lib/format";

const MAX_SEATS = 8;

export function SeatSelection({ movie, session }: { movie: Movie; session: Session }) {
  const router = useRouter();
  const { setOrder } = useBooking();

  const occupied = useMemo(() => occupiedSeats(session.id), [session.id]);
  const [selected, setSelected] = useState<string[]>([]);
  const [meia, setMeia] = useState(0);

  const full = session.price;
  const half = session.price / 2;
  const total = selected.length;
  const inteira = Math.max(0, total - meia);
  const price = inteira * full + meia * half;

  function toggleSeat(id: string) {
    if (occupied.has(id)) return;
    setSelected((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((s) => s !== id);
        setMeia((m) => Math.min(m, next.length));
        return next;
      }
      if (prev.length >= MAX_SEATS) return prev;
      return [...prev, id].sort();
    });
  }

  function proceed() {
    if (total === 0) return;
    setOrder({ movie, session, seats: selected, tickets: { inteira, meia } });
    router.push("/checkout");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Mapa de assentos */}
      <div>
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
          {/* Tela */}
          <div className="mx-auto mb-8 max-w-md">
            <div className="h-2 rounded-t-[50%] bg-gradient-to-b from-accent/70 to-transparent" />
            <p className="mt-1 text-center text-xs uppercase tracking-[0.3em] text-muted">
              Tela
            </p>
          </div>

          <div className="no-scrollbar -mx-2 overflow-x-auto px-2">
            <div className="mx-auto flex w-max flex-col gap-1.5">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center gap-1.5">
                  <span className="w-4 shrink-0 text-center text-[11px] font-semibold text-muted">
                    {row}
                  </span>
                  <div className="flex gap-1 sm:gap-1.5">
                    {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                      const n = i + 1;
                      const id = `${row}${n}`;
                      const isOccupied = occupied.has(id);
                      const isSelected = selected.includes(id);
                      return (
                        <span key={id} className="flex">
                          <button
                            aria-label={`Poltrona ${id}`}
                            disabled={isOccupied}
                            onClick={() => toggleSeat(id)}
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-bold transition sm:h-7 sm:w-7 ${
                              isOccupied
                                ? "cursor-not-allowed bg-surface-2 text-muted/40"
                                : isSelected
                                  ? "bg-accent text-background"
                                  : "bg-surface-2 text-foreground hover:bg-accent/40"
                            }`}
                          >
                            {n}
                          </button>
                          {n === AISLE_AFTER && <span className="w-3 sm:w-4" />}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legenda */}
          <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs text-muted">
            <Legend className="bg-surface-2" label="Disponível" />
            <Legend className="bg-accent" label="Selecionada" />
            <Legend className="bg-surface-2 opacity-40" label="Ocupada" />
          </div>
        </div>
      </div>

      {/* Resumo / ingressos */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-lg font-bold">{movie.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {longDate(session.date)} · {session.time} · Sala {session.room}
          </p>
          <p className="text-sm text-muted">
            {session.format} · {session.audio}
          </p>

          <div className="my-4 h-px bg-border" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Poltronas</span>
            <span className="font-semibold">
              {selected.length > 0 ? selected.join(", ") : "—"}
            </span>
          </div>

          {total > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">Meia-entrada</p>
                  <p className="text-xs text-muted">{brl(half)} cada</p>
                </div>
                <div className="flex items-center gap-2">
                  <Stepper
                    onClick={() => setMeia((m) => Math.max(0, m - 1))}
                    disabled={meia <= 0}
                    label="−"
                  />
                  <span className="w-5 text-center font-bold">{meia}</span>
                  <Stepper
                    onClick={() => setMeia((m) => Math.min(total, m + 1))}
                    disabled={meia >= total}
                    label="+"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">Inteira</p>
                  <p className="text-xs text-muted">{brl(full)} cada</p>
                </div>
                <span className="font-bold">{inteira}</span>
              </div>
            </div>
          )}

          <div className="my-4 h-px bg-border" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Total</span>
            <span className="text-xl font-extrabold text-accent">{brl(price)}</span>
          </div>

          <button
            onClick={proceed}
            disabled={total === 0}
            className="mt-4 w-full rounded-full bg-accent py-3 text-sm font-bold text-background transition hover:bg-accent-2 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted"
          >
            {total === 0 ? "Selecione uma poltrona" : `Continuar · ${brl(price)}`}
          </button>
          <p className="mt-2 text-center text-[11px] text-muted">
            Máx. {MAX_SEATS} poltronas por compra
          </p>
        </div>
      </aside>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-4 w-4 rounded ${className}`} />
      {label}
    </span>
  );
}

function Stepper({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="grid h-7 w-7 place-items-center rounded-full border border-border bg-surface-2 text-base font-bold transition hover:border-accent disabled:opacity-30"
    >
      {label}
    </button>
  );
}
