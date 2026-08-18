import assert from "node:assert/strict";
import test from "node:test";
import {
  filterAndSortGalleryItems,
  galleryHref,
  galleryPageNumbers,
  GALLERY_PAGE_SIZE,
  parseGalleryFilters,
  paginateGalleryItems,
} from "../lib/gallery-filters";
import {
  buildStorageKey,
  draftMetadataFromFilename,
  extensionForMimeType,
  hasValidImageSignature,
  parseHomepageDrawingSlot,
  parseHomepageSlot,
  publicMediaUrl,
  resolveSurfaceVisibility,
  validatePortfolioInput,
} from "../lib/portfolio";

function validForm() {
  const form = new FormData();
  form.set("title", "Raven study");
  form.set("type", "drawing");
  form.set(
    "description",
    "An approved graphite study prepared for the portfolio.",
  );
  form.set("altText", "Graphite raven study on warm paper.");
  form.set(
    "image",
    new File([new Uint8Array([1])], "unsafe name.png", { type: "image/png" }),
  );
  return form;
}

test("portfolio input validates and trims editorial metadata", () => {
  const input = validatePortfolioInput(validForm());
  assert.equal(input.title, "Raven study");
  assert.equal(input.type, "drawing");
  assert.equal(input.bodyPlacement, null);
});
test("portfolio input rejects unsupported media", () => {
  const form = validForm();
  form.set("image", new File(["x"], "work.svg", { type: "image/svg+xml" }));
  assert.throws(() => validatePortfolioInput(form), /JPEG, PNG, or WebP/);
});
test("storage keys ignore original filenames", () => {
  assert.equal(
    buildStorageKey("item-id", "media-id", "image/jpeg"),
    "portfolio/item-id/media-id.jpg",
  );
  assert.equal(extensionForMimeType("image/webp"), "webp");
});
test("image signatures must match their declared types", () => {
  assert.equal(
    hasValidImageSignature(Uint8Array.from([0xff, 0xd8, 0xff]), "image/jpeg"),
    true,
  );
  assert.equal(
    hasValidImageSignature(
      Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      "image/png",
    ),
    true,
  );
  assert.equal(
    hasValidImageSignature(Uint8Array.from([1, 2, 3]), "image/png"),
    false,
  );
});
test("public media URLs encode path segments", () => {
  assert.equal(
    publicMediaUrl(
      "https://test.supabase.co/",
      "portfolio-media",
      "portfolio/a b/image.png",
    ),
    "https://test.supabase.co/storage/v1/object/public/portfolio-media/portfolio/a%20b/image.png",
  );
});

test("bulk draft metadata is derived without retaining unsafe filenames", () => {
  assert.deepEqual(draftMetadataFromFilename("raven-study_final.webp"), {
    title: "Raven Study Final",
    altText: "Raven Study Final portfolio image.",
  });
});

test("homepage slots accept only the four supported positions", () => {
  assert.equal(parseHomepageSlot(null), null);
  assert.equal(parseHomepageSlot(""), null);
  assert.equal(parseHomepageSlot("1"), 1);
  assert.equal(parseHomepageSlot("4"), 4);
  assert.throws(() => parseHomepageSlot("5"), /valid homepage slot/);
});

test("homepage drawings accept only four slots or removal", () => {
  assert.equal(parseHomepageDrawingSlot(null), null);
  assert.equal(parseHomepageDrawingSlot(""), null);
  assert.equal(parseHomepageDrawingSlot("1"), 1);
  assert.equal(parseHomepageDrawingSlot("4"), 4);
  assert.throws(() => parseHomepageDrawingSlot("5"), /drawing slot/);
});

test("gallery and homepage placement remain independent", () => {
  assert.deepEqual(
    resolveSurfaceVisibility({
      published: true,
      showInGallery: true,
      homepageOrder: null,
    }),
    { gallery: true, homepage: false },
  );
  assert.deepEqual(
    resolveSurfaceVisibility({
      published: true,
      showInGallery: true,
      homepageOrder: 2,
    }),
    { gallery: true, homepage: true },
  );
  assert.deepEqual(
    resolveSurfaceVisibility({
      published: true,
      showInGallery: false,
      homepageOrder: 2,
    }),
    { gallery: false, homepage: true },
  );
  assert.deepEqual(
    resolveSurfaceVisibility({
      published: false,
      showInGallery: true,
      homepageOrder: 2,
    }),
    { gallery: false, homepage: false },
  );
});

