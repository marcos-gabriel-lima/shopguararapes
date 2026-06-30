"use client";

import { useState } from "react";
import Image from "next/image";
import type { Movie, Session, TicketSelection } from "@/lib/types";
import { CINEMA } from "@/lib/data";
import { ClassBadge } from "./ClassBadge";
import { brl } from "@/lib/format";

export interface TicketData {
  movie: Movie;
  session: Session;
  seats: string[];
  tickets: TicketSelection;
  code: string;
  orderNumber: string;
  purchaseDate: string;
  validatedAt: string;
  customerName: string;
  customerPhone?: string;
  fee: number;
  total: number;
}

function shortDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function ticketTypeLabel(t: TicketSelection) {
  const parts: string[] = [];
  if (t.inteira > 0) parts.push(`${t.inteira}x INTEIRA`);
  if (t.meia > 0) parts.push(`${t.meia}x MEIA`);
  return parts.join(" + ") || "—";
}

export function TicketView({ data, onClose }: { data: TicketData; onClose: () => void }) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const { movie, session, seats, tickets } = data;
  const count = tickets.inteira + tickets.meia;
  const backdrop = movie.backdropUrl ?? movie.posterUrl;

  function copy() {
    navigator.clipboard?.writeText(data.code).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      },
      () => {},
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 px-4 py-4 backdrop-blur">
        <h1 className="flex-1 text-center text-lg">
          Código de Busca <strong className="font-bold">{data.code}</strong>
        </h1>
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-2 text-foreground"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <p className="px-4 text-center text-sm text-muted">
        Apresente este ingresso na entrada da sessão.
      </p>

      <div className="space-y-1 px-4 pb-4 pt-4">
        {/* TICKET — imagem + sessão */}
        <div className="overflow-hidden rounded-3xl">
          {/* Capa */}
          <div className="relative aspect-[16/10] w-full">
            {backdrop ? (
              <Image
                src={backdrop}
                alt={movie.title}
                fill
                sizes="(max-width: 480px) 100vw, 448px"
                className="object-cover"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${movie.poster[0]}, ${movie.poster[1]})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            {/* Ícone info */}
            <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-background">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M11 7h2v2h-2V7Zm0 4h2v6h-2v-6Z" />
                <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
              </svg>
            </span>

            {/* Texto sobre a capa */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-sm font-medium text-white/85">{CINEMA.name}</p>
              <h2 className="text-xl font-black leading-tight text-white sm:text-2xl">
                {movie.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ClassBadge classification={movie.classification} />
                <span className="rounded-md bg-info px-2.5 py-1 text-xs font-bold uppercase text-white">
                  {session.audio}
                </span>
                <span className="rounded-md bg-info px-2.5 py-1 text-xs font-bold uppercase text-white">
                  {session.format}
                </span>
              </div>
            </div>
          </div>

          {/* Bloco da sessão (gradiente azul -> roxo) */}
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-5 text-white">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">Sessão</p>
                <p className="text-2xl font-black">{shortDate(session.date)}</p>
              </div>
              <p className="text-2xl font-black">{session.time}</p>
            </div>
            <div className="my-4 h-px bg-white/25" />
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">Sala</p>
                <p className="text-xl font-bold">Sala {session.room}</p>
              </div>
              <div className="ml-3 min-w-0 text-right">
                <p className="text-xs uppercase tracking-wide text-white/70">Assento(s)</p>
                <p className="break-words text-xl font-bold">{seats.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Linha "Validado" */}
        <div className="flex items-center gap-3 py-4">
          <span className="flex-1 border-t border-dashed border-green-500/70" />
          <span className="flex items-center gap-1.5 text-sm font-semibold text-green-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.2-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7Z" />
            </svg>
            Validado às {data.validatedAt}
          </span>
          <span className="flex-1 border-t border-dashed border-green-500/70" />
        </div>

        {/* Card de ingressos */}
        <div className="relative rounded-3xl bg-surface-2 px-6 py-6">
          <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-background" />
          <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-background" />
          <div className="flex items-start justify-between gap-3">
            <div className="shrink-0">
              <p className="text-sm text-muted">Ingresso(s)</p>
              <p className="text-3xl font-black">{count}</p>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-sm text-muted">Tipo(s) de ingresso(s)</p>
              <p className="text-lg font-black leading-tight sm:text-2xl">
                {ticketTypeLabel(tickets)}
              </p>
            </div>
          </div>
        </div>

        {/* Detalhes do Pedido */}
        <div className="mt-1 rounded-3xl bg-surface px-5 py-5">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
            </svg>
            <span className="flex-1 text-left text-xl font-extrabold">Detalhes do Pedido</span>
            <svg
              viewBox="0 0 24 24"
              className={`h-6 w-6 text-info transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-muted">Código de busca</span>
                <button onClick={copy} className="flex items-center gap-2 font-bold text-info">
                  {data.code}
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                  </svg>
                </button>
              </div>
              {copied && <p className="mt-1 text-right text-xs text-green-500">Copiado!</p>}
              <p className="mt-2 text-sm text-muted">
                Utilize esse código para retirar seu ingresso na bilheteria e/ou para abrir chamados no SAC.
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-muted">Data da compra</span>
                <span className="text-muted">{data.purchaseDate}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-muted">Nº do Pedido</span>
                <span className="truncate text-muted">{data.orderNumber}</span>
              </div>

              <div className="my-5 h-px bg-border" />

              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20a8 8 0 0 1 16 0" strokeLinecap="round" />
                </svg>
                <span className="text-xl font-extrabold">Cliente</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span>Nome</span>
                <span className="text-muted">{data.customerName}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span>Telefone</span>
                <span className="text-muted">{data.customerPhone ?? "—"}</span>
              </div>

              <div className="my-5 h-px bg-border" />

              <div className="flex items-center justify-between">
                <span className="text-muted">Total taxa</span>
                <span className="text-muted">{brl(data.fee)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold">Valor Total</span>
                <span className="text-lg font-extrabold">{brl(data.total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Banner promo */}
        <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-700 p-5 text-center">
          <p className="text-sm font-medium text-white/90">
            Ganhe <strong>R$ 20</strong> na sua próxima compra. E mais! Garanta ainda{" "}
            <strong>R$ 20 de volta</strong> na sua conta corrente!
          </p>
          <button className="mt-3 rounded-lg bg-accent px-5 py-2 text-sm font-bold text-background">
            Receba agora
          </button>
        </div>
      </div>
    </div>
  );
}
