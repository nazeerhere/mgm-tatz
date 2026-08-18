# Client Website A — Verification Contract

## Gallery pagination, sticky filters, and Hero newsletter — 2026-08-16

- A 14-item production Gallery rendered six tiles on pages 1 and 2 and two on page 3. Previous was disabled on page 1; Next was disabled on page 3. Sort and Type changes from later pages returned to page 1, and a Tattoo + Anime/Manga combination retained the existing empty state.
- A current-page tile opened and closed the existing native-dialog lightbox. Unit coverage also verifies six-or-fewer, empty, invalid-page clamping, and filtering/sorting before pagination.
- At 1440×1000, the sticky controls aligned exactly with the 64px header bottom. At exact 375×812, the controls aligned below the 81.77px responsive header, occupied 187.28px, retained horizontally scrollable Style choices, and produced no page overflow.
- Home rendered exactly two shared newsletter forms (Hero and Footer) with distinct deterministic email/status IDs. Hero email and submit controls measured 44px at exact mobile width, remained horizontal and secondary to the consultation CTA, and produced no overflow. No subscription was submitted.
- `npm run format:check`, zero-warning `npm run lint`, strict `npm run typecheck`, all 46 tests, `npm run build`, and `git diff --check` pass.

## Compact public footer — 2026-08-16

- Production instrumentation measured the desktop footer at 521.375px before and 256.406px after (49.2%). Exact 375×812 measurement changed from 1112.703px to 517.313px (46.5%). Neither viewport had horizontal overflow.
- Desktop and exact mobile footer captures were inspected. The final layout is vertically balanced, retains the editorial palette/type hierarchy, and has no large dead area. Mobile stacks newsletter and identity cleanly.
- The footer contains no navigation groups or repeated About, Work, FAQ, Drawings, Process, or Consultation links. Instagram, TikTok, and Email each retain a 44px minimum target; absent configuration renders a non-clickable “Link forthcoming” state.
- Newsletter markup, action, helper copy, and Mailchimp integration tests remain intact. Submit controls measured 44.34px desktop and 48px mobile.
- `npm run format:check`, zero-warning `npm run lint`, strict `npm run typecheck`, all 42 tests, `npm run build`, and `git diff --check` pass.

## Homepage charcoal-mask compositing — 2026-08-16

- CSS inspection and a focused regression test confirm both boundary directions compute with `var(--ink)`, extend outside the dark section, and contain no paper-colored transition fill.
- Production screenshots at 1440×1000 and calibrated 375px mobile width show the rotated fine/major grid continuing through visually revealed paper at Hero→Drawings, Drawings→About, About→Specialties, Specialties→FAQ, FAQ→Process, and Process→Consultation joins.
- Visual inspection found no flat paper patches, hard rectangular seams, detached dark blobs, long brush strokes, 1px lines, or clipped contours. The erosion remains irregular and connected to charcoal.
- Exact instrumentation measured `clientWidth === scrollWidth` at 1440×1000 and 375×812. Mobile computed both transition directions as `rgb(12, 12, 11)` with the erosion mask loaded; the grid retained its approved rotated transform.
- `npm run format:check`, zero-warning `npm run lint`, strict `npm run typecheck`, all 41 tests, `npm run build`, and `git diff --check` pass.

## Compact homepage slot editors — 2026-08-16

- Source checks confirm two four-slot grids, per-card Change disclosures and occupied-card Clear forms, with no permanent assignment inventory.
- `npm run format:check`, zero-warning `npm run lint`, strict `npm run typecheck`, all 40 tests, `npm run build`, and `git diff --check` pass.
- Production CSS instrumentation with a non-persistent eight-card fixture measured four columns at 1440×1000 and one 309px column at an exact 375×812 viewport. All eight Change controls were present, an opened picker was bounded to 256px, and both viewports had zero horizontal overflow.
- Authenticated selection, replacement, and Clear submissions were not executed; owner authentication was not bypassed and no database or external service was mutated.

## Four-slot homepage drawings — 2026-08-16

