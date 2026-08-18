import assert from "node:assert/strict";
import test from "node:test";
import {
  ConsultationValidationError,
  consultationStorageExtension,
  maxReferenceImages,
  validateConsultationImageSignatures,
  validateConsultationInput,
} from "../lib/consultation";

function validConsultationForm() {
  const form = new FormData();
  form.set("fullName", "  Alex Rivera  ");
  form.set("email", "  ALEX@EXAMPLE.COM ");
  form.set("phone", "");
  form.set("location", "Chicago, IL");
  form.set(
    "tattooIdea",
    "A mythic bird composition with movement, contrast, and room for artist direction.",
  );
  form.set("desiredPlacement", "Forearm");
  form.set("approximateSize", "Forearm-sized");
  form.set("preferredStyle", "Illustrative");
  form.set("colorPreference", "Black & grey");
  form.set("projectType", "New tattoo");
  form.set("artisticInterpretation", "Yes — bring your perspective");
  form.set("preferredTimeframe", "Autumn, but flexible");
  form.set("avoidNotes", "");
  form.set("additionalNotes", "");
  return form;
}

test("consultation input trims fields, normalizes email, and keeps phone optional", () => {
  const input = validateConsultationInput(validConsultationForm());
  assert.equal(input.fullName, "Alex Rivera");
  assert.equal(input.email, "alex@example.com");
  assert.equal(input.phone, null);
  assert.deepEqual(input.referenceImages, []);
  assert.equal(input.bodyAreaImage, null);
});

test("consultation input reports the missing required field", () => {
  const form = validConsultationForm();
  form.set("fullName", "");
  assert.throws(
    () => validateConsultationInput(form),
    (error) =>
      error instanceof ConsultationValidationError &&
      error.field === "fullName" &&
      /required/.test(error.message),
  );
});

test("consultation input rejects an invalid email", () => {
  const form = validConsultationForm();
  form.set("email", "not-an-email");
  assert.throws(
    () => validateConsultationInput(form),
    (error) =>
      error instanceof ConsultationValidationError &&
      error.field === "email" &&
      /valid email/.test(error.message),
  );
});

test("consultation input rejects unknown select values", () => {
  const form = validConsultationForm();
  form.set("preferredStyle", "Whatever the internet says");
  assert.throws(
    () => validateConsultationInput(form),
    (error) =>
      error instanceof ConsultationValidationError &&
      error.field === "preferredStyle",
  );
});

test("consultation references are independently bounded", () => {
  const form = validConsultationForm();
  for (let index = 0; index <= maxReferenceImages; index += 1) {
    form.append(
      "referenceImages",
      new File([Uint8Array.from([0xff, 0xd8, 0xff])], `${index}.jpg`, {
        type: "image/jpeg",
      }),
    );
  }
  assert.throws(
    () => validateConsultationInput(form),
    (error) =>
      error instanceof ConsultationValidationError &&
      error.field === "referenceImages",
  );
});

test("consultation image signatures must match their declared type", async () => {
  const file = new File([Uint8Array.from([1, 2, 3])], "reference.png", {
    type: "image/png",
  });
  await assert.rejects(
    validateConsultationImageSignatures([{ file, field: "referenceImages" }]),
    (error) =>
      error instanceof ConsultationValidationError &&
      error.field === "referenceImages",
  );
  assert.equal(consultationStorageExtension("image/webp"), "webp");
});
