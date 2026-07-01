import type { Classification } from "./types";

export function brl(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function duration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${m}min`;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Recebe yyyy-mm-dd e devolve { weekday, day, month, isToday } */
export function dateParts(iso: string, todayIso = "2026-07-01") {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return {
    weekday: WEEKDAYS[date.getDay()],
    day: d,
    month: MONTHS[m - 1],
    isToday: iso === todayIso,
  };
}

export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAYS[date.getDay()]}, ${d} de ${MONTHS[m - 1]}`;
}

const CLASS_COLORS: Record<Classification, string> = {
  L: "#2e7d32",
  "6": "#e91e63",
  "10": "#0288d1",
  "12": "#f9a825",
  "14": "#ef6c00",
  "16": "#d32f2f",
  "18": "#212121",
  "?": "#5f6672",
};

export function classColor(c: Classification): string {
  return CLASS_COLORS[c];
}

export function classLabel(c: Classification): string {
  return c === "L" ? "L" : c;
}
