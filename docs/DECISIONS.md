# Client Website A — Decision Log

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
- **Status:** Accepted and implemented locally; no resources provisioned
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
