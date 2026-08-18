# Client Website A — Trajectory

## 2026-08-16 — Gallery pagination and Hero newsletter

- Added six-item client pagination after existing Gallery filtering/sorting, with clamped boundaries and resets on Type, Style, and Sort changes.
- Made the existing control surface sticky below the responsive site header without changing filter design or lightbox behavior.
- Reused the shared NewsletterSignup in the Hero with explicit instance IDs and compact responsive styling; no newsletter action or provider logic was duplicated.

## 2026-08-16 — Compact public footer

- Reduced the shared desktop footer from 521px to 256px and mobile from 1113px to 517px in measured production renders.
- Removed six repeated internal destinations and retained the newsletter, identity, location descriptor, helper copy, and accessible controls.
- Added isolated optional public hooks for Instagram, TikTok, and email without inventing client destinations.

## 2026-08-16 — Subtractive charcoal boundary compositing

- Replaced masked paper-colored boundary overlays with masked charcoal extensions on both dark-to-paper and paper-to-dark joins.
- Transparent mask regions now reveal the existing paper background, grain, and rotated grid directly.
- Desktop and exact mobile inspection confirmed continuous grid visibility through revealed areas and no page overflow.

## 2026-08-16 — Compact homepage slot editors

- Replaced the permanent assignment inventories with on-demand pickers inside the four Hero and four Drawings cards.
- Preserved the existing placement actions, atomic database functions, authorization, schema, and public behavior.
- Production CSS instrumentation confirmed four desktop columns, one mobile column, bounded picker height, and no page overflow.

## 2026-08-16 — Four-slot homepage drawings

- Removed the immediately preceding generalized drawings-membership migration and its automatic homepage paragraph styling.
- Added four drawing slots that parallel the existing hero slot interaction while storing separate drawing placement fields on canonical portfolio rows.
- Hero placement, Gallery visibility, media ownership, and the pre-migration public fallback remain independent and unchanged.
- The replacement migration is checked in but unapplied; no authenticated placement mutation or external service change was performed.

## 2026-08-16 — Admin architecture and managed FAQ

**Objective**

Replace the single long-form portfolio desk with a compact owner dashboard and focused Portfolio, Homepage, Gallery, and FAQ management views without duplicating canonical media.

**Changes**

- Added a shared responsive admin shell with active navigation, dashboard counts, quick actions, dense portfolio rows, visual homepage slots, and independent Gallery visibility controls.
- Reused `portfolio_items.show_in_gallery`, `featured`, and `homepage_order`; dedicated actions preserve the other surface state when one placement changes.
- Added one `faqs` table migration, owner CRUD actions, explicit delete confirmation, active/order controls, and active-only public rendering with migration-safe fallback content.

**Verification boundary**

- Static validation, schema tests, build, anonymous route redirects, and responsive browser inspection are local evidence. No migration was applied and no authenticated live mutation was performed in this checkpoint.

**Drift check**

No media ownership tables, analytics, roles, dependencies, external services, deployment, or public FAQ redesign were introduced.

## 2026-08-14 — Consultation paper and tone refinement

**Objective**

Correct the overly bright consultation sidebar and make the approved sketchbook-paper treatment materially visible without changing the form or consultation flow.

**Changes**

- Replaced the consultation sidebar's global ivory base and strong white highlight with a dedicated muted taupe paper token and restrained tonal variation.
- Added a full-panel, non-repeating SVG surface with broad paper variation, fine grain, and softened irregular fiber tooth. The consultation charcoal edge uses the same taupe so the join does not flash back to ivory.
- Removed the straight desktop divider and faded/repositioned the mobile tiger treatment so artwork and paper dissolve into the existing organic charcoal boundary without a rectangular seam.

**Verification boundary**

- Production renders were inspected at 1440×1000 and exact 375×812 CSS pixels after both the initial and corrected texture passes. The first directional-fiber version was rejected as fabric-like and softened before final verification.
- Final instrumentation reports the paper asset loaded at both widths, computed taupe `rgb(196, 178, 148)`, sticky-header top `0`, no horizontal overflow, and no browser exception.

