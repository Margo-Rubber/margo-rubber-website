/**
 * 28_Industry_Water_Fluid_Management → industry-water-fluid-management.
 *
 *   node scripts/sheets/apply/water-fluid-management.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "28_Industry_Water_Fluid_Management",
  id: "industry-water-fluid-management",
  bulletsFor: "Gaskets",
});
