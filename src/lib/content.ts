import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { COLLECTIONS, type Collection, type Frontmatter } from "../content/schemas/index.ts";
import { isIndexable } from "./build-mode.ts";

/**
 * CONTENT LOADER
 *
 * One .mdx file per page. One dynamic route per collection.
 *
 * This is what makes duplicated pages structurally impossible to cross-
 * contaminate: `getContent` reads ONE file from disk and returns a FRESH
 * object every call. Two pages are never the same object in memory, and
 * everything renders as a React Server Component, so content is read-only
 * by construction.
 *
 * Adding a page = adding one .mdx file. No route file is ever edited.
 */

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

/** Files beginning with `_` are templates, not pages. */
function isContentFile(file: string) {
  return file.endsWith(".mdx") && !file.startsWith("_");
}

/**
 * YAML turns a key with no value ("productCode:") into null, but Zod's
 * `.optional()` means undefined, not null — so a field an author left blank as
 * a placeholder fails validation and the whole page 404s. Dropping nulls before
 * parsing makes "left blank" and "not present" mean the same thing, which is
 * what a content author expects.
 */
function stripNulls(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== null),
  );
}

export function getAllSlugs(collection: Collection): string[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(isContentFile)
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

/**
 * Frontmatter only — no MDX compilation. Cheap enough to call for every page
 * when building the sitemap, nav, hub-page card grids and JSON-LD.
 */
export function getFrontmatter<C extends Collection>(
  collection: C,
  slug: string,
): Frontmatter<C> {
  const file = path.join(CONTENT_ROOT, collection, `${slug}.mdx`);
  if (!fs.existsSync(file)) {
    throw new Error(`[content] Missing ${collection}/${slug}.mdx`);
  }

  const { data } = matter(fs.readFileSync(file, "utf8"));
  const parsed = COLLECTIONS[collection].safeParse({ slug, ...stripNulls(data) });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `    • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `[content] ${collection}/${slug}.mdx failed validation:\n${issues}`,
    );
  }
  return parsed.data as Frontmatter<C>;
}

export function getAllFrontmatter<C extends Collection>(
  collection: C,
): Frontmatter<C>[] {
  return getAllSlugs(collection).map((slug) => getFrontmatter(collection, slug));
}

/**
 * Publication status, read straight from frontmatter without validating the
 * rest of the document.
 *
 * Deliberately not `getFrontmatter().status`. Two reasons:
 *
 *  · `COLLECTIONS.pages` maps every file in content/pages to the products-hub
 *    schema, because the thirteen marketing pages each have a shape of their
 *    own and the union has to point somewhere. Validating a page against it
 *    throws for twelve of the thirteen.
 *
 *  · Even where the mapping is right, the sitemap should not fail to build
 *    because an unrelated field on an unrelated page is malformed. Asking
 *    "may this be indexed" should not require the whole document to be valid.
 */
export function getStatus(collection: string, slug: string): string {
  const file = path.join(CONTENT_ROOT, collection, `${slug}.mdx`);
  if (!fs.existsSync(file)) return "placeholder";
  const { data } = matter(fs.readFileSync(file, "utf8"));
  // Same default as the schema: anything unmarked is not published.
  return typeof data.status === "string" ? data.status : "placeholder";
}

/** Only indexable pages enter the sitemap, are indexable, and emit schema. */
export function getPublishedSlugs(collection: string): string[] {
  return getAllSlugs(collection as Collection).filter(
    (slug) => isIndexable(getStatus(collection, slug)),
  );
}

/**
 * Frontmatter + the compiled MDX body.
 *
 * The switch keeps exactly ONE dynamic segment per import specifier, which is
 * what lets the bundler build a static context map. A fully dynamic
 * `import(\`../content/${collection}/${slug}.mdx\`)` would not resolve.
 */
/**
 * Loads a one-off page from src/content/pages/ against an explicit schema.
 *
 * The hub pages (/products, /industries) each have their own shape, so they
 * can't share a single entry in COLLECTIONS without collapsing to a union and
 * losing type narrowing in the templates.
 */
export async function getPage<S extends z.ZodTypeAny>(
  slug: string,
  schema: S,
): Promise<z.infer<S>> {
  const file = path.join(CONTENT_ROOT, "pages", `${slug}.mdx`);
  if (!fs.existsSync(file)) throw new Error(`[content] Missing pages/${slug}.mdx`);

  const { data } = matter(fs.readFileSync(file, "utf8"));
  const parsed = schema.safeParse({ slug, ...data });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `    • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`[content] pages/${slug}.mdx failed validation:\n${issues}`);
  }
  return parsed.data;
}

export async function getContent<C extends Collection>(
  collection: C,
  slug: string,
): Promise<{
  frontmatter: Frontmatter<C>;
  Content: React.ComponentType;
  /** False when the body is empty or only MDX comments — lets a template skip
   *  the prose section entirely instead of rendering an empty padded band. */
  hasBody: boolean;
}> {
  const frontmatter = getFrontmatter(collection, slug);

  const raw = matter(
    fs.readFileSync(path.join(CONTENT_ROOT, collection, `${slug}.mdx`), "utf8"),
  ).content;
  const hasBody =
    raw
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // strip MDX comments
      .trim().length > 0;

  let mod: { default: React.ComponentType };
  switch (collection) {
    case "products":
      mod = await import(`../content/products/${slug}.mdx`);
      break;
    case "industries":
      mod = await import(`../content/industries/${slug}.mdx`);
      break;
    case "resources":
      mod = await import(`../content/resources/${slug}.mdx`);
      break;
    case "pages":
      mod = await import(`../content/pages/${slug}.mdx`);
      break;
    case "skus":
      mod = await import(`../content/skus/${slug}.mdx`);
      break;
    case "legal":
      mod = await import(`../content/legal/${slug}.mdx`);
      break;
    default:
      throw new Error(`[content] Unknown collection "${collection}"`);
  }

  return { frontmatter, Content: mod.default, hasBody };
}