**Drift check**

Only consultation presentation CSS, one dedicated visual asset, and project memory changed. Form fields, validation, actions, Supabase, auth, Storage, portfolio publishing, routes, and external resources remain unchanged.

## 2026-08-14 — Consultation presentation refinement

**Objective**

Bring the existing consultation-request route into the approved parchment/charcoal split composition without changing its server action, private persistence architecture, or booking boundary.

**Changes**

- Rebuilt only the consultation presentation around a light branded information/process sidebar and a dark numbered 01–05 form panel.
- Retained every required backend field, added a visible optional Instagram input through the existing notes payload, and added an explicit request-not-booking acknowledgement without changing the database contract.
- Added a dedicated non-repeating charcoal panel-edge mask, subtle paper and linework treatments, responsive stacked layout, and a gold editorial submission treatment.

**Verification boundary**

- Formatting, zero-warning lint, strict types, all 27 tests, and the production build pass.
- Instrumented production renders at 1440×1000 and exact 375×812 CSS pixels confirm the desktop split, mobile single column, five numbered sections, sticky header, comfortable controls, local previews, and no horizontal overflow or browser exception.
- Only invalid/acknowledgement validation was exercised in the final visual check. No valid request, supplied artwork, personal data, database row, Storage object, or external write was submitted during this pass.

**Drift check**

No consultation server action, Supabase table, Storage policy, authentication, portfolio publishing path, newsletter behavior, route inventory, or external account changed.

## 2026-08-14 — Consultation-request vertical slice

**Objective**

Add a calm public project-request flow that gathers enough information for artist review without becoming a booking engine or weakening the verified portfolio boundaries.

**Changes**

- Added `/consultation` and routed shared consultation navigation and CTAs to it while retaining the homepage `#consult` destination.
- Added the requested ordered, accessible form with inline validation, value preservation, bounded image previews/removal, and an explicit request-only confirmation state. Phone remains optional; email is the primary required contact channel.
- Added a validated server action, dedicated consultation tables, a private intake bucket, strict file count/type/size/signature checks, and partial-failure cleanup. Public visitors receive no direct Supabase table or object permission.
- Added a server-only service-role environment boundary and focused validation/schema tests. No Calendly, booking, payment, portfolio, newsletter, or admin feature was added.

**Verification boundary**

- Local formatting, lint, strict types, tests, production build, route checks, and whitespace review pass. Instrumented 1440×1000 and exact 375×812 renders confirm sticky navigation, responsive two-/one-column form behavior, comfortable controls, upload previews, and no horizontal overflow.
- Required and malformed-email errors were observed with entered values retained. A fully valid synthetic submission reached the server action and returned the intended safe unavailable state because the service-role key and consultation migration are not configured locally.
- Database insertion, private object persistence, owner retrieval, cleanup under a provider failure, and a future Calendly handoff remain unverified live.

**Drift check**

The slice adds only consultation intake. Existing portfolio authentication, RLS, publishing actions, public gallery behavior, newsletter integration, client media, and external accounts remain unchanged.

## 2026-08-14 — Navbar identity asset and supplied batch intake

**Objective**

Use the newly supplied circular bird artwork for the existing navbar seal and ingest the five supplied portfolio images only through the real private-draft pipeline.

**Changes**

- Cropped `10.jpg` non-destructively to the circular composition's clean square bounds, reduced it to a crisp 256px JPEG, and placed it in the unchanged navbar seal with the MGM.TATZ wordmark preserved.
- Kept `11.jpg`–`15.jpg` outside application content. They were not hardcoded or copied into the development fallback because the approved path is authenticated Supabase draft ingestion.

**Verification boundary**

- Desktop 1440×1000 and exact 375×812 CSS renders show the bird centered and fully clipped within the existing seal, the MGM.TATZ wordmark intact, the sticky header unchanged in height, and no horizontal overflow. The optimized image completed at both widths.
- Formatting, zero-warning ESLint, strict TypeScript, all 19 tests, and the production build pass.
- The live artwork upload is blocked on two explicit prerequisites: applying the checked-in placement migration and providing an authenticated owner session. No credential, RLS bypass, direct unauthenticated write, or alternative content path was introduced.

