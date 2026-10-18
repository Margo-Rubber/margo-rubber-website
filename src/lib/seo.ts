import type { Metadata } from "next";
import { IS_VISION, isIndexable } from "@/lib/build-mode";

/**
 * B3 — the site is served from www.margorubber.com; margorubber.in and the
 * bare margorubber.com redirect there. Canonicals, sitemaps, robots and JSON-LD
 * all read this one value. Email stays on @margorubber.in. Change here only.
 */
export const SITE_URL = "https://www.margorubber.com";

/**
 * The share card every page uses (WhatsApp, LinkedIn, X, Slack previews).
 * 1200×630 in /public. Without it every link Margo sends previews with no
 * picture (SEO audit, Oct 2026).
 */
const OG_IMAGE = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "Margo Rubber Products — precision moulded rubber components, Nashik, India",
};

/**
 * Search snippets are cut at roughly 60 characters for a title and 155 for a
 * description; past that Google rewrites or truncates them mid-word (ticket
 * T11). These guards keep whatever an editor types inside the limits:
 *
 *  · a title over 60 drops its middle " | " segments, keeping the lead and
 *    the brand ("A | B | Margo" → "A | Margo");
 *  · a description over 155 keeps whole sentences that fit, or else cuts at a
 *    word and ends with "…".
 *
 * Studio also warns at these lengths; this is the backstop.
 */
export const TITLE_MAX = 60;
export const META_MAX = 155;

export function fitTitle(title: string): string {
  const t = title.trim();
  if (t.length <= TITLE_MAX) return t;
  const parts = t.split(" | ");
  if (parts.length >= 3) {
    const short = `${parts[0]} | ${parts[parts.length - 1]}`;
    if (short.length <= TITLE_MAX) return short;
  }
  return t;
}

export function fitDescription(description: string): string {
  const d = description.replace(/\s+/g, " ").trim();
  if (d.length <= META_MAX) return d;
  const sentences = d.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [];
  let out = "";
  for (const s of sentences) {
    if ((out + s).trim().length > META_MAX) break;
    out += s;
  }
  if (out.trim().length >= 70) return out.trim();
  const cut = d.slice(0, META_MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–—-]+$/, "")}…`;
}

type SeoInput = {
  seo: { title: string; description: string };
  status: "placeholder" | "draft" | "published";
};

/**
 * Builds page metadata from frontmatter.
 *
 * Anything not indexable (`isIndexable`, build-mode.ts: `published` always,
 * `placeholder` once the launch switch is on, `draft` never) ships
 * `noindex, nofollow` — this is what lets the whole site structure exist
 * before the content does, without repeating the old site's
 * 43-URLs/3-indexed thin-content failure.
 */
export function buildMetadata(fm: SeoInput, path: string): Metadata {
  const url = `${SITE_URL}${path}`;
  // The vision build is never indexable, whatever the document says: its
  // copy is target state. Build Instructions §01.
  const indexable = isIndexable(fm.status) && !IS_VISION;
  const title = fitTitle(fm.seo.title);
  const description = fitDescription(fm.seo.description);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
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
      title,
      description,
      siteName: "Margo Rubber Products",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
