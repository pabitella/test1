# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing landing page for test1, targeting internal users. Backed by Neon Postgres; deployed to Vercel.

## Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | ^16 |
| Language | TypeScript strict | ^5 |
| UI runtime | React | 19 |
| Styling | Tailwind CSS v4 | ^4.1 |
| Linter/Formatter | Biome | 1.9.4 |
| Package manager | pnpm | 10.11.0 |
| Node | 22 LTS | pinned in `.nvmrc` |
| Database client | @neondatabase/serverless | ^0.10 |
| Unit tests | Vitest + Testing Library | ^3 / ^16 |
| E2E tests | Playwright | ^1.49 |

## Commands

```bash
pnpm dev          # Turbopack dev server → localhost:3000
pnpm build        # production build
pnpm start        # serve production build locally
pnpm lint         # Biome lint (read-only)
pnpm format       # Biome format (writes)
pnpm check        # Biome lint + format, auto-fix (use before committing)
pnpm typecheck    # tsc --noEmit
pnpm test         # Vitest unit tests (watch mode)
pnpm test:e2e     # Playwright e2e

# Run a single test file
pnpm test src/path/to/file.test.tsx
```

## Directory layout

```
<populated after scaffold>
```

## Conventions

**Files & components**
- React components: PascalCase files, named exports, co-locate styles in the same directory if component-specific.
- All other files (utils, hooks, server actions): kebab-case.
- Test files live next to their subject: `foo.test.tsx` beside `foo.tsx`.

**Styling**
- Tailwind v4: no `tailwind.config.ts`. All design tokens (color, font, spacing) go in the `@theme {}` block in `app/globals.css` as CSS custom properties.
- Use Tailwind utility classes directly on JSX. Avoid inline `style={}` unless animating dynamic values.

**Imports**
- Alias `@/*` maps to the repo root. Use it for all cross-directory imports (`@/lib/db`, `@/components/Button`).

**Commits**
- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`. Keep subject ≤72 chars.

## Always / Never

**Always**
- Run `pnpm check` before committing.
- Use Server Components by default; add `"use client"` only when you need browser APIs or interactivity.
- Put database queries in `lib/` or route handlers — never directly inside JSX.
- Keep secrets in `.env.local`; never commit them.

**Never**
- Never install ESLint or Prettier — Biome owns lint and format.
- Never add `postcss.config` plugins other than `@tailwindcss/postcss` — autoprefixer is not needed in v4.
- Never use `npm` or `yarn` — pnpm only.
- Never use `any` without a `// biome-ignore` comment explaining why.

## Deployment

**Target:** Vercel (auto-deploy on push to `main`).

**Required env vars** — set in Vercel project settings for each environment:

| Var | Used for |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (pooled for preview, direct for production) |

**Preview vs production**
- Vercel preview deployments use the same `DATABASE_URL` unless you configure a separate Neon branch. Treat preview as staging — prefer a Neon branch database for previews to avoid touching production data.

---

Product and design spec lives in **SPEC.md** — read it before implementing features.
