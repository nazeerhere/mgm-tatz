import type { Metadata } from "next";
import { getActiveFaqItems } from "@/lib/faq";

export const metadata: Metadata = { title: "FAQ" };

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqItems = await getActiveFaqItems();
  return (
    <section className="support-page faq-page paper">
      <header className="support-hero support-hero-light">
        <p className="kicker ink-kicker">Studio information</p>
        <h1>Frequently asked questions.</h1>
        <p className="support-lede">
          Booking and studio information will live here as approved details
          become available.
        </p>
      </header>

      <div className="faq-page-grid">
        <div className="faq-page-intro">
          <p className="kicker ink-kicker">Start here</p>
          <h2>Questions, answered clearly.</h2>
          <p>
            Current answers remain intentionally limited until Miles supplies
            final client-approved details.
          </p>
        </div>

        <div className="faq-list">
          {faqItems.map((item, index) => (
            <details key={item.id} open={index === 0}>
              <summary>
                <span>{item.question}</span>
                <span className="faq-toggle" aria-hidden="true" />
              </summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
