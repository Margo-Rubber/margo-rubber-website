/**
 * 21_Industry_Mining → industry-mining.
 *
 *   node scripts/sheets/apply/mining.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "21_Industry_Mining",
  id: "industry-mining",
  bulletsFor: "Anti-Vibration Mounts",
});
