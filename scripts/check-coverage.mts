/**
 * SHEET COVERAGE — the other direction from check:copy.
 *
 * check:copy proves every string the apply script placed is on the page.
 * This lists every deliverable string in the SHEET that is NOT on the page,
 * so an omission in the apply script shows up rather than silently passing.
 * Deliverable = every literal, heading line, paragraph, list item and table
 * cell in a section's Replacement content, minus the columns that are not
 * copy ("Replaces", "Live status", "Why", "Live …", "Watch for") and the
 * cells the sheet strikes through.
 *
 *   node scripts/check-coverage.mts 01_Homepage /  [02_Products /products …]
 */

import { readFileSync } from "node:fs";
import type { Sheet } from "./sheets/parse-sheets.mts";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SKIP_COLUMNS =
  /^(replaces|live status|why|why this one|live [a-z]+|watch for|#|status|general industry continuous|verdict|published here|links to|goes to|state on .*|on this page)$/i;
const SKIP_SECTIONS = /footer|page-level/i;
/**
 * Fields a sheet writes but does not ship, by sheet#section and field index:
 * sheet 38 §07 carries the question, Version A (its H2 and two panels) and
 * the "also required" note beside the Version B that ships.
 */
const UNSHIPPED: Record<string, number[]> = { "38_Product_Rubber_Lining#07": [0, 1, 2, 3, 7] };

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
const norm = (s: string) => decode(s).replace(/\s+/g, " ").trim();
const INLINE = /<\/?(a|b|strong|em|i|span|u|small|abbr|code|sup|sub)\b[^>]*>/g;
const textOf = (html: string) =>
  norm(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<!-- -->/g, "")
      // Form placeholders are copy too; lift them out of the attribute.
      .replace(/<(input|textarea)\b[^>]*\bplaceholder="([^"]*)"[^>]*>/g, " $2 ")
      .replace(INLINE, "")
      .replace(/<[^>]+>/g, " "),
  );

const args = process.argv.slice(2);
if (args.length % 2) throw new Error("pairs of <sheet> <route>");

for (let i = 0; i < args.length; i += 2) {
  // `08_Legal_Pages#02` — one section of a sheet that spans several routes.
  const [stem, only] = args[i].split("#");
  const route = args[i + 1];
  const sheet = JSON.parse(
    readFileSync(`scripts/sheets/out/${stem}.json`, "utf8"),
  ) as Sheet;
  const html = await (await fetch(`${BASE}${route}`)).text();
  const text = textOf(html);
  const lower = text.toLowerCase();
  const misses: string[] = [];
  let total = 0;
  const check = (sec: string, label: string, s: string) => {
    const v = norm(s)
      .replace(/\*\*/g, "")
      // The sheet's own glyph for a line it wants read twice is not copy.
      .replace(/🛑\s*/g, "")
      // "[ Label → /href ]" — the brackets come off before the href does.
      .replace(/^\[\s*|\s*\]$/g, "")
      .replace(/\s*(→|↗|↓)\s*(\/|#|tel:|mailto:|https?:)\S*$/, "")
      .replace(/\s*(→|↓|↗)\s*$/, "");
    if (!v || v.length < 3) return;
    total++;
    if (!lower.includes(v.toLowerCase()))
      misses.push(
        `§${sec} ${label}: “${v.length > 100 ? v.slice(0, 97) + "…" : v}”`,
      );
  };
  for (const sec of sheet.sections) {
    if (SKIP_SECTIONS.test(sec.title)) continue;
    if (only && sec.num !== only) continue;
    for (const [fi, f] of sec.fields.entries()) {
      if (UNSHIPPED[`${stem}#${sec.num}`]?.includes(fi)) continue;
      if (
        /^(remove|removed|cut|recommendation|permission note|strip build|check result|single source|fkm — the one|add a column|figure block ×0|download buttons)/i.test(
          f.label,
        )
      )
        continue;
      switch (f.kind) {
        case "lit":
          for (const line of f.value.split("\n")) {
            const m = line.match(/^(.*?)\s*(?:→|->)\s*\S+$/);
            check(sec.num, f.label, m ? m[1] : line);
          }
          break;
        case "heading":
          for (const l of f.lines) check(sec.num, f.label, l);
          break;
        case "paragraphs":
          for (const p of f.paragraphs) check(sec.num, f.label, p);
          for (const l of f.lits ?? []) check(sec.num, f.label, l);
          break;
        case "list":
          for (const it of f.items) check(sec.num, f.label, it);
          break;
        case "table": {
          const cols = f.columns;
          f.rows.forEach((r) =>
            r.forEach((cell, ci) => {
              if (cols[ci] && SKIP_COLUMNS.test(cols[ci])) return;
              if (!cell) return;
              for (const part of cell.split(/\s·\s|\n/))
                check(
                  sec.num,
                  `${f.label}[${cols[ci] ?? ci}]`,
                  part.replace(/^\d\d\s+/, ""),
                );
            }),
          );
          break;
        }
        case "text":
          check(sec.num, f.label, f.value);
          break;
        case "document":
          check(sec.num, "standfirst", f.standfirst);
          for (const sct of f.sections) {
            check(sec.num, sct.title, sct.title);
            for (const b of sct.blocks) {
              if (b.kind === "ul") for (const it of b.items) check(sec.num, sct.title, it);
              else check(sec.num, sct.title, b.text);
            }
          }
          break;
        case "composite":
          for (const p of f.parts) {
            if (p.kind === "lit") for (const line of p.value.split("\n")) check(sec.num, f.label, line.replace(/^→\s*/, "").replace(/\s*\/\S+$/, ""));
            else if (p.kind === "heading") for (const l of p.lines) check(sec.num, f.label, l);
            else if (p.kind === "para") check(sec.num, f.label, p.text);
            else if (p.kind === "list") for (const it of p.items) check(sec.num, f.label, it);
            else if (p.kind === "table") for (const r of p.rows) for (const c of r) check(sec.num, f.label, c);
          }
      }
    }
  }
  console.log(
    `\n══ ${stem} → ${route}: ${total - misses.length}/${total} sheet strings on the page`,
  );
  for (const m of misses) console.log(`  ✗  ${m}`);
}
