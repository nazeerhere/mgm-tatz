import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../supabase/migrations/202608120001_portfolio_publishing.sql",
  import.meta.url,
);
const placementMigrationUrl = new URL(
  "../supabase/migrations/202608140001_portfolio_surface_placement.sql",
  import.meta.url,
);
const consultationMigrationUrl = new URL(
  "../supabase/migrations/202608140002_consultation_requests.sql",
  import.meta.url,
);
const faqMigrationUrl = new URL(
  "../supabase/migrations/202608160001_managed_faqs.sql",
  import.meta.url,
);
const homepageDrawingSlotsMigrationUrl = new URL(
  "../supabase/migrations/202608160003_homepage_drawing_slots.sql",
  import.meta.url,
);
const portfolioActionsUrl = new URL(
  "../app/actions/portfolio.ts",
  import.meta.url,
);
const faqActionsUrl = new URL("../app/actions/faq.ts", import.meta.url);
const homepageQueriesUrl = new URL("../lib/queries.ts", import.meta.url);
const globalStylesUrl = new URL("../app/globals.css", import.meta.url);
const homepageAdminUrl = new URL(
  "../app/admin/homepage/page.tsx",
  import.meta.url,
);
const rootLayoutUrl = new URL("../app/layout.tsx", import.meta.url);
const footerContactUrl = new URL(
  "../content/footer-contact.ts",
  import.meta.url,
);
const portfolioGalleryUrl = new URL(
  "../components/portfolio-gallery.tsx",
  import.meta.url,
);
const siteNavigationUrl = new URL(
  "../components/site-navigation.tsx",
  import.meta.url,
);
const newsletterComponentUrl = new URL(
  "../components/newsletter-signup.tsx",
  import.meta.url,
);
const homepageUrl = new URL("../app/page.tsx", import.meta.url);

test("migration keeps drafts private and published media public", async () => {
  const sql = await readFile(migrationUrl, "utf8");
  assert.match(sql, /'portfolio-drafts', 'portfolio-drafts', false/);
  assert.match(sql, /'portfolio-media', 'portfolio-media', true/);
  assert.match(sql, /published or public\.is_portfolio_owner\(\)/);
});

test("all portfolio mutations require the owner allowlist", async () => {
  const sql = await readFile(migrationUrl, "utf8");
  assert.match(sql, /create table public\.owner_users/);
  assert.match(sql, /create or replace function public\.is_portfolio_owner/);
  assert.doesNotMatch(sql, /for all to authenticated using \(true\)/);
});

test("surface placement is independent and limited to four homepage slots", async () => {
  const sql = await readFile(placementMigrationUrl, "utf8");
  assert.match(sql, /show_in_gallery boolean not null default true/);
  assert.match(sql, /homepage_order between 1 and 4/);
  assert.match(sql, /create unique index portfolio_homepage_slot/);
  assert.match(sql, /set show_in_gallery = gallery_visible/);
  assert.match(sql, /featured = target_homepage_order is not null/);
});

test("placement mutation remains owner-only", async () => {
  const sql = await readFile(placementMigrationUrl, "utf8");
  assert.match(sql, /if not public\.is_portfolio_owner\(\)/);
  assert.match(
    sql,
    /grant execute on function public\.set_portfolio_placement\(uuid, boolean, smallint\) to authenticated/,
  );
  assert.doesNotMatch(sql, /grant execute .* to anon/);
});

test("consultation submissions use dedicated private tables and storage", async () => {
  const sql = await readFile(consultationMigrationUrl, "utf8");
  assert.match(sql, /create table public\.consultation_requests/);
  assert.match(sql, /create table public\.consultation_request_media/);
  assert.match(sql, /'consultation-intake',[\s\S]*false,[\s\S]*5242880/);
  assert.doesNotMatch(sql, /portfolio_items[\s\S]*consultation/);
});

test("consultation intake grants no anonymous table or object access", async () => {
  const sql = await readFile(consultationMigrationUrl, "utf8");
  assert.match(
    sql,
    /revoke all on table public\.consultation_requests from anon/,
  );
  assert.match(
    sql,
    /revoke all on table public\.consultation_request_media from anon/,
  );
  assert.match(sql, /owner manages consultation objects/);
  assert.doesNotMatch(sql, /consultation[\s\S]*to anon/);
});

