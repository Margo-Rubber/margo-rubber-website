"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from "react";
import { sameOriginFileUrl } from "@/lib/sanity-file";

/**
 * INTERACTIVE 3D VIEW OF A PART — drag to rotate, pinch/scroll to zoom.
 *
 * Renders Google's <model-viewer> web component for the part's .glb, which is
 * uploaded per SKU in Sanity ("3D model (.glb)"). The library (~three.js) is
 * heavy, so it is only imported once the viewer scrolls near the viewport;
 * pages without a model never load it at all.
 *
 * Until the library has loaded, the styled plate below shows, so there is no
 * layout shift and no hydration mismatch (the element is client-only).
 */

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        loading?: "auto" | "lazy" | "eager";
        reveal?: "auto" | "manual";
        exposure?: string;
        "camera-controls"?: string;
        "auto-rotate"?: string;
        "auto-rotate-delay"?: string;
        "rotation-per-second"?: string;
        "interaction-prompt"?: string;
        "shadow-intensity"?: string;
        "shadow-softness"?: string;
        "environment-image"?: string;
        "touch-action"?: string;
        "disable-pan"?: string;
      };
    }
  }
}

/** Sanity file CDN → same-origin path (next.config.ts rewrites it back). */
const sameOrigin = sameOriginFileUrl;

export function SkuModelViewer({ src, alt }: { src: string; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let cancelled = false;
    const load = () => {
      import("@google/model-viewer")
        .then(() => !cancelled && setReady(true))
        .catch(() => !cancelled && setFailed(true));
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrap}
      // A light studio backdrop, not the site's dark plate: the .glb files
      // are authored on white, and Margo's parts are mostly black rubber,
      // which disappears against a dark background.
      className="rounded-card border-line relative isolate aspect-[16/10] overflow-hidden border bg-[radial-gradient(ellipse_at_50%_40%,#ffffff_0%,#f1f3f5_55%,#dfe4e8_100%)]"
    >
      {ready && !failed ? (
        <model-viewer
          src={sameOrigin(src)}
          alt={alt}
          camera-controls=""
          auto-rotate=""
          auto-rotate-delay="1500"
          rotation-per-second="20deg"
          interaction-prompt="auto"
          // Neutral studio lighting lifts the detail out of dark rubber; a
          // soft contact shadow grounds the part on the light floor.
          environment-image="neutral"
          shadow-intensity="0.7"
          shadow-softness="0.9"
          exposure="1.15"
          disable-pan=""
          touch-action="pan-y"
          loading="eager"
          style={
            {
              width: "100%",
              height: "100%",
              background: "transparent",
              "--poster-color": "transparent",
            } as CSSProperties
          }
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <p className="text-eyebrow font-mono text-[#5b6670] uppercase">
            {failed ? "3D view unavailable" : "Loading 3D model…"}
          </p>
        </div>
      )}

      <p className="text-eyebrow pointer-events-none absolute bottom-3 left-4 font-mono text-[#5b6670] uppercase">
        Drag to rotate · Scroll to zoom
      </p>
      {/* Corner brackets, matching the photo plates. */}
      <span aria-hidden className="pointer-events-none absolute top-3 left-3 size-5 border-t border-l border-[#0f8087]/60" />
      <span aria-hidden className="pointer-events-none absolute right-3 bottom-3 size-5 border-r border-b border-[#0f8087]/60" />
    </div>
  );
}
