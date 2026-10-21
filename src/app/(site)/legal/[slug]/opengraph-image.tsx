import { ogCard, OG_SIZE, OG_TYPE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Margo Rubber Products legal information";

/** Legal pages' share card (see app/(site)/about/opengraph-image.tsx). */
export default function Image() {
  return ogCard({ eyebrow: "Legal", title: "Margo Rubber Products: policies and terms" });
}
