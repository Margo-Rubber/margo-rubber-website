import { SiteHeader } from "@/components/nav/SiteHeader";
import { ConceptBand } from "@/components/nav/ConceptBand";
import { ImageOverrideProvider } from "@/components/ui/ImageOverrideProvider";
import { getImageOverrides } from "@/lib/image-overrides";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Analytics } from "@/components/analytics/Analytics";
import { getSiteSettings } from "@/lib/settings";

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
  const [images, settings] = await Promise.all([getImageOverrides(), getSiteSettings()]);

  return (
    <ImageOverrideProvider value={images}>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <ConceptBand />
      <WhatsAppButton number={settings.entity.whatsapp} />
      <Analytics />
    </ImageOverrideProvider>
  );
}
