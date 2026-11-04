import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { REDIRECTS } from "./src/content/redirects";
import { dataset, projectId } from "./sanity/env";

const nextConfig: NextConfig = {
  // NOTE: `mdx` is deliberately NOT in pageExtensions. Content files live in
  // src/content/ and are loaded by slug — they are data, not routes. Adding
  // mdx here would turn every content file into an accidental URL.
  pageExtensions: ["ts", "tsx"],

  images: {
    // WebP only. AVIF is ~20% smaller but several times slower to encode, and
    // every new image size is encoded on its first request — that encode was
    // the multi-second wait before photos appeared on a cold page.
    formats: ["image/webp"],
    // Photographs uploaded through the CMS are served from Sanity's asset CDN.
    // Next fetches each original once per size variant, optimises it, and
    // serves its own cache from then on — so this costs Sanity bandwidth per
    // variant, not per visitor.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },

  // Next 16: top-level, no longer experimental.
  cacheComponents: true,

  // Trailing slashes are removed by src/proxy.ts instead, in the SAME hop as
  // any legacy redirect. Next's own trailing-slash redirect runs first and
  // would add a hop to every old WordPress URL (they all end in "/").
  skipTrailingSlashRedirect: true,

  // Override Next's built-in "default" cache profile. Every `"use cache"`
  // function here sets tags but no cacheLife, so they all fell back to the
  // default 15-minute revalidate — and because the (site) layout reads image
  // overrides, every page re-rendered (and wrote to Vercel ISR storage) every
  // 15 minutes it was crawled. Freshness comes from the Sanity webhook
  // (revalidateTag); the 30-day timer is only a safety net.
  cacheLife: {
    default: {
      stale: 300, // 5 min client-side
      revalidate: 60 * 60 * 24 * 30, // 30 days
      expire: 60 * 60 * 24 * 365, // 1 year
    },
  },

  // Styles arrive inside the HTML, so first paint does not wait on a stylesheet
  // competing with fonts and scripts on a slow connection. Experimental, and
  // production builds only.
  experimental: {
    inlineCss: true,
  },

  // Dev server only. Next 16 refuses its own JS chunks (403) to any host other
  // than `localhost`, so opening the dev site via 127.0.0.1 or from a phone on
  // the same Wi-Fi rendered the HTML but never started React — no menus, no
  // forms, no scroll effects. These are the private-network ranges a phone or
  // second laptop would use. Has no effect on production builds.
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*", "10.*.*.*", "172.*.*.*"],

  // Sanity Studio pulls in packages that ship raw .ts inside node_modules,
  // which Turbopack refuses with "Unknown module type". Naming them here
  // hands them to the compiler instead of the bundler's asset pipeline.
  transpilePackages: ["sanity", "@sanity/sdk-react", "@sanity/workbench"],

  // 3D models (.glb) and certificate PDFs uploaded in Studio live on Sanity's file CDN, which
  // sends no CORS header for this site — the browser blocks the viewer's
  // fetch of them. Served through our own domain instead, they are
  // same-origin and need no CORS at all. See src/lib/sanity-file.ts.
  // T22: baseline security headers on every page. The Content-Security-
  // Policy is REPORT-ONLY: browsers log what it would block (devtools
  // console) but block nothing, so it cannot break the site while it is
  // tuned. The Studio is left out — it loads its own tooling.
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.clarity.ms https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://cdn.sanity.io https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com https://www.facebook.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.sanity.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://connect.facebook.net https://www.facebook.com",
      "media-src 'self' https://cdn.sanity.io",
      "frame-src 'self' https://www.facebook.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self' https://www.facebook.com",
    ].join("; ");
    return [
      {
        source: "/((?!studio).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/sanity-files/:path*",
        destination: `https://cdn.sanity.io/files/${projectId}/${dataset}/:path*`,
      },
    ];
  },

  async redirects() {
    // Moved and merged part pages — src/content/redirects.ts. The 26 legacy
    // WooCommerce SKU URLs join the same list once the pre-cutover crawl
    // names them (blocker B15).
    // A 301 as the sheets specify — `permanent: true` would send a 308.
    // Not on margorubber.in: there, src/proxy.ts sends each old URL straight
    // to its final www.margorubber.com address in ONE hop. Matched here
    // first, these would add a hop on the old domain (T01).
    return REDIRECTS.map((r) => ({
      source: r.from,
      destination: r.to,
      statusCode: 301,
      missing: [{ type: "host" as const, value: "(?:www\\.)?margorubber\\.in" }],
    }));
  },
};

const withMDX = createMDX({
  options: {
    // Turbopack requires plugin names as strings — JS functions can't be
    // passed to Rust. Options must be serializable.
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
