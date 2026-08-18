# Client Website A — Decision Log

## 2026-08-16 — Gallery pagination remains downstream of filtering

- **Decision:** Keep publication eligibility, Type, Style, and Sort processing unchanged; paginate the resulting array at six items per page.
- **Decision:** Reset page state in each filter/sort interaction and clamp pagination helpers for defensive invalid-page handling.
- **Decision:** Reuse NewsletterSignup for Hero and Footer, with explicit instance prefixes to preserve unique labels/status relationships.

## 2026-08-16 — Footer contact links require approved configuration

- **Decision:** Remove repeated site-navigation groups from the footer and reserve its secondary column for identity plus Instagram, TikTok, and email.
- **Decision:** Validate optional `NEXT_PUBLIC_*` contact values and display “Link forthcoming” when absent rather than inventing URLs or an email address.
- **Consequences:** The header remains the canonical internal navigation; adding approved footer destinations requires configuration only.

## 2026-08-16 — Boundary masks own charcoal only

- **Decision:** Homepage boundary pseudo-elements may paint only `var(--ink)` and extend outside their dark section; they must never simulate exposed paper with `var(--paper)`.
- **Reason:** Transparent mask regions must reveal the canonical adjacent paper background, texture, and grid as one continuous layer system.
- **Consequences:** The existing erosion mask and geometry remain, while vertical mask orientation determines whether charcoal connects to the boundary above or below.

## 2026-08-16 — Homepage slots are the primary editing surface

- **Decision:** Keep four visible cards per Homepage surface and reveal eligible published work through a native disclosure picker inside each card.
- **Reason:** This removes redundant always-visible inventories while keeping assignment context attached to the target slot.
- **Consequences:** Placement actions and schema remain unchanged; candidate and Clear forms use the existing atomic mutations.

## 2026-08-16 — Four drawing slots parallel hero placement

- **Decision:** Store `drawing_featured` and `homepage_drawing_order` on canonical portfolio rows, mirroring the hero boolean/ordinal pattern without reusing hero fields.
- **Decision:** Enforce exactly slots 1–4 with a partial unique index and owner-gated replacement function. No arbitrary membership list or drag/reorder model is retained.
- **Decision:** Keep the original development drawings fallback when the replacement migration is unavailable.

## 2026-08-16 — Focused admin views reuse canonical records

- **Decision:** Keep `portfolio_items` and `portfolio_media` canonical. Homepage and Gallery are management projections over existing placement columns, not separate content stores.
- **Decision:** Use a shared responsive shell across owner management routes while leaving `/admin/login` outside the management navigation.
- **Decision:** Add only `public.faqs` for managed site content. Public reads are limited by RLS to active rows; all mutations require the existing single-owner predicate.
- **Decision:** Preserve checked-in FAQ copy as a read fallback when Supabase is unconfigured or the FAQ migration is pending, preventing migration-order downtime.

## ADR-001 — Separate controlled repository

- **Date:** 2026-08-12
- **Status:** Accepted
- **Decision:** Build Client Website A in `/home/nazeer171/Desktop/Client-Website-A`, isolated from Portfolio and SolarBot.
- **Rationale:** Client data, deployment, authentication, and operational boundaries must not become coupled to unrelated projects.

## ADR-002 — Next.js public and admin application

- **Date:** 2026-08-12
- **Status:** Accepted and implemented locally
- **Decision:** Use Next.js App Router with strict TypeScript, server-first rendering, and minimal client components.
- **Rationale:** One application can provide public editorial routes, protected admin routes, metadata, accessible server rendering, and controlled server-side Supabase access without splitting the first slice across services.
- **Alternative rejected:** A separate admin SPA adds deployment and authorization surfaces before they are justified. A headless/general CMS conflicts with the client-specific boundary.

## ADR-003 — Isolated Supabase backend

- **Date:** 2026-08-12
- **Status:** Accepted, implemented, and live-verified in development
- **Decision:** Use one Client A Supabase project for PostgreSQL, object storage, and owner authentication. Use Row Level Security as defense in depth and keep privileged mutations on controlled server paths.
- **Rationale:** It supplies the requested structured persistence, media storage, and owner auth with one isolated operational boundary and a clear path to future CRM-lite tables.
- **Alternatives rejected:** Repository/filesystem content cannot satisfy remote administration or durable object storage. A bespoke database/auth/storage stack adds operations without improving the first slice. Shared ecosystem infrastructure violates the explicit exclusion.
- **Consequence:** Supabase becomes a meaningful provider dependency. Schema, policies, migrations, backups, environment separation, and egress limits must remain portable and documented.

