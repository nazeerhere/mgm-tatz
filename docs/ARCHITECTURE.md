# Client Website A — Architecture

## Status

Implemented locally and in checked-in migration form; not externally provisioned.

## System boundary

```text
Public visitor ──> Next.js public routes ──> published-only query ──> Supabase PostgreSQL
                                         └───────────────────────> controlled media delivery

Owner ──> Supabase Auth ──> protected Next.js admin routes
                           ├─> validated metadata mutation ──────> PostgreSQL
                           └─> validated image upload ──────────> private staging / public media path
```

The application owns client-specific presentation, validation, and editorial workflow. Supabase owns identity, relational state, object bytes, database authorization policies, and persistence. No other project reads or writes this backend.

## Proposed route structure

### Public

- `/` — hero, selected work, drawings/flash, bio, specialties, FAQ, CTA, contact
- `/work` — published gallery with type/style filters only when supported by real volume
- `/work/[slug]` — optional detail route after the first slice proves a need

### Private

- `/admin/login` — owner authentication
- `/admin` — editorial item list
- `/admin/portfolio/new` — create/upload/publish form
- `/admin/portfolio/[id]` — deferred edit flow

### Controlled server endpoints/actions

- Authenticate through Supabase server-side helpers/cookies.
- Create an item as unpublished, upload validated media, associate its storage object, then explicitly publish.
- Public query projects only an allowlisted set of fields where `published = true`.

## Authentication and authorization

- One invited owner account; no public signup.
- Use one invited password-based owner account with public signup disabled. No magic-link, social-login, or multi-user role surface is included.
- Middleware may provide early route redirection, but every privileged mutation must verify the user on the server.
- RLS denies anonymous writes and limits authenticated writes to the approved owner identity/role.
- Service-role credentials, if required, remain server-only and are never exposed to the browser. Prefer user-scoped operations under RLS where practical.

## Storage structure

Proposed bucket: `portfolio-media`.

```text
portfolio-media/
  portfolio/{portfolio_item_id}/{random_uuid}.{validated_extension}
```

- Generate keys server-side; never trust uploaded filenames as object keys.
- Allow JPEG, PNG, and WebP initially, with an explicit size ceiling and signature/type checks.
- Database rows store the bucket/key, media type, dimensions when available, alt text, display order, and timestamps—not binary content.
- Unpublished media lives in private `portfolio-drafts`. Publishing copies validated bytes to public `portfolio-media`, updates metadata/state, and then removes the private object. Public bucket writes remain owner-only; public reads apply only after promotion.
- Additional images are modeled separately but deferred from the first create slice unless the primary-image path is already complete.

## Deployment and environments

- Vercel: Next.js build and runtime.
- Supabase: one isolated development project during implementation. A distinct production project is mandatory before deployment.
- Environment variables use `.env.local` locally and encrypted host configuration remotely. Only publishable Supabase identifiers may reach the client; privileged keys stay server-side.
- Database changes use checked-in SQL migrations. Storage/RLS policies are versioned alongside schema.

## Failure behavior

- Authentication failure: redirect/deny without exposing admin data.
- Validation failure: preserve safe form fields and provide field-level guidance.
- Upload failure: do not publish or create a broken public item; clean up partial objects when safe.
- Database failure after upload: report failure and remove the orphan object or record it for bounded cleanup.
- Public data/storage failure: render a deliberate unavailable/empty state without leaking diagnostics.

## Phase 3 vertical slice

Only one complete path: owner signs in, creates one portfolio item with one primary image and metadata, saves it unpublished, publishes it, and observes it in the public gallery. FAQ, SiteContent editing, multi-image editing, filters, CRM-lite, and generalized content blocks remain deferred.
