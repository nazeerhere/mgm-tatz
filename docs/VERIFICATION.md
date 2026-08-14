# Client Website A — Verification Contract

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
