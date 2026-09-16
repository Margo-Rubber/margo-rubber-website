/**
 * 11_Product_Gaskets → productCategory-gaskets.
 *
 *   node scripts/sheets/apply/gaskets.mts [--write]
 */

import { applyStandardCategory } from "../category.mts";

await applyStandardCategory({
  stem: "11_Product_Gaskets",
  id: "productCategory-gaskets",
  heroAlt: "Moulded EPDM flange gaskets at Margo Rubber Products, Nashik",
  codes: { "EPDM sponge / hard foam": "EPDM-SPONGE" },
  schemaProduct: {
    name: "Custom Rubber Gaskets",
    description:
      "Moulded and die-cut rubber gaskets to ASME B16.21, EN 1514-1 and JIS B2404 in eight compounds plus EPDM sponge.",
    material: ["FKM", "NBR", "EPDM", "Silicone", "AEM", "Neoprene", "SBR", "Natural Rubber", "EPDM Sponge"],
  },
  related: ["o-rings", "oil-seals"],
});
