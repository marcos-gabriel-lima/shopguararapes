import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionById } from "@/lib/showtimes";
import { getMovieById } from "@/lib/catalog";
import { SeatSelection } from "@/components/SeatSelection";
import { Stepperbar } from "@/components/Stepperbar";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = getSessionById(id);
  if (!session) notFound();
  const movie = await getMovieById(session.movieId);
  if (!movie) notFound();

  return (
    <div className="px-4 py-6">
      <Link
        href={`/filme/${movie.slug}`}
        className="text-sm text-muted transition hover:text-foreground"
      >
        ← Trocar sessão
      </Link>

      <Stepperbar current={2} />

      <h1 className="mb-6 mt-2 text-xl font-extrabold">Escolha suas poltronas</h1>
      <SeatSelection movie={movie} session={session} />
    </div>
  );
}
