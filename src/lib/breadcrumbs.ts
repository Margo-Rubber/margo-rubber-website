/**
 * BREADCRUMB TRAILS — one shape for the visible trail and the JSON-LD.
 *
 * Every page below the homepage shows Home › Section › Page, and the same
 * list feeds `breadcrumbNode()` so the structured data can never disagree
 * with what the reader sees. Pages build the trail once with `trail()` and
 * pass it to both.
 */
export type Crumb = { name: string; path: string };

export const HOME: Crumb = { name: "Home", path: "/" };

/** `trail(["Industries", "/industries"], [fm.navLabel, path])` — Home is implied. */
export function trail(...steps: [name: string, path: string][]): Crumb[] {
  return [HOME, ...steps.map(([name, path]) => ({ name, path }))];
}
