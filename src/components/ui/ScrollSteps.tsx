"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * SCROLL-LIT TIMELINE
 *
 * Wraps the "How we work" step list. As the reader scrolls, every step whose
 * top has passed the reading line (55% down the viewport) is marked
 * `data-lit`, the furthest one also `data-current`, and the list gets a
 * `--spine-fill` (0–1) so the centre line can fill behind them.
 *
 * Progressive enhancement: the dimmed "not yet reached" state only applies
 * once this component sets `data-steps-ready`. Without JS the list renders
 * exactly as before — every step fully visible.
 *
 * Reduced motion does NOT switch this off (Windows turns that setting on
 * whenever "Animation effects" is off, which is common). The steps still
 * light up as the reader scrolls; globals.css only drops the movement —
 * no slide, no scale, no pulsing ring — under prefers-reduced-motion.
 *
 * DOM attributes rather than React state: the steps themselves are server-
 * rendered children, and a scroll handler re-rendering them on every frame
 * would be wasted work. Works for any number of steps the CMS supplies.
 */
export function ScrollSteps({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;

    const steps = Array.from(list.querySelectorAll<HTMLElement>(":scope > li"));
    if (steps.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      let current = -1;
      steps.forEach((li, i) => {
        // Measure from the node (top of the card), not the li's padding.
        const lit = li.getBoundingClientRect().top + 24 <= line;
        li.toggleAttribute("data-lit", lit);
        if (lit) current = i;
      });
      steps.forEach((li, i) => li.toggleAttribute("data-current", i === current));

      const box = list.getBoundingClientRect();
      const fill = box.height > 0 ? (line - box.top) / box.height : 0;
      list.style.setProperty("--spine-fill", String(Math.min(1, Math.max(0, fill))));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    list.setAttribute("data-steps-ready", "");
    // Capture phase: also catches scrolling inside a wrapper element, not
    // just the window, in case the layout ever scrolls a container instead.
    document.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      list.removeAttribute("data-steps-ready");
    };
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
