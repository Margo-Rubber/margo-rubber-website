/**
 * 34_SKU_Sheets/SKU_01 … SKU_31 → the 31 sku documents.
 *
 *   node scripts/sheets/apply/skus.mts [SKU_06] [--write] [--review]
 *
 * --review prints what each sheet resolves to (applications, spec rows,
 * ranking) without touching Sanity — the pre-format-rule sheets carry
 * rationale inside cells and the extraction is worth reading once.
 */

import { readdirSync } from "node:fs";
import { applySku } from "../sku.mts";

/** Sheet stem → the live document. Category moves the sheets propose are Phase 7. */
const SKUS: Record<string, string> = {
  "SKU_01_ac-vibration-weight": "anti-vibration-mounts--ac-vibration-weight",
  "SKU_02_backlight-mount": "anti-vibration-mounts--backlight-mount",
  "SKU_03_bumper-stopper": "anti-vibration-mounts--bumper-stopper",
  "SKU_04_scorpio-footrest-mat": "anti-vibration-mounts--scorpio-footrest-mat",
  "SKU_05_tata-bumper-stopper": "anti-vibration-mounts--tata-bumper-stopper",
  "SKU_06_aem-insulation-bush": "bushes--aem-insulation-bush",
  "SKU_07_c-pillar-garnish": "gaskets--c-pillar-garnish",
  "SKU_08_epdm": "gaskets--epdm",
  "SKU_09_foam-gaskets": "gaskets--foam-gaskets",
  "SKU_10_3-pin-hole-pad": "grommets--3-pin-hole-pad",
  "SKU_11_internal-fit": "grommets--internal-fit",
  "SKU_12_seal-filler-cap-o-rings": "o-rings--seal-filler-cap-o-rings",
  "SKU_13_compression-pump-inlays": "oil-seals--compression-pump-inlays",
  "SKU_14_oil-seals-epdm": "oil-seals--epdm",
  "SKU_15_oil-seals-fkm": "oil-seals--fkm",
  "SKU_16_fkm-compression-pump-inlays": "oil-seals--fkm-compression-pump-inlays",
  "SKU_17_oil-seals-nbr": "oil-seals--nbr",
  "SKU_18_oil-seals-silicone": "oil-seals--silicone",
  "SKU_19_ac-flaps": "pads-stoppers-caps--ac-flaps",
  "SKU_20_big-support-pad": "pads-stoppers-caps--big-support-pad",
  "SKU_21_bolero-support-pad": "pads-stoppers-caps--bolero-support-pad",
  "SKU_22_boot-tailgate-switch": "pads-stoppers-caps--boot-tailgate-switch",
  "SKU_23_c-pad": "pads-stoppers-caps--c-pad",
  "SKU_24_epdm-pad": "pads-stoppers-caps--epdm-pad",
  "SKU_25_glove-box-stopper": "pads-stoppers-caps--glove-box-stopper",
  "SKU_26_insulator-head-cover": "pads-stoppers-caps--insulator-head-cover",
  "SKU_27_l-pad": "pads-stoppers-caps--l-pad",
  "SKU_28_oil-filler-cap": "pads-stoppers-caps--oil-filler-cap",
  "SKU_29_oil-seal-filler-cap": "pads-stoppers-caps--oil-seal-filler-cap",
  "SKU_30_radiator-shroud-flaps": "pads-stoppers-caps--radiator-shroud-flaps",
  "SKU_31_rubber-plungers": "pads-stoppers-caps--rubber-plungers",
};

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const review = process.argv.includes("--review");
const stems = Object.keys(SKUS).filter((s) => !args.length || args.some((a) => s.startsWith(a)));
const onDisk = readdirSync("scripts/sheets/out").filter((f) => /^SKU_.*\.json$/.test(f)).length;
if (onDisk !== 31) throw new Error(`expected 31 parsed SKU sheets, found ${onDisk}`);

for (const stem of stems) {
  const file = SKUS[stem];
  const category = file.slice(0, file.indexOf("--"));
  const patch = await applySku({ stem, id: `sku-${file}`, category, review });
  if (review) {
    const P = patch as Record<string, unknown>;
    console.log(`\n══ ${stem}`);
    console.log("  h1:", P.h1);
    console.log("  quick:", JSON.stringify(P.quickSpecs));
    console.log("  overlay:", JSON.stringify(P["gallery.overlay"]));
    console.log("  tiles:", JSON.stringify((P.dimensional as { tiles: unknown }).tiles));
    console.log("  specs:", JSON.stringify(P.specs));
    console.log("  ranking:", JSON.stringify((P.compoundRanking as { code: string; rankLabel: string }[]).map((r) => `${r.rankLabel}: ${r.code}`)));
    console.log("  chip:", JSON.stringify(P.qualityChip));
    console.log("  apps:", JSON.stringify(P.applications));
    console.log("  process:", JSON.stringify((P.process as { name: string }[]).map((p) => p.name)));
    console.log("  metrics:", JSON.stringify((P.quality as { metrics: unknown }).metrics));
    console.log("  related:", JSON.stringify(P.relatedParts));
    console.log("  doc cta:", JSON.stringify((P.documentation as { cta: unknown }).cta));
  }
}
