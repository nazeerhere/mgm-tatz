import assert from "node:assert/strict";
import test from "node:test";
import { validateFaqInput } from "../lib/faq";

function faqForm(overrides: Record<string, string> = {}) {
  const form = new FormData();
  form.set("question", "How should I prepare?");
  form.set("answer", "Preparation details will be shared after consultation.");
  form.set("displayOrder", "2");
  form.set("isActive", "on");
  Object.entries(overrides).forEach(([key, value]) => form.set(key, value));
  return form;
}

test("FAQ input trims copy and preserves active ordered state", () => {
  assert.deepEqual(
    validateFaqInput(
      faqForm({
        question: "  How should I prepare?  ",
        answer: "  Preparation details will be shared after consultation.  ",
      }),
    ),
    {
      question: "How should I prepare?",
      answer: "Preparation details will be shared after consultation.",
      displayOrder: 2,
      isActive: true,
    },
  );
});

test("FAQ input rejects invalid order and undersized copy", () => {
  const missingOrder = faqForm();
  missingOrder.delete("displayOrder");
  assert.throws(() => validateFaqInput(missingOrder), /Display order/);
  assert.throws(
    () => validateFaqInput(faqForm({ displayOrder: "1.5" })),
    /whole number/,
  );
  assert.throws(
    () => validateFaqInput(faqForm({ question: "No" })),
    /Question/,
  );
  assert.throws(() => validateFaqInput(faqForm({ answer: "No" })), /Answer/);
});
