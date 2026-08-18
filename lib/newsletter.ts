import { Buffer } from "node:buffer";

export type NewsletterActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export type MailchimpEnvironment = {
  apiKey: string;
  serverPrefix: string;
  audienceId: string;
};

export class NewsletterValidationError extends Error {}
export class NewsletterConfigurationError extends Error {}
export class NewsletterProviderError extends Error {}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeNewsletterEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254 || !emailPattern.test(email)) {
    throw new NewsletterValidationError("Enter a valid email address.");
  }
  return email;
}

export function getMailchimpEnvironment(): MailchimpEnvironment {
  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const serverPrefix =
    process.env.MAILCHIMP_SERVER_PREFIX?.trim().toLowerCase();
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();

  if (
    !apiKey ||
    !serverPrefix ||
    !audienceId ||
    !/^[a-z]{2}\d+$/.test(serverPrefix)
  ) {
    throw new NewsletterConfigurationError(
      "Mailchimp newsletter environment is not configured.",
    );
  }

  return { apiKey, serverPrefix, audienceId };
}

export async function subscribeToMailchimp(
  rawEmail: string,
  options: {
    environment?: MailchimpEnvironment;
    fetcher?: typeof fetch;
  } = {},
) {
  const email = normalizeNewsletterEmail(rawEmail);
  const environment = options.environment ?? getMailchimpEnvironment();
  const fetcher = options.fetcher ?? fetch;
  const endpoint = `https://${environment.serverPrefix}.api.mailchimp.com/3.0/lists/${encodeURIComponent(environment.audienceId)}/members`;

  let response: Response;
  try {
    response = await fetcher(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`mgm-tatz:${environment.apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email, status: "subscribed" }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new NewsletterProviderError(
      "Mailchimp could not be reached for this subscription.",
    );
  }

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    responseBody = null;
  }

  if (response.ok) return "subscribed" as const;

  if (
    response.status === 400 &&
    responseBody &&
    typeof responseBody === "object" &&
    "title" in responseBody &&
    responseBody.title === "Member Exists"
  ) {
    return "already-subscribed" as const;
  }

  throw new NewsletterProviderError(
    "Mailchimp rejected the subscription request.",
  );
}