**Drift check**

Only the logo asset/presentation and decision-relevant project memory changed. Portfolio architecture, auth, RLS, Storage, publishing, public queries, newsletter behavior, routes, and external resources remain unchanged.

## 2026-08-14 — Practical portfolio administration expansion

**Objective**

Expand the existing owner-only portfolio desk into a bounded content-management surface while preserving the verified auth, private-draft, explicit-publish, Storage, RLS, and editorial `/work` architecture.

**Changes**

- Replaced the single-image create form with a client-side multi-file batch preparer: previews, per-file removal, generated editable title/alt text, shared type, and independent selected/uploading/success/error states. Each file calls the existing private-draft pipeline separately, so a failed image does not roll back successful siblings.
- Added owner-only metadata editing and unpublish-to-private-draft controls. Bulk drafts use a recognizable temporary description and cannot publish until the owner replaces it with reviewed metadata.
- Added a follow-up migration with independent gallery visibility, four unique ordered homepage slots, validity constraints, migration backfill, and an owner-gated atomic placement function.
- Switched Home's artwork rail to up to four real published/featured rows ordered by slot, retaining four development cards only when Supabase is unavailable. `/work` now filters `published` plus `show_in_gallery`; legacy-compatible public reads preserve availability until the migration is applied.
- Expanded the admin list to expose publication state, gallery visibility, homepage slot, metadata editing, placement changes, and unpublish behavior.

**Verification**

- `npm run format:check`, zero-warning ESLint, strict TypeScript, all 19 tests, production build, and whitespace diff checks pass.
- Built public routes `/`, `/work`, `/about`, `/faq`, and `/admin/login` return 200. Anonymous `/admin` and `/admin/portfolio/new` retain 307 redirects to `/admin/login`.
- Instrumented browser evidence at 1440×1000 and exact 375×812 CSS viewports confirms four fallback hero cards across desktop, an internal mobile rail, sticky-header top position after scroll, and no page-level horizontal overflow. The configured development project currently returns two homepage-featured items, and Home renders only those two without placeholders.
- Live authenticated batch upload, invalid-file isolation, new placement controls, and unpublish were not observed because the follow-up migration was not applied and no authenticated owner session was available in this pass.

**Drift check**

No auth provider, base RLS policy, bucket policy, existing publish action semantics, public gallery presentation component, Mailchimp behavior, dependency, external account, deployment, or remote changed. The requested bird logo remains blocked by the absence of a usable source asset.

## 2026-08-14 — Supporting-page and newsletter footer polish

**Objective**

Polish `/about`, `/faq`, and the shared footer presentation while preserving content, native disclosure accessibility, newsletter behavior, and all backend boundaries.

**Changes**

- Moved the existing newsletter component from its standalone homepage band into a prominent site-wide footer column; the server action, validation, provider handling, environment contract, and success/error states are unchanged.
- Reorganized the footer's valid destinations into Studio, Explore, and Plan groups, omitted unavailable social/contact destinations, and strengthened hierarchy, spacing, borders, form treatment, and mobile touch targets.
- Refined About proportions and copy rhythm without changing the corrected portrait transform or approved content. Refined FAQ spacing, open-state surface, separators, typography, indicator treatment, and answer line height without replacing native disclosures.
- Preserved Home's short `/faq` preview and removed no homepage About content.

**Verification**

- Production renders at 1440×1000, 1024×900, and exact 375×812 confirm balanced desktop/tablet footer columns, a clean mobile newsletter/navigation stack, 48px submit control, 44px footer links, corrected About imagery, and no horizontal overflow.
- A focused FAQ summary opens from browser Space-key input. The relocated newsletter form returns “Enter a valid email address.” for invalid input, and the browser records no console errors or uncaught exceptions.
- Footer links resolve only to `/about`, `/work`, `/faq`, `/#drawings`, `/#process`, and `/#consult`; the unique public paths return 200. Home retains one short FAQ preview and no duplicate disclosure list.
- Formatting, zero-warning ESLint, strict TypeScript, all 14 tests, production build, and whitespace diff checks pass.

