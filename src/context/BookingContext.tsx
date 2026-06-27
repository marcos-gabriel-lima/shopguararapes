"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { OrderSnapshot } from "@/lib/types";

interface BookingContextValue {
  order: OrderSnapshot | null;
  setOrder: (order: OrderSnapshot) => void;
  reset: () => void;
}

const STORAGE_KEY = "cine-guararapes-order";

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [order, setOrderState] = useState<OrderSnapshot | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setOrderState(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (order) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [order, hydrated]);

  return (
    <BookingContext.Provider
      value={{ order, setOrder: setOrderState, reset: () => setOrderState(null) }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking deve ser usado dentro de BookingProvider");
  return ctx;
}
