/**
 * 22_Industry_Oil_Gas → industry-oil-gas.
 *
 *   node scripts/sheets/apply/oil-gas.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "22_Industry_Oil_Gas",
  id: "industry-oil-gas",
  bulletsFor: "O-Rings",
});
