# SPEC.md

Product and design contract for test1. Read this before implementing any feature.
Design source: https://www.figma.com/proto/rfgKtOmpqFXHYlFhl7Smvo/pabitella?node-id=2015-5

---

## Problem and goals

- Give internal users a single, authoritative landing page that explains what test1 is and why it matters.
- Provide a clear call-to-action so users know exactly what to do next (sign up, request access, or contact the team).
- Persist any lead/interest data (e.g. email captures) to Neon Postgres so nothing is lost between sessions.
- Ship fast: statically rendered where possible; no full page reloads on interactions.
- Establish a component library and design token set that future phases can extend without a rewrite.

## Non-goals

- No public-facing auth (authentication is out of scope for this phase).
- No admin dashboard or CMS — content is hardcoded or driven by env vars for now.
- No i18n; English only.
- No real-time features (websockets, live updates).
- Do not build a design system beyond what the landing page actually needs.

---

## User flows

1. **Discovery → conversion**
   User lands on `/` → reads hero + value props → clicks primary CTA → submits email/interest form → sees confirmation state → record written to DB.

2. **Return visit**
   User returns to `/` → page is unchanged (static) → no session required.

3. **[→ Figma] Additional flows**
   Document any modal, drawer, or multi-step interactions visible in the prototype here.

---

## Information architecture

| Route | Purpose |
|---|---|
| `/` | Main landing page — hero, value props, CTA, footer |
| `/api/interest` | `POST` route handler — persists email/interest to DB, returns `201` or error |
| `/_not-found` | Next.js default 404 (customize later) |

> Add routes here as the design reveals additional pages (e.g. `/about`, `/contact`).

---

## Component inventory

### Primitives
- **Button** — variants: `primary`, `secondary`, `ghost`; sizes: `sm`, `md`, `lg`
- **Input** — text input with label, error state, helper text
- **Badge** — small label chip (status, category)
- **Divider** — horizontal rule using design token spacing

### Composites
- **InterestForm** — email `<Input>` + submit `<Button>`; handles loading/success/error states; posts to `/api/interest`
- **FeatureCard** — icon + heading + body copy; used in the value-prop grid
- **Testimonial** — avatar + quote + name/role (if present in design)
- **Nav** — top bar with logo and optional CTA link
- **Footer** — links, legal copy, social icons

### Layouts
- **PageShell** — wraps every page: `<Nav>` + `<main>` + `<Footer>`
- **Section** — constrained-width, vertical-rhythm wrapper (`max-w-5xl mx-auto px-4`)
- **Grid** — responsive 1→2→3 column layout for feature cards

> [→ Figma] Confirm exact components visible in prototype. Remove or add above accordingly.

---

## Design tokens

> [→ Figma] Extract exact values from the Figma file and fill this table. Tokens go in the `@theme {}` block in `app/globals.css`.

### Colors
| Token | CSS var | Value |
|---|---|---|
| Brand primary | `--color-brand` | `[→ Figma]` |
| Brand secondary | `--color-brand-secondary` | `[→ Figma]` |
| Surface default | `--color-surface` | `[→ Figma]` |
| Surface muted | `--color-surface-muted` | `[→ Figma]` |
| Text primary | `--color-text` | `[→ Figma]` |
| Text muted | `--color-text-muted` | `[→ Figma]` |
| Border | `--color-border` | `[→ Figma]` |
| Destructive | `--color-destructive` | `[→ Figma]` |

### Type scale
| Token | CSS var | Value |
|---|---|---|
| Font family | `--font-sans` | `[→ Figma]` |
| xs | `--text-xs` | `[→ Figma]` |
| sm | `--text-sm` | `[→ Figma]` |
| base | `--text-base` | `[→ Figma]` |
| lg | `--text-lg` | `[→ Figma]` |
| xl | `--text-xl` | `[→ Figma]` |
| 2xl | `--text-2xl` | `[→ Figma]` |
| display | `--text-display` | `[→ Figma]` |

### Spacing, radii, shadows
| Token | CSS var | Value |
|---|---|---|
| Border radius sm | `--radius-sm` | `[→ Figma]` |
| Border radius md | `--radius-md` | `[→ Figma]` |
| Border radius lg | `--radius-lg` | `[→ Figma]` |
| Shadow card | `--shadow-card` | `[→ Figma]` |
| Shadow modal | `--shadow-modal` | `[→ Figma]` |

### Motion
| Token | CSS var | Value |
|---|---|---|
| Duration fast | `--duration-fast` | `150ms` |
| Duration base | `--duration-base` | `250ms` |
| Easing default | `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` |

---

## Data model

### `interests`
Captures email/interest submissions from the landing page CTA.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, `gen_random_uuid()` default |
| `email` | `text` | Not null; validated as email format before insert |
| `created_at` | `timestamptz` | Default `now()` |
| `source` | `text` | Optional; e.g. `"hero-cta"`, `"footer-cta"` |
| `metadata` | `jsonb` | Optional; free-form extras (referrer, UTM params) |

> Expand the model here if the design reveals additional data needs (e.g. a name field, company, message).

---

## APIs and integrations

| Surface | Method | Path | Purpose |
|---|---|---|---|
| Interest capture | `POST` | `/api/interest` | Validates email, writes to `interests` table, returns `201 { id }` or `422` on validation error |

**Database:** Neon Postgres via `@neondatabase/serverless`. All queries go through `lib/db.ts`.

**Auth:** None in Phase 1.

**External services:** None in Phase 1. (Analytics, email provider TBD.)

---

## Acceptance criteria

### `/` — Landing page
- [ ] Page is statically rendered (appears as `○` in `next build` output).
- [ ] Hero section renders headline, subhead, and primary CTA button.
- [ ] Submitting the interest form with a valid email writes a row to `interests` and shows a success message.
- [ ] Submitting with an invalid email shows an inline error; no DB write occurs.
- [ ] Form submit button shows a loading state while the request is in flight.
- [ ] Page is responsive at 375 px, 768 px, and 1280 px viewports.
- [ ] Passes Lighthouse accessibility audit (score ≥ 90).

### `/api/interest`
- [ ] `POST` with valid `{ email }` → `201 { id }`.
- [ ] `POST` with missing or malformed email → `422 { error: "invalid email" }`.
- [ ] `POST` with duplicate email → decide: upsert silently or return `409`. **[Open question #2]**

---

## Open questions

1. **Design access** — The Figma prototype is auth-gated. Share view-only access or export tokens/assets so the `[→ Figma]` placeholders above can be filled in.
2. **Duplicate email handling** — Upsert (idempotent) or reject with `409`?
3. **Success action** — After form submit, does the CTA button area replace with a message inline, or does the user navigate to a `/thank-you` page?
4. **Analytics** — Is any event tracking (Plausible, PostHog, GA4) required in Phase 1?
5. **Content source** — Is hero copy and feature card content hardcoded, or should it come from env vars / a lightweight CMS?
6. **`[→ Figma]` tokens** — All design token values above are placeholders pending design access.
