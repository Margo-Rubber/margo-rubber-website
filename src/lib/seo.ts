import type { Metadata } from "next";
import { IS_VISION } from "@/lib/build-mode";

/** B3 — domain decision pending. Change here only. */
export const SITE_URL = "https://margorubber.in";

type SeoInput = {
  seo: { title: string; description: string };
  status: "placeholder" | "draft" | "published";
};

/**
 * Builds page metadata from frontmatter.
 *
 * Anything not `published` ships `noindex, nofollow` — this is what lets the
 * whole site structure exist before the content does, without repeating the
 * old site's 43-URLs/3-indexed thin-content failure.
 */
export function buildMetadata(fm: SeoInput, path: string): Metadata {
  const url = `${SITE_URL}${path}`;
  // The vision build is never indexable, whatever the document says: its
  // copy is target state. Build Instructions §01.
  const indexable = fm.status === "published" && !IS_VISION;

  return {
    metadataBase: new URL(SITE_URL),
    title: fm.seo.title,
    description: fm.seo.description,
    // One language, one canonical. A parameterised variant (?product=, ?sector=,
    // ?family=) is the same page and never gets its own canonical: `path` is
    // the bare route, never the request URL. hreflang en + x-default, both
    // pointing here, per content sheet 01.
    alternates: {
      canonical: url,
      languages: { en: url, "x-default": url },
    },
    robots: indexable
      ? {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
          },
        }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      url,
      title: fm.seo.title,
      description: fm.seo.description,
      siteName: "Margo Rubber Products",
    },
    twitter: {
      card: "summary_large_image",
      title: fm.seo.title,
      description: fm.seo.description,
    },
  };
}
