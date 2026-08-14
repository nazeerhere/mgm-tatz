import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../supabase/migrations/202608120001_portfolio_publishing.sql",
  import.meta.url,
);

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
