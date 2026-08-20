# Client Website A — Project State

_Last updated: 2026-08-16 for Gallery pagination/sticky controls and Hero newsletter._

## Project header

- **Type:** Premium tattoo artist portfolio with private content administration
- **Client:** Miles / MGM.TATZ
- **Objective:** Present Miles's tattoo and illustration practice through a distinctive public experience, preserve the verified publishing path, and provide controlled newsletter and consultation-request entry points.
- **Current Phase:** Publishing verified against development Supabase; consultation intake implemented locally with migration and live private persistence awaiting verification
- **Writable Scope:** `/home/nazeer171/Desktop/Client-Website-A` only
- **Autonomy:** High for reversible work inside the repository
- **Depth:** Production foundation
- **Completion Standard for current checkpoint:** Dedicated consultation route, requested ordered fields, safe private persistence architecture, responsive and accessible form behavior, focused tests, and explicit live-verification boundaries

## Canonical current state

### Observed

- This is a separate Git repository on branch `main`.
- The repository contains a Next.js `16.3.0` App Router application with React `19.2.8`, strict TypeScript `6.0.2`, Supabase SSR `0.12.0`, Supabase JS `2.109.0`, ESLint, Prettier, and Node tests.
- Public `/` and `/work` routes render the approved black/ivory/gold editorial foundation and explicit placeholders where client content is unavailable.
- Home uses a dark Miles-led hero with up to four ordered, admin-controlled published images, followed by an ivory drawings rail, dark split About section, ivory specialties, a short dark FAQ/contact preview, ivory four-step process, and dark consultation close. With Supabase unavailable it uses the four established development tattoos; with live data it renders only eligible rows and creates no placeholder cards.
- `/about` reuses the approved homepage introduction, About statement, value placeholders, and Miles portrait in a standalone dark editorial layout. `/faq` holds the current limited booking/contact placeholders in keyboard-operable native disclosures on an ivory supporting-page layout.
- Primary About and FAQ links route to `/about` and `/faq`. The expanded shared footer places the existing newsletter signup prominently on the left and organizes only working Studio, Explore, and Plan destinations on the right; mobile becomes a single-column directory with 44px link targets.
- The standalone homepage Selected Work section is intentionally removed. The full Selected Work gallery remains available at `/work`.
- `/work` is the primary public tattoo portfolio page. It uses a responsive editorial grid with natural image proportions, restrained title/category/optional-description metadata, and an accessible native-dialog focused view with Escape, backdrop, and explicit back controls.
- `/work` now exposes compact Type, Style, and Featured/Newest controls over the same published-only dataset. Type grouping treats tattoo as tattoo and drawing/flash/concept as drawing; style filtering reads the existing data-driven style-tag relation. The local fallback supplies explicit manifest metadata and includes both development tattoos and drawings.
- Cross-route scroll positions are stored by pathname in tab-scoped `sessionStorage`. Internal route changes are captured before navigation, known positions are restored without smooth scrolling, hash destinations remain native, and browser back/forward paths use the same per-route values without cookies or server persistence.
- Navigation is CSS-sticky with a compact translucent charcoal surface and responsive anchor offsets.
- Home's ivory drawings, specialties, and process sections separate their sketchbook treatment into a non-repeating broad-tone/fiber paper SVG and a parchment-toned hierarchical graph layer. Darker 60px primary cells contain five lighter 12px subdivisions per axis; the regular perpendicular grid sits on a centered `180% × 220%` plane transformed with `rotate(-25deg) scale(1.1)`, visibly leaning left while remaining clipped behind the content.
- Dark-to-ivory boundaries use a subtractive paper-colored pseudo-element masked by a non-repeating SVG charcoal-erosion texture. The mask erodes only the dark section's lower band; detached flecks and the dark light-section seam have been removed.
- `/admin/login`, `/admin`, `/admin/portfolio/new`, and `/admin/portfolio/[id]` implement password login, owner-only access, multi-file batch selection, independent per-file private draft creation, metadata editing, publication state, gallery/homepage placement, explicit publish, and unpublish-to-draft behavior.
- The owner interface is split into compact `/admin`, `/admin/portfolio`, `/admin/homepage`, `/admin/gallery`, and `/admin/faq` management surfaces under one responsive dark-sidebar/light-workspace shell. Portfolio remains canonical; Homepage and Gallery mutate only existing placement fields.
- A checked-in FAQ migration defines ordered, active/inactive FAQ records with active-only public reads and owner-only writes. The public FAQ reads active rows in display order and retains checked-in fallback content until the migration is available.
- Four independent homepage drawing slots parallel the existing hero placement fields on canonical portfolio rows. The public rail retains its pre-migration development fallback, while managed drawing data is limited to slots 1–4.
- Homepage management uses the eight slot cards themselves as the editing surface. Each Hero and Drawings card exposes an on-demand published-item picker and an occupied-slot Clear action; no permanent duplicate inventory appears below either grid.
- Homepage boundaries now extend masked charcoal outside each dark section. Transparent erosion reveals the adjacent paper section's real background, grain, and rotated grid instead of covering them with a paper-colored pseudo-element.
- The shared public footer is a compact newsletter/identity split. Repeated internal navigation is removed; optional validated Instagram, TikTok, and contact-email hooks render honest unavailable states until approved destinations are configured.
- `/work` filters and sorts the full eligible dataset before rendering a clamped six-item page. Previous/Next controls expose page boundaries, and the existing controls stay directly beneath the sticky header while results scroll.
- Home renders a compact secondary newsletter action inside the Hero by reusing the same instance-safe `NewsletterSignup` component and server action as the unchanged footer signup.
- The original checked-in SQL migration defines portfolio/media/style tables, two storage buckets, indexes, owner allowlisting, public-published reads, owner-only mutations, and seeded data-driven style tags. A follow-up migration adds `show_in_gallery`, four unique ordered homepage slots, placement validity checks, and an owner-gated atomic placement function.
- Draft images are private. Publishing promotes media to a public bucket and removes the private copy after metadata/state succeeds.
- Newsletter submission uses a public Next.js server action, server-side email validation/normalization, and a direct Mailchimp Marketing API request. Mailchimp credentials remain server-only, and subscriber data is not duplicated in Supabase.
- `/consultation` uses a desktop parchment/charcoal split: a branded warm-taupe sketchbook introduction, email note, four-step review process, and subdued development artwork sit beside a dark numbered 01–05 form panel. The light surface uses a dedicated, non-tiling broad-tone/grain/fiber SVG rather than the brighter global paper token. At phone widths the panels stack into one column with the established subtractive charcoal edge between them. The route retains local image previews, friendly field-level validation, an explicit request acknowledgement, and a request-only confirmation state.
- The consultation split preserves the manually tuned upper and lower artwork layers and uses a `325vh` desktop minimum canvas; at `980px` and below it returns to natural content height.
- Consultation persistence is isolated from portfolio publishing in dedicated tables and a private bucket. A validated server action owns the server-only privileged write boundary; anonymous Supabase table and Storage access remains denied.
- Nazeer approved the repository path and the Next.js + Supabase + Vercel architecture direction on 2026-08-12.
- One development Supabase project is configured and was used for the live publishing verification. Production still requires a separate project before deployment.
- No Vercel project or domain has been created or accessed.
- Final artist copy, studio details, social links, FAQ answers, and an approved scheduling destination have not been supplied.

