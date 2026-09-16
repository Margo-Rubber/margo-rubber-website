/**
 * 10_Product_Oil_Seals → productCategory-oil-seals.
 *
 *   node scripts/sheets/apply/oil-seals.mts [--write]
 */

import { applyStandardCategory } from "../category.mts";

await applyStandardCategory({
  stem: "10_Product_Oil_Seals",
  id: "productCategory-oil-seals",
  sections: { commercial: "05", enquiries: "06" },
  heroAlt: "Rotary oil seals moulded by Margo Rubber Products, Nashik, India",
  // "Delete all five chips … The free-text filter also comes out."
  controls: false,
  // "Link the disclaimer beneath the table" — the notes give the line verbatim.
  specFootnote: "Typical values. See our technical disclaimer.",
  faq: [{ q: "How is a custom oil seal quoted?", from: "commercial" }],
  schemaProduct: {
    name: "Rotary and Static Oil Seals",
    description:
      "Oil seals moulded to shaft diameter, housing bore and width in eight compounds, to DIN 3760 and ISO 6194 profiles.",
  },
  related: ["o-rings"],
});
