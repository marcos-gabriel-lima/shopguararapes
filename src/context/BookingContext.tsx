"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { TicketSelection } from "@/lib/types";

interface Booking {
  sessionId: string | null;
  seats: string[];
  tickets: TicketSelection;
}

interface BookingContextValue extends Booking {
  setSession: (sessionId: string) => void;
  setSeats: (seats: string[]) => void;
  setTickets: (tickets: TicketSelection) => void;
  reset: () => void;
}

const EMPTY: Booking = {
  sessionId: null,
  seats: [],
  tickets: { inteira: 0, meia: 0 },
};

const STORAGE_KEY = "cine-guararapes-booking";

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Booking>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setBooking(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
    } catch {
      /* ignore */
    }
  }, [booking, hydrated]);

  const value: BookingContextValue = {
    ...booking,
    setSession: (sessionId) =>
      setBooking({ sessionId, seats: [], tickets: { inteira: 0, meia: 0 } }),
    setSeats: (seats) => setBooking((b) => ({ ...b, seats })),
    setTickets: (tickets) => setBooking((b) => ({ ...b, tickets })),
    reset: () => setBooking(EMPTY),
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking deve ser usado dentro de BookingProvider");
  return ctx;
}
