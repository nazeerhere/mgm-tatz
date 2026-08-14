# Client Website A — Trajectory

## 2026-08-13 — First repository baseline

**Objective**

Canonicalize the approved local application, documentation, migration, tests, and client-provided development media into the first commit without adding product scope.

**Changes**

- Audited the repository, existing staged boundary, ignore behavior, generated files, Git history, and remote configuration before committing.
- Expanded ignore coverage for local secrets, build/provider output, dependencies, browser/test captures, logs, caches, and temporary files while preserving `.env.example` as the documented configuration contract.
- Updated canonical state to record the approved visual hierarchy, sticky navigation, subtractive charcoal erosion boundary, homepage Selected Work removal, preserved `/work` route, local-only Supabase implementation status, and current development assets.
- Added a fourth finished tattoo as a repository-owned development fixture with intrinsic dimensions and descriptive alt text. `/work` includes it only in the existing local fallback gallery; Home retains the established three-image hero rail, and real published Supabase rows remain authoritative.

**Verification**

- Formatting, zero-warning ESLint, strict TypeScript, all 7 tests, and the production build pass.
- Credential-free production routes return 200 for `/`, `/work`, and `/admin/login`; anonymous `/admin` and `/admin/portfolio/new` redirect to login with 307.
- The new JPEG returns 200 as `image/jpeg`, appears on `/work`, and remains absent from Home. Desktop and true 375-CSS-pixel `/work` renders preserve its full vertical composition without observed clipping.
- Live authentication, database persistence, Storage promotion, RLS, and public publication remain unverified because no development Supabase project is configured.

**Drift check**

No Supabase integration, auth, schema, Storage, RLS, upload/publish action, route, backend behavior, Aftercare scope, deployment, remote configuration, or external account changed.

## 2026-08-12 — Client-provided development media placement

**Objective**

Replace generic visual placeholders with eight supplied client assets without changing the Phase 3 backend, routes, or publishing behavior.

**Changes**

- Added three finished tattoo images, four drawing/study images, and the Miles portrait as repository-owned development fixtures.
- Added a typed media manifest with intrinsic dimensions, descriptive alternatives, titles, and crop positions, plus a local gallery component that mirrors the stored-data gallery structure.
- Home and `/work` now use client-provided tattoos only when no real published Supabase rows are available; stored published content remains authoritative when present.
- Reframed Miles non-destructively through CSS around his face, hands, and workstation, excluding Instagram header, carousel, story text, and sticker chrome.
- Tuned desktop and 375px crops: vertical cover treatment for tattoos, paper-card presentation for studies, `contain` for the tall classical composition, and a snap-scrolling mobile hero rail.

**Verification**

- All eight assets return 200 with `image/jpeg` from the production server.
- Desktop and true 375-CSS-pixel tall screenshots confirm image loading, crops, aspect treatment, section transitions, and no observed horizontal page overflow.
- Format, lint, strict type checking, 7 tests, and production build pass; anonymous admin access remains redirected to login.

**Drift check**

No Supabase client, auth, schema, Storage, RLS, upload/publish action, stored-data gallery component, route, Aftercare, or admin behavior changed.

## 2026-08-12 — Homepage navigation and boundary refinement

**Objective**

Keep the hero as Home's finished-work showcase, make navigation persist while scrolling, and replace hard dark/ivory edges with subtle irregular ink-to-paper dissolutions.

**Changes**

- Removed only the homepage Selected Work section and its redundant public-data request; `/work` remains the complete Supabase-backed gallery route.
- Made the shared header sticky with a restrained translucent charcoal, blur, border, and shadow treatment; added anchor offsets and compact mobile dimensions.
- Added layered pseudo-elements with uneven radial masks, charcoal feathering, faint diagonal sketch remnants, blend modes, blur, and reciprocal paper-edge overlays across the dark/ivory sequence.
- Added page-level horizontal clipping as a guard against intentionally oversized transition layers.

**Verification**

- Format, zero-warning ESLint, strict TypeScript, 7 tests, and production build pass.
- Built routes return 200 for `/`, `/work`, and `/admin/login`; anonymous `/admin` remains a 307 redirect to `/admin/login`.
- Production HTML confirms the Selected Work heading is absent from Home and present on `/work`.
- Desktop, true 375-CSS-pixel mobile, anchored About states, and mobile `/work` were rendered and inspected. The header remains visible at anchored scroll positions, the transition layers scale across both widths, and no page-level horizontal overflow was observed.

