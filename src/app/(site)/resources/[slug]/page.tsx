import Link from "next/link";
import { displayName } from "@/content/routes";
import { getSiteSettings } from "@/lib/settings";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { trail } from "@/lib/breadcrumbs";
import { notFound } from "next/navigation";
import { getResourcePage, listResources, resourceSlugs } from "@/lib/resource-source";
import { emphasised } from "@/components/ui/Emphasis";
import { Prose } from "@/components/blocks/Prose";
import { buildMetadata } from "@/lib/seo";
import { articleNode, pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Section";
import { publishedRoutes } from "@/lib/published";

export async function generateStaticParams() {
  return (await resourceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/resources/[slug]">,
) {
  const { slug } = await props.params;
  const page = await getResourcePage(slug);
  return page ? buildMetadata(page.frontmatter, `/resources/${slug}`) : {};
}

const CATEGORY_LABEL: Record<string, string> = {
  "material-comparison": "Material Comparison",
  "sizing-spec": "Sizing & Spec",
  "sourcing-buyer": "Sourcing & Buyer",
  datasheets: "Datasheets",
};

/** "2026-09-01" → "1 September 2026", fixed locale so server and client agree. */
function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${d} ${months[m - 1]} ${y}`;
}

/**
 * /resources/[slug] — the guide template.
 *
 * NOTE: there is no Figma design for this page type. The layout below is
 * derived from the established design system and should be reviewed before it
 * carries real copy.
 *
 * The guides currently have no body. Rather than fabricate material
 * engineering, `hasBody` drives an explicit in-preparation state: the reader is
 * told the guide is being written and pointed at the pages that DO have
 * substance. The moment real prose lands in the MDX body, this page renders it
 * and the notice disappears with no code change.
 */
export default async function ResourceGuidePage(
  props: PageProps<"/resources/[slug]">,
) {
  const { slug } = await props.params;

  // Unknown slugs are handled by letting getContent throw rather than by
  // listing the directory here. Reading the filesystem inside the component is
  // runtime data, which makes the route blocking under cacheComponents and
  // stops the fallback shell prerendering. Same pattern as the products and
  // industries routes.
  const page = await getResourcePage(slug);
  if (!page) notFound();

  const { frontmatter: fm, Content, prose, hasBody } = page;
  const { guideReviewer } = await getSiteSettings();
  const related = fm.related;
  const guides = related.resources.length ? await listResources() : [];
  // "Guide-to-guide links only where the target is published. A link to an
  // unwritten guide is another dead affordance." — RES_01 §12.
  const live = new Set((await publishedRoutes()).filter((r) => r.type === "resource").map((r) => r.slug));
  const pages = related.pages.filter((p) => !p.href.startsWith("/resources/") || live.has(p.href.slice("/resources/".length)));
  const resources = related.resources.filter((r) => live.has(r));

  const crumbs = trail(
    ["Resources", "/resources"],
    [fm.navLabel, `/resources/${slug}`],
  );

  return (
    <article className="bg-canvas">
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: `/resources/${slug}`,
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
          faqs: fm.faqs,
          extra: [await articleNode(fm, `/resources/${slug}`)],
        })}
      />

      <header className="relative isolate overflow-hidden hero-offset pb-14">
        <span
          aria-hidden
          className="bg-accent-400/10 pointer-events-none absolute -top-24 -left-32 -z-10 size-[30rem] rounded-full blur-3xl"
        />
        <Container>
          <Breadcrumb items={crumbs} />

          {/* A datasheet is looked up, not read through: its own line
              stands in for the category and read time (sheet 40). */}
          <p className="text-eyebrow text-accent-400 mt-8 flex items-center gap-2.5 font-mono uppercase">
            {fm.eyebrow ?? (
              <>
                {CATEGORY_LABEL[fm.category] ?? fm.category}
                <span aria-hidden className="text-ink-4">·</span>
                <span className="text-ink-4 normal-case">
                  {fm.readingMinutes} min read
                </span>
              </>
            )}
          </p>

          <h1 className="text-display-2 mt-4 max-w-[24ch]">{fm.h1}</h1>

          <p className="text-ink-3 mt-6 max-w-[60ch] leading-relaxed">
            {fm.standfirst ?? fm.intro}
          </p>
          {/* The byline — reviewer from Site settings, date from the guide.
              Nothing renders while either is unset (sheet 35). */}
          {(guideReviewer.name || fm.publishedAt) && hasBody && (
            <p className="text-ink-4 mt-6 text-sm">
              {guideReviewer.name && (
                <>
                  Reviewed at our works in Nashik by {guideReviewer.name}
                  {guideReviewer.role ? `, ${guideReviewer.role}` : ""}
                </>
              )}
              {guideReviewer.name && fm.publishedAt ? " · " : ""}
              {fm.publishedAt && <>Published {longDate(fm.publishedAt)}</>}
              {fm.updatedAt && fm.updatedAt !== fm.publishedAt && (
                <> · Updated <time dateTime={fm.updatedAt}>{longDate(fm.updatedAt)}</time></>
              )}
            </p>
          )}
        </Container>
      </header>

      <Container>
        {hasBody ? (
          <div className="prose-guide max-w-[68ch] pb-16">
            {/* Same wrapper for both sources, so a guide written in Studio and
                one written in MDX are indistinguishable once rendered. */}
            {prose ? <Prose value={prose} /> : Content ? <Content /> : null}
          </div>
        ) : (
          <div className="rounded-card border-line border-l-accent-400 mb-16 max-w-[68ch] border border-l-2 bg-[#0B0D10] p-7 md:p-9">
            <h2 className="text-ink text-lg font-semibold">
              This guide is being written
            </h2>
            <p className="text-ink-4 mt-3 text-sm leading-relaxed">
              We publish technical guides only once the engineering content has
              been reviewed by our team in Nashik. This one is in preparation.
              Rather than fill the page with generic material, we would rather
              answer your specific question directly.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-accent-400 text-ink hover:opacity-90 shadow-glow rounded-cta inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors"
              >
                Ask our engineers
              </Link>
              <Link
                href="/resources"
                className="border-line-2 text-ink hover:border-accent-400/60 rounded-pill inline-flex items-center border px-6 py-3 text-sm font-semibold transition-colors"
              >
                Back to all guides
              </Link>
            </div>
          </div>
        )}

        {/* The questions the FAQPage node carries, on the page as well —
            the same rule as everywhere else on the site. */}
        {hasBody && fm.faqs.length > 0 && (
          <section className="max-w-[68ch] pb-16">
            <h2 className="text-h2">Frequently asked questions</h2>
            <ul className="mt-6 space-y-4">
              {fm.faqs.map((f) => (
                <li key={f.q} className="rounded-card border-line border bg-[#0B0D10]">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-5 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-ink text-sm font-medium">{f.q}</h3>
                      <span aria-hidden className="text-ink-4 transition-transform group-open:rotate-180">⌄</span>
                    </summary>
                    <p className="text-ink-3 px-5 pb-5 text-sm leading-relaxed">{f.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* The closing offer the sheet writes for this guide. */}
        {hasBody && fm.closing && (
          <div className="rounded-card border-line border-l-accent-400 mb-16 max-w-[68ch] border border-l-2 bg-[#0B0D10] p-7 md:p-9">
            <p className="text-ink-2 leading-relaxed">{emphasised(fm.closing.body, "text-ink font-semibold")}</p>
            <div className="mt-6">
              <Link
                href={fm.closing.cta.href}
                className="bg-accent-400 text-ink hover:opacity-90 shadow-glow rounded-cta inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors"
              >
                {fm.closing.cta.label} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Related links carry the internal-linking spec from the plan: every
            guide points at the categories and sectors it informs. */}
        {(related.products.length > 0 || related.industries.length > 0 || resources.length > 0 || pages.length > 0) && (
          <div className="border-line max-w-[68ch] border-t pt-10 pb-20">
            <h2 className="text-eyebrow text-ink-4 font-mono uppercase">
              Related
            </h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {related.products.map((p) => (
                <li key={`p-${p}`}>
                  <Link
                    href={`/products/${p}`}
                    className="border-line-2 text-ink-2 hover:border-accent-400/60 hover:text-ink rounded-pill inline-flex border px-4 py-2 text-sm transition-colors"
                  >
                    {displayName(p)}
                  </Link>
                </li>
              ))}
              {related.industries.map((i) => (
                <li key={`i-${i}`}>
                  <Link
                    href={`/industries/${i}`}
                    className="border-line-2 text-ink-2 hover:border-accent-400/60 hover:text-ink rounded-pill inline-flex border px-4 py-2 text-sm transition-colors"
                  >
                    {displayName(i)}
                  </Link>
                </li>
              ))}
              {/* Guide-to-guide links, by the other guide's short name. */}
              {resources.map((r) => (
                <li key={`r-${r}`}>
                  <Link
                    href={`/resources/${r}`}
                    className="border-line-2 text-ink-2 hover:border-accent-400/60 hover:text-ink rounded-pill inline-flex border px-4 py-2 text-sm transition-colors"
                  >
                    {guides.find((g) => g.slug === r)?.navLabel ?? r}
                  </Link>
                </li>
              ))}
              {/* Any other page, with the sheet's own anchor text. */}
              {pages.map((p) => (
                <li key={`g-${p.href}`}>
                  <Link
                    href={p.href}
                    className="border-line-2 text-ink-2 hover:border-accent-400/60 hover:text-ink rounded-pill inline-flex border px-4 py-2 text-sm transition-colors"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </article>
  );
}
