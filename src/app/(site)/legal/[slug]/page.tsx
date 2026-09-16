import { notFound } from "next/navigation";
import { trail } from "@/lib/breadcrumbs";
import { getLegalPage, legalSlugs } from "@/lib/legal-source";
import { buildMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { LegalBody, LegalHero } from "@/components/sections/LegalBlocks";

/**
 * /legal/[slug] — one route, three documents, built to `Privacy Policy.pdf`.
 *
 * CONTENT STATUS. The comp supplies the design for all three pages but the
 * copy for only part of one: its frame renders Privacy Policy sections 1–3
 * and stops, while the table of contents lists twelve. Sections 4–12, and
 * both other documents, therefore ship with their headings and anchors in
 * place and their bodies empty.
 *
 * That is deliberate. A privacy policy's retention periods, transfer
 * mechanisms and user-rights procedures are statements about what Margo
 * actually does with people's data, and a terms page is a contract offered to
 * a visitor. Plausible-sounding filler here would not be placeholder copy the
 * way a marketing lede is — it would be a false representation that a reader
 * is entitled to rely on, and in several jurisdictions one that carries
 * penalties. So the structure is real and the gaps are visible and named.
 *
 * Every page ships `status: placeholder`, so all three are `noindex, nofollow`
 * until counsel supplies the text. See §A of 17_Open_Questions_For_Margo.md.
 */

export async function generateStaticParams() {
  return (await legalSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/legal/[slug]">) {
  const { slug } = await props.params;
  const fm = await getLegalPage(slug);
  return fm ? buildMetadata(fm, `/legal/${slug}`) : {};
}

const PENDING =
  "This section is awaiting approved wording from Margo's legal counsel. Its heading and anchor are in place so the document's structure and links are final; only the text is outstanding.";

export default async function LegalPage(props: PageProps<"/legal/[slug]">) {
  const { slug } = await props.params;

  const fm = await getLegalPage(slug);
  if (!fm) notFound();

  const crumbs = trail([fm.h1, `/legal/${slug}`]);

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: `/legal/${slug}`,
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
        })}
      />

      <LegalHero
        badge={fm.badge}
        h1={fm.h1}
        intro={fm.intro}
        lastUpdated={fm.lastUpdated}
        breadcrumb={crumbs}
      />
      <LegalBody sections={fm.sections} pendingNote={PENDING} />
    </>
  );
}