- Verification covers removal of the generalized migration and automatic paper-paragraph selector, four-slot validation/constraints, owner-gated replacement, public fallback rendering, and independence from hero/Gallery fields.
- `npm run format:check`, zero-warning `npm run lint`, strict `npm run typecheck`, all 39 tests, `npm run build`, and `git diff --check` pass.
- Production renders were inspected at 1440×1000 and an exact 375×812 CSS viewport. At mobile size `clientWidth` and `scrollWidth` both measured 375px. Homepage paper paragraphs computed with transparent backgrounds, zero borders, and zero added padding, confirming the reverted paragraph-box rule is absent.
- Public `/` and `/faq` returned 200. Anonymous `/admin`, `/admin/homepage`, `/admin/gallery`, and `/admin/faq` returned 307 redirects to `/admin/login`.
- Before the replacement migration is applied, the public rail intentionally retains the established five-item development fallback. Configured database results are capped at four ordered managed slots; there is no fifth managed slot.
- Authenticated drawing-slot mutations remain unobserved without applying the replacement migration and using an owner session.

## Admin management and managed FAQ — 2026-08-16

- Added focused tests for FAQ validation and migration security shape alongside the existing portfolio placement invariants.
- Local verification observed formatting, zero-warning lint, strict TypeScript, 34 passing tests, and a successful production build. Public `/`, `/work`, `/faq`, `/about`, `/consultation`, and `/admin/login` returned 200; anonymous requests to all five owner management routes returned 307 to `/admin/login`.
- The owner-login page was inspected at 1440×1000 and an exact calibrated 375×812 CSS viewport. The public fallback FAQ was inspected at the exact mobile viewport with ordered disclosures and no observed page overflow. Authenticated management-shell rendering remains unobserved without an owner browser session.
- Live owner login, Storage upload/promotion, portfolio mutations, FAQ mutations, and FAQ migration application remain outside this local checkpoint and must not be inferred from static checks.

## Consultation paper and tone refinement — 2026-08-14

- The final production render computes the consultation sidebar at `rgb(196, 178, 148)` and loads `/consultation-paper.svg` as a non-repeating full-panel pseudo-element at opacity `0.68` on desktop and mobile.
- Visual inspection at 1440×1000 confirms a muted parchment/taupe sidebar, readable dark text, subtle broad tonal variation and paper tooth, a charcoal form panel, and an irregular vertical join without the previous straight divider.
- Exact 375×812 CSS inspection confirms one 343px form column, the tiger artwork fading into the paper before the subtractive horizontal charcoal edge, no hard artwork rectangle, and no horizontal overflow.
- The first texture render exposed excessive directional striation that risked reading as linen/fabric. Its fiber frequency and opacity were reduced before the final captures; the corrected result retains visible paper variation without strong speckling or grunge.
- No form field, validation rule, route, action, schema, external service, or valid submission changed during this pass.

## Consultation presentation refinement — 2026-08-14

- `npm exec prettier -- --check app/consultation/page.tsx components/consultation-form.tsx app/globals.css`, zero-warning `npm run lint`, strict `npm run typecheck`, all 27 tests, and `npm run build` pass.
- Instrumented 1440×1000 production rendering reports a 414.7px parchment sidebar and 1025.3px charcoal panel, two 340.7px field columns, five numbered sections, sticky-header top `0`, a loaded dedicated vertical edge mask, no browser exception, and no horizontal overflow.
- Exact 375×812 CSS rendering reports `innerWidth = 375`, one 343px field column, 56.8px minimum text/select controls, sticky-header top `0`, the responsive subtractive edge mask, no browser exception, and no horizontal overflow.
- The parchment intro, four-step process, subdued tiger artwork, panel heading, contact/preferences/upload/final sections, CTA, and panel boundary were inspected in viewport captures. The mobile straight border was removed after inspection so the charcoal mask is the sole panel transition.
- Empty submission returns the existing full-name error. A complete synthetic field set without acknowledgement focuses and marks the acknowledgement control invalid. Three synthetic local image previews render with 44px remove controls. No valid request was submitted and no external write was attempted in this visual pass.
- The visual pass does not claim live database insertion, private object persistence, or owner review. Those remain subject to the existing consultation integration gate below.

## Consultation request slice — 2026-08-14

