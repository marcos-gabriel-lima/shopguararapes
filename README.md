# 🎬 Cine Guararapes — clone do app ingresso.com

Clone do app de compra de ingressos de cinema (estilo **ingresso.com**), focado no
**Cinépolis Guararapes — Shopping Guararapes** (Jaboatão dos Guararapes/PE).

Feito com **Next.js 16 + React 19 + TypeScript + Tailwind v4**. Visual mobile com
barra de abas inferior, tema escuro e accent amarelo.

## Telas

- **Início** — seletor de cidade, carrossel de destaque, trilhas "Em Alta" e "Em breve".
- **Filmes** — abas Em cartaz / Em breve, **busca por título/gênero**, filtros por gênero e grade de pôsteres.
- **Cinemas** — sessões por data, com formatos (NORMAL/3D/IMAX) e horários.
- **Notícias** — feed de matérias.
- **Fluxo de compra** — detalhe do filme → seleção de poltronas → **bomboniere (combos)** → checkout (pagamento fictício) → confirmação com código.

## Catálogo: estático ou dinâmico (TMDB)

Por padrão o app usa um **catálogo de exemplo embutido** ([src/lib/data.ts](src/lib/data.ts)) com
pôsteres reais do TMDB — funciona sem nenhuma configuração.

Para um **catálogo dinâmico** (filmes em cartaz/em breve reais, atualizados sozinhos), defina a
variável `TMDB_ACCESS_TOKEN` (veja [.env.example](.env.example)). Com a chave presente, as telas
Início/Filmes/Cinemas e o detalhe do filme passam a buscar dados na
[API do TMDB](https://developer.themoviedb.org) (com cache de 1h). Sem a chave, cai no estático
automaticamente.

## Rodando localmente

```bash
npm install
npm run dev     # http://localhost:3000
```

> Dica: no DevTools, ative o modo dispositivo (mobile) para ver igual aos prints do app.

## Deploy na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com) → **Add New… → Project** → importe o repositório.
3. Framework: **Next.js** (detectado automaticamente). Nenhuma variável de ambiente é necessária.
4. **Deploy**. As imagens dos pôsteres já estão liberadas em `next.config.ts`
   (`images.remotePatterns` → `image.tmdb.org`).

## Créditos

- **Pôsteres e dados de filmes:** [The Movie Database (TMDB)](https://www.themoviedb.org).
  Este produto usa imagens do TMDB, mas **não é endossado nem certificado pelo TMDB**.
- Projeto **demonstrativo** — sessões, preços e pagamentos são fictícios; não realiza vendas reais.
