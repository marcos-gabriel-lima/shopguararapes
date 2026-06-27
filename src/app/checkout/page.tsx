"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBooking } from "@/context/BookingContext";
import { SNACKS } from "@/lib/data";
import { brl, longDate } from "@/lib/format";
import { Stepperbar } from "@/components/Stepperbar";
import { OrderSummary, type SnackLine } from "@/components/OrderSummary";
import { Bomboniere } from "@/components/Bomboniere";

type Status = "form" | "processing" | "done";

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `CG-${s}`;
}

function maskCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskCard(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

export default function CheckoutPage() {
  const { order, reset } = useBooking();
  const [status, setStatus] = useState<Status>("form");
  const [code, setCode] = useState("");
  const [snackQty, setSnackQty] = useState<Record<string, number>>({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");

  const ticketsTotal = useMemo(() => {
    if (!order) return 0;
    return order.tickets.inteira * order.session.price + order.tickets.meia * (order.session.price / 2);
  }, [order]);

  const snackLines: SnackLine[] = useMemo(
    () =>
      SNACKS.filter((s) => (snackQty[s.id] ?? 0) > 0).map((s) => ({
        name: s.name,
        qty: snackQty[s.id],
        price: s.price,
      })),
    [snackQty],
  );

  const snacksTotal = snackLines.reduce((sum, s) => sum + s.qty * s.price, 0);
  const total = ticketsTotal + snacksTotal;

  // Sem reserva válida
  if (!order) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-5xl">🍿</p>
        <h1 className="mt-4 text-2xl font-bold">Nenhuma reserva em andamento</h1>
        <p className="mt-2 text-muted">Escolha um filme e uma sessão para comprar seus ingressos.</p>
        <Link
          href="/filmes"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold text-background"
        >
          Ver filmes em cartaz
        </Link>
      </div>
    );
  }

  const { movie, session, seats, tickets } = order;

  const valid =
    name.trim().length > 2 &&
    /\S+@\S+\.\S+/.test(email) &&
    cpf.replace(/\D/g, "").length === 11 &&
    card.replace(/\D/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(exp) &&
    cvv.length >= 3;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setStatus("processing");
    window.setTimeout(() => {
      setCode(makeCode());
      setStatus("done");
    }, 1400);
  }

  // Confirmação
  if (status === "done") {
    return (
      <div className="px-4 py-10">
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/15 text-3xl">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Compra confirmada!</h1>
          <p className="mt-1 text-sm text-muted">
            Enviamos os ingressos para <strong>{email}</strong>
          </p>

          <div className="my-6 rounded-xl border border-dashed border-accent/50 bg-accent/5 p-4">
            <p className="text-xs uppercase tracking-widest text-muted">Código do pedido</p>
            <p className="mt-1 text-3xl font-black tracking-widest text-accent">{code}</p>
            <p className="mt-1 text-xs text-muted">
              Apresente este código na bilheteria ou totem de retirada.
            </p>
          </div>

          <div className="text-left">
            <OrderSummary
              movie={movie}
              session={session}
              seats={seats}
              tickets={tickets}
              snacks={snackLines}
              total={total}
            />
          </div>

          <Link
            href="/"
            onClick={() => reset()}
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold text-background"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <Link
        href={`/sessao/${session.id}`}
        className="text-sm text-muted transition hover:text-foreground"
      >
        ← Voltar às poltronas
      </Link>
      <Stepperbar current={3} />
      <h1 className="mb-5 mt-2 text-xl font-extrabold">Pagamento</h1>

      {/* Resumo no topo (mobile) */}
      <div className="mb-5">
        <OrderSummary
          movie={movie}
          session={session}
          seats={seats}
          tickets={tickets}
          snacks={snackLines}
          total={total}
        />
        <p className="mt-2 px-1 text-xs text-muted">
          {longDate(session.date)} · {session.time}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <Bomboniere
          quantities={snackQty}
          onChange={(id, qty) => setSnackQty((prev) => ({ ...prev, [id]: qty }))}
        />

        <fieldset className="rounded-2xl border border-border bg-surface p-5">
          <legend className="px-2 text-sm font-bold">Seus dados</legend>
          <div className="grid gap-4">
            <Field label="Nome completo">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como no documento"
                className={inputCls}
              />
            </Field>
            <Field label="E-mail">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className={inputCls}
              />
            </Field>
            <Field label="CPF">
              <input
                value={cpf}
                onChange={(e) => setCpf(maskCpf(e.target.value))}
                placeholder="000.000.000-00"
                inputMode="numeric"
                className={inputCls}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-border bg-surface p-5">
          <legend className="px-2 text-sm font-bold">Cartão de crédito</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Número do cartão" className="sm:col-span-2">
              <input
                value={card}
                onChange={(e) => setCard(maskCard(e.target.value))}
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
                className={inputCls}
              />
            </Field>
            <Field label="Validade">
              <input
                value={exp}
                onChange={(e) =>
                  setExp(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4)
                      .replace(/(\d{2})(\d)/, "$1/$2"),
                  )
                }
                placeholder="MM/AA"
                inputMode="numeric"
                className={inputCls}
              />
            </Field>
            <Field label="CVV">
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                inputMode="numeric"
                className={inputCls}
              />
            </Field>
          </div>
          <p className="mt-3 text-xs text-muted">
            🔒 Pagamento fictício — nenhum dado real é processado ou armazenado.
          </p>
        </fieldset>

        <button
          type="submit"
          disabled={!valid || status === "processing"}
          className="w-full rounded-full bg-accent py-3.5 text-sm font-bold text-background transition hover:bg-accent-2 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted"
        >
          {status === "processing" ? "Processando…" : `Pagar ${brl(total)}`}
        </button>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none transition focus:border-accent";

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
