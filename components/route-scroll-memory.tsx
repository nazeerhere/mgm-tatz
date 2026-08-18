"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STORAGE_PREFIX = "mgm-scroll:";

function storageKey(pathname: string) {
  return `${STORAGE_PREFIX}${pathname}`;
}

function readPosition(pathname: string) {
  try {
    const value = window.sessionStorage.getItem(storageKey(pathname));
    if (value === null) return null;
    const position = Number(value);
    return Number.isFinite(position) && position >= 0 ? position : null;
  } catch {
    return null;
  }
}

function writePosition(pathname: string) {
  try {
    window.sessionStorage.setItem(storageKey(pathname), String(window.scrollY));
  } catch {
    // Browsing still works when session storage is unavailable.
  }
}

export function RouteScrollMemory() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useLayoutEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    let frame = 0;

    function scheduleSave() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() =>
        writePosition(pathnameRef.current),
      );
    }

    function saveNow() {
      window.cancelAnimationFrame(frame);
      writePosition(pathnameRef.current);
    }

    function saveBeforeRouteChange(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin === window.location.origin &&
        destination.pathname !== pathnameRef.current
      )
        saveNow();
    }

    window.addEventListener("scroll", scheduleSave, { passive: true });
    window.addEventListener("pagehide", saveNow);
    document.addEventListener("click", saveBeforeRouteChange, true);

    return () => {
      window.removeEventListener("scroll", scheduleSave);
      window.removeEventListener("pagehide", saveNow);
      document.removeEventListener("click", saveBeforeRouteChange, true);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useLayoutEffect(() => {
    if (window.location.hash) return;
    const position = readPosition(pathname);
    if (position === null) return;

    const previousScrollBehavior =
      document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, position);
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo(0, position);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, [pathname]);

  return null;
}
