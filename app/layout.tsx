import type { Metadata } from "next";
import Link from "next/link";
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
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <header className="site-header">
          <Link className="brand-lockup" href="/">
            <span className="brand-seal" aria-hidden="true">
              M
            </span>
            <span className="wordmark">MGM.TATZ</span>
          </Link>
          <nav aria-label="Primary">
            <Link href="/work">Work</Link>
            <Link href="/#drawings">Drawings</Link>
            <Link href="/#about">About</Link>
            <Link href="/#process">Process</Link>
            <Link href="/#faq">FAQ</Link>
            <Link href="/#consult">Consultation</Link>
          </nav>
        </header>
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <span className="footer-wordmark">MGM.TATZ</span>
          <span>Solo artist · Chicago, Illinois</span>
          <span>Social links forthcoming</span>
        </footer>
      </body>
    </html>
  );
}
