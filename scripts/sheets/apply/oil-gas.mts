/**
 * 22_Industry_Oil_Gas → industry-oil-gas.
 *
 *   node scripts/sheets/apply/oil-gas.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "22_Industry_Oil_Gas",
  id: "industry-oil-gas",
  // "This block should link to the new FAQ qualification answer" (§06).
  links: [{ block: "quality", phrase: "Documentation available on request", href: "#faq" }],
  bulletsFor: "O-Rings",
});
