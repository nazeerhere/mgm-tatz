# Client Website A — Architecture

## Gallery pagination and shared signup instances

`PortfolioGallery` owns ephemeral filter, sort, page, and lightbox state. `filterAndSortGalleryItems` runs first; `paginateGalleryItems` then slices at the fixed six-item boundary. Hero and Footer mount the same client NewsletterSignup and server action, passing only presentation classes and deterministic ID prefixes.

## Shared footer

The root layout owns one shared public footer. Its newsletter retains the existing client action and Mailchimp server boundary. `content/footer-contact.ts` is the isolated public-contact configuration adapter: social values must be HTTPS and contact email must validate before the layout renders an anchor.

## Homepage boundary compositing

Paper sections own their background color, SVG grain (`::before`), rotated hierarchical grid (`::after`), and foreground content. Adjacent dark sections own both boundary transitions: an outward `::after` for dark-to-paper and an outward `::before` for paper-to-dark. Those transition layers are masked charcoal; their transparent pixels expose the real paper stack beneath.

## Homepage management interaction

`/admin/homepage` renders independent four-card Hero and Drawings grids. Each server-rendered card owns a native disclosure of published canonical portfolio choices. Candidate and Clear forms call the existing owner-gated placement actions; the UI adds no client state, media duplication, schema change, or alternate mutation path.

## Homepage drawing slots — 2026-08-16

- `portfolio_items.drawing_featured` and `homepage_drawing_order` are the drawing equivalents of hero `featured` and `homepage_order`.
- A validity constraint requires drawing placements to be published and within slots 1–4; a partial unique index permits only one item per drawing slot.
- `set_homepage_drawing_placement(uuid, smallint)` is owner-gated and replaces the current occupant of a selected drawing slot.
- The drawing function does not read or mutate hero placement or Gallery visibility.

## Admin management surfaces — 2026-08-16

- `/admin` is an owner-only dashboard; `/admin/portfolio`, `/admin/homepage`, `/admin/gallery`, and `/admin/faq` are focused owner-only management routes.
- `components/admin-shell.tsx` and `components/admin-nav.tsx` provide the shared responsive shell. Each route calls `requireOwner()` before querying private data.
- `lib/admin.ts` builds one admin portfolio view model and signs short-lived draft thumbnails server-side. Published thumbnails continue using public Storage URLs.
- Homepage and Gallery actions call the existing owner-gated `set_portfolio_placement` function while retaining the unaffected placement field.
- `public.faqs` is the only new content table. Public FAQ queries request active rows ordered by `display_order`; admin actions use the authenticated owner client.

## Status

Implemented locally and in checked-in migration form; not externally provisioned.

## System boundary

```text
Public visitor ──> Next.js public routes ──> published-only query ──> Supabase PostgreSQL
                                         └───────────────────────> controlled media delivery

Public visitor ──> validated consultation server action ──> dedicated consultation tables
                                                    └─────> private intake bucket

Owner ──> Supabase Auth ──> protected Next.js admin routes
                           ├─> validated metadata mutation ──────> PostgreSQL
                           └─> validated image upload ──────────> private staging / public media path
```

The application owns client-specific presentation, validation, and editorial workflow. Supabase owns identity, relational state, object bytes, database authorization policies, and persistence. No other project reads or writes this backend.

## Route structure

### Public

- `/` — hero tattoo rail, drawings/flash, About preview, specialties, FAQ/contact preview, process, and consultation CTA
- `/about` — standalone artist introduction using the approved About content and portrait
- `/faq` — standalone booking/studio information using accessible native disclosures
- `/work` — published-only editorial gallery with development fallback when live data is unavailable
- `/consultation` — public project-request form; submission does not book an appointment
- `/work/[slug]` — optional detail route after the first slice proves a need

The shared application shell provides the sticky primary navigation and a site-wide footer containing the existing newsletter form plus valid Studio, Explore, and Plan destinations.

### Private

- `/admin/login` — owner authentication
- `/admin` — editorial item list with publication, gallery, and four-slot homepage controls
- `/admin/portfolio/new` — multi-file private-draft uploader with independent per-file results
- `/admin/portfolio/[id]` — metadata and image-description editor

### Controlled server endpoints/actions

- Authenticate through Supabase server-side helpers/cookies.
- Create each uploaded image as its own unpublished item, upload validated media, associate its private storage object, then explicitly publish after metadata review.
- Public gallery queries require `published = true` and `show_in_gallery = true`. Homepage queries require `published = true` and `featured = true`, ordered by a unique `homepage_order` from 1–4.
- An owner-only database function changes gallery visibility and homepage placement together so slot displacement remains atomic while the two public surfaces stay independent.
- The consultation action validates and normalizes all visitor input on the server, signature-checks bounded JPEG/PNG/WebP uploads, and uses a server-only Supabase service-role client to write only to dedicated consultation tables and the private `consultation-intake` bucket. No anonymous database or Storage grant is added.

## Authentication and authorization

- One invited owner account; no public signup.
- Use one invited password-based owner account with public signup disabled. No magic-link, social-login, or multi-user role surface is included.
- Middleware may provide early route redirection, but every privileged mutation must verify the user on the server.
- RLS denies anonymous writes and limits authenticated writes to the approved owner identity/role.
- Service-role credentials, if required, remain server-only and are never exposed to the browser. Prefer user-scoped operations under RLS where practical.
- Public consultation submission is the narrow exception: visitors have no Supabase session, so a validated server action owns the privileged write boundary. The browser receives neither the service-role credential nor a private object URL.

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

Consultation uploads use a separate private bucket and keyspace:

```text
consultation-intake/
  consultations/{consultation_request_id}/{random_uuid}.{validated_extension}
```

Each image is limited to 5 MB; one request accepts at most five references and one body-area image. The action compensates a partial failure by removing uploaded objects and the request row when possible.

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

The verified foundation remains owner sign-in → one private image draft → explicit publication → public gallery. The next local slice adds independent multi-file draft ingestion, metadata editing, unpublish, gallery visibility, and four ordered homepage placements without becoming a generalized CMS. Multi-image-per-item editing, filters, CRM-lite, and generalized content blocks remain deferred.
