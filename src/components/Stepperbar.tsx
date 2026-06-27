const STEPS = ["Sessão", "Poltronas", "Pagamento"];

export function Stepperbar({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="my-4 flex items-center gap-2 text-xs font-medium">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${
                active
                  ? "bg-accent text-background"
                  : done
                    ? "bg-accent/30 text-accent-2"
                    : "bg-surface-2 text-muted"
              }`}
            >
              {done ? "✓" : step}
            </span>
            <span className={active ? "text-foreground" : "text-muted"}>{label}</span>
            {step < STEPS.length && <span className="mx-1 h-px w-6 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
