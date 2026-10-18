import { REDIRECTS } from "../content/redirects.ts";

/**
 * OLD URLS → THEIR PAGE ON www.margorubber.com, IN ONE HOP.
 *
 * Used by src/proxy.ts for every request to margorubber.in (and its www), and
 * for old WordPress paths and trailing slashes on .com. Before this, an old
 * link took up to four hops: Vercel's domain redirect to .com, Next's
 * trailing-slash redirect, then the legacy map. Search engines follow a few
 * hops but pass less value through each, and the audit (T01, 16 Oct 2026)
 * requires 1 hop (2 for an http:// origin, whose first hop is the HTTPS
 * upgrade). So the answer is computed once, here, from the whole map.
 *
 * Requires the margorubber.in domains in Vercel to be ATTACHED to the
 * project ("Connect to an environment: Production"), not set to redirect —
 * a domain-level redirect runs before this code and adds its own hop.
 */

export const CANONICAL_ORIGIN = "https://www.margorubber.com";

/** Hosts of the old site. Every request to one of them is redirected. */
export const isLegacyHost = (host: string) =>
  /^(www\.)?margorubber\.in$/i.test(host.split(":")[0]);

/** Old-site paths with no counterpart, beyond src/content/redirects.ts (Fix 5 map). */
const EXTRA: Record<string, string> = {
  "/cart": "/products",
  "/shop": "/products",
  "/checkout": "/contact",
  "/my-account": "/contact",
  "/legal": "/legal/privacy-policy",
  "/privacy-policy": "/legal/privacy-policy",
  "/terms-and-conditions": "/legal/terms",
  "/page-sitemap.xml": "/sitemap.xml",
  "/post-sitemap.xml": "/sitemap.xml",
  "/sitemap_index.xml": "/sitemap.xml",
  "/wp-sitemap.xml": "/sitemap.xml",
  "/product-sitemap.xml": "/products/sitemap/0.xml",
  "/products/gaskets-seals": "/products/gaskets",
  // The old brochure. The current catalogue is requested on /products.
  "/wp-content/uploads/2023/12/Margo_Broucher.pdf": "/products#catalogue",
};

/** Retired WordPress and theme paths: answered 410 Gone, which tells crawlers to drop them. */
const GONE = [
  /^\/feed(\/|$)/,
  /^\/comments\/feed/,
  /^\/wp-admin(\/|$)/,
  /^\/wp-login\.php$/,
  /^\/wp-json(\/|$)/,
  /^\/xmlrpc\.php$/,
  /^\/wp-content\//,
  /^\/wp-includes\//,
  /^\/og\/[^/]+\.(?:jpe?g|png)$/,
  /^\/logo\.png$/,
];

const MAP: Map<string, string> = (() => {
  const m = new Map<string, string>();
  for (const r of REDIRECTS) m.set(strip(r.from), r.to);
  for (const [from, to] of Object.entries(EXTRA)) m.set(from, to);
  return m;
})();

function strip(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/** Query parameters that only meant something to WooCommerce. */
const DROP_PARAMS = ["product-page", "add-to-cart", "orderby", "paged"];

export type LegacyResult =
  | { kind: "redirect"; location: string }
  | { kind: "gone" }
  | null;

/**
 * Where an incoming URL should go, or null when it is already canonical.
 *
 * @param legacyHost the request came to margorubber.in — always answered.
 */
export function resolveLegacy(pathname: string, search: string, legacyHost: boolean): LegacyResult {
  const path = strip(pathname);

  // A WordPress path that is gone, even if listed below (the brochure has a home).
  if (!MAP.has(path) && GONE.some((rx) => rx.test(path))) return { kind: "gone" };

  let target = MAP.get(path);
  // Any other old WooCommerce product URL lands on the product range.
  if (!target && /^\/product\/[^/]+$/.test(path)) target = "/products";
  // Paginated old category archives.
  if (!target && /^\/product-category\/.+\/page\/\d+$/.test(path)) target = "/products";

  const params = new URLSearchParams(search);
  let paramsChanged = false;
  for (const p of DROP_PARAMS) {
    if (params.has(p)) {
      params.delete(p);
      paramsChanged = true;
    }
  }

  const dest = target ?? path;
  const changed = legacyHost || !!target || dest !== pathname || paramsChanged;
  if (!changed) return null;

  const q = params.toString();
  const [destPath, hash] = dest.split("#");
  return {
    kind: "redirect",
    location: `${CANONICAL_ORIGIN}${destPath}${q ? `?${q}` : ""}${hash ? `#${hash}` : ""}`,
  };
}
