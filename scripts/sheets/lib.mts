/**
 * COPY-PASS TOOLKIT — shared by every per-page apply script.
 *
 * A page script reads its sheet JSON (from parse-sheets), builds a patch of
 * whole fields, and hands it here. This file does the parts that must be
 * identical for every page:
 *
 *   · the patch is merged over the live document and validated with the
 *     same Zod schema the site renders with — a document that would fail on
 *     the page fails here, before anything is written;
 *   · array items get the `_key` and `_type` the Studio needs (member type
 *     names are read from the Sanity schema, not guessed);
 *   · a dry run prints old → new for every changed field; `--write` patches
 *     the document; nothing is written without a dataset export first;
 *   · the forbidden-claims list is run over every string in the patch.
 *
 * The sheet's copy is never retyped: every string comes from the parsed
 * JSON and is placed by reference.
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import type { ZodTypeAny } from "zod";
import { schemaTypes } from "../../sanity/schemaTypes/index.ts";
import { stripNullsDeep } from "../../src/content/blocks.ts";
import { FORBIDDEN_CLAIMS } from "../../src/content/site.ts";
import type { Sheet, Section, Field, Part } from "./parse-sheets.mts";

export type { Section, Sheet, Field };

/* ── Environment ────────────────────────────────────────────────────────── */

