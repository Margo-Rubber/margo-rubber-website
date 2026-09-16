/**
 * 20_Industry_Automotive → industry-automotive.
 *
 *   node scripts/sheets/apply/automotive.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "20_Industry_Automotive",
  id: "industry-automotive",
  bulletsFor: "Bushes & Bushings",
});
