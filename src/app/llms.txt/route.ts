import { cacheTag } from "next/cache";
import { groq } from "next-sanity";
import { client } from "../../../sanity/client";
import { getSiteSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/seo";
import { isIndexable } from "@/lib/build-mode";
import { pathFor } from "@/lib/published-paths";
import { getAllSlugs, getFrontmatter } from "@/lib/content";
import { pageTag } from "@/lib/page-source";
import { productTag } from "@/lib/product-source";
import { industryTag } from "@/lib/industry-source";
import { resourceTag } from "@/lib/resource-source";

/**
 * /llms.txt
 *
 * A plain-text summary of the site for language models.
 *
 * Built from the SAME Sanity documents the pages render, never from the old
 * .mdx seed files — those still carried pre-launch copy (a 500-piece
 * minimum, ASME B16.20 for rubber gaskets, a compound "spotlight"), and this
 * file repeated it to every AI crawler (ticket T04). Titles and descriptions
 * are each page's own search-listing title and description, so an edit in
 * Studio reaches this file on the next publish.
 *
 * Only published pages are listed, exactly as in the sitemap.
 */

type Row = {
  _type: string;
  slug: string;
  status: string;
  category?: string;
  navLabel?: string;
  h1?: string;
  title?: string;
  description?: string;
};

const query = groq`
  *[_type in ["productCategory", "sku", "industry", "resource"] && defined(slug.current) && !(_id in path("drafts.**"))]{
    _type, "slug": slug.current, status, category, navLabel, h1,
    "title": seo.title, "description": seo.description
  }
`;

async function listedPages(): Promise<Row[]> {
  "use cache";
  cacheTag(pageTag(), productTag(), industryTag(), resourceTag());
  const rows: Row[] = await client.fetch<Row[]>(query).catch(() => [] as Row[]);

  // Files the CMS does not know about yet answer for themselves — the same
  // fallback the sitemaps use (lib/published.ts), so a page held in an .mdx
  // file (the Oct 2026 release, before migration) is listed in both.
  const seen = new Set(rows.map((r) => `${r._type}:${r.slug}`));
  const files: { collection: "products" | "industries" | "resources" | "skus"; type: string }[] = [
    { collection: "products", type: "productCategory" },
    { collection: "skus", type: "sku" },
    { collection: "industries", type: "industry" },
    { collection: "resources", type: "resource" },
  ];
  for (const { collection, type } of files) {
    for (const file of getAllSlugs(collection)) {
      const [category, part] = type === "sku" ? file.split("--") : [undefined, file];
      const slug = part ?? file;
      if (seen.has(`${type}:${slug}`) || seen.has(`${type}:${file}`)) continue;
      const fm = getFrontmatter(collection, file) as {
        status: string; navLabel?: string; h1?: string; seo: { title: string; description: string };
      };
      rows.push({
        _type: type, slug, status: fm.status, category, navLabel: fm.navLabel, h1: fm.h1,
        title: fm.seo.title, description: fm.seo.description,
      });
    }
  }
  return rows;
}

/** The company pages, listed under Company. Append a row to add one. */
const COMPANY_PAGES: [name: string, path: string][] = [
  ["Home", "/"],
  ["About", "/about"],
  ["Case studies", "/case-studies"],
  ["Certifications", "/certifications"],
  ["Contact", "/contact"],
  ["Export", "/export"],
  ["Industries", "/industries"],
  ["Disclaimer", "/legal/disclaimer"],
  ["Export compliance", "/legal/export-compliance"],
  ["Privacy policy", "/legal/privacy-policy"],
  ["Terms", "/legal/terms"],
  ["Manufacturing", "/manufacturing"],
  ["Products", "/products"],
  ["Resources", "/resources"],
];

const clean = (s?: string) => (s ?? "").replace(/\s*\|\s*Margo.*$/i, "").trim();

function section(heading: string, rows: Row[]): string | null {
  const lines = rows
    .map((r) => ({ r, path: isIndexable(r.status) ? pathFor(r) : null }))
    .filter((x): x is { r: Row; path: string } => !!x.path)
    .sort((a, b) => a.path.localeCompare(b.path))
    .map(({ r, path }) => {
      const name = clean(r.title) || r.navLabel || r.h1 || r.slug;
      return `- [${name}](${SITE_URL}${path})${r.description ? `: ${r.description}` : ""}`;
    });
  return lines.length ? `## ${heading}\n\n${lines.join("\n")}` : null;
}

export async function GET() {
  const [{ entity, commercial, certifications }, rows] = await Promise.all([
    getSiteSettings(),
    listedPages(),
  ]);
  const of = (t: string) => rows.filter((r) => r._type === t);

  const parts: (string | null)[] = [
    `# ${entity.legalName}`,
    "",
    // Two sentences on purpose: the certificate covers moulded components
    // only, so it is never stated in the same sentence as extrusion (T03).
    `> Manufacturer of precision moulded and extruded rubber components, made to drawing in ${entity.address.locality}, ${entity.address.region}, India, and supplied to OEMs directly from the factory. Quality system certified to ${certifications.line.split(" · ")[0]} for moulded rubber components.`,
    "",
    "## Company",
    "",
    [
      `- Location: ${entity.address.locality}, ${entity.address.region}, India`,
      `- Certification: ${certifications.line} (scope: moulded rubber components)`,
      `- Minimum run: ${commercial.minimumRunMoulded}`,
      `- Quotation: ${commercial.quotation}; acknowledgement ${commercial.acknowledgement}`,
      `- Incoterms: ${commercial.incoterms}`,
      `- Terms: ${commercial.terms}`,
      `- Contact: ${entity.email} · ${entity.phone} · ${entity.hours}`,
    ].join("\n"),
    "",
    COMPANY_PAGES.map(([name, path]) => `- [${name}](${SITE_URL}${path})`).join("\n"),
    "",
    section("Product lines", of("productCategory")),
    "",
    section("Parts", of("sku")),
    "",
    section("Industries", of("industry")),
    "",
    section("Technical guides", of("resource")),
    "",
    "## Notes",
    "",
    "- Figures above are the manufacturer's own and are the single source used across this site.",
    "- Only published pages are listed.",
  ];

  const body = parts
    .filter((p) => p !== null)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();

  return new Response(body + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
