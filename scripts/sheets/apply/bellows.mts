/**
 * 12_Product_Bellows → productCategory-bellows.
 *
 *   node scripts/sheets/apply/bellows.mts [--write]
 *
 * No parts section on this page; the sheet renumbers the two that follow.
 */

import { applyStandardCategory } from "../category.mts";

await applyStandardCategory({
  stem: "12_Product_Bellows",
  id: "productCategory-bellows",
  sections: { parts: undefined, commercial: "04", enquiries: "05" },
  heroAlt: "Convoluted rubber bellows moulded at Margo Rubber Products, Nashik",
  // The chips filter by service, not by a standard's name; each carries the
  // rule that selects its rows from the table's own cells.
  chipRules: {
    "Fatigue-critical": "^(Very high|High)$",
    "Oil contact": String.raw`^(?!.*not for (petroleum )?oil)(?!.*no oil contact).*\b(oil|hydraulic fluid)s?\b`,
    "Water & steam": String.raw`\b(water|steam|coolant)\b`,
    "High temperature": String.raw`\+(1[7-9]\d|2\d\d) °C`,
  },
  faq: [{ q: "How is a rubber bellows order quoted?", from: "commercial" }],
  schemaProduct: {
    name: "Rubber Bellows and Protective Boots",
    description:
      "Convoluted bellows and protective boots moulded to customer drawing in eight compounds, specified by stroke, convolution count and service temperature.",
    material: ["Natural Rubber", "Neoprene", "NBR", "EPDM", "AEM", "FKM", "SBR", "Silicone"],
  },
  related: ["oil-seals", "grommets"],
});
