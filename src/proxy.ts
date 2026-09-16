import { NextResponse, type NextRequest } from "next/server";

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
  if (process.env.NEXT_PUBLIC_BUILD_MODE !== "vision")
    return NextResponse.next();

  const user = process.env.PREVIEW_USER ?? "";
  const pass = process.env.PREVIEW_PASSWORD ?? "";
  const header = request.headers.get("authorization") ?? "";

  if (user && pass && header.startsWith("Basic ")) {
    const [u, p] = atob(header.slice(6)).split(":");
    if (u === user && p === pass) return NextResponse.next();
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

export const config = {
  matcher: [
    // Everything except: Next internals, static files, the API routes and the studio.
    "/((?!_next/|api/|studio|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2?|txt|xml)$).*)",
  ],
};
