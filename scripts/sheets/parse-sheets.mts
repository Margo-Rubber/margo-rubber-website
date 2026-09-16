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
      note?: string;
    }
  | {
      label: string;
      kind: "table";
      columns: string[];
      rows: string[][];
      note?: string;
    }
  | { label: string; kind: "list"; items: string[]; note?: string }
  | { label: string; kind: "text"; value: string; note?: string };

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
  const notes = dd.querySelectorAll(".wc, .confirm");
  const note = notes
    .map((n) => text(n))
    .filter(Boolean)
    .join(" · ");
  for (const n of notes) n.remove();
  return { note, dd };
}

/* ── One <dl class="el"> row ────────────────────────────────────────────── */

function readRow(dl: HTMLElement): Field | null {
  const label = text(dl.querySelector("dt"));
  const dd0 = dl.querySelector("dd");
  if (!dd0) return null;
  const { note, dd } = stripNotes(dd0);
  const withNote = (f: Field): Field => (note ? { ...f, note } : f);

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
    const rows = table
      .querySelectorAll("tbody tr")
      .map((tr) =>
        tr
          .querySelectorAll("td, th")
          .map((td) => (td.classList.contains("strike") ? "" : text(td))),
      );
    return withNote({ label, kind: "table" as const, columns, rows });
  }
  const paras = dd.querySelectorAll("p.body-copy, p");
  if (paras.length) {
    return withNote({
      label,
      kind: "paragraphs" as const,
      paragraphs: paras.map((p) => text(p)),
      leads: paras.map((p) =>
        p.querySelector("b") ? text(p.querySelector("b")) : null,
      ),
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
          break;
        case "table":
          out.push(`- **${f.label}** (${f.columns.join(" | ")}):`);
          for (const r of f.rows) out.push(`  | ${r.join(" | ")} |`);
          break;
        case "list":
          out.push(`- **${f.label}**:`);
          for (const i of f.items) out.push(`  - ${i}`);
          break;
        case "text":
          out.push(`- **${f.label}**: ${f.value}`);
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
