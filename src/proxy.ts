import { NextResponse, type NextRequest } from "next/server";
import { isLegacyHost, resolveLegacy } from "@/lib/legacy-redirect";

/**
 * THE GATE ON THE VISION BUILD.
 *
 * Build Instructions §01: the vision build lives on a separate,
 * password-protected preview URL. Vercel's own deployment protection is a
 * paid feature on this plan, so the gate is HTTP basic auth here, switched
 * on by the same variable that turns on the CONCEPT band and noindex.
 *
 *   NEXT_PUBLIC_BUILD_MODE=vision
 *   PREVIEW_USER=…   PREVIEW_PASSWORD=…
 *
 * On the buyer build (the default) this file does nothing at all. If the
 * mode is vision but no credentials are set, every request is refused
 * rather than let the vision copy out ungated.
 *
 * The webhook, the enquiry endpoint and Next's own assets are excluded so
 * Sanity can still revalidate and the form still posts; the studio is
 * excluded because it has its own login.
 */
export function proxy(request: NextRequest) {
  /* ── Old URLs, in one hop (ticket T01) ────────────────────────────────
     Every request to margorubber.in, any trailing slash, and any old
     WordPress path is answered here with a single redirect to its final
     www.margorubber.com URL, or 410 Gone for WordPress internals. */
  const host = request.headers.get("host") ?? "";
  const { pathname, search } = request.nextUrl;
  const legacy = resolveLegacy(pathname, search, isLegacyHost(host));
  if (legacy?.kind === "gone") {
    return new NextResponse("Gone", {
      status: 410,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }
  if (legacy?.kind === "redirect") {
    return NextResponse.redirect(legacy.location, 301);
  }

  if (process.env.NEXT_PUBLIC_BUILD_MODE !== "vision")
    return withCountry(request, NextResponse.next());

  const user = process.env.PREVIEW_USER ?? "";
  const pass = process.env.PREVIEW_PASSWORD ?? "";
  const header = request.headers.get("authorization") ?? "";

  if (user && pass && header.startsWith("Basic ")) {
    const [u, p] = atob(header.slice(6)).split(":");
    if (u === user && p === pass) return withCountry(request, NextResponse.next());
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate":
        'Basic realm="Margo Rubber concept preview", charset="UTF-8"',
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

/* ── The visitor's country, for the contact numbers ──────────────────────
   Indian buyers and export buyers are handled by different people, so a
   visitor in India sees the India number from Site settings and everyone
   else the export number. The pages are pre-built and identical for all;
   this only tells the browser which country the request came from, and
   RegionalContact swaps the numbers there.

   Vercel puts the country of the visitor's IP on every request as
   x-vercel-ip-country. `?cc=IN` (or any two-letter code) pins a country
   for that browser, so the team can see either version from anywhere and
   locally, where there is no header; `?cc=` with nothing unpins it. */
const COUNTRY_COOKIE = "mr_cc";
const PINNED_COOKIE = "mr_cc_pin";

function withCountry(request: NextRequest, response: NextResponse) {
  const cookie = { path: "/", sameSite: "lax" as const, maxAge: 60 * 60 * 24 * 30 };
  const override = request.nextUrl.searchParams.get("cc");
  if (override !== null) {
    const pinned = override.toUpperCase();
    if (/^[A-Z]{2}$/.test(pinned)) {
      response.cookies.set(COUNTRY_COOKIE, pinned, cookie);
      response.cookies.set(PINNED_COOKIE, "1", cookie);
    } else {
      response.cookies.delete(COUNTRY_COOKIE);
      response.cookies.delete(PINNED_COOKIE);
    }
    return response;
  }
  if (request.cookies.has(PINNED_COOKIE)) return response;

  const country = (request.headers.get("x-vercel-ip-country") ?? "").toUpperCase();
  // Read by the page's script, so not httpOnly. Set only when it changes.
  if (/^[A-Z]{2}$/.test(country) && country !== request.cookies.get(COUNTRY_COOKIE)?.value)
    response.cookies.set(COUNTRY_COOKIE, country, cookie);
  return response;
}

export const config = {
  matcher: [
    // Everything except: Next internals, static files, the API routes and the studio.
    "/((?!_next/|api/|studio|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2?|txt|xml)$).*)",
    // Every path on the old domain, files included, so each one redirects.
    {
      source: "/:path*",
      has: [{ type: "header", key: "host", value: "(?:www\\.)?margorubber\\.in(?::\\d+)?" }],
    },
  ],
};