- Focused tests cover trimming and lowercase email normalization, optional phone handling, required-field and malformed-email rejection, select allowlists, five-reference maximum, image signature validation, and the dedicated private schema/policy shape.
- Instrumented production rendering at 1440×1000 reports two 588px form columns, sticky-header top `0` after scroll, two upload controls, and no horizontal overflow.
- Exact 375×812 CSS rendering reports `innerWidth = 375`, one 343px form column, sticky-header top `0`, minimum text/select control height about 52.8px, and no horizontal overflow. Upload-preview remove controls were increased to a 44px minimum after the first measurement exposed a 35.2px target.
- Empty submission returns “Full name is required.” and marks the associated control invalid. A malformed email returns “Enter a valid email address.” while preserving the entered name and tattoo idea.
- Two generated reference PNGs and one generated body-area PNG produce three local previews with remove controls. No client image or real personal data was used in this behavior test.
- A fully valid synthetic request reaches the server action. With `SUPABASE_SERVICE_ROLE_KEY` absent, it returns the non-sensitive unavailable state, retains the form and all three previews, and produces no browser exception.
- Production route checks return 200 for `/`, `/work`, `/about`, `/faq`, `/consultation`, and `/admin/login`; anonymous `/admin` retains its 307 redirect to `/admin/login`.
- `npm run format:check`, zero-warning `npm run lint`, strict `npm run typecheck`, all 27 tests, `npm run build`, and `git diff --check` pass on the final tree.
- Live insertion and private Storage persistence are not claimed. They require applying `202608140002_consultation_requests.sql` and securely configuring the server-only service-role value.

## Navbar identity and supplied batch intake — 2026-08-14

- Source inspection confirms `10.jpg` is 1536×1527 and the five portfolio sources are accessible JPEGs ranging from 1251–1536px wide and 1441–1536px high.
- The navbar asset is a 256×256 JPEG generated from a centered 1440×1440 crop. The source files remain unchanged.
- Instrumented 1440×1000 rendering reports a loaded optimized logo inside a 37.6×37.6px seal, sticky-header top `0` after scroll, and no page-level horizontal overflow. Exact 375×812 rendering reports a loaded logo inside a 28.8×28.8px seal, sticky-header top `0`, document/body width `375`, and no horizontal overflow. Both screenshots show the full circular composition and unchanged wordmark.
- `npm run format:check`, zero-warning `npm run lint`, strict `npm run typecheck`, all 19 tests, and `npm run build` pass.
- `11.jpg`–`15.jpg` were not uploaded: the application has only publishable Supabase configuration and the owner UUID, not an authenticated owner session, and the required placement migration remains unapplied. No live-upload claim is made.

## Practical portfolio administration expansion — 2026-08-14

- `npm run format:check` passes.
- `npm run lint` passes with zero warnings.
- `npm run typecheck` passes under strict TypeScript.
- `npm test` passes all 19 tests. New coverage checks filename-derived batch metadata, valid/invalid four-slot parsing, all requested independent surface combinations, migration field/constraint/function shape, and owner-only placement mutation.
- `npm run build` compiles and completes route generation successfully. `/`, `/admin`, `/admin/login`, `/admin/portfolio/[id]`, `/admin/portfolio/new`, and `/work` remain dynamic as intended.
- Production route checks against the configured development environment: `/`, `/work`, `/about`, `/faq`, and `/admin/login` return 200; anonymous `/admin` and `/admin/portfolio/new` return 307 to `/admin/login`.
- Rendered 1440×1000 desktop evidence shows four development hero cards simultaneously without increasing the hero height or creating rail overflow. The configured environment rendered its two currently featured legacy rows and did not create placeholders.
- Instrumented exact 375×812 CSS evidence reports `innerWidth = 375`, document/body width `375`, no horizontal overflow, four fallback hero cards inside an overflowing internal rail, and sticky header top `0` after a 575px scroll. The live Home and `/work` also report no page-level horizontal overflow and sticky header top `0`.
- The configured `/work` rendered its live published content through the existing editorial gallery. The original live login → upload → private draft → publish → `/work` evidence remains the latest authenticated publishing observation.
- Not observed in this pass: applying `202608140001_portfolio_surface_placement.sql` to the development project; authenticated multi-file ingestion; mixed valid/invalid batch behavior against Storage; metadata edit persistence; gallery/homepage toggle persistence; slot displacement; unpublish object promotion reversal; direct row/object inspection; and the absent circular bird logo asset.
- The first attempted Chromium “375” screenshot calibrated to 502 CSS pixels and was rejected as evidence. Final mobile claims use the instrumented `Emulation.setDeviceMetricsOverride` result at exactly 375 CSS pixels.

