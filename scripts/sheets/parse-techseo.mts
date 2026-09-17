/**
 * The sheets' "Technical SEO" blocks, read by machine.
 *
 * Every section of every sheet ends with a Technical SEO block: the markup,
 * linking and structured-data rules for that section. This lists them —
 * sheet, section, route, line — into scripts/sheets/out/techseo.json for
 * check-techseo.mts to test against the rendered pages and for the report.
 *
 *   node scripts/sheets/parse-techseo.mts
 */

import { parse } from "node-html-parser";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REDIRECTS } from "../../src/content/redirects.ts";

const SRC = "/Users/true.man/Margo-Rubber/Content_Sheets_for_Developer";

export type Instruction = { sheet: string; section: string; title: string; route: string | null; text: string };

const files: string[] = [];
for (const f of readdirSync(SRC)) {
  const p = join(SRC, f);
  if (statSync(p).isDirectory()) {
    for (const g of readdirSync(p)) if (g.endsWith(".html")) files.push(join(p, g));
  } else if (f.endsWith(".html") && !f.startsWith("00_")) files.push(p);
}

const out: Instruction[] = [];
for (const file of files.sort()) {
  const stem = file.split("/").pop()!.replace(/\.html$/, "");
  const root = parse(readFileSync(file, "utf8").replace(/src="data:[^"]+"/g, 'src=""'));
  const kicker = root.querySelector("header.mast .kicker")?.textContent ?? "";
  let route: string | null = stem.startsWith("01_") ? "/" : (kicker.match(/·\s*(\/\S*)/)?.[1] ?? null);
  if (route?.includes("{")) route = null;
  if (route) route = REDIRECTS.find((r) => r.from === route)?.to ?? route;
  for (const sec of root.querySelectorAll("section.sec")) {
    const num = sec.querySelector("header .num")?.textContent.trim() ?? "";
    const title = sec.querySelector("header h2")?.textContent.trim() ?? "";
    for (const label of sec.querySelectorAll(".blabel")) {
      if (!/^Technical SEO/.test(label.textContent.trim())) continue;
      // The block's content is the siblings until the next label or the scores.
      let el = label.nextElementSibling;
      while (el && !el.classList.contains("blabel") && !el.classList.contains("scores")) {
        for (const li of el.tagName === "UL" || el.tagName === "OL" ? el.querySelectorAll("li") : [el]) {
          const text = li.textContent.replace(/\s+/g, " ").trim();
          if (text.length > 15) out.push({ sheet: stem, section: num, title, route, text });
        }
        el = el.nextElementSibling;
      }
    }
  }
}
writeFileSync("scripts/sheets/out/techseo.json", JSON.stringify(out, null, 1));
console.log(`${out.length} instruction(s) from ${files.length} sheet(s)`);