### Verification observed

- Formatting, zero-warning lint, strict type checking, 46 tests, and production build pass.
- Without credentials, `/`, `/work`, and `/admin/login` return 200; anonymous `/admin` returns a 307 redirect to login.
- Desktop and true 375-CSS-pixel mobile screenshots show no observed clipping or collision after a mobile header correction.
- The public frontend now follows the approved editorial reference hierarchy: dark hero/gallery, tall artwork bays, ivory drawing rail, split dark About band, icon-led specialties, FAQ/contact band, four-step process, and dark consultation close. All unavailable media/content remains explicitly marked forthcoming.
- Eleven client-provided JPEGs are stored under `public/client-media`: four finished-tattoo fixtures, five drawing/study fixtures, one source portrait of Miles, and the cropped navbar bird asset. The typed frontend manifest owns portfolio dimensions, alt text, titles, style tags, feature state, crop positions, and the vertical tattoo's non-cropping presentation.
- Exact 375×812 CSS browser instrumentation observed no horizontal overflow on Home, `/work`, or `/consultation`. A fresh tab began at `0`; route checks restored Home at `1180`, `/work` at `760` and then `920`, browser back restored `/about` at `360`, and forward restored `/work` at `920` without pathname cross-contamination.
- The configured `/work` rendered nine published rows. Metadata controls produced three tattoos and six drawings, a Drawings + Animals empty state, and a distinct Newest ordering. Desktop and exact-375px captures show the compact controls without a sidebar or overflow.
- At a 1440×1000 viewport the consultation canvas computed to `3250px`, retained both decorative artwork nodes, and had no horizontal overflow. At exact 375×812 its computed minimum returned to `0px`/auto, the content determined a `4708.125px` natural height, and the sticky header remained at top `0`.
- Home now supports four simultaneous desktop cards and a contained horizontal rail on tablet/mobile. Instrumented renders observed four development cards at 1440px without rail overflow and four cards at an exact 375×812 CSS viewport with internal rail overflow but no page overflow. The configured development project currently supplies two legacy featured items, which render without empty placeholders.
- Miles's source portrait is non-destructively cropped with CSS to exclude Instagram interface/story overlays from the visible About frame.
- The approved-reference scale pass reduces headline, media, navigation, CTA, and section dimensions while retaining the existing hierarchy. Responsive grids return to one column below 900px, with compact two-column drawing/specialty content at phone widths.
- Nazeer reported a successful live end-to-end check against the development Supabase project: password owner login, image upload, private draft save, confirmation that the draft was absent from `/work`, explicit publish, and confirmation that the published item appeared on `/work`.
- This proves the user-visible publishing vertical slice. Direct database-row inspection, direct anonymous draft-object denial, non-owner rejection, and internal Storage promotion/removal were not separately recorded in this checkpoint.
- After the `/work` refinement, the configured production route returned 200 and rendered the two live published items rather than development fallback content. A read-only anonymous REST check returned the same two published rows and zero draft rows under live RLS.
- Headless interaction checks at 1440×1000 and an exact 375×812 CSS viewport confirmed natural index proportions, `contain`-preserved focused media, native Escape close, explicit back-button close, scroll lock cleanup, a single mobile column, 52px mobile view targets, and no horizontal overflow.
- Newsletter tests confirm empty/invalid rejection, lowercase normalization, correct Mailchimp member request construction, success-state mapping, graceful already-subscribed behavior, and non-sensitive provider errors. Browser checks confirm the form precedes the consultation CTA, valid input reaches the server action, missing configuration produces a safe message, and the 375px layout is single-column with no overflow.
- Consultation tests and production-browser checks confirm required and invalid-email handling, preservation of entered values, three synthetic image previews, sticky navigation, responsive desktop/mobile form grids, and no horizontal overflow. The valid synthetic request reached the server action and stopped safely at the missing service-role configuration boundary.
- The consultation presentation pass was instrumented at 1440×1000 and exact 375×812 CSS viewports. Observed results include a 415px/1025px desktop split, one 375px mobile column, five numbered form sections, a loaded non-repeating panel-edge mask, 56.8px minimum text/select controls, sticky-header top `0`, three synthetic local previews with 44px remove controls, no browser exceptions, and no horizontal overflow.
- The consultation paper refinement reports a computed sidebar base of `rgb(196, 178, 148)` and a loaded dedicated paper surface at `0.68` opacity at both inspected widths. Final captures show broad tonal irregularity and subdued paper tooth without the rejected bright-ivory glow, directional fabric striation, hard artwork rectangle, or straight desktop divider.