## Supporting-page and newsletter footer polish — 2026-08-14

- At 1440×1000, the footer renders a 620px newsletter column and 561px directory column, with three organized navigation columns and one newsletter form. About and FAQ retain controlled two-column editorial layouts.
- At 1024×900, the footer remains a balanced 392px/448px split with three readable directory columns; About remains a 406px/516px split. No horizontal overflow was observed.
- At an exact 375×812 CSS viewport, supporting pages and footer use one column. The newsletter field and button are each 338px wide, the submit control is 48px high, footer link targets are 44px high, and no horizontal overflow was observed.
- The final About renders preserve the corrected source crop without story/interface overlays. The FAQ's second closed summary was focused and opened through browser Space-key input while focus remained on `SUMMARY`.
- The relocated newsletter form returns “Enter a valid email address.” for malformed input. Home contains no obsolete newsletter band, retains the `/faq` preview, and shares the one footer form.
- Footer destinations are `/about`, `/work`, `/faq`, `/#drawings`, `/#process`, and `/#consult`; unique public routes return 200. `/admin/login` returns 200 and anonymous `/admin` retains its 307 login redirect.
- The browser recorded no console errors or uncaught exceptions. `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test` (14/14), `npm run build`, and `git diff --check` pass.

## About, FAQ, and footer supporting pages — 2026-08-14

- Production HTTP checks return 200 for `/`, `/about`, `/faq`, `/work`, and `/admin/login`; anonymous `/admin` returns 307 to `/admin/login`.
- At 1440×1000, About renders a two-column portrait/editorial layout, FAQ renders a two-column introduction/disclosure layout, and the footer renders a wide identity area plus three organized navigation columns. No horizontal overflow was observed.
- At an exact 375×812 CSS viewport, About and FAQ become single-column, the footer becomes one outer column with a controlled two-column link grid, the sticky header remains 82px high, and no horizontal overflow was observed.
- The supplied About portrait loaded at both widths. Initial review exposed source overlay text at the crop edge; the crop was corrected and both final renders show only the intended portrait/studio area.
- A focused closed `<summary>` opened through a browser-dispatched Space key and retained focus. Footer links resolve to `/about`, `/faq`, `/work`, `/#drawings`, `/#process`, and `/#consult`; Home's FAQ preview resolves to `/faq` and contains no duplicate disclosure list.
- The browser recorded no console errors or uncaught runtime exceptions during the route/interaction sweep.
- `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test` (14/14), `npm run build`, and `git diff --check` pass.

## Mailchimp newsletter slice — 2026-08-14

- Unit/action tests reject empty and malformed email values, normalize `Miles@Example.COM` to `miles@example.com`, and confirm a valid address produces `POST https://{server}.api.mailchimp.com/3.0/lists/{audience}/members` with server-side Basic authentication and a subscribed member body.
- A mocked Mailchimp `Member Exists` response returns a friendly already-subscribed outcome. A mocked provider failure becomes “We couldn't add you right now. Please try again later.” without returning provider detail.
- Production-browser submission confirms malformed input returns “Enter a valid email address.” A valid email reaches the server action and, because no Mailchimp environment exists, returns “Newsletter signup isn't available yet.” No external request or resource mutation occurs in that configuration.
- At 1440×1000, the section is a compact two-column ivory band before the consultation CTA with no horizontal overflow. At an exact 375×812 CSS viewport, it becomes one 338px form column with a 338×48px submit control and no horizontal overflow.
- Production `/` and `/work` return HTTP 200; `/work` remains live-data-backed. All 14 tests, including the existing publishing/schema tests, pass.
- `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass. Live Mailchimp delivery remains unverified pending the three server-only values.

## Public portfolio gallery refinement — 2026-08-14

- Configured production `/work` returned HTTP 200, rendered `classic` and `dove`, and contained no development-fallback marker.
- A read-only anonymous REST check against the development project returned HTTP 200 with two published rows and HTTP 200 with zero rows for `published = false`, confirming draft rows remain absent under the live public RLS boundary.
- Automated browser interaction at 1440×1000 confirmed a two-column live grid, natural index image treatment, no page overflow, focused-view `object-fit: contain`, scroll locking, Escape close, and explicit “Back to gallery” close.
- The exact 375×812 CSS viewport rendered one 343px gallery column with no horizontal overflow and 52px visible view targets. Index and focused-view screenshots were inspected.
- The existing development fallback still maps all local tattoo fixtures through the same presentation component and remains subordinate to configured live rows.
- `npm exec prettier -- --write` on changed files, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test` (7/7), and `npm run build` pass.
- The failed first direct SDK probe made no data mutation: Node 20 lacks the native WebSocket transport expected by that client path. The successful follow-up used read-only anonymous REST and required no dependency or configuration change.

