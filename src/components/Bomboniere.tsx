"use client";

import { SNACKS } from "@/lib/data";
import { brl } from "@/lib/format";

export function Bomboniere({
  quantities,
  onChange,
}: {
  quantities: Record<string, number>;
  onChange: (id: string, qty: number) => void;
}) {
  return (
    <fieldset className="rounded-2xl border border-border bg-surface p-5">
      <legend className="px-2 text-sm font-bold">🍿 Bomboniere</legend>
      <p className="mb-3 px-1 text-xs text-muted">
        Adicione combos e retire na bilheteria (opcional).
      </p>
      <ul className="space-y-3">
        {SNACKS.map((s) => {
          const qty = quantities[s.id] ?? 0;
          return (
            <li key={s.id} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-xl">
                {s.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{s.name}</p>
                <p className="text-xs text-muted">{s.description}</p>
                <p className="text-xs font-bold text-accent">{brl(s.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Remover ${s.name}`}
                  onClick={() => onChange(s.id, Math.max(0, qty - 1))}
                  disabled={qty <= 0}
                  className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface-2 text-lg font-bold transition hover:border-accent disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-5 text-center font-bold">{qty}</span>
                <button
                  type="button"
                  aria-label={`Adicionar ${s.name}`}
                  onClick={() => onChange(s.id, Math.min(20, qty + 1))}
                  className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface-2 text-lg font-bold transition hover:border-accent"
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
