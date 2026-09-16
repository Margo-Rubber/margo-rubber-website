/**
 * 26_Industry_Electrical_Electronics → industry-electrical-electronics.
 *
 *   node scripts/sheets/apply/electrical-electronics.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "26_Industry_Electrical_Electronics",
  id: "industry-electrical-electronics",
  bulletsFor: "Grommets",
});
