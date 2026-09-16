/**
 * In-page anchors.
 *
 * The rule from the content sheets: a link to a section is `/page#id`, never
 * `/#id`. The second form is root-relative — it always resolves to the
 * homepage, so an "Explore Products" button on /products would navigate to
 * `/#range`, find no such section, and land the reader on the home hero.
 *
 * A bare `#id` is the same-page form and is fine; `/#id` is rewritten to
 * `#id` so it stays on the page it was clicked on. `check:links` fails the
 * build when content still carries the root-relative form.
 */
export function normalizeAnchor(href: string): string {
  return href.startsWith("/#") ? href.slice(1) : href;
}

/** The cross-page form: `anchor("/products", "range")` → "/products#range". */
export function anchor(path: string, id: string): string {
  return `${path}#${id}`;
}
