# Client Website A — Project State

_Last updated: 2026-08-14 for the public portfolio gallery refinement._

## Project header

- **Type:** Premium tattoo artist portfolio with private content administration
- **Client:** Miles / MGM.TATZ
- **Objective:** Present Miles's tattoo and illustration practice through a distinctive public experience and prove one secure end-to-end owner publishing path.
- **Current Phase:** Phase 3 publishing vertical slice verified against the development Supabase project
- **Writable Scope:** `/home/nazeer171/Desktop/Client-Website-A` only
- **Autonomy:** High for reversible work inside the repository
- **Depth:** Production foundation
- **Completion Standard for current checkpoint:** Record the observed owner login → private draft → public absence → publish → public visibility path without expanding product scope

## Canonical current state

### Observed

- This is a separate Git repository on branch `main`.
- The repository contains a Next.js `16.3.0` App Router application with React `19.2.8`, strict TypeScript `6.0.2`, Supabase SSR `0.12.0`, Supabase JS `2.109.0`, ESLint, Prettier, and Node tests.
- Public `/` and `/work` routes render the approved black/ivory/gold editorial foundation and explicit placeholders where client content is unavailable.
- Home uses a dark Miles-led hero with a three-image finished-tattoo rail, followed by an ivory drawings rail, dark split About section, ivory specialties, dark FAQ/contact band, ivory four-step process, and dark consultation/footer close.
- The standalone homepage Selected Work section is intentionally removed. The full Selected Work gallery remains available at `/work`.
- `/work` is the primary public tattoo portfolio page. It uses a responsive editorial grid with natural image proportions, restrained title/category/optional-description metadata, and an accessible native-dialog focused view with Escape, backdrop, and explicit back controls.
- Navigation is CSS-sticky with a compact translucent charcoal surface and responsive anchor offsets.
- Dark-to-ivory boundaries use a subtractive paper-colored pseudo-element masked by a non-repeating SVG charcoal-erosion texture. The mask erodes only the dark section's lower band; detached flecks and the dark light-section seam have been removed.
- `/admin/login`, `/admin`, and `/admin/portfolio/new` implement password login, owner-only access, draft creation, image validation, and explicit publishing.
- The checked-in SQL migration defines portfolio/media/style tables, two storage buckets, indexes, owner allowlisting, public-published reads, owner-only mutations, and seeded data-driven style tags.
- Draft images are private. Publishing promotes media to a public bucket and removes the private copy after metadata/state succeeds.
- Nazeer approved the repository path and the Next.js + Supabase + Vercel architecture direction on 2026-08-12.
- One development Supabase project is configured and was used for the live publishing verification. Production still requires a separate project before deployment.
- No Vercel project or domain has been created or accessed.
- Final artist copy, studio details, social links, FAQ answers, and consultation destination have not been supplied.

### Verification observed

- Formatting, zero-warning lint, strict type checking, 7 tests, and production build pass.
- Without credentials, `/`, `/work`, and `/admin/login` return 200; anonymous `/admin` returns a 307 redirect to login.
- Desktop and true 375-CSS-pixel mobile screenshots show no observed clipping or collision after a mobile header correction.
- The public frontend now follows the approved editorial reference hierarchy: dark hero/gallery, tall artwork bays, ivory drawing rail, split dark About band, icon-led specialties, FAQ/contact band, four-step process, and dark consultation close. All unavailable media/content remains explicitly marked forthcoming.
- Nine client-provided JPEGs are stored as development fixtures under `public/client-media`: four finished tattoos, four drawings/studies, and one source portrait of Miles. A typed frontend manifest owns their dimensions, alt text, titles, crop positions, and the new vertical tattoo's non-cropping presentation.
- Home retains the established three-tattoo hero rail. When Supabase is unconfigured or has no published rows, all four client-provided tattoo fixtures populate `/work`. Real published Supabase rows continue to take precedence without changing the gallery or publishing architecture.
- Miles's source portrait is non-destructively cropped with CSS to exclude Instagram interface/story overlays from the visible About frame.
- The approved-reference scale pass reduces headline, media, navigation, CTA, and section dimensions while retaining the existing hierarchy. Responsive grids return to one column below 900px, with compact two-column drawing/specialty content at phone widths.
- Nazeer reported a successful live end-to-end check against the development Supabase project: password owner login, image upload, private draft save, confirmation that the draft was absent from `/work`, explicit publish, and confirmation that the published item appeared on `/work`.
- This proves the user-visible publishing vertical slice. Direct database-row inspection, direct anonymous draft-object denial, non-owner rejection, and internal Storage promotion/removal were not separately recorded in this checkpoint.
- After the `/work` refinement, the configured production route returned 200 and rendered the two live published items rather than development fallback content. A read-only anonymous REST check returned the same two published rows and zero draft rows under live RLS.
- Headless interaction checks at 1440×1000 and an exact 375×812 CSS viewport confirmed natural index proportions, `contain`-preserved focused media, native Escape close, explicit back-button close, scroll lock cleanup, a single mobile column, 52px mobile view targets, and no horizontal overflow.

## Product direction

- Artist-first editorial identity rather than a generic tattoo-shop template.
- Near-black surfaces for finished tattoo work; warm ivory/paper surfaces for drawings and process; restrained warm gold accent.
- Refined serif display typography, clean body/UI typography, strong grid, high-impact imagery, negative space, and minimal rounded corners.
- Primary work is black-and-grey and illustration-driven, spanning animals, anatomical/skeletal work, anime/manga, dark fantasy/mythic themes, classical/religious references, surreal collage, symbolic geometry, and traditional drawing studies.

## Current public content scope

Hero/artist intro, tattoo rail, drawings/flash, About Miles, specialties/influences, FAQ/contact, process, consultation CTA, and Chicago/footer information. Final biography, studio, booking, and social copy remains blocked pending client-approved source material.

## Exclusions

Aftercare, design-to-tattoo pairing, advanced CRM automation, payment processing, shared cross-project backend integration, generalized CMS/CRM capabilities, and SolarBot work.

## Approval gates

- Creating or linking production Supabase/Vercel resources requires separate approval and credentials supplied through secure environment configuration.
- Production database migrations, storage policies, and deployment require review before external mutation.
- Public artist claims and media require client approval/provenance.

## Known limitations

- Identity is designed for one owner; additional staff roles are outside the first slice.
- The supplied images are development/client-provided content; final publication approval and migration into `portfolio-media` remain pending.
- The hero uses three development tattoos; `/work` exposes all four only when no real published Supabase rows are available.
- Non-owner rejection, direct anonymous access denial for draft objects, and internal row/object state were not independently inspected during the reported live flow.
- The focused work view is intentionally stateful rather than URL-addressable; deep-linking individual portfolio items remains an open product decision rather than part of this pass.

## Current milestone

The owner-facing development publishing path is live-verified through public gallery visibility. The next leverage point is hardening the remaining negative-path evidence, replacing development fixtures/placeholders with approved client content, and preparing a separate production Supabase project before deployment.
