import { getSitePage } from "@/lib/page-source";
import { buildMetadata } from "@/lib/seo";
import { manufacturingPageSchema, type ManufacturingPage } from "@/content/schemas";
import { trail } from "@/lib/breadcrumbs";
import { pageGraph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnswerLead } from "@/components/sections/AnswerLead";
import { answerBlockFor } from "@/content/answer-blocks";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { accented, emphasised } from "@/components/ui/Emphasis";

export async function generateMetadata() {
  const fm = await getSitePage("manufacturing", manufacturingPageSchema);
  return buildMetadata(fm, "/manufacturing");
}

/**
 * /manufacturing — how a part is made (3rd Shade keyword pack K5, 25 Oct 2026).
 *
 * One article-shaped page: H1, the answer block, then H2 sections of
 * paragraphs, bullets and small tables from the CMS, and one CTA. Per the
 * pack: BreadcrumbList as on other pages, NO FAQPage schema — so the answer
 * block renders visibly but is deliberately not passed into the JSON-LD.
 */

const paragraphs = (s?: string) =>
  (s ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

function SectionTable({ table }: { table: NonNullable<ManufacturingPage["sections"][number]["table"]> }) {
  const rows = table.rows.map((r) => r.split("|").map((c) => c.trim()));
  return (
    <div className="border-line bg-surface-3 overflow-x-auto rounded-card border">
      <table className="w-full text-sm">
        {table.caption && <caption className="sr-only">{table.caption}</caption>}
        <thead>
          <tr className="border-line border-b text-left">
            {table.columns.map((c) => (
              <th key={c} scope="col" className="text-eyebrow text-ink-3 px-4 py-3 font-mono uppercase">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-line border-b last:border-0 align-top">
              {cells.map((cell, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? "text-ink font-medium whitespace-nowrap" : "text-ink-2"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ManufacturingPage() {
  const fm = await getSitePage("manufacturing", manufacturingPageSchema);
  const crumbs = trail(["Manufacturing", "/manufacturing"]);

  return (
    <>
      <JsonLd
        status={fm.status}
        graph={await pageGraph({
          path: "/manufacturing",
          name: fm.seo.title,
          description: fm.seo.description,
          crumbs,
        })}
      />

      <header className="bg-canvas hero-offset border-line border-b pb-12 md:pb-14">
        <Container>
          <Breadcrumb items={crumbs} />
          <Eyebrow>MANUFACTURING · VILHOLI, NASHIK</Eyebrow>
          <h1 className="text-h1 mt-5 max-w-[22ch]">{accented(fm.h1)}</h1>
          {fm.standfirst && (
            <p className="text-ink-2 mt-6 max-w-[62ch] leading-relaxed">{emphasised(fm.standfirst)}</p>
          )}
        </Container>
      </header>

      <AnswerLead block={answerBlockFor("/manufacturing")} />

      {fm.sections.map((s, i) => (
        <Section
          key={s.heading}
          id={s.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}
          eyebrow={`${String(i + 1).padStart(2, "0")} · PROCESS`}
          heading={s.heading}
          className={i % 2 === 1 ? "bg-surface-2" : ""}
        >
          <div className="max-w-[70ch] space-y-5">
            {paragraphs(s.intro).map((p) => (
              <p key={p.slice(0, 40)} className="text-ink-2 leading-relaxed">
                {emphasised(p)}
              </p>
            ))}
            {s.bullets.length > 0 && (
              <ul className="text-ink-2 list-disc space-y-2 pl-5 leading-relaxed">
                {s.bullets.map((b) => (
                  <li key={b.slice(0, 40)}>{emphasised(b)}</li>
                ))}
              </ul>
            )}
            {s.table && <SectionTable table={s.table} />}
            {paragraphs(s.outro).map((p) => (
              <p key={p.slice(0, 40)} className="text-ink-2 leading-relaxed">
                {emphasised(p)}
              </p>
            ))}
            {i === fm.sections.length - 1 && fm.cta && (
              <div className="pt-4">
                <Button href={fm.cta.href}>{fm.cta.label}</Button>
              </div>
            )}
          </div>
        </Section>
      ))}
    </>
  );
}
