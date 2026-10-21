import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Margo Rubber Products: Send a drawing or a sample for a quotation";

/**
 * This page's share card. Without its own file a page had no og:image at
 * all: buildMetadata sets openGraph per page, which drops the home card it
 * would otherwise inherit (21 Oct 2026).
 */
export default function Image() {
  return ogCard({ eyebrow: "Contact", title: "Send a drawing or a sample for a quotation" });
}
