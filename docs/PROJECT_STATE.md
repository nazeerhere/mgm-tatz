# Client Website A — Project State

_Last updated: 2026-08-13 for the first repository baseline checkpoint._

## Project header

- **Type:** Premium tattoo artist portfolio with private content administration
- **Client:** Miles / MGM.TATZ
- **Objective:** Present Miles's tattoo and illustration practice through a distinctive public experience and prove one secure end-to-end owner publishing path.
- **Current Phase:** Phase 3 local vertical slice implemented; development Supabase provisioning is the next gate
- **Writable Scope:** `/home/nazeer171/Desktop/Client-Website-A` only
- **Autonomy:** High for reversible work inside the repository
- **Depth:** Production foundation
- **Completion Standard for current checkpoint:** Buildable, tested public/admin application and checked-in Supabase schema/policies; live persistence claims withheld until a development project is configured

## Canonical current state

### Observed

- This is a separate Git repository on branch `main`.
- The repository contains a Next.js `16.3.0` App Router application with React `19.2.8`, strict TypeScript `6.0.2`, Supabase SSR `0.12.0`, Supabase JS `2.109.0`, ESLint, Prettier, and Node tests.
- Public `/` and `/work` routes render the approved black/ivory/gold editorial foundation and explicit placeholders where client content is unavailable.
- Home uses a dark Miles-led hero with a three-image finished-tattoo rail, followed by an ivory drawings rail, dark split About section, ivory specialties, dark FAQ/contact band, ivory four-step process, and dark consultation/footer close.
- The standalone homepage Selected Work section is intentionally removed. The full Selected Work gallery remains available at `/work`.
- Navigation is CSS-sticky with a compact translucent charcoal surface and responsive anchor offsets.
- Dark-to-ivory boundaries use a subtractive paper-colored pseudo-element masked by a non-repeating SVG charcoal-erosion texture. The mask erodes only the dark section's lower band; detached flecks and the dark light-section seam have been removed.
- `/admin/login`, `/admin`, and `/admin/portfolio/new` implement password login, owner-only access, draft creation, image validation, and explicit publishing.
- The checked-in SQL migration defines portfolio/media/style tables, two storage buckets, indexes, owner allowlisting, public-published reads, owner-only mutations, and seeded data-driven style tags.
- Draft images are private. Publishing promotes media to a public bucket and removes the private copy after metadata/state succeeds.
- Nazeer approved the repository path and the Next.js + Supabase + Vercel architecture direction on 2026-08-12.
- No Supabase project, storage bucket, Vercel project, domain, account, or credential has been created or accessed.
- No publishable artist copy, imagery, studio details, social links, FAQ answers, or consultation destination has been supplied.

### Verification observed

- Formatting, zero-warning lint, strict type checking, 7 tests, and production build pass.
- Without credentials, `/`, `/work`, and `/admin/login` return 200; anonymous `/admin` returns a 307 redirect to login.
- Desktop and true 375-CSS-pixel mobile screenshots show no observed clipping or collision after a mobile header correction.
- The public frontend now follows the approved editorial reference hierarchy: dark hero/gallery, tall artwork bays, ivory drawing rail, split dark About band, icon-led specialties, FAQ/contact band, four-step process, and dark consultation close. All unavailable media/content remains explicitly marked forthcoming.
- Nine client-provided JPEGs are stored as development fixtures under `public/client-media`: four finished tattoos, four drawings/studies, and one source portrait of Miles. A typed frontend manifest owns their dimensions, alt text, titles, crop positions, and the new vertical tattoo's non-cropping presentation.
- Home retains the established three-tattoo hero rail. When Supabase is unconfigured or has no published rows, all four client-provided tattoo fixtures populate `/work`. Real published Supabase rows continue to take precedence without changing the gallery or publishing architecture.
- Miles's source portrait is non-destructively cropped with CSS to exclude Instagram interface/story overlays from the visible About frame.
- The approved-reference scale pass reduces headline, media, navigation, CTA, and section dimensions while retaining the existing hierarchy. Responsive grids return to one column below 900px, with compact two-column drawing/specialty content at phone widths.
- Live Supabase login, upload, row/object creation, publish promotion, RLS, and public visibility are not yet observed.

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

- Creating or linking Supabase/Vercel resources requires separate approval and credentials supplied through secure environment configuration.
- Database migrations, storage policies, and production deployment require review before external mutation.
- Public artist claims and media require client approval/provenance.

## Known limitations

- No development Supabase project or credential is configured, so live integration remains unverified.
- Identity is designed for one owner; additional staff roles are outside the first slice.
- The supplied images are development/client-provided content; final publication approval and migration into `portfolio-media` remain pending.
- The hero uses three development tattoos; `/work` exposes all four only when no real published Supabase rows are available.

## Current milestone

The local vertical slice and approved visual foundation form the first repository baseline. The next leverage point is provisioning the isolated development Supabase project, applying the reviewed migration, inviting the owner, and observing the complete persistence path. Production requires a separate project.
