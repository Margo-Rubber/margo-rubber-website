"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * SLOT-MACHINE FIGURE
 *
 * Renders a stat like "48h", "3–4 wks" or "1,200+" so each digit sits on its
 * own reel. When the figure scrolls into view the reels spin and land on the
 * real value, left to right, like a fruit machine. Letters, spaces and
 * symbols stay still.
 *
 * Built to be safe for content and SEO:
 *  · The real value is always in the DOM as screen-reader text; the reels are
 *    aria-hidden. The reel digits themselves are CSS-generated content, so
 *    crawlers and copy-paste never see "0123456789…".
 *  · Server HTML already shows the final value. Without JS, or with reduced
 *    motion, nothing moves and the number is simply there.
 *  · Spins once per page view. Works with any string the CMS supplies; a
 *    value that doesn't start with a number renders as plain text.
 */
export function SlotValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Park each reel on its own digit (same glyph as the final position, so
    // nothing visibly changes) until the figure is properly on screen.
    el.setAttribute("data-slot-ready", "");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          el.setAttribute("data-slot-spin", "");
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeAttribute("data-slot-ready");
      el.removeAttribute("data-slot-spin");
    };
  }, []);

  // Only quantities spin: the value must START with a number (after any
  // leading symbol such as ~, <, ≈ or ₹). Identifiers that merely contain
  // digits — "ISO 9001:2015", "IATF 16949" — stay still.
  if (!/^[^\p{L}\d]*\d/u.test(value)) return <>{value}</>;

  // Split into digit reels and runs of everything else.
  const parts = value.match(/\d|\D+/g) ?? [value];
  let reel = 0;

  return (
    <span ref={ref} className="margo-slot">
      <span className="sr-only">{value}</span>
      <span aria-hidden className="margo-slot-face">
        {parts.map((p, i) =>
          /\d/.test(p) ? (
            <span
              key={i}
              className="margo-slot-reel"
              style={{ "--d": Number(p), "--i": reel++ } as CSSProperties}
            >
              <span className="margo-slot-strip" />
            </span>
          ) : (
            <span key={i} className="margo-slot-char">
              {p}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