## Live development Supabase publishing — 2026-08-13

**User-observed live evidence**

1. Password login succeeded for the owner.
2. An image upload succeeded and the item was saved as a private draft.
3. The draft was confirmed absent from `/work` before publication.
4. The owner explicitly published the item.
5. The published item was confirmed visible on `/work`.

This is successful end-to-end evidence for the user-visible development publishing slice. This checkpoint does not claim direct observation of database rows, draft-object URL denial, internal private-to-public object promotion/removal, valid non-owner rejection, or production behavior.

## First baseline checkpoint — 2026-08-13

- `npm run format`, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass; all 7 tests remain green and ESLint reports no warnings.
- Credential-free production HTTP checks return 200 for `/`, `/work`, and `/admin/login`; anonymous `/admin` and `/admin/portfolio/new` return 307 redirects to `/admin/login`.
- `/client-media/illustrative-figures-tattoo.jpg` returns 200 as `image/jpeg` with the observed 40,157-byte payload. Production HTML contains the asset on `/work`, not Home; the homepage Selected Work heading remains absent and the `/work` heading remains present.
- Desktop 1440px and validated true 375-CSS-pixel `/work` renders were inspected. The fourth tattoo uses its full vertical composition within the existing fixed gallery frame, and no content clipping was observed in the final mobile evidence.
- Ignore-rule probes confirm exclusion of `.env.local`, `.next`, `node_modules`, screenshot/browser/test reports, logs, temporary files, and TypeScript build info while `.env.example` remains includable.
- Secret-pattern review found no committed credential value. The repository has no prior commit. Its pre-existing `origin` remote was observed but was not modified or contacted.
- Live owner login, database writes, private/public Storage behavior, RLS enforcement, and publication remain outside observed evidence until the isolated development Supabase project is provisioned.

## Phase 3 observed results — 2026-08-12

- `npm run format:check` — passes.
- `npm run lint` — passes with zero warnings.
- `npm run typecheck` — passes under strict TypeScript.
- `npm test` — 7 tests pass: metadata/media validation, safe storage keys, URL encoding, bucket privacy/publicity, and owner-policy invariants.
- `npm run build` — passes; public/admin routes are dynamic and Proxy is active.
- Production HTTP without credentials — `/`, `/work`, and `/admin/login` return 200; `/admin` returns 307 to `/admin/login`.
- Browser inspection — desktop 1440×1000 and true 375-CSS-pixel mobile Home, plus mobile owner login. A first mobile capture exposed header clipping; the responsive header was corrected and rechecked.
- Login page visibly reports the unconfigured development state and disables its controls.

## Visual reference pass — 2026-08-12

- Public Home inspected at 1440×1000, tall desktop, true 375-CSS-pixel mobile, and tall mobile viewports.
- `/work` and `/admin/login` inspected at true 375 CSS pixels; a mobile admin top-clearance regression was corrected.
- The reference-driven dark/ivory section sequence, vertical media-card rhythm, About split, specialty grid, process row, FAQ/contact band, CTA, typography, borders, and spacing were observed in the production build.
- At that checkpoint, real image behavior remained unobserved; the later development-media placement checkpoint below supersedes that limitation for local fixtures while live Supabase media remains unverified.

## Development media placement — 2026-08-12