## ADR-004 — Vercel deployment target

- **Date:** 2026-08-12
- **Status:** Proposed and approved as direction; no project provisioned
- **Decision:** Target Vercel for the Next.js frontend/API surface and Supabase for stateful services.
- **Rationale:** This is the simplest conventional deployment pairing for the selected framework/provider.
- **Revisit trigger:** Pricing, media delivery, region, compliance, preview-environment, or server-runtime constraints conflict with client needs.

## ADR-005 — Editorial content and client-specific admin boundary

- **Date:** 2026-08-12
- **Status:** Accepted
- **Decision:** The public visual system follows the approved black/ivory/gold editorial concept. The private interface manages only Miles's portfolio content; it is not a reusable CMS. Style tags remain relational data rather than permanent code categories.
- **Rationale:** This preserves artist identity and supports content evolution without speculative platform features.

## ADR-006 — Password owner authentication and explicit owner allowlist

- **Date:** 2026-08-12
- **Status:** Accepted and implemented
- **Decision:** Start with one invited password-based Supabase user. Public signup remains disabled. Both application logic and RLS require the approved owner UUID; being generally authenticated is insufficient.
- **Consequences:** Setup must insert the owner UUID into `owner_users` and configure `OWNER_USER_ID`. Additional staff require a deliberate role-model change.

## ADR-007 — Private draft bucket and public published bucket

- **Date:** 2026-08-12
- **Status:** Accepted and implemented
- **Decision:** Upload new work to private `portfolio-drafts`. At publish time, authenticated server logic copies the image to public `portfolio-media`, changes media metadata, publishes the item, and removes the draft object.
- **Consequences:** Draft URLs cannot be public. Publishing spans storage and database operations rather than one transaction, so compensation logic removes public copies and restores metadata when possible after a partial failure.

## ADR-008 — Development and production Supabase separation

- **Date:** 2026-08-12
- **Status:** Accepted
- **Decision:** Use one development project for the current implementation. Require a separate production Supabase project and reviewed migration before deployment.
- **Consequences:** No development data, user identity, bucket, or credential is promoted directly into production.

## ADR-009 — Direct server-only Mailchimp newsletter boundary

- **Date:** 2026-08-14
- **Status:** Accepted and implemented locally; external integration unverified
- **Decision:** Submit normalized visitor email addresses from a Next.js server action directly to one configured Mailchimp audience. Keep the API key, server prefix, and audience ID in server-only environment variables and do not duplicate subscribers in Supabase.
- **Rationale:** Mailchimp is the requested subscriber system of record. A second local subscriber table would add personal-data retention, synchronization, deletion, and consent obligations without supporting this narrow slice.
- **Consequences:** Live verification and production operation require a Mailchimp API key, data-center/server prefix, and audience ID. Consent mode, rate limiting, bot mitigation, and provider failure monitoring must be reviewed before production traffic.

## ADR-010 — Independent gallery and ordered homepage placement

- **Date:** 2026-08-14
- **Status:** Accepted and implemented in migration form; development application pending
- **Decision:** Retain `featured` as the homepage-inclusion flag, add `show_in_gallery` for independent gallery visibility, and add one nullable unique `homepage_order` constrained to slots 1–4. Change placement through one owner-gated database function that clears an occupied target slot and updates the selected item atomically.
- **Rationale:** The prior model could distinguish published from draft but could not express published work shown on only one public surface or preserve four explicit hero positions. Three narrow fields reuse the current architecture without introducing generalized page-builder concepts.
- **Consequences:** Public reads remain published-only. Applying the follow-up migration is required before the expanded admin controls operate; public routes include legacy-compatible reads during that rollout boundary.

## ADR-011 — Server-mediated private consultation intake

- **Date:** 2026-08-14
- **Status:** Accepted and implemented locally; migration and live persistence unverified
- **Decision:** Keep public visitors outside direct Supabase table and Storage permissions. A validated Next.js server action uses a server-only service-role credential to create rows in dedicated `consultation_requests` and `consultation_request_media` tables and upload bounded images to the private `consultation-intake` bucket.
- **Rationale:** Consultation requests contain private contact and project material. Direct anonymous grants would widen access and complicate abuse controls, while mixing requests into portfolio publishing tables would violate the established content boundary.
- **Consequences:** Production operation requires the migration and a securely configured `SUPABASE_SERVICE_ROLE_KEY`. The action must remain narrowly validated and server-only. Deployment-level rate limiting or bot mitigation must be reviewed before public launch; no booking or Calendly integration is implied.
