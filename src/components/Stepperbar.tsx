const STEPS = ["Sessão", "Poltronas", "Pagamento"];

export function Stepperbar({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="no-scrollbar my-4 flex items-center gap-1.5 overflow-x-auto text-[11px] font-medium">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex shrink-0 items-center gap-1.5">
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
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
            {step < STEPS.length && <span className="h-px w-4 bg-border sm:w-6" />}
          </li>
        );
      })}
    </ol>
  );
}
