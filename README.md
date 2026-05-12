# test1

*suppression of expression leads to depression* — a mental-health / self-expression platform.

## Local development

```bash
cp .env.example .env.local   # fill in DATABASE_URL from Neon dashboard
pnpm install
pnpm dev                     # http://localhost:3000
```

## Database

Schema lives in `src/lib/schema.ts` and is managed with [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview).

```bash
pnpm db:generate   # generate SQL migration from schema changes
pnpm db:migrate    # apply pending migrations to the database
pnpm db:studio     # open Drizzle Studio (local DB browser)
```

## Deploy

### Vercel (primary)

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> → import the repo → Vercel auto-detects Next.js (zero config needed, no `vercel.json` required).
3. Under **Environment Variables**, add:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled connection string (from Neon dashboard → Connection Details → Pooled) |

4. Click **Deploy**. Subsequent pushes to `main` deploy automatically.

> **Preview vs production:** Vercel preview deployments share the same `DATABASE_URL` by default. To avoid touching production data, configure a separate [Neon branch](https://neon.tech/docs/guides/branching-intro) for previews in the Neon integration settings.

### Netlify (documented, not implemented)

Netlify auto-detects Next.js via `@netlify/plugin-nextjs` — no manual install or `netlify.toml` required for standard deployments. The key difference: Vercel runs the Next.js runtime natively; Netlify wraps it in their adapter layer, which can lag behind cutting-edge Next.js features. Prefer Vercel for this stack.