- Confirmed source dimensions for all eight JPEGs and encoded those intrinsic dimensions in the typed media manifest to reserve layout space.
- Production HTTP checks returned 200 and `image/jpeg` for every copied development asset.
- Desktop tall-page inspection confirmed all three tattoo crops, four drawing treatments, the classical composition `contain` treatment, and Miles's interface-free About crop.
- True 375-CSS-pixel tall-page inspection confirmed the horizontal hero rail, two-column selected-work/drawing layouts, portrait crop, and dark/ivory transitions without observed horizontal page overflow.
- Client media is a fallback only: when Supabase is configured and returns published rows, the existing stored-data gallery remains authoritative.

## Homepage refinement — 2026-08-12

- `npm run format`, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass; all 7 existing tests remain green.
- Built-route checks: `/` 200, `/work` 200, `/admin/login` 200, and anonymous `/admin` 307 to `/admin/login`.
- Built HTML confirms the Selected Work heading is absent on Home and retained on `/work`.
- Rendered and inspected `/` at 1440px desktop and true 375 CSS pixels, plus `/#about` at both widths and `/work` at 375 CSS pixels.
- Sticky navigation remains visible in the anchored About renders, with readable dark treatment over the dark content and the preceding ivory transition area.
- Oversized transition pseudo-elements are contained by page-level horizontal clipping; no horizontal layout spill was observed in desktop or mobile renders.
- The homepage code no longer imports or invokes the Supabase gallery query; `/work`, gallery components, publishing actions, auth, schema, Storage, and RLS files are unchanged by this refinement.

## Charcoal transition correction — 2026-08-12

- Removed the CSS gradient/mask transition stack and confirmed the dedicated transparent SVG is served as a single full-width, non-repeating asset.
- Final production renders were inspected at 1440px desktop and true 375 CSS pixels.
- The inspected boundary has uneven depth, visible scraped transparency, broken horizontal brush strokes, and isolated lower fibers without smooth blur or symmetrical repetition.
- Formatting, zero-warning ESLint, strict TypeScript, all 7 tests, and the production build pass.
- Follow-up production renders at 1440px and true 375 CSS pixels confirm the dissolve occupies approximately one-third of the boundary, tapers progressively, and leaves the remainder clean.

## Scale and rhythm refinement — 2026-08-13

- `npm run format`, zero-warning ESLint, strict TypeScript, all 7 tests, and `npm run build` pass.
- Tall desktop inspection at 1440px confirms reduced hero, drawing rail, About band, information/process rows, and final CTA proportions against the approved reference.
- Mobile breakpoint inspection confirms the corrected one-column hero/drawings/About structure, compact drawing cards and value rows, retained sticky navigation, preserved charcoal transitions, and no observed horizontal clipping.
- The initial mobile evidence exposed a cascade conflict in the new desktop grid scale; responsive one-column rules were restored and the production build was restarted before the final inspected capture.

## Subtractive boundary treatment — 2026-08-13

- Production renders at 1440px desktop and the mobile breakpoint confirm the paper-colored masked element is contained within the dark section's bottom 70–110px band.
- The previous additive dark overlay and light-section transition pseudo-elements are disabled.
- Formatting, zero-warning ESLint, strict TypeScript, 7 tests, and production build pass.
- Final desktop and mobile refinement renders confirm the continuous gray overlay and repeated horizontal strokes are absent; the visible treatment is concentrated near the lower boundary with an irregular displaced contour and sparse erosion flecks.
- Final artifact-cleanup inspection at 1440px and an exact emulated 375-CSS-pixel viewport (`window.innerWidth = 375`) confirms no detached light/gray flecks remain above the contour and no dark horizontal seam remains at the ivory boundary.

## Remaining live verification

- Rejection of a valid but non-owner account.
- Direct anonymous denial of the draft object URL.
- Direct inspection of the corresponding item/media rows and the private-to-public Storage promotion/removal.
- Equivalent verification against a separate production project before deployment.

## Gallery paging and hero signup correction — 2026-08-16

- Final format, zero-warning lint, strict typecheck, all 47 tests, production build, and `git diff --check` pass.
- The configured 14-item public gallery rendered 6 records at `/work`, 6 at `?page=2`, and 2 at `?page=3`. `?page=999` returned a 307 redirect to `?page=3`; a combined type/style/newest URL returned 200.
- Desktop 1440×1000 and exact 375×812 CSS-pixel captures preserved the sticky controls, gallery layout, and compact numbered navigation without a page-level overflow regression. The style strip remains an intentional contained horizontal scroller on mobile.
- Rendered Home output contains one hero `Stay notified` form label and retains the footer's Studio Notes, Email Address label, helper message, and unchanged shared server action. No live newsletter submission was made.

