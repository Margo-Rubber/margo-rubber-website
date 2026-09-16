/**
 * 25_Industry_HVAC → industry-hvac.
 *
 *   node scripts/sheets/apply/hvac.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "25_Industry_HVAC",
  id: "industry-hvac",
  bulletsFor: "Anti-Vibration Mounts",
});