const galleryItems = [
  {
    id: "drawing-new",
    type: "drawing" as const,
    styleSlugs: ["anime-manga", "illustrative"],
    featured: false,
    createdAt: "2026-08-15T12:00:00.000Z",
    displayOrder: 2,
  },
  {
    id: "tattoo-featured",
    type: "tattoo" as const,
    styleSlugs: ["black-grey", "animals"],
    featured: true,
    createdAt: "2026-08-10T12:00:00.000Z",
    displayOrder: 1,
  },
  {
    id: "tattoo-classical",
    type: "tattoo" as const,
    styleSlugs: ["black-grey", "classical"],
    featured: false,
    createdAt: "2026-08-12T12:00:00.000Z",
    displayOrder: 3,
  },
];

test("gallery filtering combines type and style metadata", () => {
  const filtered = filterAndSortGalleryItems(galleryItems, {
    type: "tattoo",
    style: "classical",
    sort: "featured",
  });

  assert.deepEqual(
    filtered.map((item) => item.id),
    ["tattoo-classical"],
  );
});

test("gallery sorting supports featured and newest order", () => {
  const featured = filterAndSortGalleryItems(galleryItems, {
    type: "all",
    style: "all",
    sort: "featured",
  });
  const newest = filterAndSortGalleryItems(galleryItems, {
    type: "all",
    style: "all",
    sort: "newest",
  });

  assert.equal(featured[0]?.id, "tattoo-featured");
  assert.deepEqual(
    newest.map((item) => item.id),
    ["drawing-new", "tattoo-classical", "tattoo-featured"],
  );
});

test("gallery pagination caps pages at six and clamps invalid pages", () => {
  const items = Array.from({ length: 14 }, (_, index) => ({ id: index + 1 }));
  const secondPage = paginateGalleryItems(items, 2);
  const finalPage = paginateGalleryItems(items, 99);
  const emptyPage = paginateGalleryItems([], 3);

  assert.equal(GALLERY_PAGE_SIZE, 6);
  assert.deepEqual(
    secondPage.items.map((item) => item.id),
    [7, 8, 9, 10, 11, 12],
  );
  assert.equal(secondPage.totalPages, 3);
  assert.equal(finalPage.currentPage, 3);
  assert.deepEqual(
    finalPage.items.map((item) => item.id),
    [13, 14],
  );
  assert.deepEqual(emptyPage, { currentPage: 1, totalPages: 1, items: [] });
});

test("gallery URL state validates filters and preserves paging context", () => {
  const parsed = parseGalleryFilters({
    type: "drawing",
    style: "illustrative",
    sort: "newest",
    page: "3",
  });
  assert.deepEqual(parsed, {
    filters: { type: "drawing", style: "illustrative", sort: "newest" },
    page: 3,
  });
  assert.equal(
    galleryHref(parsed.filters, 3),
    "/work?type=drawing&style=illustrative&sort=newest&page=3",
  );
  assert.deepEqual(galleryPageNumbers(6, 12), [
    1,
    "ellipsis",
    5,
    6,
    7,
    "ellipsis",
    12,
  ]);
});

test("gallery pagination runs after filtering and sorting", () => {
  const repeated = Array.from({ length: 3 }, (_, group) =>
    galleryItems.map((item) => ({
      ...item,
      id: `${item.id}-${group}`,
      displayOrder: item.displayOrder + group * galleryItems.length,
    })),
  ).flat();
  const filtered = filterAndSortGalleryItems(repeated, {
    type: "tattoo",
    style: "all",
    sort: "featured",
  });
  const firstPage = paginateGalleryItems(filtered, 1);

  assert.equal(filtered.length, 6);
  assert.equal(firstPage.items.length, 6);
  assert.ok(firstPage.items.slice(0, 3).every((item) => item.featured));
});
