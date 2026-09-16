import type { DocumentActionComponent, TemplateItem } from "sanity";

/**
 * PAGES THERE CAN ONLY BE ONE OF
 *
 * A homepage. A footer. A contact page. Each exists exactly once, at a fixed
 * document id the site reads by name.
 *
 * Without this, the global + button will happily create a second one. Nothing
 * warns anybody, both documents are valid, and the site's query —
 * `*[_type == "homePage"][0]` — picks whichever the content lake returns
 * first. Which one wins is arbitrary and invisible.
 *
 * That is not hypothetical. It happened to the privacy policy: the spike that
 * proved this CMS pattern created a document with a random id, a test edit
 * replaced its opening paragraph with the word "Testing", and when the proper
 * migration later wrote to a deterministic id it created a SECOND document
 * rather than replacing the first. The site went on serving the test text, and
 * every check passed, because both documents were perfectly valid.
 *
 * So: for these types, Create and Delete are removed. The document opens from
 * its entry in the Pages menu and can be edited and published, but it cannot
 * be duplicated and it cannot be removed.
 */

export const SINGLETON_TYPES = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "whyMargoPage",
  "exportPage",
  "certificationsPage",
  "caseStudiesPage",
  "contactPage",
  "productsHub",
  "industriesHub",
  "resourcesHub",
  "siteFooter",
]);

/**
 * `utilityPage` is deliberately NOT here.
 *
 * Two documents share that type — the thank-you page and the 404 — so "only
 * one" is the wrong rule. They are addressed by fixed ids from the Pages menu,
 * which is what actually keeps them distinct; a third would be visible in that
 * menu as a document nothing links to.
 */

/**
 * Types that should never be offered in the global "create new" menu, beyond
 * the singletons themselves.
 *
 * `utilityPage` has exactly two documents — the thank-you page and the 404 —
 * and both already exist, opened by fixed id from the Pages menu. A third
 * would be a page nothing links to and nothing renders. It is not a singleton,
 * so it keeps its Delete action; it simply should not be creatable by hand.
 */
const UNCREATABLE = new Set([...SINGLETON_TYPES, "utilityPage"]);

/** Actions that make no sense on a document there can only be one of. */
const FORBIDDEN = new Set(["duplicate", "delete", "unpublish"]);

export const singletonActions = (
  prev: DocumentActionComponent[],
  context: { schemaType: string },
): DocumentActionComponent[] =>
  SINGLETON_TYPES.has(context.schemaType)
    ? prev.filter((action) => !FORBIDDEN.has(String(action.action)))
    : prev;

/**
 * Keep singletons out of the global "create new" menu.
 *
 * Removing the Create action alone is not enough — the + in the top bar builds
 * its list from the schema, so every singleton would still be offered there
 * and creating one would produce exactly the duplicate this file exists to
 * prevent.
 */
export const singletonTemplateFilter = (templateItems: TemplateItem[]): TemplateItem[] =>
  templateItems.filter((item) => !UNCREATABLE.has(String(item.templateId)));