**Drift check**

No newsletter action/provider logic, Supabase client, authentication, schema, migration, RLS, Storage, gallery, publishing action, admin behavior, dependency, external account, or deployment changed.

## 2026-08-14 — About, FAQ, and footer supporting-page checkpoint

**Objective**

Create dedicated About and FAQ destinations and clarify shared navigation without redesigning the established site or changing product/backend behavior.

**Changes**

- Added static App Router routes at `/about` and `/faq`; both reuse centralized, already-approved homepage content rather than inventing biography, policy, studio, or contact claims.
- Added keyboard-operable native FAQ disclosures for the two existing forthcoming-information states and reduced Home's FAQ area to a clear preview link.
- Routed primary About/FAQ links to the new pages and expanded the shared footer into responsive Studio, Work, and Plan columns containing only real destinations.
- Reused and non-destructively reframed the supplied Miles portrait on the About page; a first rendered crop exposed source overlay text and was tightened before completion.

**Verification**

- `/`, `/about`, `/faq`, `/work`, and `/admin/login` return 200 from the production server; anonymous `/admin` retains its 307 login redirect.
- Browser checks at 1440×1000 and exact 375×812 CSS viewports confirm responsive supporting-page/footer grids, loaded About imagery without source overlay chrome, working route targets, no horizontal overflow, and no console exceptions.
- The second FAQ disclosure was focused and opened through a real Space-key browser input. Home contains the short `/faq` preview and no duplicate disclosure list.
- Formatting, zero-warning ESLint, strict TypeScript, all 14 tests, and the production build pass.

**Drift check**

No Supabase client, authentication, schema, migration, RLS, Storage, gallery query/presentation, upload/publish action, admin route, Mailchimp behavior, dependency, external account, or deployment changed.

## 2026-08-14 — Mailchimp newsletter vertical slice

**Objective**

Add a compact homepage newsletter signup for promotions, availability, flash drops, and artist news without creating CRM scope or changing the verified portfolio system.

**Changes**

- Added an ivory newsletter band immediately before the final consultation CTA with a responsive email form, pending label, validation/error state, and success state.
- Added a public Next.js server action that trims and lowercases email addresses before a server-only Mailchimp Marketing API request.
- Added graceful handling for Mailchimp's `Member Exists` response and generic non-sensitive messages for provider/configuration failures.
- Added placeholder environment names for the Mailchimp API key, server prefix, and audience ID. No credential, Mailchimp resource, subscriber table, dependency, campaign, popup, analytics, SMS, or adjacent marketing feature was added.

**Verification**

- Seven newsletter tests cover empty/invalid input, normalization, valid request construction, success-state mapping, already-subscribed handling, provider errors, and server-action messaging; all 14 repository tests pass.
- With Mailchimp intentionally unconfigured, browser submission of a valid address reached the server action and returned the safe unavailable message; invalid input returned the specific validation message.
- Desktop 1440×1000 and exact 375×812 screenshots confirm the section order, restrained scale, single-column mobile controls, 48px mobile submit target, and no horizontal overflow.
- `/` and live-data-backed `/work` return 200; gallery and publishing tests remain green. Formatting, zero-warning ESLint, strict TypeScript, and production build pass.

**Drift check**

No Supabase table, migration, RLS policy, Storage bucket/policy, auth, admin, gallery, upload/publish action, dependency, external account, or Mailchimp resource changed.

## 2026-08-14 — Public tattoo portfolio refinement

**Objective**

Make `/work` the primary public tattoo portfolio page without changing the verified Supabase publishing path or adding adjacent product features.

**Changes**

