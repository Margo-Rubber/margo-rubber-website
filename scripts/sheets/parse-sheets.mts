/**
 * SHEET PARSER — the content sheets, read by machine.
 *
 * Content_Sheets_for_Developer/*.html is the deliverable from 3rd Shade: one
 * HTML file per page, each section a <section class="sec"> with a header, a
 * "Replacement content" block of <dl class="el"> rows (label → value) and a
 * "Technical SEO" block of notes. The copy the site must display verbatim
 * sits in four shapes inside the value cell:
 *
 *   .lit            a literal — eyebrow, badge, CTA ("Label → /href")
 *   .h1lit / .h2lit a heading; newlines are line breaks, <em> is the accent
 *   p.body-copy     a paragraph; <b> is a lead-in the page may set bold
 *   table           rows of cells; a .strike cell is the OLD copy, dropped
 *
 * Everything else — .wc word counts, .strike, notes, scores — is guidance
 * for the developer and never reaches a page. That distinction is the
 * whole job of this file: the deliverable comes out as JSON, byte for byte
 * (em dashes, curly quotes, non-breaking spaces), keyed by section and
 * label, and nothing is retyped by hand.
 *
 *   node scripts/sheets/parse-sheets.mts [01_Homepage ...]
 *     → scripts/sheets/out/<sheet>.json  and  <sheet>.md (for review)
 */

import { parse, type HTMLElement } from "node-html-parser";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const SRC = "/Users/true.man/Margo-Rubber/Content_Sheets_for_Developer";
const OUT = "scripts/sheets/out";

export type Field =
  | { label: string; kind: "lit"; value: string; href?: string; note?: string }
  | {
      label: string;
      kind: "heading";
      lines: string[];
      accent: string[];
      value: string;
      note?: string;
    }
  | {
      label: string;
      kind: "paragraphs";
      paragraphs: string[];
      leads: (string | null)[];
      /** The same paragraphs with any bold runs kept as `**…**`, for copy that ships with its emphasis. */
      marked: string[];
      /** Literals set beside the paragraphs (a boxed value under an instruction). */
      lits?: string[];
      note?: string;
    }
  | {
      label: string;
      kind: "table";
      columns: string[];
      rows: string[][];
      /** [row, col] cells the sheet marks CONFIRM */
      confirm?: [number, number][];
      note?: string;
    }
  | { label: string; kind: "list"; items: string[]; note?: string }
  | { label: string; kind: "text"; value: string; note?: string }
  /** A cell holding several kinds in sequence — a market block: eyebrow, H2, standfirst, bullets, caveat, links. */
  | { label: string; kind: "composite"; parts: Part[]; note?: string }
  /** A whole legal document (sheet 08): standfirst, then numbered sections of sub-headings, paragraphs and lists. */
  | { label: string; kind: "document"; lastUpdated: string; standfirst: string; sections: DocSection[]; note?: string };

export type DocSection = {
  title: string;
  blocks: ({ kind: "p"; text: string } | { kind: "h"; text: string } | { kind: "ul"; items: string[] } | { kind: "note"; text: string })[];
};

export type Part =
  | { kind: "lit"; value: string }
  | { kind: "heading"; lines: string[]; accent: string[] }
  | { kind: "para"; text: string; lead: string | null; em: boolean }
  | { kind: "list"; items: string[] }
  | {
      kind: "table";
      columns: string[];
      rows: string[][];
      confirm?: [number, number][];
    };

export type Section = {
  num: string;
  title: string;
  chip: string;
  live: string;
  fields: Field[];
  /** The "Technical SEO" bullet notes — instructions, never copy. */
  notes: string[];
};

export type Sheet = {
  file: string;
  title: string;
  kicker: string;
  head: { title?: string; description?: string };
  sections: Section[];
};

/* ── Text ───────────────────────────────────────────────────────────────── */