**Remaining visual gap**

The dissolution is intentionally CSS-generated and restrained. A bespoke client-approved charcoal/line-art texture could add richer hand-made variation later, but no new visual asset was fabricated for this pass.

**Drift check**

No Supabase integration, auth, schema, Storage, RLS, publishing action, admin flow, route contract, or Aftercare scope changed.

## 2026-08-12 — Dedicated charcoal transition asset

**Objective**

Correct the dark-to-ivory boundary so it follows the approved dry-brush silhouette rather than reading as a blurred CSS gradient.

**Changes**

- Replaced the gradient-generated transition layers with one transparent, non-repeating SVG brush asset.
- Built uneven paint depth, scraped transparent gaps, broken horizontal strokes, and sparse extended fibers into the asset itself.
- Kept CSS limited to responsive sizing, positioning, and directional flipping between dark and paper sections.

**Verification**

- Format, ESLint, strict TypeScript, 7 tests, and production build pass.
- The homepage was rendered and inspected at 1440px and true 375 CSS pixels after the final silhouette adjustment.

**Drift check**

Only the transition asset and its presentation CSS changed. Layout, content, routes, Supabase, auth, admin, Storage, RLS, and publishing behavior remain unchanged.

### Follow-up refinement

The brush asset is now confined to an asymmetrically positioned 34% desktop region and a compact 38% mobile region. A horizontal alpha taper lets the texture disappear within that zone while the remaining boundary stays clean.

## 2026-08-13 — Visual scale and rhythm refinement

**Objective**

Bring the existing composition closer to the approved reference's quieter headline-to-body ratios, media proportions, navigation density, section heights, and CTA prominence without redesigning it.

**Changes**

- Reduced the sticky header, navigation gaps, hero headline, supporting copy, buttons, artwork rail, drawing cards, About typography/value points, specialty row, process row, and final consultation headline.
- Tightened section padding while retaining deliberate whitespace and the established black/ivory/gold sequence.
- Preserved the dedicated charcoal transitions and restored the original responsive one-column grid behavior after detecting a cascade conflict during mobile inspection.

**Verification**

- Formatting, zero-warning ESLint, strict TypeScript, 7 tests, and production build pass.
- Tall 1440px desktop and mobile breakpoint renders were inspected; the final mobile render confirms single-column structure and no observed horizontal clipping.

**Remaining scale gap**

The mobile hero artwork rail remains the most dominant page element. That is intentional because it is Home's only finished-work showcase, though it is still somewhat taller than the reference's compact desktop artwork bays relative to surrounding copy.

**Drift check**

No content structure, transition asset, route, Supabase integration, auth, schema, Storage, RLS, gallery query, publishing behavior, or admin functionality changed.

## 2026-08-13 — Subtractive dark-section edge

**Objective**

Replace the additive charcoal overlay with an eaten-away bottom edge contained inside each dark-to-ivory boundary.

**Changes**

- Reused the brush texture as an inverted alpha mask on a paper-colored pseudo-element inside the final 70–110px of each dark section.
- Removed the reciprocal overlays from the ivory sections, leaving the light side of each boundary clean.

**Verification**

- Desktop and mobile production renders confirm that ivory cuts upward into the dark section and no charcoal element extends beneath the boundary.
- Formatting, ESLint, strict TypeScript, 7 tests, and production build pass.

**Drift check**

Only transition presentation CSS changed. Layout, content, routes, Supabase, auth, gallery, publishing, and admin behavior remain unchanged.

### Erosion-mask refinement

Replaced the long-stroke alpha texture with a dedicated non-tiling erosion mask. Its edge uses displaced fractal noise, asymmetric contour depth, sparse thresholded flecks, and a lower-weight upward fade. The bottom seam is fully paper-backed so the result reads as darkness being removed rather than charcoal being added.

### Artifact cleanup

Removed the detached fleck field while preserving the primary displaced contour, and removed the ivory section's top border that produced the dark seam. No erosion strength, depth, layout, or structure changed.

## 2026-08-12 — Approved-reference visual implementation

**Objective**

Restyle the existing frontend to closely follow the approved editorial reference without changing Phase 3 backend or publishing behavior.

**Changes**

