/**
 * 15_Product_Bushes → productCategory-bushes.
 *
 *   node scripts/sheets/apply/bushes.mts [--write]
 */

import { applyStandardCategory } from "../category.mts";

await applyStandardCategory({
  stem: "15_Product_Bushes",
  id: "productCategory-bushes",
  heroAlt: "Bonded rubber silent-block bushes at Margo Rubber Products, Nashik",
  // The four chips are words in the table's construction and type cells.
  faq: [{ q: "How is a bonded rubber bush quoted?", from: "commercial" }],
  schemaProduct: {
    name: "Rubber Bushes and Bushings",
    description:
      "Silent-block, bonded, flanged and insulation bushes moulded to customer drawing by bore, outer diameter, length and durometer, in natural rubber, AEM, NBR, EPDM and four further compounds.",
    material: ["AEM", "FKM", "Silicone", "EPDM", "NBR", "Neoprene", "SBR", "Natural Rubber"],
  },
  related: ["anti-vibration-mounts", "oil-seals"],
});