## Compact gallery filters and mobile navigation — 2026-08-16

- Final format, zero-warning lint, strict typecheck, all 49 tests, production build, and `git diff --check` pass.
- A 1440×1000 production capture retains all four inline desktop navigation links and shows the collapsed sticky Filters row at approximately 50px tall.
- The mobile production capture at the established exact-width emulation shows only the MGM.TATZ brand and Menu control in the header, plus a separate collapsed Filters row. No clipped page-level content or horizontal displacement is visible.
- Static interaction coverage confirms both disclosures expose `aria-expanded`/`aria-controls`; mobile navigation retains all four destinations and implements link-selection, Escape, and outside-pointer dismissal. Filter disclosure state does not reset or rewrite filter selections.

## Bounded paper, route-memory, gallery-control patch — 2026-08-15

- `npm run format:check`, zero-warning `npm run lint`, strict `npm run typecheck`, all 29 tests, `npm run build`, and `git diff --check` pass on the final tree.
- Fresh-profile desktop and exact 375×812 CSS captures show separate paper and hierarchical graph layers on the three Home ivory sections. The final grid contains darker 60px primary lines and lighter 12px subdivisions in both perpendicular directions. Browser instrumentation reports a `675 × 2539.62px` mobile grid plane and `matrix(0.996939, -0.46488, 0.46488, 0.996939, -337.5, -1269.81)`, the scaled/translated equivalent of `rotate(-25deg)`. Visual inspection confirms the whole plane leans left, the paper grain remains behind it, no corners are exposed, text remains readable, charcoal boundaries stay seamless, and horizontal overflow is zero.
- Browser instrumentation at exact 375×812 reports `scrollWidth - clientWidth = 0` for Home, `/work`, and `/consultation`. The sticky header remains at top `0` after scrolling.
- A fresh tab began at Home `scrollY = 0`. The route sequence `/ → /work → /` restored Home to `1180`; returning to `/work` restored `760`; `/work → /about → /work` restored `920`; browser back restored About to `360`; browser forward restored Work to `920`. Session keys remained separated as `mgm-scroll:/`, `mgm-scroll:/work`, and route peers.
- The configured public gallery rendered nine published rows. Type controls produced three tattoos and six drawings. Drawings + Animals & Nature produced the intentional empty state. Newest changed the first item from `purple rain` to `warrior`, confirming `created_at` ordering rather than filename inference.
- Gallery filter/sort unit tests cover combined type/style matching plus Featured and Newest order. Existing publishing, newsletter, consultation, and schema tests remain green.
- At 1440×1000, `.consultation-split` computed to `3250px`, retained both upper and lower artwork elements, and had no horizontal overflow. At exact 375×812, computed minimum height was `0px` (CSS `auto`), content produced natural height, and no overflow was observed.

## Phase 3 minimum ladder

1. File and syntax inspection.
2. Repository formatting check.
3. ESLint with zero warnings.
4. Strict TypeScript check.
5. Unit tests for validation, public-query filtering, and storage-key generation.
6. Integration tests for authenticated create/publish and unauthorized rejection.
7. Production build.
8. Authentication boundary: anonymous admin access and writes rejected.
9. Persistence: upload succeeds, object exists outside the database, and metadata/media rows exist.
10. Publication: unpublished item absent publicly; published item visible from real stored data.
11. Responsive browser checks at representative mobile and desktop widths.
12. Accessibility basics: semantic headings/landmarks, labels/errors, keyboard operation, visible focus, image alternatives, and contrast.
13. Secret scan and environment-boundary review.
14. Diff review and project-memory update.

## Evidence format

Record exact commands, observed outputs, test counts, routes/statuses, relevant row/object identifiers with sensitive values redacted, and screenshot paths when visual checks are run. A configured service or written test is not evidence that the integration works.

## External verification gates

Do not claim upload, database, RLS, auth, or deployment success until a real isolated Supabase environment is provisioned and observed. Never use production client data as a test fixture without explicit permission.
