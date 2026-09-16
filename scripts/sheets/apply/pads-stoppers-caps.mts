/**
 * 16_Product_Pads_Stoppers_Caps → productCategory-pads-stoppers-caps.
 *
 *   node scripts/sheets/apply/pads-stoppers-caps.mts [--write]
 */

import { applyStandardCategory } from "../category.mts";
import { loadSheet, rows, section } from "../lib.mts";

// The thirteen catalogue components, in table order, for the ItemList node.
const sheet = loadSheet("16_Product_Pads_Stoppers_Caps");
const components = rows(section(sheet, "02"), "Table").map((r) => r[0]);
if (components.length !== 13) throw new Error(`expected 13 components, got ${components.length}`);

await applyStandardCategory({
  stem: "16_Product_Pads_Stoppers_Caps",
  id: "productCategory-pads-stoppers-caps",
  heroAlt: "Moulded rubber pads, filler caps and stoppers made at Margo Rubber Products, Nashik",
  // The chips group the thirteen components by the word in their name.
  chipRules: {
    "Pads & buffers": "Pad",
    "Caps & plugs": "Cap",
    "Stoppers & plungers": "(Stopper|Plunger)",
    "Flaps & covers": "(Flap|Cover)",
  },
  schemaProduct: {
    name: "Rubber Pads, Stoppers and Caps",
    description:
      "Moulded support pads, buffers, filler caps, plungers, stoppers and air-extractor flaps to customer drawing, thirteen catalogue components and cut to print, in eight compounds.",
    material: ["EPDM", "NBR", "Neoprene", "Natural Rubber", "SBR", "Silicone", "AEM", "FKM"],
    components,
  },
  related: ["anti-vibration-mounts", "grommets"],
});