## Product direction

- Artist-first editorial identity rather than a generic tattoo-shop template.
- Near-black surfaces for finished tattoo work; warm ivory/paper surfaces for drawings and process; restrained warm gold accent.
- Refined serif display typography, clean body/UI typography, strong grid, high-impact imagery, negative space, and minimal rounded corners.
- Primary work is black-and-grey and illustration-driven, spanning animals, anatomical/skeletal work, anime/manga, dark fantasy/mythic themes, classical/religious references, surreal collage, symbolic geometry, and traditional drawing studies.

## Current public content scope

Hero/artist intro, tattoo rail, drawings/flash, homepage About Miles, specialties/influences, shortened FAQ/contact preview, process, consultation CTA, standalone `/about`, standalone `/faq`, and a shared newsletter/directory footer with Chicago information. Final biography, studio, booking, FAQ, and social copy remains blocked pending client-approved source material.

## Exclusions

Aftercare, design-to-tattoo pairing, advanced CRM automation, payment processing, shared cross-project backend integration, generalized CMS/CRM capabilities, and SolarBot work.

## Approval gates

- Creating or linking production Supabase/Vercel resources requires separate approval and credentials supplied through secure environment configuration.
- Creating a Mailchimp account, audience, API key, or campaign requires separate approval; this checkpoint provisions none of them.
- Production database migrations, storage policies, and deployment require review before external mutation.
- Public artist claims and media require client approval/provenance.

