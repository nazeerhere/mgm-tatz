import assert from "node:assert/strict";
import test from "node:test";
import {
  buildStorageKey,
  extensionForMimeType,
  hasValidImageSignature,
  publicMediaUrl,
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
