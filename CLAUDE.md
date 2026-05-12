# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing landing page. Hosted on Vercel, backed by Neon Postgres.

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run lint     # ESLint via next lint
```

## Stack

- **Next.js 15** — App Router, TypeScript, React 19
- **Tailwind CSS** — utility-first styling
- **Neon Postgres** — serverless Postgres via `@neondatabase/serverless`

## Architecture

```
app/          # Next.js App Router — layouts, pages, route handlers
components/   # shared React components
lib/db.ts     # Neon SQL client (export: sql tagged-template)
```

### Database

`lib/db.ts` exports a `sql` tagged-template function from `@neondatabase/serverless`. Use it in Server Components and Route Handlers directly — no connection pooling config needed for serverless. Requires `DATABASE_URL` in environment (see `.env.example`).

### Environment

Copy `.env.example` to `.env.local` and fill in your Neon connection string before running locally. In Vercel, add `DATABASE_URL` via the project environment variables UI.