## Known limitations

- Identity is designed for one owner; additional staff roles are outside the first slice.
- The supplied images are development/client-provided content; final publication approval and migration into `portfolio-media` remain pending.
- The hero uses four development tattoos when live homepage placements are unavailable; `/work` exposes all four tattoos plus all five development drawings only when Supabase is not configured.
- Style-specific public filtering depends on style-tag assignments. Published items without assigned tags remain available under Style: All but correctly do not appear under a specific style. The current admin surface does not yet expose tag assignment.
- Development fallback items have no defensible creation timestamps, so Newest preserves their explicit manifest order. Live published rows sort by their existing `created_at` values.
- Non-owner rejection, direct anonymous access denial for draft objects, and internal row/object state were not independently inspected during the reported live flow.
- The focused work view is intentionally stateful rather than URL-addressable; deep-linking individual portfolio items remains an open product decision rather than part of this pass.
- Mailchimp is not configured, so real subscription delivery and audience membership remain unverified. Live verification requires `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, and `MAILCHIMP_AUDIENCE_ID` in server-only environment configuration.
- The public newsletter action has no application-level rate limiter or bot challenge in this slice; provider protections and deployment-level controls must be reviewed before production traffic.
- The public consultation action uses a honeypot and strict validation/file limits but has no durable rate limiter or bot challenge. Deployment-level abuse controls must be reviewed before production traffic.
- The consultation migration is applied and the server-only service role is configured locally. The remote consultation tables and private bucket are empty; live request creation, owner review, and provider-failure cleanup remain unverified because this reconciliation pass intentionally submitted no request.
- All five checked-in migrations match the linked demo project's remote migration history. Actual remote column probes confirm both placement models, FAQ, and consultation tables exist.
- The client supplied a dedicated 1536×1527 circular bird source. A non-destructive 1440px square crop, reduced to a 256px development asset, now fills the existing navbar seal without changing header dimensions or replacing the MGM.TATZ wordmark.
- The batch client, metadata edit, placement mutation, and unpublish compensation path passed static/type/unit/build checks but were not exercised with an authenticated live owner session in this pass.
- Five additional client artwork sources (`11.jpg`–`15.jpg`) are locally available but remain outside the repository and Supabase. They were not hardcoded or copied as fallback fixtures; authenticated draft ingestion remains pending the development migration and owner session.

## Current milestone

The linked demo backend is migration-aligned and contains one matching owner, 14 intact published/gallery-visible portfolio records, four Hero placements, four Drawings placements, two active FAQs, and the three correctly classified Storage buckets. The project owner reports the authenticated owner/admin workflows have been exercised successfully. The next leverage point is Vercel demo configuration followed by deployed smoke testing.

## Pre-launch repository audit — 2026-08-20

- Removed the tracked rollback patch and unused duplicate `app/HomePage.tsx`; `app/page.tsx` remains the sole public Home implementation.
- Removed two unreachable legacy portfolio actions, one superseded unpaginated gallery query, and CSS used only by the retired inline admin placement form.
- Tracked-file secret scanning found environment names and documented placeholders only. The service-role and Mailchimp values remain server-only boundaries.
- The five checked-in migrations remain the canonical ordered schema history. No migration or external state was changed during the audit.
- Production launch remains gated by migration/environment reconciliation, live owner/RLS/storage checks, abuse controls for public write endpoints, and final client-approved content/contact values.

## Production hardening — 2026-08-20

- Application responses now declare a Next-compatible CSP, MIME sniffing protection, strict-origin referrer policy, restricted browser capabilities, frame denial, and HTTPS-only HSTS; framework disclosure is disabled.
- Newsletter and consultation writes share honeypot and timing friction. Durable rate limiting remains a host/edge requirement because process-memory counters are not reliable on serverless infrastructure.
- Development portfolio and FAQ fixtures are no longer eligible when `NODE_ENV=production`; missing Supabase configuration fails closed to empty managed surfaces rather than presenting mock records.
- `docs/PRODUCTION_READINESS.md` is the canonical environment, migration reconciliation, acceptance-test, and client-content handoff checklist.

## Linked Supabase reconciliation — 2026-08-20

- Linked project `tpcnrgvdaysoavepptba` reports healthy. Local and remote histories match all five migrations; none was applied in this pass.
- Read-only CLI statistics and API probes confirm the intended tables/columns, one allowlisted owner matching the sole Auth user, 14 preserved portfolio/media records, complete independent four-slot Hero/Drawings state, two active FAQs, and empty consultation tables.
- Storage inspection confirms private `portfolio-drafts`, public `portfolio-media`, and private `consultation-intake` buckets with the intended size/type limits. A sampled published object returned 200 anonymously; no draft object existed for a direct private-object denial check.
- Anonymous reads returned only active FAQs and published portfolio state; consultation endpoints rejected anonymous reads. Authenticated mutations were not independently rerun by the agent, but the project owner reports the owner/admin acceptance workflows succeeded.

## Gallery paging and hero signup correction — 2026-08-16

- `/work` now treats type, style, sort, and page as validated URL state. A filter-identical exact head count determines the valid page, then the server requests only that page's six portfolio rows.
- Numbered Previous/Next pagination preserves active filters; changing a filter resets to page one, and out-of-range URLs redirect to the last valid page.
- The shared newsletter action/component remains canonical. Its hero instance now presents only the gold `Stay notified` label; the footer retains the Studio Notes context and default Email Address label.

## Compact gallery filters and mobile navigation — 2026-08-16

- Public Gallery controls now live in a sticky, initially collapsed disclosure. Opening and closing it preserves the URL-backed type, style, sort, and page model; the expanded controls use a compact single-row treatment with contained horizontal scrolling on narrow screens.
- The desktop primary navigation remains inline. At the existing mobile breakpoint it is replaced by a Menu disclosure containing the same four destinations, with link-selection, Escape, and outside-pointer dismissal.

## Sticky mobile hamburger correction — 2026-08-20

- The later mobile `position: relative` regression is removed; the canonical sticky header now remains `top: 0` with its existing page-navigation stacking level.
- Mobile navigation uses a 46px circular, CSS-drawn three-line hamburger with state-specific accessible labels. Its dropdown is an explicit single-column list; desktop navigation remains unchanged.

## Hero newsletter modal — 2026-08-20

- The Hero's inline newsletter presentation is replaced by a compact secondary Subscribe trigger. The trigger opens a native modal containing the canonical shared `NewsletterSignup`; the footer instance and newsletter server action remain unchanged.
- The modal uses native focus containment plus explicit Escape, close-button, backdrop, scroll-lock, and trigger-focus-restoration behavior.
