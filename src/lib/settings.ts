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

/**
 * The service range of a compound as one string: "−40 °C to +175 °C
 * (continuous to 160 °C)". Every table that prints a range prints this, so
 * the hub, the category pages and the part pages cannot disagree — the old
 * site had FKM at three different ceilings.
 */
export function formatRange(c: SiteSettings["compounds"][number]): string {
  const sign = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `+${n}`);
  const base = `${sign(c.minC)} °C to ${sign(c.maxC)} °C`;
  return c.continuousMaxC
    ? `${base} (continuous to ${c.continuousMaxC} °C)`
    : base;
}

/**
 * The category pages' typography for the same range — "−40° to +175°C", the
 * continuous rating on its own line (sheets 09–17 §03). Same numbers, one
 * source; only the spacing differs from the hub's table.
 */
export function formatRangeCompact(c: SiteSettings["compounds"][number]): string {
  const sign = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `+${n}`);
  const base = `${sign(c.minC)}° to ${sign(c.maxC)}°C`;
  return c.continuousMaxC ? `${base}\ncontinuous to ${c.continuousMaxC}°C` : base;
}

/** Match by code ("FKM") or by the code in parentheses of a display name ("Viton® (FKM)"). */
export function compoundByCode(settings: SiteSettings, code: string) {
  const key = code.trim().toUpperCase();
  // "FKM", "Silicone (VMQ)", "Natural Rubber" and "Neoprene" all resolve:
  // by code, by the code in parentheses either way round, or by name.
  return settings.compounds.find(
    (c) =>
      c.code.toUpperCase() === key ||
      c.name.toUpperCase() === key ||
      c.name.toUpperCase().includes(`(${key})`) ||
      key.includes(`(${c.code.toUpperCase()})`),
  );
}
