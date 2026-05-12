# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing landing page. Hosted on Vercel, backed by Neon Postgres.

## Commands

```bash
pnpm dev          # dev server (Turbopack, localhost:3000)
pnpm build        # production build
pnpm check        # Biome lint + format (auto-fix)
pnpm lint         # Biome lint only
pnpm format       # Biome format only
pnpm test         # Vitest unit tests
pnpm test:e2e     # Playwright e2e tests
```

To run a single unit test file: `pnpm test path/to/file.test.tsx`

## Stack

- **Next.js 16** — App Router, TypeScript strict, React 19, Turbopack
- **Tailwind CSS v4** — config-in-CSS via `@theme {}` in `globals.css`; no `tailwind.config.ts`
- **Biome** — single tool for lint and format (replaces ESLint + Prettier)
- **pnpm** — package manager (Node 22 LTS, pinned in `.nvmrc`)
- **Neon Postgres** — `@neondatabase/serverless` via `lib/db.ts`
- **Vitest + Testing Library** — unit tests; `vitest.setup.ts` loads jest-dom matchers
- **Playwright** — e2e scaffold in `e2e/`; no tests written yet

## Architecture

```
app/              # Next.js App Router — layouts, pages, route handlers
  globals.css     # Tailwind v4 entry + @theme design tokens
components/       # shared React components
e2e/              # Playwright e2e tests (scaffolded, empty)
lib/
  db.ts           # Neon sql tagged-template client
```

### Design tokens

All design tokens (colors, fonts, spacing overrides) live in the `@theme {}` block in `app/globals.css`. Map Figma tokens here as CSS variables. Tailwind utilities pick them up automatically.

### Database

`lib/db.ts` exports `sql` — a tagged-template function safe for serverless (no persistent connections). Use directly in Server Components and Route Handlers. Requires `DATABASE_URL` in env (see `.env.example`).

### Environment

Copy `.env.example` → `.env.local` before running locally. In Vercel, add `DATABASE_URL` via the project environment variables UI.
