"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * SCROLL-IN TRIGGER
 *
 * Renders one element and marks it `data-inview` the first time enough of it
 * is on screen. All the actual motion lives in globals.css, keyed off that
 * attribute — this component only says "now".
 *
 * Progressive enhancement, same rule as ScrollSteps: the hidden "before"
 * state only applies under `data-reveal-ready`, which this sets on mount.
 * Without JS, or with reduced motion, content is simply visible.
 *
 * `spotlight` also tracks the pointer over any `[data-spot]` child and writes
 * its position to --mx / --my on that child, for hover light effects.
 */
export function InView({
  as: Tag = "div",
  className,
  style,
  children,
  threshold = 0.12,
  spotlight = false,
}: {
  as?: "div" | "ol" | "ul" | "dl" | "section" | "figure";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  threshold?: number;
  spotlight?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>("[data-spot]");
      if (!card || !el.contains(card)) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    if (spotlight) el.addEventListener("pointermove", onMove);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => el.removeEventListener("pointermove", onMove);
    }

    el.setAttribute("data-reveal-ready", "");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.setAttribute("data-inview", "");
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px 0px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeAttribute("data-reveal-ready");
      el.removeAttribute("data-inview");
    };
  }, [threshold, spotlight]);

  return (
    // The ref type is the widest of the allowed tags; each is an HTMLElement.
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
