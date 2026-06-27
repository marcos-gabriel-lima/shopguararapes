import Image from "next/image";
import { NEWS } from "@/lib/data";
import type { NewsItem } from "@/lib/types";
import { Avatar } from "@/components/TopChrome";

function NewsImage({ item, className }: { item: NewsItem; className: string }) {
  if (item.imageUrl) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 480px) 100vw, 448px"
          className="object-cover object-[center_25%]"
        />
      </div>
    );
  }
  return (
    <div
      className={className}
      style={{ background: `linear-gradient(160deg, ${item.image[0]}, ${item.image[1]})` }}
    />
  );
}

export default function NoticiasPage() {
  const [featured, ...rest] = NEWS;

  return (
    <div>
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center bg-background/95 px-4 py-3 backdrop-blur">
        <span className="w-10" />
        <h1 className="flex-1 text-center text-lg font-bold">Notícias</h1>
        <Avatar />
      </div>

      {/* Destaque */}
      <article className="relative">
        <NewsImage item={featured} className="aspect-[4/3] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="rounded bg-accent px-2 py-0.5 text-[11px] font-bold uppercase text-background">
            {featured.category}
          </span>
          <h2 className="mt-2 text-2xl font-black leading-tight text-white">
            {featured.title}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            {featured.date} | {featured.author}
          </p>
        </div>
      </article>

      {/* Banner */}
      <div className="mx-4 mt-5 flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-5 text-center text-xs text-muted">
        Espaço publicitário
      </div>

      {/* Lista */}
      <div className="mt-5 space-y-4 px-4">
        {rest.map((n) => (
          <article
            key={n.id}
            className="overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div className="relative">
              <NewsImage item={n} className="aspect-[16/9] w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="rounded bg-accent/90 px-2 py-0.5 text-[10px] font-bold uppercase text-background">
                  {n.category}
                </span>
                <h3 className="mt-2 text-lg font-bold leading-tight text-white">{n.title}</h3>
                <p className="mt-1 text-xs text-white/70">
                  {n.date} | {n.author}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
