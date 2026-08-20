"use client";

import { useEffect, useRef } from "react";
import { NewsletterSignup } from "@/components/newsletter-signup";

export function HeroNewsletterModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => document.body.classList.remove("lightbox-open"), []);

  function openDialog() {
    dialogRef.current?.showModal();
    document.body.classList.add("lightbox-open");
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        className="hero-subscribe-trigger"
        type="button"
        ref={triggerRef}
        onClick={openDialog}
      >
        Subscribe
      </button>
      <dialog
        className="newsletter-dialog"
        ref={dialogRef}
        aria-labelledby="newsletter-dialog-title"
        aria-modal="true"
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClose={() => {
          document.body.classList.remove("lightbox-open");
          triggerRef.current?.focus();
        }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="newsletter-dialog-panel">
          <button
            className="newsletter-dialog-close"
            type="button"
            aria-label="Close newsletter signup"
            onClick={closeDialog}
          >
            ×
          </button>
          <p className="kicker">Studio notes</p>
          <h2 id="newsletter-dialog-title">Stay notified.</h2>
          <p className="newsletter-dialog-copy">
            Occasional availability, flash, and studio updates.
          </p>
          <NewsletterSignup idPrefix="hero-newsletter-modal" />
        </div>
      </dialog>
    </>
  );
}
