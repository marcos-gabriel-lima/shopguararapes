import type { Movie, Session, TicketSelection } from "@/lib/types";
import { MoviePoster } from "./MoviePoster";
import { brl } from "@/lib/format";

export function OrderSummary({
  movie,
  session,
  seats,
  tickets,
  total,
}: {
  movie: Movie;
  session: Session;
  seats: string[];
  tickets: TicketSelection;
  total: number;
}) {
  const full = session.price;
  const half = session.price / 2;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex gap-3">
        <div className="w-16 shrink-0">
          <MoviePoster movie={movie} />
        </div>
        <div>
          <h3 className="font-bold leading-tight">{movie.title}</h3>
          <p className="text-xs text-muted">
            {session.format} · {session.audio} · Sala {session.room}
          </p>
          <p className="mt-1 text-xs text-muted">
            Poltronas: <span className="font-semibold text-foreground">{seats.join(", ")}</span>
          </p>
        </div>
      </div>

      <div className="my-4 h-px bg-border" />

      <dl className="space-y-1.5 text-sm">
        {tickets.inteira > 0 && (
          <Row label={`Inteira × ${tickets.inteira}`} value={brl(tickets.inteira * full)} />
        )}
        {tickets.meia > 0 && (
          <Row label={`Meia × ${tickets.meia}`} value={brl(tickets.meia * half)} />
        )}
      </dl>

      <div className="my-4 h-px bg-border" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">Total</span>
        <span className="text-xl font-extrabold text-accent">{brl(total)}</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
