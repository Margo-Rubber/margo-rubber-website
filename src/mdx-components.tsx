import type { MDXComponents } from "mdx/types";

/**
 * Global MDX component map. Required by @next/mdx with the App Router.
 *
 * Two jobs:
 *  1. Style raw markdown output to the Margo design tokens.
 *  2. Expose Margo components (<AnswerBlock>, <SpecTable>…) to every content
 *     file without an import in the MDX itself.
 *
 * Headings get `id`s so SKU anchors (#scorpio-footrest-mat) and the products
 * mega-dropdown jump-links resolve. See §4.0 of the implementation plan.
 */

function slugify(children: React.ReactNode): string {
  return String(children)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const components: MDXComponents = {
  h2: ({ children, id }) => (
    <h2
      id={id ?? slugify(children)}
      className="text-h2 mt-16 mb-4"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id ?? slugify(children)}
      className="text-h3 mt-10 mb-3"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-ink-2 mb-4 max-w-[68ch] leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-ink-2 mb-4 max-w-[68ch] list-disc space-y-2 pl-5">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-ink-2 mb-4 max-w-[68ch] list-decimal space-y-2 pl-5">
      {children}
    </ol>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-accent-400 underline-offset-4 hover:underline"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="text-ink font-semibold">{children}</strong>
  ),
  /**
   * Markdown tables render as real <table> elements — never images.
   * Required by both AI crawlers and Product schema. Wrapper scrolls
   * horizontally on mobile rather than stacking, which would destroy
   * the column-to-column comparability that is the point of a spec table.
   */
  table: ({ children }) => (
    <div className="border-line my-8 overflow-x-auto rounded-card border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-accent-400 text-ink px-4 py-3 text-left font-semibold whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-line text-ink-2 border-t px-4 py-3">{children}</td>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
