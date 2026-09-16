/**
 * 09_Product_O_Rings → productCategory-o-rings.
 *
 *   node scripts/sheets/apply/o-rings.mts [--write]
 *
 * The one category page with a sizing-standards section (§05); its
 * commercial terms are §06 and the enquiry band §07. The footer (§08) is
 * the sitewide component, already applied from sheet 01.
 */

import { applyStandardCategory } from "../category.mts";

await applyStandardCategory({
  stem: "09_Product_O_Rings",
  id: "productCategory-o-rings",
  sections: { standards: "05", commercial: "06", enquiries: "07" },
  // alt text and the trade-mark footnote are given verbatim in the notes.
  heroAlt: "Precision O-rings moulded by Margo Rubber Products, Nashik, India",
  materialFootnote:
    "Viton is a registered trade mark of The Chemours Company. Vamac is a registered trade mark of DuPont. Teflon is a registered trade mark of The Chemours Company.",
  // Not a compound in Site settings: the panel keeps its own figures.
  codes: { "PTFE-encapsulated": "PTFE" },
  schemaProduct: {
    name: "Precision O-Rings",
    description: "Custom and catalogue O-rings moulded to AS568, ISO 3601, JIS B2401 and DIN 3771 in eight compounds.",
  },
  related: ["oil-seals"],
});