function envFromDotfile(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  if (!existsSync(".env.local")) return undefined;
  const line = readFileSync(".env.local", "utf8")
    .split("\n")
    .find((l) => l.startsWith(`${name}=`));
  return line
    ?.slice(name.length + 1)
    .trim()
    .replace(/^["']|["']$/g, "");
}

export const WRITE = process.argv.includes("--write");

export const client = createClient({
  projectId: "jyg2beas",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: WRITE ? envFromDotfile("SANITY_WRITE_TOKEN") : undefined,
});

/* ── Reading a sheet ────────────────────────────────────────────────────── */

export function loadSheet(stem: string): Sheet {
  return JSON.parse(
    readFileSync(`scripts/sheets/out/${stem}.json`, "utf8"),
  ) as Sheet;
}

export function section(sheet: Sheet, num: string): Section {
  const s = sheet.sections.find((x) => x.num === num);
  if (!s) throw new Error(`${sheet.file}: no section ${num}`);
  return s;
}

/** A field by the start of its label; throws so a renamed row is never silently skipped. */
export function field<K extends Field["kind"]>(
  sec: Section,
  label: string,
  kind: K,
): Extract<Field, { kind: K }> {
  const f = sec.fields.find((x) =>
    x.label.toLowerCase().startsWith(label.toLowerCase()),
  );
  if (!f)
    throw new Error(
      `section ${sec.num} "${sec.title}": no field starting "${label}" (have: ${sec.fields.map((x) => x.label).join(" | ")})`,
    );
  // A composite cell (table + rationale paragraphs, say) answers for its
  // table or its paragraphs when that is what the caller asked for.
  if (f.kind === "composite" && kind === "table") {
    const t = f.parts.find((p) => p.kind === "table");
    if (t && t.kind === "table")
      return {
        label: f.label,
        kind: "table",
        columns: t.columns,
        rows: t.rows,
        ...(t.confirm ? { confirm: t.confirm } : {}),
        note: f.note,
      } as Extract<Field, { kind: K }>;
  }
  if (f.kind === "composite" && kind === "paragraphs") {
    const ps = f.parts.filter(
      (p): p is Extract<Part, { kind: "para" }> => p.kind === "para",
    );
    const lits = f.parts
      .filter((p): p is Extract<Part, { kind: "lit" }> => p.kind === "lit")
      .map((p) => p.value);
    if (ps.length)
      return {
        label: f.label,
        kind: "paragraphs",
        paragraphs: ps.map((p) => p.text),
        leads: ps.map((p) => p.lead),
        ...(lits.length ? { lits } : {}),
        note: f.note,
      } as Extract<Field, { kind: K }>;
  }
  if (f.kind !== kind)
    throw new Error(
      `section ${sec.num} "${label}": expected ${kind}, sheet has ${f.kind}`,
    );
  return f as Extract<Field, { kind: K }>;
}

export const lit = (sec: Section, label: string) =>
  field(sec, label, "lit").value;
export const litHref = (sec: Section, label: string) => {
  const f = field(sec, label, "lit");
  if (!f.href)
    throw new Error(`section ${sec.num} "${label}": literal has no → href`);
  return { label: f.value, href: f.href };
};
export const heading = (sec: Section, label: string) =>
  field(sec, label, "heading");
export const paragraphs = (sec: Section, label: string) =>
  field(sec, label, "paragraphs").paragraphs;
export const paragraph = (sec: Section, label: string) => {
  const p = paragraphs(sec, label);
  if (p.length !== 1)
    throw new Error(
      `section ${sec.num} "${label}": expected one paragraph, sheet has ${p.length}`,
    );
  return p[0];
};
export const rows = (sec: Section, label: string) =>
  field(sec, label, "table").rows;
export const list = (sec: Section, label: string) =>
  field(sec, label, "list").items;

/**
 * "Label → /href" lines inside one literal (the hero chips are written this
 * way). Returns them in sheet order.
 */
export function links(
  sec: Section,
  label: string,
): { label: string; href: string }[] {
  const f = field(sec, label, "lit");
  const raw = f.href ? `${f.value} → ${f.href}` : f.value;
  return raw.split("\n").map((line) => {
    const m = line.match(/^(.*?)\s*(?:→|->)\s*(\S+)$/);
    if (!m)
      throw new Error(
        `section ${sec.num} "${label}": line is not "Label → href": ${line}`,
      );
    return { label: m[1].trim(), href: m[2] };
  });
}

/**
 * Which heading lines are the accent. The sheet marks the accent with <em>;
 * a line is accent when its text is inside the marked span. Returns the
 * 0-based indexes the site's `h1AccentLines` / `accentLines` fields expect.
 */
export function accentLines(h: {
  lines: string[];
  accent: string[];
}): number[] {
  const marked = h.accent.join(" ");
  return h.lines
    .map((l, i) => (marked.includes(l) ? i : -1))
    .filter((i) => i >= 0);
}

/** The `*accent*` convention some home fields use inside a single line. */
export function starAccent(h: { lines: string[]; accent: string[] }): string[] {
  return h.lines.map((l) => {
    for (const a of h.accent)
      if (a && l.includes(a) && a !== l) return l.replace(a, `*${a}*`);
    return h.accent.includes(l) ? `*${l}*` : l;
  });
}

/* ── Sanity item keys and types ─────────────────────────────────────────── */

type SanityField = {
  name?: string;
  type?: string;
  fields?: SanityField[];
  of?: SanityField[];
};

/** The array member type name at `path` on document `type`, from the Sanity schema. */
function memberType(type: string, path: string[]): string | undefined {
  let node: SanityField | undefined = schemaTypes.find(
    (t) => t.name === type,
  ) as SanityField | undefined;
  for (const seg of path) {
    if (!node) return undefined;
    node = node.fields?.find((f) => f.name === seg);
    // Descend through an array into its (single) object member.
    if (
      node?.type === "array" &&
      node.of?.length === 1 &&
      path.indexOf(seg) < path.length - 1
    ) {
      node = node.of[0];
    }
  }
  if (node?.type !== "array") return undefined;
  const objects = (node.of ?? []).filter(
    (m) =>
      m.type === "object" ||
      (m.type &&
        !["string", "number", "text", "url", "boolean"].includes(m.type)),
  );
  return objects.length === 1
    ? (objects[0].name ?? objects[0].type)
    : undefined;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

/**
 * Walk a value and give every array of objects the `_key` and `_type` the
 * Studio needs. Keys are stable: derived from the first string in the item,
 * so a re-run patches rather than reorders.
 */
export function keyed(
  type: string,
  value: unknown,
  path: string[] = [],
): unknown {
  if (Array.isArray(value)) {
    const member = memberType(type, path);
    const seen = new Map<string, number>();
    return value.map((item, i) => {
      const inner = keyed(type, item, path);
      if (inner && typeof inner === "object" && !Array.isArray(inner)) {
        const obj = inner as Record<string, unknown>;
        const first = Object.values(obj).find(
          (v) => typeof v === "string" && v.trim(),
        ) as string | undefined;
        let key = first ? slugify(first) : `item-${i}`;
        const n = (seen.get(key) ?? 0) + 1;
        seen.set(key, n);
        if (n > 1) key = `${key}-${n}`;
        return { _key: key, ...(member ? { _type: member } : {}), ...obj };
      }
      return inner;
    });
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>))
      out[k] = keyed(type, v, [...path, k]);
    return out;
  }
  return value;
}

/* ── Forbidden claims ───────────────────────────────────────────────────── */

function* strings(v: unknown, path = ""): Generator<[string, string]> {
  if (typeof v === "string") yield [path, v];
  else if (Array.isArray(v))
    for (let i = 0; i < v.length; i++) yield* strings(v[i], `${path}[${i}]`);
  else if (v && typeof v === "object")
    for (const [k, val] of Object.entries(v))
      yield* strings(val, path ? `${path}.${k}` : k);
}

export function forbidden(patch: unknown): string[] {
  const hits: string[] = [];
  for (const [path, s] of strings(patch)) {
    for (const rule of FORBIDDEN_CLAIMS) {
      const re = new RegExp(
        rule.pattern.source,
        rule.pattern.flags.includes("g")
          ? rule.pattern.flags
          : rule.pattern.flags + "g",
      );
      const m = s.match(re);
      if (m) hits.push(`${path}: “${m[0]}” — ${rule.why}`);
    }
  }
  return hits;
}

/* ── Diff, validate, write ──────────────────────────────────────────────── */

function short(v: unknown): string {
  if (v === undefined) return "(none)";
  const s = typeof v === "string" ? v : JSON.stringify(v);
  return s.length > 110 ? s.slice(0, 107) + "…" : s;
}

function* leaves(v: unknown, path = ""): Generator<[string, unknown]> {
  if (Array.isArray(v)) {
    for (let i = 0; i < v.length; i++) yield* leaves(v[i], `${path}[${i}]`);
  } else if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (k.startsWith("_")) continue;
      yield* leaves(val, path ? `${path}.${k}` : k);
    }
  } else yield [path, v];
}

