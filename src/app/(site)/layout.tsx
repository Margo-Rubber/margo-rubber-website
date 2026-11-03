import { SiteHeader } from "@/components/nav/SiteHeader";
import { ConceptBand } from "@/components/nav/ConceptBand";
import { ImageOverrideProvider } from "@/components/ui/ImageOverrideProvider";
import { getImageOverrides } from "@/lib/image-overrides";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Analytics } from "@/components/analytics/Analytics";
import { getSiteSettings } from "@/lib/settings";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationNode } from "@/lib/schema";

/**
 * The public site's chrome.
 *
 * A route group, so it adds no path segment: every marketing URL is exactly
 * what it was. It exists so the header and footer wrap the marketing pages
 * and nothing else — the enquiries desk sits outside it and renders bare.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Fetched once here rather than per image: `Img` is used inside client
  // components and cannot fetch, and resolving overrides inside every page's
  // data fetch would mean changing the props of nearly every component that
  // takes an image key.
  const [images, settings, organization] = await Promise.all([
    getImageOverrides(),
    getSiteSettings(),
    organizationNode(),
  ]);

  return (
    <ImageOverrideProvider value={images}>
      {/* The Organization entity, once per page, so every page graph's
          reference to /#organization resolves where it is used. Built from
          Site settings, which are confirmed facts, hence "published". */}
      <JsonLd
        status="published"
        graph={{ "@context": "https://schema.org", ...organization }}
      />
      <SiteHeader />
      {/* overflow-x-clip: a safety net so a decorative glow or an
          over-wide element can never make a phone scroll sideways. `clip`,
          not `hidden`, so sticky elements inside keep working. */}
      <main className="flex-1 overflow-x-clip">{children}</main>
      <SiteFooter />
      <ConceptBand />
      <WhatsAppButton number={settings.entity.whatsapp} />
      <Analytics />
    </ImageOverrideProvider>
  );
}
