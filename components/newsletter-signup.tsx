"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import type { NewsletterActionState } from "@/lib/newsletter";

const initialState: NewsletterActionState = { status: "idle", message: "" };

export function NewsletterSignup({
  className,
  idPrefix,
  label = "Email address",
}: { className?: string; idPrefix?: string; label?: string } = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const generatedId = useId();
  const instanceId = idPrefix ?? generatedId;
  const emailId = `${instanceId}-newsletter-email`;
  const messageId = `${instanceId}-newsletter-message`;
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form
      action={formAction}
      className={`newsletter-form${className ? ` ${className}` : ""}`}
      ref={formRef}
      noValidate
    >
      <label htmlFor={emailId}>{label}</label>
      <div className="newsletter-controls">
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          required
          aria-invalid={state.status === "error"}
          aria-describedby={messageId}
          placeholder="you@example.com"
        />
        <button className="newsletter-submit" type="submit" disabled={pending}>
          {pending ? "Joining…" : "Join the list"}
        </button>
      </div>
      <p
        className={`newsletter-message ${state.status}`}
        id={messageId}
        role={state.status === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {state.message || "No noise. Unsubscribe whenever you like."}
      </p>
    </form>
  );
}
