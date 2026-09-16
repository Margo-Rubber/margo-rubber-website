import { getSitePage } from "@/lib/page-source";
import { buildMetadata } from "@/lib/seo";
import { utilityPageSchema } from "@/content/schemas";
import { getSiteSettings } from "@/lib/settings";
import { UtilityPage } from "@/components/sections/UtilityPage";

export async function generateMetadata() {
  const fm = await getSitePage("thank-you", utilityPageSchema);
  return buildMetadata(fm, "/thank-you");
}

/**
 * /thank-you — the post-RFQ confirmation.
 *
 * NOT YET WIRED: the /contact form has no backend, so nothing redirects here.
 * The page is built and ready to be the redirect target the moment it can be.
 *
 * The response time is rendered from site settings rather than written
 * into content. Three pages currently state three different SLAs (24 hours,
 * 1 business day, 3 business days); when Margo settles it, this page follows
 * without an edit.
 *
 * This page must never be indexed. It ships `status: placeholder` like
 * everything else, but even at launch it should stay noindex: an indexed
 * thank-you page pollutes conversion tracking and can surface for brand
 * queries.
 */
export default async function ThankYouPage() {
  const [fm, settings] = await Promise.all([
    getSitePage("thank-you", utilityPageSchema),
    getSiteSettings(),
  ]);

  return (
    <UtilityPage
      eyebrow={fm.eyebrow}
      h1Lines={fm.h1Lines}
      intro={fm.intro}
      steps={fm.steps}
      note={fm.note}
      linksHeading={fm.linksHeading}
      links={fm.links}
      actions={fm.actions}
      responsePromise={settings.commercial.acknowledgement}
      showTick
    />
  );
}
