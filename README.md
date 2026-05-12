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

### Render (primary)

The repo includes `render.yaml` for infrastructure-as-code deployment.

1. Push this repo to GitHub.
2. Go to <https://dashboard.render.com/new/web> → **Connect a repository** → select this repo → Render picks up `render.yaml` automatically.
3. Under **Environment Variables**, add:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled connection string (from Neon dashboard → Connection Details → Pooled) |

4. Click **Create Web Service**. Live at <https://test1-fxz.onrender.com>.

Subsequent pushes to `main` deploy automatically. PRs do **not** get automatic preview URLs on Render free tier (unlike Vercel).

> **Note:** Render runs Next.js as a standard Node.js process (`next start`), not a native serverless runtime. Cold starts on the free tier can be slow after inactivity.

### Vercel (documented, not implemented)

Zero-config Next.js support — connects at <https://vercel.com/new>. Runs the Next.js runtime natively; PRs get preview URLs automatically. Prefer Vercel if preview deployments matter.

### Netlify (documented, not implemented)

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