function get(obj: unknown, path: string): unknown {
  const segs =
    path.replace(/\[(\d+)\]/g, ".$1").match(/[^.[\]]+(?:\[[^\]]+\])?/g) ?? [];
  return segs.reduce<unknown>((a, k) => {
    if (!a || typeof a !== "object") return undefined;
    const m = k.match(/^([^[]+)\[(\w+)=="([^"]+)"\]$/);
    if (m)
      return (
        (a as Record<string, unknown>)[m[1]] as
          Record<string, unknown>[] | undefined
      )?.find((it) => it[m[2]] === m[3]);
    return (a as Record<string, unknown>)[k];
  }, obj);
}

/** Every document, as NDJSON, before anything is written. The CLI export needs a browser login; the API token does not. */
export async function backupDataset(label: string): Promise<string> {
  const dir = "/Users/true.man/Margo-Rubber/backups";
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);
  const file = `${dir}/production-${stamp}-${label}.ndjson`;
  const docs = (await client.fetch(`*[!(_id in path("_.**"))]`)) as unknown[];
  writeFileSync(file, docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
  console.log(`  backup: ${docs.length} documents → ${file}`);
  return file;
}

/**
 * Apply a patch to one document.
 *
 *   id      Sanity document id (e.g. homePage-home)
 *   type    Sanity type name (for member types)
 *   schema  the Zod schema the route validates with
 *   patch   whole-field values keyed by top-level (or dotted) field
 */
