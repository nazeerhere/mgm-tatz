"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navigationItems = [
  { href: "/work", label: "Gallery" },
  { href: "/about", label: "About Me" },
  { href: "/faq", label: "FAQ" },
  { href: "/consultation", label: "Consultation" },
] as const;

export function SiteNavigation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="site-navigation" ref={containerRef}>
      <nav className="desktop-navigation" aria-label="Primary">
        {navigationItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="mobile-menu-icon" aria-hidden="true">
          <span />
        </span>
      </button>
      <nav
        className="mobile-navigation"
        id="mobile-navigation"
        aria-label="Primary mobile"
        hidden={!open}
      >
        {navigationItems.map((item) => (
          <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