test("FAQ schema exposes active ordered content without anonymous writes", async () => {
  const sql = await readFile(faqMigrationUrl, "utf8");
  assert.match(sql, /create table public\.faqs/);
  assert.match(sql, /display_order integer not null/);
  assert.match(sql, /is_active boolean not null default true/);
  assert.match(sql, /using \(is_active or public\.is_portfolio_owner\(\)\)/);
  assert.match(sql, /owner manages FAQs/);
  assert.match(
    sql,
    /revoke insert, update, delete on table public\.faqs from anon/,
  );
  assert.doesNotMatch(sql, /for all to anon/);
});

test("focused placement actions preserve the unaffected surface state", async () => {
  const actions = await readFile(portfolioActionsUrl, "utf8");
  assert.match(
    actions,
    /updateHomepagePlacement[\s\S]*select\("show_in_gallery,published"\)[\s\S]*item\.show_in_gallery/,
  );
  assert.match(
    actions,
    /updateGalleryVisibility[\s\S]*select\("published,featured,homepage_order"\)[\s\S]*item\.featured \? item\.homepage_order : null/,
  );
});

test("FAQ mutations require owner access and confirmed deletion", async () => {
  const actions = await readFile(faqActionsUrl, "utf8");
  assert.match(actions, /createFaq[\s\S]*requireOwner\(\)/);
  assert.match(actions, /updateFaq[\s\S]*requireOwner\(\)/);
  assert.match(actions, /confirmDelete[\s\S]*requireOwner\(\)/);
});

test("homepage drawings mirror the four-slot hero model independently", async () => {
  const sql = await readFile(homepageDrawingSlotsMigrationUrl, "utf8");
  assert.match(sql, /drawing_featured boolean not null default false/);
  assert.match(sql, /homepage_drawing_order between 1 and 4/);
  assert.match(sql, /create unique index portfolio_homepage_drawing_slot/);
  assert.match(sql, /set_homepage_drawing_placement/);
  assert.match(sql, /public\.is_portfolio_owner\(\)/);
  assert.match(sql, /drawing_featured = target_drawing_order is not null/);
  assert.doesNotMatch(
    sql,
    /create table public\.(portfolio_media|homepage_drawing_placements)/,
  );
  assert.doesNotMatch(sql, /show_in_gallery/);
  assert.doesNotMatch(
    sql,
    /set featured =|homepage_order = target_drawing_order/,
  );
});

test("drawings placement action is owner-gated and surface-specific", async () => {
  const actions = await readFile(portfolioActionsUrl, "utf8");
  const actionStart = actions.indexOf(
    "export async function updateHomepageDrawingPlacement",
  );
  const actionEnd = actions.indexOf(
    "export async function updateGalleryVisibility",
    actionStart,
  );
  const drawingAction = actions.slice(actionStart, actionEnd);
  assert.match(
    drawingAction,
    /updateHomepageDrawingPlacement[\s\S]*requireOwner\(\)[\s\S]*set_homepage_drawing_placement/,
  );
  assert.doesNotMatch(
    drawingAction,
    /show_in_gallery|homepageOrder|set_portfolio_placement/,
  );
});

