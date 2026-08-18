"use server";

import {
  NewsletterConfigurationError,
  NewsletterProviderError,
  NewsletterValidationError,
  subscribeToMailchimp,
  type NewsletterActionState,
} from "@/lib/newsletter";

export async function subscribeNewsletter(
  _previousState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  try {
    const outcome = await subscribeToMailchimp(
      String(formData.get("email") ?? ""),
    );

    return {
      status: "success",
      message:
        outcome === "already-subscribed"
          ? "You're already on the list."
          : "You're on the list. Watch your inbox for MGM.TATZ updates.",
    };
  } catch (error) {
    if (error instanceof NewsletterValidationError) {
      return { status: "error", message: error.message };
    }
    if (error instanceof NewsletterConfigurationError) {
      return {
        status: "error",
        message: "Newsletter signup isn't available yet.",
      };
    }
    if (error instanceof NewsletterProviderError) {
      return {
        status: "error",
        message: "We couldn't add you right now. Please try again later.",
      };
    }
    return {
      status: "error",
      message: "We couldn't add you right now. Please try again later.",
    };
  }
}
