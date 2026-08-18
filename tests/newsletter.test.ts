import assert from "node:assert/strict";
import test from "node:test";
import { subscribeNewsletter } from "../app/actions/newsletter";
import {
  NewsletterProviderError,
  NewsletterValidationError,
  normalizeNewsletterEmail,
  subscribeToMailchimp,
  type MailchimpEnvironment,
  type NewsletterActionState,
} from "../lib/newsletter";

const environment: MailchimpEnvironment = {
  apiKey: "test-key",
  serverPrefix: "us21",
  audienceId: "audience-id",
};

const initialState: NewsletterActionState = { status: "idle", message: "" };

test("newsletter email validation rejects empty and invalid values", () => {
  assert.throws(() => normalizeNewsletterEmail(""), NewsletterValidationError);
  assert.throws(
    () => normalizeNewsletterEmail("not-an-email"),
    NewsletterValidationError,
  );
});

test("newsletter email is trimmed and normalized", () => {
  assert.equal(
    normalizeNewsletterEmail("  Miles@Example.COM "),
    "miles@example.com",
  );
});

test("valid subscription reaches the Mailchimp member endpoint", async () => {
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  const fetcher = (async (
    input: string | URL | Request,
    init?: RequestInit,
  ) => {
    requestUrl = String(input);
    requestInit = init;
    return Response.json({ status: "subscribed" });
  }) as typeof fetch;

  const outcome = await subscribeToMailchimp("Miles@Example.com", {
    environment,
    fetcher,
  });

  assert.equal(outcome, "subscribed");
  assert.equal(
    requestUrl,
    "https://us21.api.mailchimp.com/3.0/lists/audience-id/members",
  );
  assert.equal(requestInit?.method, "POST");
  assert.deepEqual(JSON.parse(String(requestInit?.body)), {
    email_address: "miles@example.com",
    status: "subscribed",
  });
  assert.match(
    String((requestInit?.headers as Record<string, string>).Authorization),
    /^Basic /,
  );
});

test("already-subscribed addresses return a graceful outcome", async () => {
  const fetcher = (async () =>
    Response.json(
      { title: "Member Exists", detail: "Address is already a list member." },
      { status: 400 },
    )) as typeof fetch;

  assert.equal(
    await subscribeToMailchimp("miles@example.com", { environment, fetcher }),
    "already-subscribed",
  );
});

test("Mailchimp errors stay behind a provider-safe boundary", async () => {
  const fetcher = (async () =>
    Response.json(
      { title: "API Key Invalid", detail: "Sensitive provider detail." },
      { status: 401 },
    )) as typeof fetch;

  await assert.rejects(
    subscribeToMailchimp("miles@example.com", { environment, fetcher }),
    NewsletterProviderError,
  );
});

test("server action returns the frontend success state", async (t) => {
  const previous = {
    apiKey: process.env.MAILCHIMP_API_KEY,
    prefix: process.env.MAILCHIMP_SERVER_PREFIX,
    audience: process.env.MAILCHIMP_AUDIENCE_ID,
  };
  process.env.MAILCHIMP_API_KEY = "test-key";
  process.env.MAILCHIMP_SERVER_PREFIX = "us21";
  process.env.MAILCHIMP_AUDIENCE_ID = "audience-id";
  t.after(() => {
    if (previous.apiKey === undefined) delete process.env.MAILCHIMP_API_KEY;
    else process.env.MAILCHIMP_API_KEY = previous.apiKey;
    if (previous.prefix === undefined)
      delete process.env.MAILCHIMP_SERVER_PREFIX;
    else process.env.MAILCHIMP_SERVER_PREFIX = previous.prefix;
    if (previous.audience === undefined)
      delete process.env.MAILCHIMP_AUDIENCE_ID;
    else process.env.MAILCHIMP_AUDIENCE_ID = previous.audience;
  });

  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ status: "subscribed" }),
  );
  const valid = new FormData();
  valid.set("email", "miles@example.com");
  assert.deepEqual(await subscribeNewsletter(initialState, valid), {
    status: "success",
    message: "You're on the list. Watch your inbox for MGM.TATZ updates.",
  });
});

test("server action returns validation and non-sensitive API errors", async (t) => {
  const invalid = new FormData();
  invalid.set("email", "bad-address");
  assert.deepEqual(await subscribeNewsletter(initialState, invalid), {
    status: "error",
    message: "Enter a valid email address.",
  });

  const previous = {
    apiKey: process.env.MAILCHIMP_API_KEY,
    prefix: process.env.MAILCHIMP_SERVER_PREFIX,
    audience: process.env.MAILCHIMP_AUDIENCE_ID,
  };
  process.env.MAILCHIMP_API_KEY = "test-key";
  process.env.MAILCHIMP_SERVER_PREFIX = "us21";
  process.env.MAILCHIMP_AUDIENCE_ID = "audience-id";
  t.after(() => {
    if (previous.apiKey === undefined) delete process.env.MAILCHIMP_API_KEY;
    else process.env.MAILCHIMP_API_KEY = previous.apiKey;
    if (previous.prefix === undefined)
      delete process.env.MAILCHIMP_SERVER_PREFIX;
    else process.env.MAILCHIMP_SERVER_PREFIX = previous.prefix;
    if (previous.audience === undefined)
      delete process.env.MAILCHIMP_AUDIENCE_ID;
    else process.env.MAILCHIMP_AUDIENCE_ID = previous.audience;
  });

  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ title: "Internal Server Error" }, { status: 500 }),
  );
  const valid = new FormData();
  valid.set("email", "miles@example.com");
  assert.deepEqual(await subscribeNewsletter(initialState, valid), {
    status: "error",
    message: "We couldn't add you right now. Please try again later.",
  });
});
