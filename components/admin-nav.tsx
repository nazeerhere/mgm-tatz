"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Dashboard", "/admin"],
  ["Portfolio", "/admin/portfolio"],
  ["Homepage", "/admin/homepage"],
  ["Gallery", "/admin/gallery"],
  ["FAQ", "/admin/faq"],
] as const;

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="Administration">
      {links.map(([label, href]) => {
        const active =
          href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            href={href}
            aria-current={active ? "page" : undefined}
            key={href}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
