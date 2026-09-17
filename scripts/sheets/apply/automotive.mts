/**
 * 20_Industry_Automotive → industry-automotive.
 *
 *   node scripts/sheets/apply/automotive.mts [--write]
 */

import { applyIndustry } from "../industry.mts";

await applyIndustry({
  stem: "20_Industry_Automotive",
  id: "industry-automotive",
  // "Link 'AEM' to the bushes page on first mention" (§04).
  links: [{ block: "conditions", phrase: "AEM", href: "/products/bushes" }],
  bulletsFor: "Bushes & Bushings",
});
