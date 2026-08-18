import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { RouteScrollMemory } from "@/components/route-scroll-memory";
import { SiteNavigation } from "@/components/site-navigation";
import { footerContactLinks } from "@/content/footer-contact";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MGM.TATZ | Tattoo Artist", template: "%s | MGM.TATZ" },
  description:
    "Selected tattoo work, drawings, and consultation information for Miles / MGM.TATZ in Chicago.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <RouteScrollMemory />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <header className="site-header">
          <Link className="brand-lockup" href="/">
            <span className="brand-seal" aria-hidden="true">
              <Image
                src="/client-media/mgm-bird-logo.jpg"
                alt=""
                width={256}
                height={256}
                priority
                sizes="48px"
              />
            </span>
            <span className="wordmark">MGM.TATZ</span>
          </Link>
          <SiteNavigation />
        </header>
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div
            className="footer-newsletter"
            aria-labelledby="footer-newsletter-heading"
          >
            <p className="kicker">Studio notes</p>
            <h2 id="footer-newsletter-heading">First look, occasionally.</h2>
            <p className="footer-newsletter-copy">
              Promotions, availability updates, flash drops, and artist
              news—sent only when there is something worth sharing.
            </p>
            <NewsletterSignup idPrefix="footer-newsletter" />
          </div>

          <div className="footer-directory">
            <div className="footer-summary">
              <Link className="footer-wordmark" href="/">
                MGM.TATZ
              </Link>
              <p>Solo artist · Chicago, Illinois</p>
            </div>
            <div
              className="footer-contact"
              aria-labelledby="footer-contact-heading"
            >
              <h2 id="footer-contact-heading">Social &amp; contact</h2>
              <ul>
                {footerContactLinks.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a href={item.href}>{item.label}</a>
                    ) : (
                      <span aria-disabled="true">
                        {item.label}
                        <small>Link forthcoming</small>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