/** Inner text with entities decoded and whitespace collapsed — but NBSP kept. */
function text(el: HTMLElement | null | undefined): string {
  if (!el) return "";
  return el.structuredText ? clean(el.textContent) : clean(el.textContent);
}
function clean(s: string): string {
  return s
    .replace(/[ \t\r\f\v]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}
/** Same, but a heading keeps its line breaks (white-space: pre-line in the sheet). */
function headingLines(el: HTMLElement): string[] {
  const raw = el.innerHTML.replace(/<br\s*\/?>/g, "\n");
  const t = clean(parse(raw).textContent);
  return t
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function stripNotes(dd: HTMLElement): { note: string; dd: HTMLElement } {
  // A <td class="confirm"> is a VALUE flagged for confirmation and stays in
  // its row (readRow marks it); only free-standing notes are lifted out.
  const notes = dd
    .querySelectorAll(".wc, .confirm")
    .filter((n) => n.tagName !== "TD");
  const note = notes
    .map((n) => text(n))
    .filter(Boolean)
    .join(" · ");
  for (const n of notes) n.remove();
  // Struck-through elements are the OLD copy ("Live"), shown for contrast
  // beside what ships. They never reach a page. Table cells keep their
  // column (readRow blanks them) so row shapes stay aligned; inline strike
  // spans inside a sentence are part of that sentence's markup and stay.
  for (const n of dd
    .querySelectorAll(".strike")
    .filter((n) => n.tagName !== "TD" && n.tagName !== "SPAN"))
    n.remove();
  return { note, dd };
}

/* ── One <dl class="el"> row ────────────────────────────────────────────── */

function readRow(dl: HTMLElement): Field | null {
  const label = text(dl.querySelector("dt"));
  const dd0 = dl.querySelector("dd");
  if (!dd0) return null;
  const { note, dd } = stripNotes(dd0);
  const withNote = (f: Field): Field => (note ? { ...f, note } : f);

  // Several kinds in one cell → keep them all, in order.
  const kinds = new Set<string>();
  for (const el of dd.childNodes as unknown as HTMLElement[]) {
    if (!el.tagName) continue;
    if (el.classList?.contains("h1lit") || el.classList?.contains("h2lit"))
      kinds.add("heading");
    else if (el.tagName === "P") kinds.add("para");
    else if (el.tagName === "UL" || el.tagName === "OL") kinds.add("list");
    else if (el.classList?.contains("tbl") || el.tagName === "TABLE")
      kinds.add("table");
    else if (el.classList?.contains("lit")) kinds.add("lit");
  }
  // Composite when two or more block kinds share a cell (a lone literal
  // beside paragraphs stays a paragraphs field with `lits`).
  const blockKinds = new Set([...kinds].filter((k) => k !== "lit"));
  if (blockKinds.size > 1 || (kinds.has("heading") && kinds.size > 1)) {
    const parts: Part[] = [];
    for (const el of dd.childNodes as unknown as HTMLElement[]) {
      if (!el.tagName) continue;
      if (el.classList?.contains("h1lit") || el.classList?.contains("h2lit")) {
        parts.push({
          kind: "heading",
          lines: headingLines(el),
          accent: el.querySelectorAll("em, b").map((e) => text(e)),
        });
      } else if (el.tagName === "P") {
        parts.push({
          kind: "para",
          text: text(el),
          lead: el.querySelector("b") ? text(el.querySelector("b")) : null,
          em:
            !!el.querySelector("em") &&
            text(el.querySelector("em")) === text(el),
        });
      } else if (el.tagName === "UL" || el.tagName === "OL") {
        parts.push({
          kind: "list",
          items: el.querySelectorAll("li").map((li) => text(li)),
        });
      } else if (el.classList?.contains("tbl") || el.tagName === "TABLE") {
        const t = el.tagName === "TABLE" ? el : el.querySelector("table")!;
        const confirm: [number, number][] = [];
        const rows = t.querySelectorAll("tbody tr").map((tr, ri) =>
          tr.querySelectorAll("td, th").map((td, ci) => {
            if (td.classList.contains("confirm")) confirm.push([ri, ci]);
            return td.classList.contains("strike") ? "" : text(td);
          }),
        );
        parts.push({
          kind: "table",
          columns: t.querySelectorAll("thead th").map((th) => text(th)),
          rows,
          ...(confirm.length ? { confirm } : {}),
        });
      } else if (el.classList?.contains("lit")) {
        parts.push({ kind: "lit", value: text(el) });
      }
    }
    return withNote({ label, kind: "composite" as const, parts });
  }

  const heading = dd.querySelector(".h1lit, .h2lit");
  if (heading) {
    const lines = headingLines(heading);
    const accent = heading.querySelectorAll("em, b").map((e) => text(e));
    return withNote({
      label,
      kind: "heading" as const,
      lines,
      accent,
      value: lines.join(" "),
    });
  }
  const table = dd.querySelector("table");
  if (table) {
    const columns = table.querySelectorAll("thead th").map((th) => text(th));
    const confirm: [number, number][] = [];
    const rows = table.querySelectorAll("tbody tr").map((tr, ri) =>
      tr.querySelectorAll("td, th").map((td, ci) => {
        if (td.classList.contains("confirm")) confirm.push([ri, ci]);
        return td.classList.contains("strike") ? "" : text(td);
      }),
    );
    return withNote({
      label,
      kind: "table" as const,
      columns,
      rows,
      ...(confirm.length ? { confirm } : {}),
    });
  }
  const paras = dd.querySelectorAll("p.body-copy, p");
  if (paras.length) {
    const lits = dd.querySelectorAll(".lit").map((l) => text(l));
    return withNote({
      label,
      kind: "paragraphs" as const,
      paragraphs: paras.map((p) => text(p)),
      leads: paras.map((p) =>
        p.querySelector("b") ? text(p.querySelector("b")) : null,
      ),
      // In a sheet's prose <b> is emphasis; in the legal documents <b> marks
      // a confirmed token and only <strong> is emphasis.
      marked: paras.map((p) => strongMarked(p, "b, strong")),
      ...(lits.length ? { lits } : {}),
    });
  }
  const list = dd.querySelector("ul, ol");
  if (list) {
    return withNote({
      label,
      kind: "list" as const,
      items: list.querySelectorAll("li").map((li) => text(li)),
    });
  }
  const lit = dd.querySelector(".lit");
  if (lit) {
    const value = text(lit);
    // "Label → /path" is a link literal.
    const m = value.match(
      /^(.*?)\s*(?:→|->)\s*(\/\S*|#\S*|https?:\/\/\S*|mailto:\S*|tel:\S*)$/,
    );
    return withNote(
      m
        ? { label, kind: "lit" as const, value: m[1].trim(), href: m[2] }
        : { label, kind: "lit" as const, value },
    );
  }
  return withNote({ label, kind: "text" as const, value: text(dd) });
}

/* ── A legal document (sheet 08) ─────────────────────────────────────────── */

/**
 * The legal sheets are whole documents: a header line with the date, a
 * standfirst, then `<h3>` sections holding `<h4>` sub-headings, paragraphs
 * and bulleted lists. Counsel notes are `<span class="tok">` and are lifted
 * into the field note, never into a block.
 */
/**
 * A paragraph whose lead-in is emphasised ("Legal basis. Under DPDP…") keeps
 * the emphasis as `**…**`, which the renderers turn back into <strong>.
 * Plain text otherwise.
 */
function strongMarked(el: HTMLElement, selector = "strong"): string {
  if (!el.querySelectorAll(selector).length) return text(el);
  const clone = el.clone() as HTMLElement;
  for (const st of clone.querySelectorAll(selector)) {
    // A run that is the whole paragraph is emphasis of the block, not of a phrase.
    if (text(st) === text(el)) continue;
    st.replaceWith(`**${text(st)}**`);
  }
  return text(clone);
}

function readDocument(sec: HTMLElement, doc: HTMLElement): Field {
  const hdr = sec.querySelector(".pagehdr");
  const lastUpdated = (hdr?.querySelectorAll("span").map((x) => text(x)).find((t) => /^LAST UPDATED:/i.test(t)) ?? "").replace(/^LAST UPDATED:\s*/i, "");
  const notes: string[] = [];
  for (const tok of doc.querySelectorAll(".tok")) {
    notes.push(text(tok));
    tok.parentNode.remove();
  }
  const sections: DocSection[] = [];
  let standfirst = "";
  let current: DocSection | null = null;
  for (const el of doc.childNodes as unknown as HTMLElement[]) {
    if (!el.tagName) continue;
    const tag = el.tagName;
    if (tag === "P" && el.classList.contains("meta")) continue;
    if (tag === "H3") {
      current = { title: text(el).replace(/^\d+\.\s*/, ""), blocks: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      if (tag === "P") standfirst = text(el);
      continue;
    }
    if (tag === "H4") current.blocks.push({ kind: "h", text: text(el) });
    else if (tag === "P") {
      const strong = el.querySelector("strong");
      // A paragraph that is one emphasised sentence is the site's "note" block.
      if (strong && text(strong) === text(el)) current.blocks.push({ kind: "note", text: text(el) });
      else current.blocks.push({ kind: "p", text: strongMarked(el) });
    } else if (tag === "UL" || tag === "OL") current.blocks.push({ kind: "ul", items: el.querySelectorAll("li").map((li) => strongMarked(li)) });
  }
  const sheetTitle = text(sec.querySelector("header h2"));
  return { label: sheetTitle, kind: "document" as const, lastUpdated, standfirst, sections, ...(notes.length ? { note: notes.join(" · ") } : {}) };
}

/* ── A sheet ────────────────────────────────────────────────────────────── */

export function parseSheet(file: string): Sheet {
  const html = readFileSync(file, "utf8").replace(
    /src="data:[^"]+"/g,
    'src=""',
  );
  const root = parse(html);

  const head: Sheet["head"] = {};
  const codes = root.querySelectorAll("section.pagelevel pre.code");
  for (const pre of codes) {
    const t = pre.textContent.replace(/<\/?[bi]>/g, "");
    const title = t.match(/<title>([^<]+)<\/title>/)?.[1];
    const desc = t.match(/name="description" content="([^"]+)"/)?.[1];
    // The <pre> wraps long values for display; the tag value is one line.
    if (title) head.title = clean(title).replace(/\n/g, " ");
    if (desc) head.description = clean(desc).replace(/\n/g, " ");
  }

  const sections: Section[] = root
    .querySelectorAll("section.sec")
    .map((sec) => {
      const header = sec.querySelector("header");
      const fields: Field[] = [];
      for (const dl of sec.querySelectorAll("dl.el")) {
        const f = readRow(dl);
        if (f) fields.push(f);
      }
      const doc = sec.querySelector("div.doc");
      if (doc) fields.push(readDocument(sec, doc));
      const notes = sec.querySelectorAll("ul.spec > li").map((li) => text(li));
      return {
        num: text(header?.querySelector(".num")),
        title: text(header?.querySelector("h2")),
        chip: text(header?.querySelector(".chip")),
        live: text(header?.querySelector(".livehead")),
        fields,
        notes,
      };
    });

  return {
    file: basename(file),
    title: text(root.querySelector("header.mast h1")),
    kicker: text(root.querySelector("header.mast .kicker")),
    head,
    sections,
  };
}

/* ── Review rendering ───────────────────────────────────────────────────── */

function toMarkdown(s: Sheet): string {
  const out: string[] = [`# ${s.file} — ${s.title}`, ``];
  if (s.head.title) out.push(`**<title>** ${s.head.title}`);
  if (s.head.description) out.push(`**description** ${s.head.description}`);
  for (const sec of s.sections) {
    out.push(
      ``,
      `## ${sec.num} ${sec.title} [${sec.chip}]`,
      sec.live ? `> live: ${sec.live}` : ``,
    );
    for (const f of sec.fields) {
      switch (f.kind) {
        case "lit":
          out.push(
            `- **${f.label}**: \`${f.value}\`${f.href ? ` → ${f.href}` : ""}`,
          );
          break;
        case "heading":
          out.push(
            `- **${f.label}**: ${f.lines.map((l) => `“${l}”`).join(" / ")}${f.accent.length ? `  (accent: ${f.accent.join(" | ")})` : ""}`,
          );
          break;
        case "paragraphs":
          out.push(`- **${f.label}**:`);
          for (const p of f.paragraphs) out.push(`  > ${p}`);
          for (const l of f.lits ?? []) out.push(`  \`${l}\``);
          break;
        case "table":
          out.push(`- **${f.label}** (${f.columns.join(" | ")}):`);
          f.rows.forEach((r, ri) =>
            out.push(
              `  | ${r.map((c, ci) => (f.confirm?.some(([a, b]) => a === ri && b === ci) ? `⚠ ${c}` : c)).join(" | ")} |`,
            ),
          );
          break;
        case "list":
          out.push(`- **${f.label}**:`);
          for (const i of f.items) out.push(`  - ${i}`);
          break;
        case "text":
          out.push(`- **${f.label}**: ${f.value}`);
          break;
        case "document":
          out.push(`- **${f.label}** (document · last updated ${f.lastUpdated}):`, `  > ${f.standfirst}`);
          for (const sct of f.sections) {
            out.push(`  ### ${sct.title}`);
            for (const b of sct.blocks) {
              if (b.kind === "ul") for (const it of b.items) out.push(`    - ${it}`);
              else out.push(`    ${b.kind === "h" ? "#### " : b.kind === "note" ? "**" : ""}${b.text}${b.kind === "note" ? "**" : ""}`);
            }
          }
          break;
        case "composite":
          out.push(`- **${f.label}** (composite):`);
          for (const p of f.parts) {
            if (p.kind === "lit") out.push(`  · \`${p.value}\``);
            else if (p.kind === "heading")
              out.push(`  · H: ${p.lines.map((l) => `“${l}”`).join(" / ")}`);
            else if (p.kind === "para")
              out.push(`  · ${p.em ? "_" : ""}${p.text}${p.em ? "_" : ""}`);
            else if (p.kind === "list")
              for (const i of p.items) out.push(`    - ${i}`);
            else if (p.kind === "table")
              for (const r of p.rows) out.push(`    | ${r.join(" | ")} |`);
          }
      }
      if (f.note) out.push(`  _${f.note}_`);
    }
    if (sec.notes.length) {
      out.push(`  <details><summary>notes (${sec.notes.length})</summary>`);
      for (const n of sec.notes) out.push(`  - ${n}`);
      out.push(`  </details>`);
    }
  }
  return out.join("\n");
}

/* ── CLI ────────────────────────────────────────────────────────────────── */

const wanted = process.argv.slice(2);
const files = readdirSync(SRC)
  .filter((f) => f.endsWith(".html") && !f.startsWith("00_"))
  .filter((f) => !wanted.length || wanted.some((w) => f.startsWith(w)));

mkdirSync(OUT, { recursive: true });
for (const f of files) {
  const sheet = parseSheet(join(SRC, f));
  const stem = f.replace(/\.html$/, "");
  writeFileSync(join(OUT, `${stem}.json`), JSON.stringify(sheet, null, 2));
  writeFileSync(join(OUT, `${stem}.md`), toMarkdown(sheet));
  const n = sheet.sections.reduce((a, s) => a + s.fields.length, 0);
  console.log(`  ${stem}: ${sheet.sections.length} sections, ${n} fields`);
}
