/**
 * 24_Industry_Pumps_Valves → industry-pumps-valves.
 *
 *   node scripts/sheets/apply/pumps-valves.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "24_Industry_Pumps_Valves",
  id: "industry-pumps-valves",
  bulletsFor: "Gaskets",
});
