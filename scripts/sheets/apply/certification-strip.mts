/**
 * The certification block sheets 36–42 share → Site settings.
 *
 *   node scripts/sheets/apply/certification-strip.mts [--write]
 *
 * "Identical on all category pages · do not retype it, do not add to it."
 * The lines are read from sheet 36, checked against the other six, and
 * stored once; the pages place a block that reads them.
 */

import { z } from "zod";
import { siteSettingsSchema } from "../../../src/content/schemas/settings.ts";
import { stripNullsDeep } from "../../../src/content/blocks.ts";
import { applyDocument, lit, loadSheet, section } from "../lib.mts";

const SHEETS: [string, string][] = [
  ["36_Product_Diaphragms", "07"],
  ["37_Product_Bonded_Components", "08"],
  ["38_Product_Rubber_Lining", "08"],
  ["39_Product_Seals", "08"],
  ["40_Resource_Sponge_Foam_Datasheet", "08"],
  ["41_Industry_Construction", "07"],
  ["42_Industry_Transport", "07"],
];

const blocks = SHEETS.map(([stem, num]) => lit(section(loadSheet(stem), num), "Certification block"));
for (let i = 1; i < blocks.length; i++)
  if (blocks[i] !== blocks[0]) throw new Error(`${SHEETS[i][0]} §${SHEETS[i][1]}: certification block differs from sheet 36`);

const strip = blocks[0].split("\n");
await applyDocument({
  id: "siteSettings-settings",
  type: "siteSettings",
  schema: z.preprocess((raw) => stripNullsDeep(raw), siteSettingsSchema.passthrough()),
  patch: { "certifications.strip": strip },
  expect: strip,
});
