import { ImageResponse } from "next/og";

/**
 * SHARE CARDS — one 1200×630 image per template (ticket T15).
 *
 * Before this, every page shared the same og-default.png, so a link to an
 * O-ring page and a link to a mining page looked identical on LinkedIn and
 * WhatsApp. Each template's `opengraph-image.tsx` calls this with the page's
 * own title and, for parts and product lines, its own photograph.
 *
 * Plain system fonts and flat colours: nothing to fetch but the photo, so a
 * card renders even if the photo cannot be reached (it is simply left out).
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

export async function ogCard({
  eyebrow,
  title,
  photo,
}: {
  eyebrow: string;
  title: string;
  /** Absolute URL of a photo on a white background. */
  photo?: string | null;
}) {
  // Confirm the photo is reachable before handing it to the renderer, which
  // fails the whole card on a broken image.
  let src: string | null = null;
  if (photo) {
    try {
      const r = await fetch(photo, { method: "HEAD" });
      if (r.ok) src = photo;
    } catch {
      src = null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0A0A0B",
          color: "#F2F4F6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 56px 56px 64px",
            width: src ? 660 : 1200,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, letterSpacing: 4, color: "#2BBCC4", textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            <div style={{ fontSize: title.length > 60 ? 50 : 60, fontWeight: 700, lineHeight: 1.1, marginTop: 24 }}>
              {title}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>MARGO RUBBER PRODUCTS</div>
            <div style={{ fontSize: 22, color: "#9AA3AE", marginTop: 8 }}>
              Made to drawing in Nashik, India · www.margorubber.com
            </div>
          </div>
        </div>
        {src && (
          <div
            style={{
              display: "flex",
              width: 540,
              height: "100%",
              background: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" style={{ maxWidth: 480, maxHeight: 520, objectFit: "contain" }} />
          </div>
        )}
      </div>
    ),
    OG_SIZE,
  );
}

/** Drop the " | Margo" brand suffix from a search title. */
export const cardTitle = (t: string) => t.replace(/\s*\|\s*Margo.*$/i, "").trim();
