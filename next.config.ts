import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { REDIRECTS } from "./src/content/redirects";

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

  async redirects() {
    // Moved and merged part pages — src/content/redirects.ts. The 26 legacy
    // WooCommerce SKU URLs join the same list once the pre-cutover crawl
    // names them (blocker B15).
    // A 301 as the sheets specify — `permanent: true` would send a 308.
    return REDIRECTS.map((r) => ({ source: r.from, destination: r.to, statusCode: 301 }));
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
