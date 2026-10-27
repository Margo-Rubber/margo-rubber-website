import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * /robots.txt
 *
 * Deliberately permissive on content and closed on everything that is not
 * content. There is nothing here that needs to change when copy does, which
 * is why this can be built before Margo's real content arrives.
 *
 * NOTE ON INDEXING. This file does not decide what gets indexed — every page
 * carries its own `noindex` until its content is marked `published`, and the
 * sitemap is filtered the same way. `Allow: /` here means "you may crawl",
 * and each page then says whether it may be indexed. A blanket `Disallow`
 * would be worse: a page Google cannot crawl is a page whose `noindex` it
 * cannot read either, so it can end up indexed from third-party links with no
 * description at all.
 */

/**
 * One list for every group. A crawler that matches a named group reads ONLY
 * that group and ignores `*`, so a line added to `*` alone never reaches the
 * answer engines (N1, 27 Oct 2026).
 */
const DISALLOW = [
  // The enquiries desk. Behind a password, but a crawler should not
  // be knocking on it at all.
  "/margo-desk",
  "/margo-desk/",
  // Endpoints, not pages. Nothing here renders.
  "/api/",
  // The editing studio has its own login; it is not content.
  "/studio",
  // Query-string variants of listing pages are the same content
  // reachable at many URLs, which splits ranking signals across them.
  "/*?q=",
  "/*?status=",
  "/*?source=",
  "/*?page=",
  // The contact form arrives pre-filled from forty-odd links
  // (?part=, ?industry=, ?request= …). One page, one URL: the
  // parameterised variants canonical to /contact and are not crawled.
  "/contact?",
  // Data files, not pages (N1). Search Console, 25 Oct 2026: 52% of
  // Googlebot's requests went to "other file type" — Next's RSC payloads
  // and the 3D models — and only 13% to HTML. `&_rsc=` is the same payload
  // on a URL that already has a query string. The page's own HTML, CSS, JS
  // chunks (/_next/static/) and images stay open: Google needs them to
  // render. Certificate PDFs under /sanity-files/ stay open too.
  "/*?_rsc=",
  "/*&_rsc=",
  "/sanity-files/*.glb",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // The answer engines, named, so a future blanket rule cannot shut them
      // out by accident — being cited is the point of the content sheets.
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Bingbot"],
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/products/sitemap/0.xml`],
    // No `host:` line — a Yandex-only directive Google ignores, and it was
    // emitted as a full URL where the format expects a bare hostname.
  };
}
