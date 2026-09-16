/**
 * 17_Product_Leak_Test_Rubber → productCategory-leak-test-rubber.
 *
 *   node scripts/sheets/apply/leak-test-rubber.mts [--write]
 *
 * No parts section on this page; the sheet renumbers the two that follow.
 */

import { applyStandardCategory } from "../category.mts";

await applyStandardCategory({
  stem: "17_Product_Leak_Test_Rubber",
  id: "productCategory-leak-test-rubber",
  sections: { parts: undefined, commercial: "04", enquiries: "05" },
  heroAlt: "Profiled leak-test sealing rubber for alloy wheel rigs, made at Margo Rubber Products, Nashik",
  // Three chips are words in the application cells; "SUV & premium" selects on SUV.
  chipRules: { "SUV & premium": "SUV" },
  schemaProduct: {
    name: "Leak Test Rubber for Alloy Wheel Rigs",
    description:
      "Compression sealing rubber for alloy-wheel leak-test rigs, profiled to rim diameter and bead-seat geometry, 12 to 24 inch and cut to print, for test pressures of 2 to 6 bar.",
    material: ["AEM", "FKM", "Silicone", "EPDM", "NBR", "Neoprene", "SBR", "Natural Rubber"],
  },
  related: ["o-rings", "pads-stoppers-caps"],
});