- Replaced the fixed crop-card presentation with a responsive editorial grid that keeps each image's natural aspect ratio and introduces only a restrained stagger at larger widths.
- Added a focused native-dialog view with `contain` media, title, category, optional description, Escape/backdrop close, and an explicit “Back to gallery” control.
- Unified live and development-fallback display through one presentation component while leaving the server-side published-only query and live-data precedence unchanged.
- Removed body placement and availability labels from the public cards; no filter, search, pagination, engagement, newsletter, booking, or admin feature was added.

**Verification**

- The configured `/work` route returned 200 and rendered two live Supabase items with no development fallback marker.
- An anonymous live REST query returned two published rows and zero draft rows under RLS.
- Desktop and exact 375px browser checks confirmed two-column live layout, single-column mobile layout, preserved aspect ratios, no horizontal overflow, 52px mobile view targets, focused `contain` media, and successful Escape and explicit-button close paths.
- Formatting, zero-warning ESLint, strict TypeScript, all 7 tests, and production build pass.

**Drift check**

No authentication, RLS, Storage policy, upload/publish action, database schema, admin route, public query, dependency, or external resource changed.

## 2026-08-13 — Live Supabase publishing checkpoint

**Objective**

Record the successful development-project publishing path without changing application behavior or adding features.

**Observed live flow**

- Nazeer signed in through password-based owner authentication.
- Nazeer uploaded an image and saved it as a private draft.
- The unpublished draft was confirmed absent from `/work`.
- Nazeer explicitly published the item.
- The published item was confirmed visible on `/work`.

These observations verify the user-visible owner login → upload → private draft → publish → public gallery vertical slice. They do not independently prove unobserved internal row/object transitions, direct anonymous draft-object denial, or rejection of a valid non-owner account.

**Changes**

- Updated only canonical project-memory documents to distinguish the newly observed live path from remaining verification gaps.
- Added no feature, dependency, migration, configuration, route, backend, or visual change.

**Drift check**

Documentation-only checkpoint. Supabase architecture, auth, schema, Storage, RLS, publishing logic, application code, routes, client content, deployment, and remote configuration are unchanged.

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

## 2026-08-15 — Homepage paper, route memory, and gallery controls

**Objective**

Implement the next bounded visual/navigation/gallery patch without redesigning shared chrome or changing publication semantics.

**Changes**

- Refined the dedicated homepage sketchbook treatment behind only the three Home paper sections. Paper tone/fibers remain in the non-repeating SVG, while an independent graph layer combines darker 60px primary cells with lighter 12px subdivisions. The regular square plane is centered at `180% × 220%` and transformed with `rotate(-25deg) scale(1.1)` so it leans left without corner gaps.
- Added pathname-keyed, tab-session scroll memory. A stable listener records internal navigation before Next changes routes, and layout-phase restoration avoids the old-listener/new-path race observed in the first implementation.
- Added compact Type, Style, and Featured/Newest controls to the existing `/work` gallery. Live items reuse `created_at`, `featured`, `display_order`, and the existing style-tag relation; local fallback items use explicit manifest tags rather than filenames.
- Preserved the existing consultation artwork and form, setting only the requested `325vh` desktop minimum and natural mobile minimum.

**Verification and correction**

- Direct paper captures exposed that percentage insets on the absolutely positioned CSS-grid pseudo-element collapsed its painted box to roughly `142 × 67px`; the transform existed but nearly all lines vanished. Explicit centered width/height replaced that fragile inset geometry. Final desktop and exact-375px renders visibly show both grid levels, the counterclockwise plane, clipped coverage, readable text, and zero horizontal overflow.
- Interactive tracing found and fixed a route-listener lifecycle race that initially mixed restored Home coordinates into `/work`.
- A missing `app/page.tsx` working-tree file was detected during strict checking and recovered from the immediately preceding production source map, preserving its uncommitted implementation rather than replacing it with the Git baseline.
- Final exact-375px instrumentation confirmed route-separated positions, back/forward restoration, filter combinations, empty state, sorting, sticky navigation, responsive consultation sizing, and zero page overflow.

**Drift check**

No header/footer redesign, auth, owner model, RLS, Storage, upload/publish action, Mailchimp, consultation field, booking, deployment, commit, or external resource changed.
