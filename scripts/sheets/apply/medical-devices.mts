/**
 * 23_Industry_Medical_Devices → industry-medical-devices.
 *
 *   node scripts/sheets/apply/medical-devices.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "23_Industry_Medical_Devices",
  id: "industry-medical-devices",
  bulletsFor: "O-Rings",
});
