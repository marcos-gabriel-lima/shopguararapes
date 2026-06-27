import { hash } from "./hash";

export const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "J"];
export const SEATS_PER_ROW = 14;
/** Corredor visual depois desta coluna (1-indexed). */
export const AISLE_AFTER = 7;

/** Conjunto de assentos ocupados, estável para uma mesma sessão. */
export function occupiedSeats(sessionId: string): Set<string> {
  const occupied = new Set<string>();
  for (const row of ROWS) {
    for (let n = 1; n <= SEATS_PER_ROW; n++) {
      const id = `${row}${n}`;
      if (hash(`${sessionId}:${id}`) % 100 < 28) {
        occupied.add(id);
      }
    }
  }
  return occupied;
}