test("public drawing query is capped at four managed slots", async () => {
  const queries = await readFile(homepageQueriesUrl, "utf8");
  assert.match(
    queries,
    /getHomepageDrawingItems[\s\S]*eq\("drawing_featured", true\)[\s\S]*order\("homepage_drawing_order"[\s\S]*limit\(4\)/,
  );
});

test("automatic homepage paper paragraph styling is absent", async () => {
  const css = await readFile(globalStylesUrl, "utf8");
  assert.doesNotMatch(css, /\.paper\s+:where\(p\)/);
  assert.doesNotMatch(css, /\.drawings-band\.paper\s+:where\(p\)/);
});

test("homepage boundary masks extend charcoal instead of painting paper", async () => {
  const css = await readFile(globalStylesUrl, "utf8");
  const transitionStart = css.indexOf(
    "Charcoal extends into paper, then the mask erodes",
  );
  const transitionEnd = css.indexOf(
    "/* Public portfolio index",
    transitionStart,
  );
  const darkToPaper = css.slice(transitionStart, transitionEnd);
  const paperToDarkStart = css.indexOf(".about-band::before", transitionEnd);
  const paperToDarkEnd = css.indexOf(
    "/* Consultation request */",
    paperToDarkStart,
  );
  const paperToDark = css.slice(paperToDarkStart, paperToDarkEnd);

  assert.match(darkToPaper, /top: calc\(100% - 1px\)/);
  assert.match(darkToPaper, /background: var\(--ink\)/);
  assert.doesNotMatch(darkToPaper, /background: var\(--paper\)/);
  assert.match(paperToDark, /bottom: calc\(100% - 1px\)/);
  assert.match(paperToDark, /background: var\(--ink\)/);
  assert.doesNotMatch(paperToDark, /background: var\(--paper\)/);
});

test("homepage admin edits each surface from its four slot cards", async () => {
  const page = await readFile(homepageAdminUrl, "utf8");
  assert.match(page, /<details className="admin-slot-picker">/);
  assert.match(page, /<summary>Change<\/summary>/);
  assert.match(page, />\s*Clear\s*<\/button>/);
  assert.match(page, /orderField="homepageOrder"/);
  assert.match(page, /orderField="drawingOrder"/);
  assert.equal(page.match(/homepageSlots\.map/g)?.length, 2);
  assert.doesNotMatch(page, /Assign hero slot|Assign drawing slot/);
  assert.doesNotMatch(page, /className="admin-compact-list"/);
});

test("footer replaces repeated internal navigation with safe contact hooks", async () => {
  const [layout, contacts] = await Promise.all([
    readFile(rootLayoutUrl, "utf8"),
    readFile(footerContactUrl, "utf8"),
  ]);
  const footer = layout.slice(layout.indexOf("<footer"));

  assert.match(footer, /<NewsletterSignup idPrefix="footer-newsletter" \/>/);
  assert.match(footer, /footerContactLinks\.map/);
  assert.doesNotMatch(
    footer,
    /href="\/(about|work|faq|consultation|#drawings|#process)/,
  );
  assert.match(contacts, /NEXT_PUBLIC_INSTAGRAM_URL/);
  assert.match(contacts, /NEXT_PUBLIC_TIKTOK_URL/);
  assert.match(contacts, /NEXT_PUBLIC_CONTACT_EMAIL/);
  assert.match(contacts, /url\.protocol === "https:"/);
});

test("gallery pages are URL-backed and database-limited to six records", async () => {
  const [gallery, queries, workPage] = await Promise.all([
    readFile(portfolioGalleryUrl, "utf8"),
    readFile(new URL("../lib/queries.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/work/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(queries, /select\(select, \{ count: "exact", head: true \}\)/);
  assert.match(queries, /range\(offset, offset \+ GALLERY_PAGE_SIZE - 1\)/);
  assert.match(queries, /eq\("published", true\)/);
  assert.match(queries, /eq\("show_in_gallery", true\)/);
  assert.match(gallery, /items\.map/);
  assert.match(gallery, /galleryPageNumbers\(currentPage, totalPages\)/);
  assert.match(gallery, /next\.delete\("page"\)/);
  assert.match(workPage, /redirect\(galleryHref\(filters, currentPage\)\)/);
});

test("gallery filters use an accessible state-preserving disclosure", async () => {
  const gallery = await readFile(portfolioGalleryUrl, "utf8");
  assert.match(gallery, /aria-expanded=\{filtersOpen\}/);
  assert.match(gallery, /aria-controls="gallery-filter-panel"/);
  assert.match(gallery, /hidden=\{!filtersOpen\}/);
  assert.doesNotMatch(gallery, /setFilters\(|setTypeFilter|setStyleFilter/);
});

test("mobile navigation reuses every desktop destination and supports dismissal", async () => {
  const navigation = await readFile(siteNavigationUrl, "utf8");
  for (const destination of ["/work", "/about", "/faq", "/consultation"])
    assert.match(navigation, new RegExp(`href: "${destination}"`));
  assert.match(navigation, /aria-expanded=\{open\}/);
  assert.match(navigation, /aria-controls="mobile-navigation"/);
  assert.match(navigation, /event\.key === "Escape"/);
  assert.match(navigation, /contains\(event\.target as Node\)/);
  assert.match(navigation, /onClick=\{\(\) => setOpen\(false\)\}/);
});

test("hero and footer reuse the instance-safe newsletter component", async () => {
  const [homepage, layout, newsletter] = await Promise.all([
    readFile(homepageUrl, "utf8"),
    readFile(rootLayoutUrl, "utf8"),
    readFile(newsletterComponentUrl, "utf8"),
  ]);
  assert.match(homepage, /className="hero-newsletter-form"/);
  assert.match(homepage, /idPrefix="hero-newsletter"/);
  assert.match(homepage, /label="Stay notified"/);
  assert.doesNotMatch(homepage, /Studio notes|Occasional availability/);
  assert.match(layout, /idPrefix="footer-newsletter"/);
  assert.match(newsletter, /useId\(\)/);
  assert.match(newsletter, /subscribeNewsletter/);
  assert.doesNotMatch(homepage, /subscribeNewsletter|MAILCHIMP_/);
});
