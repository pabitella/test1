# SPEC.md

Product and design contract for test1. Read this before implementing any feature.
Design source: brand image (hero artwork) — see `/public/hero.jpg`.

---

## Problem and goals

- Give internal users a single landing page that communicates the brand message: *suppression of expression leads to depression* — self-expression is the core value prop.
- Evoke the serene, expansive feeling of the hero artwork: sky, water, stillness, bold color.
- Provide a clear call-to-action (email interest capture) so the team can measure reach.
- Persist submissions to Neon Postgres — no lead lost.
- Ship statically rendered where possible; no full page reloads on interaction.

## Non-goals

- No public-facing auth in Phase 1.
- No admin dashboard or CMS — content is hardcoded for now.
- No i18n; English only.
- No real-time features.
- Do not build a design system beyond what this page needs.

---

## User flows

1. **Discovery → conversion**
   User lands on `/` → hero image + tagline stops them → reads value prop copy → clicks primary CTA → submits email → sees inline confirmation → record written to DB.

2. **Return visit**
   User returns to `/` → page is static, no session needed.

---

## Information architecture

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, tagline, value props, interest form, footer |
| `/api/interest` | `POST` — validates email, writes to `interests` table |
| `/_not-found` | 404 (customize in a later phase) |

---

## Component inventory

### Primitives
- **Button** — variants: `primary` (brand-yellow fill), `ghost` (transparent + border); sizes: `sm`, `md`, `lg`
- **Input** — text input with floating label, error state, helper text
- **Badge** — small rounded chip

### Composites
- **InterestForm** — email `<Input>` + `<Button>`; loading / success / error states; posts to `/api/interest`
- **Nav** — minimal top bar: wordmark left, optional ghost CTA right
- **Footer** — single row: tagline, legal, social links

### Layouts
- **PageShell** — `<Nav>` + `<main>` + `<Footer>`
- **HeroSection** — full-viewport or near-full panel; hero image centered/right, tagline + form left; sky-blue background
- **Section** — constrained width (`max-w-5xl mx-auto px-6`), vertical rhythm spacing

---

## Design tokens

Extracted from the hero brand image. All values go in the `@theme {}` block in `app/globals.css`.

### Colors

| Token | CSS var | Value | Source |
|---|---|---|---|
| Brand yellow | `--color-brand` | `oklch(88% 0.19 100)` | Yellow fan, dominant |
| Brand teal | `--color-brand-teal` | `oklch(78% 0.09 185)` | Seafoam fan, accent |
| Sky (bg) | `--color-sky` | `oklch(86% 0.05 215)` | Background / water |
| Sky deep | `--color-sky-deep` | `oklch(72% 0.07 215)` | Water reflection, darker |
| Surface | `--color-surface` | `oklch(98% 0 0)` | Off-white card/form bg |
| Surface muted | `--color-surface-muted` | `oklch(94% 0.01 215)` | Input backgrounds |
| Text primary | `--color-text` | `oklch(15% 0 0)` | Near-black (matches image text) |
| Text muted | `--color-text-muted` | `oklch(50% 0 0)` | Secondary copy |
| Border | `--color-border` | `oklch(88% 0.01 215)` | Subtle, sky-tinted |
| Destructive | `--color-destructive` | `oklch(58% 0.22 25)` | Form errors |

### Type scale

The image uses a bold, tightly-set sans-serif for the tagline. Use **Inter** or **Geist** (already available in Next.js) — confirm with stakeholder.

| Token | CSS var | Value |
|---|---|---|
| Font sans | `--font-sans` | `var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif` |
| xs | `--text-xs` | `0.75rem / 1rem` |
| sm | `--text-sm` | `0.875rem / 1.25rem` |
| base | `--text-base` | `1rem / 1.5rem` |
| lg | `--text-lg` | `1.125rem / 1.75rem` |
| xl | `--text-xl` | `1.25rem / 1.75rem` |
| 2xl | `--text-2xl` | `1.5rem / 2rem` |
| display | `--text-display` | `clamp(2rem, 5vw, 3.5rem) / 1.1` |

### Radii, shadows, motion

| Token | CSS var | Value |
|---|---|---|
| Radius sm | `--radius-sm` | `0.375rem` |
| Radius md | `--radius-md` | `0.75rem` |
| Radius lg | `--radius-lg` | `1.5rem` |
| Radius full | `--radius-full` | `9999px` |
| Shadow card | `--shadow-card` | `0 1px 3px oklch(0% 0 0 / 8%), 0 4px 16px oklch(0% 0 0 / 6%)` |
| Duration fast | `--duration-fast` | `150ms` |
| Duration base | `--duration-base` | `250ms` |
| Ease default | `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` |

---

## Data model

### `interests`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, `gen_random_uuid()` default |
| `email` | `text` | Not null; validated before insert |
| `created_at` | `timestamptz` | Default `now()` |
| `source` | `text` | Optional — `"hero-cta"`, `"footer-cta"` |
| `metadata` | `jsonb` | Optional — referrer, UTM params |

---

## APIs and integrations

| Surface | Method | Path | Behavior |
|---|---|---|---|
| Interest capture | `POST` | `/api/interest` | Validate email → insert → `201 { id }` or `422 { error }` |

**Database:** Neon Postgres via `lib/db.ts` (`sql` tagged-template).
**Auth:** None in Phase 1.
**Analytics:** Required in Phase 1. Use **Vercel Analytics** (`@vercel/analytics`) — zero-config on Vercel, no separate account needed. Add `<Analytics />` to the root layout.

---

## Acceptance criteria

### `/` — Landing page
- [ ] Page is statically rendered (`○` in `next build` output).
- [ ] Hero image fills the hero panel without layout shift (use `next/image` with explicit dimensions).
- [ ] Tagline "suppression of expression leads to depression" is present as real text (not baked into image), bold, near-black.
- [ ] Interest form: valid email → success confirmation inline; invalid email → error message, no DB write.
- [ ] Submit button shows loading state while request is in flight.
- [ ] Responsive at 375 px, 768 px, 1280 px.
- [ ] Lighthouse accessibility ≥ 90.

### `/api/interest`
- [ ] `POST { email }` valid → `201 { id }`.
- [ ] `POST` missing/malformed email → `422 { error: "invalid email" }`.
- [ ] Duplicate email → `INSERT … ON CONFLICT (email) DO NOTHING`; always return `201` (user sees success regardless).
- [ ] Vercel Analytics page-view event fires on load.

---

## Decisions log

| # | Question | Decision |
|---|---|---|
| 1 | Duplicate email | Upsert silently — `ON CONFLICT DO NOTHING`, always `201` |
| 2 | Font | Geist (Next.js built-in) |
| 3 | Hero image rights | Cleared for use |
| 4 | Post-submit action | Inline confirmation (no navigation) |
| 5 | Analytics | Vercel Analytics in Phase 1 |
| 6 | Additional pages | No — single landing page only |
