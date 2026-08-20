# Production readiness contract

## Security headers

Every application route receives a CSP, `nosniff`, strict-origin referrer policy, a restricted Permissions Policy, frame denial, and one-year HSTS. Framework disclosure is disabled.

The CSP allows:

- `'self'` for application resources and requests;
- inline scripts and styles because the current Next.js App Router response and React style props require them;
- `data:`/`blob:` images for framework previews and local file previews;
- HTTPS images/media plus HTTPS/WSS connections to `*.supabase.co` for public media and authenticated Supabase requests.

Mailchimp is called only by the server and needs no browser CSP allowance. HSTS is appropriate only for the intended HTTPS-only production host; do not serve production over HTTP.

## Public form abuse controls

Newsletter and consultation forms use an off-screen honeypot and a browser-populated completion timestamp. Implausibly fast or honeypot-filled submissions receive a neutral success response without a provider/database write. A missing timestamp is allowed so progressive submission and accessibility tooling are not blocked, and an old timestamp remains valid so a legitimate user can leave a form open while preparing a request.

These checks are low-cost friction, not durable rate limiting. Before launch, enable host/edge rate limits for the newsletter and consultation server-action POST traffic. Start conservatively, observe legitimate traffic, and exempt authenticated admin traffic. Do not replace this with process-memory counters on a serverless host.

## Production fallback invariant

Development fixtures are available only when `NODE_ENV` is not `production`. In production, missing or unusable Supabase configuration produces:

- no mock Hero or Drawings media on Home;
- an empty Gallery rather than development portfolio records;
- no placeholder FAQ records.

Static approved layout/copy and the local Miles portrait/logo remain regular site assets, not database fallbacks. Admin remains unavailable when Supabase is not configured.

## Environment contract

Public/client-safe variables:

- `NEXT_PUBLIC_SUPABASE_URL` — production Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — publishable/anon key only.
- `NEXT_PUBLIC_INSTAGRAM_URL` — optional approved HTTPS profile.
- `NEXT_PUBLIC_TIKTOK_URL` — optional approved HTTPS profile.
- `NEXT_PUBLIC_CONTACT_EMAIL` — optional approved public contact address.

Server-only variables; these must never use `NEXT_PUBLIC_`:

- `SUPABASE_SERVICE_ROLE_KEY` — consultation persistence only.
- `OWNER_USER_ID` — UUID allowlist checked by owner-only application routes.
- `MAILCHIMP_API_KEY` — Marketing API credential.
- `MAILCHIMP_SERVER_PREFIX` — Mailchimp data-center prefix.
- `MAILCHIMP_AUDIENCE_ID` — target audience identifier.

The deployed Supabase project must also contain an `owner_users` row matching the authenticated owner UUID. Never commit deployed values.

## Migration reconciliation

Required order:

1. `202608120001_portfolio_publishing.sql`
2. `202608140001_portfolio_surface_placement.sql`
3. `202608140002_consultation_requests.sql`
4. `202608160001_managed_faqs.sql`
5. `202608160003_homepage_drawing_slots.sql`

From a securely linked local Supabase CLI, perform read-only comparison first:

```sh
npx supabase migration list --linked
npx supabase db dump --linked --schema public,storage --file /tmp/client-website-a-linked-schema.sql
```

Compare the migration list to `supabase/migrations/` and inspect the dump for `owner_users`, the three portfolio placement columns/constraints, both placement RPCs, `faqs`, consultation tables, and the three expected buckets: `portfolio-drafts`, `portfolio-media`, and `consultation-intake`. Do not run `db push` until the comparison is reviewed and a backup exists.

Migration assumptions:

- Publishing creates `is_portfolio_owner()` and `set_updated_at()`, which later migrations reuse.
- Surface placement must precede drawing slots; each owns distinct columns, constraints, indexes, and RPC names.
- Consultation and FAQ migrations depend on the publishing migration's owner function; their policies do not permit anonymous writes.
- The FAQ and drawing migrations contain initial data/backfill behavior. Review existing production rows before application.
- `owner_users` is intentionally not seeded because the production auth UUID is environment-specific.

## Live owner acceptance checklist

- Auth: owner login succeeds; anonymous admin routes redirect; a valid non-owner account is rejected.
- Portfolio: upload a controlled image, edit metadata, confirm it remains private, publish it, then unpublish it and confirm public removal/private restoration.
- Placement: assign and replace Hero slots 1–4; assign and replace Drawings slots 1–4; clear each; verify Gallery membership changes independently.
- FAQ: create, edit, hide, show, reorder, and explicitly delete a controlled record; verify only active records render publicly in display order.
- Consultation: submit one controlled request; verify its row and private objects; verify owner-only reads and direct anonymous denial; remove the controlled data afterward under an approved cleanup procedure.
- Newsletter: use one controlled address; confirm Mailchimp acceptance/delivery, already-subscribed behavior, and safe provider-error messaging.
- Recheck `/`, `/work`, `/faq`, `/consultation`, `/admin`, mobile navigation, Gallery controls/pagination/lightbox, modal behavior, and response headers on the production domain.

Do not use client personal data for acceptance testing.

## Client-content gaps

- `content/site-content.ts`: biography, personal process, artist statement, studio details, and both fallback FAQ answers require approved final copy.
- `app/page.tsx`: three process descriptions still say details are forthcoming.
- `app/faq/page.tsx`: supporting copy explicitly says approved booking/studio details are pending.
- `.env.example` contract: approved Instagram URL, TikTok URL, and contact email are not supplied.
- `content/development-media.ts` and `public/client-media/`: titles, descriptions, alt text, and publication rights require final client approval before any fixture is promoted into canonical production media.
- Existing database portfolio metadata must be reviewed in the owner UI; repository inspection cannot verify remote titles/descriptions.
