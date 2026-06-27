import { hash } from "./hash";
import type { Session, Format, Audio } from "./types";

const BASE_DATE = "2026-06-27";
const TIMES_A = ["13:15", "13:30", "14:15", "16:40", "19:10", "21:45"];
const TIMES_B = ["14:00", "16:30", "18:50", "21:20"];
const ROOMS = 8;
const SEP = "~";

/** As 5 datas do catálogo (yyyy-mm-dd). */
export function catalogDates(): string[] {
  const [y, m, d] = BASE_DATE.split("-").map(Number);
  return Array.from({ length: 5 }, (_, i) => {
    const dt = new Date(y, m - 1, d + i);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
      dt.getDate(),
    ).padStart(2, "0")}`;
  });
}

function timesFor(movieId: string): string[] {
  return hash(movieId) % 2 === 0 ? TIMES_A : TIMES_B;
}

/** Reconstrói uma sessão a partir de movieId + date + time, de forma determinística. */
function sessionFor(movieId: string, date: string, time: string): Session {
  const h = hash(`${movieId}|${time}`);
  const format: Format = h % 6 === 0 ? "IMAX" : h % 2 === 0 ? "3D" : "2D";
  const audio: Audio = h % 3 === 0 ? "Legendado" : "Dublado";
  const price = format === "IMAX" ? 44 : format === "3D" ? 36 : 30;
  const room = (hash(`${movieId}|${date}`) % ROOMS) + 1;
  return {
    id: `${movieId}${SEP}${date}${SEP}${time.replace(":", "")}`,
    movieId,
    date,
    time,
    room,
    format,
    audio,
    price,
  };
}

/** Todas as sessões de um filme nos próximos 5 dias. */
export function sessionsForMovie(movieId: string): Session[] {
  const out: Session[] = [];
  for (const date of catalogDates()) {
    for (const time of timesFor(movieId)) {
      out.push(sessionFor(movieId, date, time));
    }
  }
  return out;
}

/** Sessões de um filme em uma data específica, ordenadas por horário. */
export function sessionsForMovieOnDate(movieId: string, date: string): Session[] {
  return timesFor(movieId)
    .map((time) => sessionFor(movieId, date, time))
    .sort((a, b) => a.time.localeCompare(b.time));
}

/** Reconstrói uma sessão a partir do seu id. */
export function getSessionById(id: string): Session | undefined {
  const parts = id.split(SEP);
  if (parts.length !== 3) return undefined;
  const [movieId, date, hhmm] = parts;
  if (!/^\d{4}$/.test(hhmm)) return undefined;
  const time = `${hhmm.slice(0, 2)}:${hhmm.slice(2)}`;
  return sessionFor(movieId, date, time);
}
