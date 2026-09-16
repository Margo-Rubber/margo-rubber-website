/**
 * 14_Product_Grommets → productCategory-grommets.
 *
 *   node scripts/sheets/apply/grommets.mts [--write]
 */

import { applyStandardCategory } from "../category.mts";

await applyStandardCategory({
  stem: "14_Product_Grommets",
  id: "productCategory-grommets",
  heroAlt: "Moulded rubber cable grommets at Margo Rubber Products, Nashik",
  // The four configuration chips are words in the table's own cells.
  faq: [{ q: "How is a custom grommet order quoted?", from: "commercial" }],
  schemaProduct: {
    name: "Custom Rubber Grommets",
    description:
      "Cable and panel pass-through grommets moulded to customer drawing in open, blind, multi-hole, oval and bulkhead configurations, 6 to 50 mm panel hole and cut to print, in eight compounds.",
    material: ["EPDM", "NBR", "Neoprene", "Silicone", "AEM", "FKM", "SBR", "Natural Rubber"],
  },
  related: ["bushes", "extrusion"],
});
