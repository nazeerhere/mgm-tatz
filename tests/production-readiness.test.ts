import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { looksLikeAutomatedSubmission } from "../lib/bot-protection";
import { allowsDevelopmentFallback } from "../lib/env";

test("bot friction detects honeypots and implausibly fast timed submissions", () => {
  const now = 10_000;
  const legitimate = new FormData();
  legitimate.set("submissionStartedAt", String(now - 2_000));
  assert.equal(looksLikeAutomatedSubmission(legitimate, now), false);

  const tooFast = new FormData();
  tooFast.set("submissionStartedAt", String(now - 100));
  assert.equal(looksLikeAutomatedSubmission(tooFast, now), true);

  const honeypot = new FormData();
  honeypot.set("website", "https://spam.example");
  assert.equal(looksLikeAutomatedSubmission(honeypot, now), true);

  assert.equal(looksLikeAutomatedSubmission(new FormData(), now), false);
});

test("development fixtures fail closed in production", () => {
  assert.equal(allowsDevelopmentFallback("development"), true);
  assert.equal(allowsDevelopmentFallback("test"), true);
  assert.equal(allowsDevelopmentFallback("production"), false);
});

test("Next configuration declares the production security baseline", async () => {
  const config = await readFile("next.config.ts", "utf8");
  assert.match(config, /poweredByHeader: false/);
  assert.match(config, /Content-Security-Policy/);
  assert.match(config, /frame-ancestors 'none'/);
  assert.match(config, /X-Content-Type-Options/);
  assert.match(config, /Strict-Transport-Security/);
});
