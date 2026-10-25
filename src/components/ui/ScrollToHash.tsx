"use client";

import { useEffect } from "react";

/**
 * Smooth-scrolls to the #section in the URL when the page is opened from a
 * link like /export#australia, and again on later hash changes.
 *
 * The browser's own jump happens before hydration and the pinned lane
 * sequence above the market sections, so on /export it lands short or not
 * at all. This waits a frame for layout, then scrolls; the html element's
 * scroll-padding-top keeps the heading clear of the fixed header.
 *
 * If the target is (or sits inside) a closed <details>, it is opened first,
 * so a collapsed section never swallows the link.
 */
export function ScrollToHash() {
  useEffect(() => {
    const run = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      for (let d = el.closest("details"); d; d = d.parentElement?.closest("details") ?? null) d.open = true;
      if (el instanceof HTMLDetailsElement) el.open = true;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })),
      );
    };
    const t = window.setTimeout(run, 120);
    window.addEventListener("hashchange", run);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", run);
    };
  }, []);
  return null;
}
