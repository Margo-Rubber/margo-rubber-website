/**
 * 13_Product_Anti_Vibration_Mounts → productCategory-anti-vibration-mounts.
 *
 *   node scripts/sheets/apply/anti-vibration-mounts.mts [--write]
 */

import { applyStandardCategory } from "../category.mts";

await applyStandardCategory({
  stem: "13_Product_Anti_Vibration_Mounts",
  id: "productCategory-anti-vibration-mounts",
  heroAlt: "Rubber-to-metal bonded anti-vibration mounts at Margo Rubber Products, Nashik",
  // The sheet names the chips but not which mount types each selects; the
  // rules read the mount-type cell. Bonded / unbonded and compression /
  // shear follow the form: bobbins, conical, plate and shear mounts and
  // bonded bushes are rubber-to-metal bonded; a buffer is unbonded; a shear
  // or bush mount is loaded in shear, the rest in compression — OPEN-ITEMS.
  chipRules: {
    Bonded: "^(Cylindrical bobbin|Conical|Plate|Shear|Bonded)",
    Unbonded: "^Buffer",
    Compression: "^(Cylindrical bobbin|Conical|Plate|Buffer)",
    Shear: "^(Shear|Bonded bush)",
  },
  schemaProduct: {
    name: "Anti-Vibration Mounts",
    description:
      "Rubber-to-metal bonded and unbonded anti-vibration mounts moulded to customer drawing in bobbin, conical, sandwich and buffer forms, specified by static load and stiffness.",
    material: ["AEM", "FKM", "Silicone", "EPDM", "NBR", "Neoprene", "SBR", "Natural Rubber"],
  },
  related: ["bushes", "pads-stoppers-caps"],
});
