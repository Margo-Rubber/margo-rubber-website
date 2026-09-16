import { getSitePage } from "@/lib/page-source";
import { siteSettingsSchema, type SiteSettings } from "@/content/schemas";

/**
 * The strings every page shares — read from the Sanity singleton, with the
 * checked-in settings.mdx as the fallback. Cached under the same tags as
 * every other singleton, and a publish of the settings document invalidates
 * every collection (see /api/revalidate), because there is no page that does
 * not read at least the footer.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  return getSitePage("settings", siteSettingsSchema);
}

/** "+91 96655 79276" → "+919665579276" for tel: hrefs. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
