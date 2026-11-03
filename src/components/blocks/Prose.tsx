import { PortableText, type PortableTextComponents } from "next-sanity";
import Link from "next/link";
import { Img } from "@/components/ui/Img";

/**
 * LONG-FORM PROSE WRITTEN IN THE CMS
 *
 * The resource guides are the one place on this site with genuine article
 * content — 1,200 to 2,200 words of material engineering each. None of it is
 * written yet: all eight .mdx files carry a comment explaining that inventing
 * compound behaviour is the one thing this build will not do.
 *
 * That makes the guides the clearest case for the CMS on the whole site. The
 * prose has to be written by someone at Margo or a technical writer, and
 * asking that person to edit a Markdown file in a git repository is how a
 * guide never gets written. Here it is a text editor with headings and lists.
 *
 * The mapping below is deliberately narrow, and every omission is a decision:
 *
 *  · No H1. The page owns its H1 and a second one is an SEO fault an author
 *    should not be able to commit by choosing a dropdown value. H2 is the
 *    section level the guides are written at (content sheet 35).
 *  · Links go through next/link so internal navigation stays client-side, and
 *    anything leaving the site gets rel="noopener".
 *  · Images come from the registry by key, like every other image on the site,
 *    so alt text and intrinsic dimensions travel with them.
 *
 * Styling is inherited from `.prose-guide`, the same wrapper the compiled MDX
 * body used, so a guide written in Sanity and a guide written in MDX are
 * indistinguishable once rendered.
 */

/** A heading's fragment id, from its own text — the same rule the apply script uses to write the anchors. */
export function headingId(value: { children?: unknown[] } | undefined): string {
  const text = (value?.children ?? []).map((c) => (typeof (c as { text?: unknown }).text === "string" ? (c as { text: string }).text : "")).join("");
  return headingSlug(text);
}
export function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’'"“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    // H2 is the section level the content sheets write the guides at; the
    // page keeps the one H1.
    // Each carries an id from its own words, so a list item lower down can
    // anchor back to it ("Items 2, 3 and 4 anchor back to sections 04, 05
    // and 08" — RES_02 §10).
    h2: ({ children, value }) => <h2 id={headingId(value)}>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },

  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },

  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = String(value?.href ?? "");
      // Internal links use next/link; anything else is external and gets the
      // rel that stops the opened page reaching back into this one.
      if (href.startsWith("/") || href.startsWith("#")) {
        return <Link href={href}>{children}</Link>;
      }
      return (
        <a href={href} rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      );
    },
  },

  types: {
    // A data table. Cells arrive as pipe-separated strings — the plainest
    // thing an editor can type — and are split here.
    guideTable: ({ value }) => {
      const columns = (value?.columns as string[] | undefined) ?? [];
      const rows = ((value?.rows as string[] | undefined) ?? []).map((r) => r.split("|").map((c) => c.trim()));
      if (!columns.length || !rows.length) return null;
      return (
        <div className="overflow-x-auto">
          <table>
            {value?.caption ? <caption>{String(value.caption)}</caption> : null}
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {r.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={j} className="whitespace-pre-line">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    // The answer up front, as a plain paragraph in the article's flow: an
    // <aside> is read as a sidebar and dropped by text extraction, so the
    // answer under the first question went missing (3rd Shade fix 10).
    // The panel look is on the paragraph itself.
    callout: ({ value }) => (
      <p className="rounded-card border-line border-l-accent-400 text-ink-3 my-8 border border-l-2 bg-[#0B0D10] p-6 text-sm leading-relaxed">
        {value?.title ? (
          <>
            <strong className="text-ink font-semibold">{String(value.title)}</strong>
            <br />
          </>
        ) : null}
        {String(value?.body ?? "")}
      </p>
    ),
    // An image inside the prose. Still a registry key, never an upload — the
    // same contract as the rest of the site.
    guideImage: ({ value }) => {
      const key = String(value?.key ?? "");
      if (!key) return null;
      return (
        <figure>
          <Img k={key} sizes="(max-width: 768px) 100vw, 68ch" />
          {value?.caption ? <figcaption>{String(value.caption)}</figcaption> : null}
        </figure>
      );
    },
  },
};

export type ProseValue = Parameters<typeof PortableText>[0]["value"];

/** True when there is at least one block with actual text in it. */
export function hasProse(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false;
  return value.some((block) => {
    const b = block as { _type?: string; children?: Array<{ text?: string }> };
    if (b._type !== "block") return true; // an image or other object counts
    return (b.children ?? []).some((c) => (c.text ?? "").trim().length > 0);
  });
}

export function Prose({ value }: { value: ProseValue }) {
  return <PortableText value={value} components={components} />;
}
