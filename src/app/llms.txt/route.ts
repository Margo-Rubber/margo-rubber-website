import { getSiteSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/seo";
import { getFrontmatter, getPublishedSlugs } from "@/lib/content";

/**
 * /llms.txt
 *
 * A plain-text summary of the site for language models, which read a page's
 * text but rarely its JSON-LD and never its sitemap. It answers, in one
 * fetch, the questions an assistant is actually asked about a manufacturer:
 * what do they make, to what standard, in what quantity, and where do they
 * ship.
 *
 * TWO RULES, both the reason this can exist before Margo's content does.
 *
 *  1. Every fact here comes from the facts registry in site.ts, which holds
 *     `null` for anything Margo has not confirmed. Nothing is written into
 *     this file by hand, so it cannot drift from the site or assert a
 *     founding year and country count that are still disputed.
 *
 *  2. Pages are listed only once `published`, exactly as in sitemap.ts.
 *     Pointing a model at a page whose own metadata says `noindex` would be
 *     the same contradiction, just in a different file.
 *
 * Today that means a document with the company summary and no page list.
 * That is correct: it is true, and it grows on its own as content is signed
 * off.
 */


/** One "- [Title](url): description" line per published page in a collection. */
function section(
  heading: string,
  collection: string,
  base: string,
): string | null {
  const slugs = getPublishedSlugs(collection);
  if (!slugs.length) return null;

  const lines = slugs.map((slug) => {
    // Frontmatter is only read for pages already known to be valid and
    // published, so a schema error elsewhere cannot take this file down.
    const fm = getFrontmatter(collection as never, slug) as {
      h1?: string;
      navLabel?: string;
      seo?: { description?: string };
    };
    const title = fm.navLabel ?? fm.h1 ?? slug;
    const desc = fm.seo?.description ?? "";
    return `- [${title}](${SITE_URL}${base}/${slug})${desc ? `: ${desc}` : ""}`;
  });

  return `## ${heading}\n\n${lines.join("\n")}`;
}

export async function GET() {
  const { entity, commercial, certifications } = await getSiteSettings();
  const held = certifications.items.filter((c) => c.standing === "held").map((c) => c.code);

  const parts: (string | null)[] = [
    `# ${entity.legalName}`,
    "",
    `> ${held.join(", ")} certified manufacturer of precision moulded and extruded rubber components, based in ${entity.address.locality}, ${entity.address.region}, India. Supplies OEMs and distributors directly from the factory.`,
    "",
    "## Company",
    "",
    [
      `- Location: ${entity.address.locality}, ${entity.address.region}, India`,
      `- Certification: ${certifications.line}`,
      `- Minimum run: ${commercial.minimumRunMoulded}`,
      `- Installed capacity: ${commercial.capacityInstalledMonthly.toLocaleString("en-GB")} pieces a month; current output ${commercial.capacityCurrentMonthly.toLocaleString("en-GB")}`,
      `- Quotation: ${commercial.quotation}; acknowledgement ${commercial.acknowledgement}`,
      `- Incoterms: ${commercial.incoterms}`,
      `- Terms: ${commercial.terms}`,
      `- Contact: ${entity.email} · ${entity.phone} · ${entity.hours}`,
    ]
      .filter(Boolean)
      .join("\n"),
    "",
    section("Products", "products", "/products"),
    "",
    section("Industries", "industries", "/industries"),
    "",
    section("Technical guides", "resources", "/resources"),
    "",
    "## Notes",
    "",
    "- Figures above are the manufacturer's own, and are the single source used across this site.",
    "- Only pages whose content is finalised are listed here.",
  ];

  const body = parts
    .filter((p) => p !== null)
    .join("\n")
    // Collapse the gaps left by omitted sections.
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Same freshness as the pages it describes.
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