export async function applyDocument(opts: {
  id: string;
  type: string;
  schema: ZodTypeAny;
  patch: Record<string, unknown>;
  /** Strings the page must show verbatim, for check-copy. */
  expect?: string[];
}): Promise<void> {
  const { id, type, schema, patch } = opts;
  const current = (await client.fetch(`*[_id == $id][0]`, { id })) as Record<
    string,
    unknown
  > | null;
  if (!current) throw new Error(`no document ${id}`);

  // Merge dotted paths over the live document. A segment may address an
  // array item by a field value — `step2[name=="country"]` — as Sanity's
  // own patch paths do.
  const merged: Record<string, unknown> = structuredClone(current);
  const sets: Record<string, unknown> = {};
  const FILTER = /^([^[]+)\[(\w+)=="([^"]+)"\]$/;
  const step = (node: unknown, seg: string): unknown => {
    const obj = node as Record<string, unknown>;
    const m = seg.match(FILTER);
    if (m) {
      const arr = obj[m[1]] as Record<string, unknown>[] | undefined;
      const hit = arr?.find((it) => it[m[2]] === m[3]);
      if (!hit) throw new Error(`no item with ${m[2]}=="${m[3]}" in ${m[1]}`);
      return hit;
    }
    if (!obj[seg] || typeof obj[seg] !== "object") obj[seg] = {};
    return obj[seg];
  };
  const unsets: string[] = [];
  for (const [rawPath, value] of Object.entries(patch)) {
    // A leading "?" marks a patch that may not apply — a rename whose
    // source item is already gone on a re-run. Skipped, not failed.
    const optional = rawPath.startsWith("?");
    const path = optional ? rawPath.slice(1) : rawPath;
    if (optional) {
      try {
        get(current, path.replace(/\.[^.]+$/, ""));
        const segs = path.match(/[^.[\]]+(?:\[[^\]]+\])?/g) ?? [];
        let node: unknown = current;
        for (const seg of segs.slice(0, -1))
          node = step(structuredClone(node), seg);
      } catch {
        continue;
      }
    }
    if (value === undefined) {
      // `undefined` removes the field — a section the sheet deletes.
      unsets.push(path);
      const segs = path.split(".");
      let node: unknown = merged;
      for (const seg of segs.slice(0, -1))
        node = (node as Record<string, unknown>)?.[seg];
      if (node && typeof node === "object")
        delete (node as Record<string, unknown>)[segs[segs.length - 1]];
      continue;
    }
    const withKeys = keyed(
      type,
      value,
      path.replace(/\[[^\]]+\]/g, "").split("."),
    );
    sets[path] = withKeys;
    const segs = path.match(/[^.[\]]+(?:\[[^\]]+\])?/g) ?? [];
    let node: unknown = merged;
    for (const seg of segs.slice(0, -1)) node = step(node, seg);
    const last = segs[segs.length - 1];
    if (FILTER.test(last))
      throw new Error(`a filtered segment cannot be last: ${path}`);
    (node as Record<string, unknown>)[last] = withKeys;
  }

  // Validate exactly as the route does.
  const forRoute = {
    ...stripNullsDeep(merged),
    slug: (merged.slug as { current?: string })?.current ?? merged.slug,
  };
  const parsed = schema.safeParse(forRoute);
  if (!parsed.success) {
    console.error(`\n  ✗  ${id} would not validate after the patch:`);
    for (const i of parsed.error.issues)
      console.error(`     ${i.path.join(".")}: ${i.message}`);
    process.exit(1);
  }

  const claims = forbidden(patch);
  if (claims.length) {
    console.error(`\n  ✗  ${id}: the patch carries forbidden claims:`);
    for (const c of claims) console.error(`     ${c}`);
    process.exit(1);
  }

  // Diff.
  let changed = 0;
  console.log(`\n══ ${id} ${WRITE ? "(writing)" : "(dry run)"}`);
  for (const [path, value] of Object.entries(sets)) {
    for (const [leaf, nv] of leaves(value, path)) {
      const ov = get(current, leaf);
      if (JSON.stringify(ov) === JSON.stringify(nv)) continue;
      changed++;
      console.log(`  ${leaf}\n     − ${short(ov)}\n     + ${short(nv)}`);
    }
  }
  console.log(`  ${changed} leaf value(s) change.`);

  if (opts.expect) {
    mkdirSync("scripts/sheets/expect", { recursive: true });
    writeFileSync(
      `scripts/sheets/expect/${id}.json`,
      JSON.stringify(opts.expect, null, 2),
    );
  }

  for (const p of unsets) {
    if (get(current, p) === undefined) continue;
    changed++;
    console.log(`  ${p}\n     − ${short(get(current, p))}\n     + (removed)`);
  }

  if (WRITE && changed) {
    let tx = client.patch(id).set(sets);
    if (unsets.length) tx = tx.unset(unsets);
    await tx.commit();
    console.log(`  ✓ written`);
  }
}
