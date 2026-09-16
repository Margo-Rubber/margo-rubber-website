/**
 * 27_Industry_Agriculture → industry-agriculture.
 *
 *   node scripts/sheets/apply/agriculture.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "27_Industry_Agriculture",
  id: "industry-agriculture",
  bulletsFor: "Bushes & Bushings",
});