- Reworked the public visual hierarchy around a compact editorial header, Miles-led hero, four tall media bays, dark gallery, ivory drawing rail, dark split About block, ivory icon-led specialties, dark FAQ/contact band, four-step process, and dark consultation/footer close.
- Added paper/charcoal textures, thin rules, serif display hierarchy, restrained gold ornaments, architectural spacing, and explicit media placeholders.
- Adapted the composition to a true 375-CSS-pixel viewport and preserved the owner interface with only mobile top-clearance adjustment for the taller shared header.
- Added no final client claims, artwork, social details, Aftercare, backend behavior, or route.

**Verification**

- Format, zero-warning lint, strict type checking, 7 tests, and production build pass.
- `/`, `/work`, and `/admin/login` return 200; anonymous `/admin` remains a 307 redirect to login.
- Desktop and true 375-CSS-pixel mobile screenshots were inspected across the homepage hierarchy; `/work` and `/admin/login` were separately checked for shared-style regressions.

**Known gap**

The composition matches the reference language, but approved tattoo photography, paper drawings, artist portrait, final biography, booking link, and social/studio details are unavailable. Deliberate placeholders preserve truth until those inputs arrive.

**Drift check**

No auth, schema, storage, RLS, upload/publish action, query boundary, route, CRM, payment, Aftercare, or deployment behavior changed.

## 2026-08-12 — Phase 3 local publishing vertical slice

**Objective**

Scaffold and implement only password owner login → private image/metadata draft → explicit publish → public gallery.

**Observed starting state**

- The repository was documentation-only and the provider direction was approved but unresolved on auth, media visibility, and environment separation.
- No Supabase or Vercel resource or client content was available.

**Changes**

- Scaffolded Next.js 16.3 with strict TypeScript and a minimal Supabase SSR integration; pinned Node-20-compatible Supabase versions after current releases exposed a Node 22 requirement.
- Added the editorial public experience, owner login/admin/create routes, validated safe-key uploads, private drafts, compensated public promotion, and published-only queries.
- Added normalized PostgreSQL tables, data-driven tags, two storage buckets, RLS owner allowlisting, tests, environment template, and setup guidance.
- Kept missing client copy, media, social links, and studio details explicit rather than fabricated.

**Verification**

- Format, lint, type checking, 7 tests, production build, public HTTP routes, anonymous admin redirect, and responsive desktop/mobile inspection pass.
- Live provider behavior remains unobserved because no development Supabase project or credential was provisioned.

**Risks / debt**

- Publish promotion spans object storage and relational mutations; compensation reduces but cannot eliminate rare partial-failure cleanup work.
- Image dimensions are modeled but not extracted in this slice; the UI preserves intrinsic ratios when dimensions are available and uses a stable fallback otherwise.
- Client-approved content and imagery remain absent.

**Next leverage point**

Provision the isolated development Supabase project, apply the migration, invite/allowlist the owner, and execute the real authentication/upload/publish verification ladder. Create a separate production project before any deployment.

**Drift check**

The slice contains no CRM, payments, generalized CMS, shared backend, SolarBot work, multi-image editor, or external deployment.

## 2026-08-12 — Project foundation and architecture checkpoint

**Objective**

Create a separate controlled repository, establish canonical project records, and record the approved architecture before application scaffolding.

**Observed starting state**

- The approved target path contained no project files or Git repository.
- No client application, provider resources, credentials, or publishable content existed in scope.
- The supplied brief defined the visual baseline, content model, exclusions, first vertical slice, and verification expectations.

**Changes**

- Initialized a standalone Git repository on `main`.
- Added the repository agent contract, canonical state, decisions, architecture, content-model proposal, verification contract, README, and ignore rules.
- Recorded Next.js, isolated Supabase, and proposed Vercel boundaries without scaffolding, installing packages, provisioning services, or deploying.

**Evidence**

- Repository tree, Git status, documentation consistency, and secret patterns are inspected at this checkpoint.

**Risks / debt**

- Real artist content, media rights/provenance, admin email/auth method, Supabase/Vercel environments, and runtime credentials are unavailable.
- Storage visibility strategy must be selected during implementation with real provider behavior in view.

**Next leverage point**

Approve Phase 3 scaffolding and dependency installation, then build the smallest local application skeleton and checked-in schema/policy migrations before external provisioning.

**Drift check**

The work is isolated from Portfolio and SolarBot, remains documentation-only, excludes CRM/payments/general CMS scope, and creates no external resource.
