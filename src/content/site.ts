/**
 * Site-level code constants.
 *
 * Everything an editor might need to change — the legal name, address,
 * phone, response times, minimum run, certification record, the compound
 * table — lives in Site settings (Studio → Site settings; fallback in
 * src/content/pages/settings.mdx) and is read through getSiteSettings().
 * It used to live here, which meant a developer and a deploy to correct a
 * phone number, and it drifted: this file carried a 500-piece minimum and a
 * "1 business day" promise long after both had been superseded.
 *
 * What remains here is the rule set: the strings that may never be
 * published, enforced by `npm run check:claims`.
 */

/** Placeholder-status helper — drives noindex + sitemap exclusion. */
export type ContentStatus = "placeholder" | "draft" | "published";

/**
 * STRINGS THAT MUST NEVER SHIP.
 *
 * From the content sheets' claim rules (Build Instructions §07–08) and the
 * live-site audit. Each pattern names the defect it catches. The checker
 * scans the .mdx fallbacks, the Sanity dataset and the component source, and
 * fails on anything not already recorded in claims-baseline.json — the
 * baseline is the list of known defects the copy pass burns down, and a NEW
 * violation fails the build the day it is introduced.
 */
export const FORBIDDEN_CLAIMS: { pattern: RegExp; why: string }[] = [
  /* ── Entity ──────────────────────────────────────────────────────── */
  { pattern: /Margo Rubber Industries|Pvt\.?\s*Ltd/i, why: "The entity is Margo Rubber Products, a firm. GSTIN 27AAKFM8595Q1Z1 embeds a PAN whose 4th character F denotes a firm." },
  { pattern: /MIDC\s+Ambad|B-?12,?\s+MIDC|Ambad,?\s+Nashik/i, why: "Wrong address. The confirmed address is SRNO. 4494/10, behind Furniture Stop, opposite Samarth Dies, Vilholi, Nashik 422010." },
  { pattern: /rfq@margorubber\.com|sales@margorubber|exports@margorubber|admin@margorubber/i, why: "One address sitewide: info@margorubber.in." },
  { pattern: /\+91\s*(92251\s*38339|253\s*234\s*5678|98765\s*43210|22\s*XXXX)/i, why: "One number sitewide: +91 96655 79276. Four others circulated, one a placeholder." },
  { pattern: /©\s*20(1\d|2[0-5])\b/, why: "Copyright year renders from the clock, never a literal." },
  { pattern: /\b(1982|1988|1997)\b(?=[^\n]{0,60}(found|establish|since|est\.))/i, why: "Founding year is 2005. The old site ran three others at once." },

  /* ── Promises ────────────────────────────────────────────────────── */
  { pattern: /within\s+24\s*hours|24[- ]hour\s+(response|quot)|within\s+the\s+hour|within\s+minutes|<\s*4\s*hours/i, why: "Acknowledgement is within one business day; quotation within 48 hours. Nothing faster." },
  { pattern: /within\s+(two|2|three|3)\s+(working|business)\s+days/i, why: "Quotation is within 48 hours — not 2 or 3 days." },
  { pattern: /\bMOQ\b|\(at MOQ\)/i, why: "The term MOQ does not appear. The position is a minimum run of 10,000 pieces per part number, per compound, stated in those words." },
  { pattern: /\b(100|500|1,?000)\s*(pcs|pieces)\b(?=[^\n]{0,40}(min|order|SKU|MOQ))/i, why: "Minimum run is 10,000 pieces per part number per compound; never 100, 500 or 1,000." },
  { pattern: /min(imum)?\.?\s*:?\s*\d[\d,]*\s*kg\b/i, why: "The unit is pieces, never kilograms." },

  /* ── Numbers that do not exist ────────────────────────────────────── */
  { pattern: /±\s*0\.0[15]\s*mm/i, why: "±0.01 mm is the instrument's resolution, not a tolerance. Tolerance is ISO 3302-1 classes M1–M4 / E1–E3." },
  { pattern: /\bCMM\b/, why: "Inspection is by vernier and micrometer. There is no CMM." },
  { pattern: /clean\s*room|ISO\s*Class\s*7/i, why: "No cleanroom. A class is a certified environment with a validation report." },
  { pattern: /six[- ]sigma|6[- ]sigma/i, why: "Six Sigma is a certifiable methodology; unclaimed." },
  { pattern: /\bNABL\b(?![- ](accredited|partner)|\s+partner)/i, why: "Margo's lab is not NABL-accredited; it uses a NABL-accredited partner. Say so." },
  { pattern: /99\.7\s*%|98\.[57]\s*%|<\s*0\.1\s*%\s*defect/i, why: "Invented quality figures. Target rejection is <1%; on-time is >99%." },
  { pattern: /80,?000\s*sq|400\+?\s*(team|employees|staff)|1,?200\+?\s*(clients|customers)|(25|27|30|35|50)\+?\s*(countries|years|nations)/i, why: "Fabricated scale figures. See the sheets' verified values." },
  { pattern: /\b60\s*(M|million)\s*\+?\s*(pcs|pieces)?\s*(\/|per)?\s*(yr|year)/i, why: "Capacity typo. Installed is 5 million a month; current 1.5 million." },
  // Sheet 12 §02 may say what cycle life depends on and offer to qualify a
  // part against a target; it may not state a figure.
  { pattern: /(?<!target )cycle\s*life(?! for a given part depends| and we will qualify)|100,?000[- ]cycle|fatigue[- ]tested/i, why: "No cycle-life or fatigue claim anywhere: no rig in-house or at the partner lab. The 100,000-cycle figure is parked." },
  { pattern: /B16\.20\b/, why: "Rubber flange gaskets cite ASME B16.21; B16.20 is the metallic standard." },
  { pattern: /Kammprofile|Spiral[- ]wound/i, why: "Metallic gasket types Margo does not make." },

  /* ── Certifications ──────────────────────────────────────────────── */
  // "Do you hold IATF 16949 certification?" is a question the page answers
  // with the upgrade (sheet 20 §08); "upgrading … to IATF 16949:2016 and are
  // targeting certification" is the answer.
  { pattern: /IATF\s*16949(?!\s*certification\?)(?![^.]{0,120}(in progress|upgrad|target|being upgraded|roadmap|not (yet )?held|not certified))/i, why: "IATF 16949 is stated only as an upgrade in progress, targeted end 2026 — never as held." },
  { pattern: /\bCE[- ](mark|certif)/i, why: "CE marking is not held." },
  // A REACH screen may be named as a roadmap item (sheet 06 §04 EU block), never as held.
  { pattern: /RoHS[- ](certified|compliant|2\.0)|REACH[- ](certified|compliant|SVHC)(?![^.]{0,120}(roadmap|not (yet )?held|on request))/i, why: "Declarations, not certifications, and not made. Composition declarations are produced per part on request." },
  // "Do you hold FDA or ISO 13485 approval?" is answered "working toward …
  // targeted for 2027. We are not FDA registered." (sheet 23 §08).
  { pattern: /(?<!not hold\s)ISO\s*13485(?!\s*approval\?)(?![^.]{0,80}(do not hold|not held|not hold|working toward|targeted))|(?<!not )FDA[- ](approved|grade|registered|compliant)/i, why: "Never as held. The medical page states plainly they are not." },
  // Naming the schemes is fine when the same passage says they are not held (sheet 24 §08).
  { pattern: /WRAS[- ]approved|NSF[\/ ]?(ANSI[\/ ]?)?61\s*certified|AS\/NZS\s*4020|KTW[- ]BWGL(?![\s\S]{0,200}do not hold)/i, why: "Potable-water approvals attach to a formulation; Margo holds none." },
  { pattern: /ISO\s*(14001|45001)(?![^.]{0,120}(in progress|targeted|being upgraded|not (currently )?held))/i, why: "Only ever as targeted 2027, never as held." },
  // AS568 is the "Aerospace Size Standard" and is described as such; naming
  // the catalogue is not a supply claim (sheet 09 §05).
  { pattern: /AS9100|CEMILAC|(?<!power, )aerospace(?! size standard| procurement)/i, why: "Aerospace supply needs AS9100, not held and not claimed." },
  { pattern: /Bureau Veritas|TÜV\s*SÜD|SGS India(?! pre-shipment)|FIEO/i, why: "Certification bodies that have never audited Margo. The issuer is Integral Certification Ltd." },

  /* ── Customers and people ────────────────────────────────────────── */
  { pattern: /Kirloskar|Bosch|Atlas Copco|Grundfos|Thermax|Forbes Marshall|\bKSB\b|Alfa Laval|Sulzer|Bonfiglioli|\bL&T\b|Larsen & Toubro|\bBHEL\b|Siemens|\bABB\b|Samsung Engineering/i, why: "Fabricated client names. The 23 named accounts come from company profile p28 via site settings." },
  // Victor Reinz is on the sheets' corrected 24-name list (sheet 01 §02, company profile p28).
  { pattern: /Samsonite|Federal-Mogul/i, why: "Dropped in the 2026-07-19 reconciliation; Federal-Mogul owns the Victor Reinz brand already listed." },
  { pattern: /Name pending sign-off|Attribution pending/i, why: "Placeholder strings published on the live page." },

  /* ── Materials Margo does not make ───────────────────────────────── */
  { pattern: /\b(polyurethane|\bPU\b|butyl|\bPVC\b|solid PTFE)\b(?![^\n.]{0,60}(do not|not one of|decline|never))/i, why: "Not among the eight compounds. PTFE-encapsulated O-rings are fine; solid PTFE is not." },

  /* ── Register ────────────────────────────────────────────────────── */
  { pattern: /cutting[- ]edge|world[- ]class|industry[- ]leading|state[- ]of[- ]the[- ]art/i, why: "Banned marketing register. Voice is factual-engineer." },
];
