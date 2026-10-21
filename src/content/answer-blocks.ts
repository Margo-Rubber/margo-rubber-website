/**
 * ANSWER BLOCKS (D6 / T13) — one question and its answer near the top of
 * each page, written so an answer engine can lift it whole: the question as
 * an H2, a 40–60-word answer that leads with a number.
 *
 * Text from 3rd Shade's AEO sheet (15 Oct 2026, "Answer-block rewrites"),
 * pasted EXACTLY as written in the developer to-do of 21 Oct 2026. Every
 * figure is one already published on the site. Do not add "95 countries",
 * "200+ SKUs", IATF dates or any minimum other than 10,000.
 *
 * Rows 5, 15, 17 and 19 are held for Margo's sign-off (D13) and rows 21–28
 * belong to the /materials pages (D15); add them here when released.
 *
 * Each block also goes into its page's FAQPage schema (see lib/schema.ts),
 * so the visible text and the structured data cannot drift apart.
 */
export type AnswerBlock = { row: number; q: string; a: string };

export const ANSWER_BLOCKS: Record<string, AnswerBlock> = {
  "/": {
    row: 1,
    q: "Who makes custom rubber parts to drawing in Nashik, India?",
    a: "Margo Rubber Products, in Nashik since 2005, moulds and extrudes rubber parts to customer drawing. Its moulded-component line is certified to ISO 9001:2015 (certificate 09111526A, Integral Certification Ltd, valid to 21 February 2027). The range covers O-rings, oil seals, gaskets, bellows and bonded parts in eight compounds. Quotation in 48 hours; production in three to four weeks.",
  },
  "/products/o-rings": {
    row: 2,
    q: "Which O-ring standards and compounds does Margo mould?",
    a: "Margo moulds O-rings to AS568, ISO 3601, JIS B2401 and DIN 3771, in AEM, EPDM, FKM, NBR and silicone. Hardness runs from 30 to 90 Shore A depending on the compound, and tolerance follows the standard and the cross-section. Sizes outside the catalogue are cut to your drawing. The minimum run is 10,000 pieces per part number, per compound.",
  },
  "/products/oil-seals": {
    row: 3,
    q: "Which oil seal material should I specify?",
    a: "Pick by the medium, then the temperature, in a DIN 3760 or ISO 6194 size. NBR covers mineral oil, fuel and hydraulic fluid from −30 to +120 °C. FKM takes fuels and aggressive chemistry to +250 °C. EPDM is for water, steam and brake fluid, never petroleum oil. Margo moulds seals in AEM, EPDM, FKM, NBR and silicone.",
  },
  "/products/gaskets": {
    row: 4,
    q: "What is the best rubber for a gasket?",
    a: "EPDM to +140 °C for water, steam and weather, NBR to +120 °C for oil and fuel, FKM to +250 °C for chemicals and fuel: the medium decides, not a single best rubber. Margo moulds and die-cuts gaskets in eight compounds to ASME B16.21, EN 1514-1 and JIS B2404, with tolerance to ISO 3302-1.",
  },
  "/products/bushes": {
    row: 6,
    q: "What sizes and hardness do Margo's rubber bushes come in?",
    a: "Silent-block bushes run 8–20 mm bore by 20–40 mm outside diameter, insulation bushes 10–30 by 25–60 mm, and linkage bushes 12–40 by 30–80 mm. Durometer runs 45 to 75 Shore A and is set on your drawing, because hardness sets the rate. Dimensions are held to ISO 3302-1, class M1 to M4.",
  },
  "/products/bonded-components": {
    row: 7,
    q: "How is rubber bonded to metal?",
    a: "Rubber is bonded to metal during vulcanisation and tested to ASTM D429: the insert is degreased, grit-blasted, chemically treated and primed, then the rubber cures onto it in the mould. There is no glued joint to fail. Margo bonds to steel, stainless steel, aluminium and brass. A sound bond fails in the rubber, recorded as 100% R.",
  },
  "/products/extrusion": {
    row: 8,
    q: "What tolerance can a rubber extrusion hold?",
    a: "Margo holds ±0.2 mm on the critical dimensions of an extruded profile, with each tolerance set by the section and recorded to ISO 3302-1, class E1 to E3. Profiles are extruded in EPDM, FKM, NBR, neoprene and silicone, at 40–85 Shore A, across −60 to +250 °C. Pricing is per metre, quoted against your total run length.",
  },
  "/products/rubber-lining": {
    row: 9,
    q: "How thick and how hard should a rubber lining be?",
    a: "6–25 mm thick at 35–65 Shore A, set by the duty. Light sliding abrasion takes 6–8 mm at 55–65 Shore A; general abrasion 10–12 mm at 45–60 Shore A; impact zones such as crusher discharge 15–25 mm at 35–45 Shore A. Natural rubber has the best abrasion resistance of Margo's eight compounds, measured as volume loss to ISO 4649.",
  },
  "/products/seals": {
    row: 10,
    q: "Why does a reciprocating seal leak after a few weeks?",
    a: "On a rod or piston seal in an ISO 5597 housing, the usual culprit is the rod: surface finish is the biggest single cause of early failure. Pressure and clearance gap come next, and together they decide whether a back-up ring is needed. Send the finish in Ra, the plating, the clearance, and continuous and peak pressure.",
  },
  "/products/diaphragms": {
    row: 11,
    q: "When does a rubber diaphragm need fabric reinforcement?",
    a: "Above roughly 3 bar, or wherever a stretching diaphragm would change the dose, the rubber alone cannot carry the pressure and fabric reinforcement takes over. Margo moulds flat, rolling and convoluted diaphragms from Ø20 to Ø400 mm effective diameter, at 40–80 Shore A, and picks the compound from the medium you pump, not from a default.",
  },
  "/products/bellows": {
    row: 12,
    q: "Which rubber should a bellows or boot be made from?",
    a: "Natural rubber for flex-fatigue life with no oil (−20 to +90 °C), NBR for petroleum oil and hydraulic fluid (to +120 °C), EPDM for water, steam and weather (to +140 °C), FKM for fuel at sustained high temperature (to +250 °C). Pick by what the bellows touches. Margo moulds convoluted bellows and boots from Ø10 to Ø150 mm.",
  },
  "/products/grommets": {
    row: 13,
    q: "What size rubber grommet do I need?",
    a: "Size it from the panel hole and the panel thickness: 6–12 mm holes take a 1.0–1.6 mm panel. 12–25 mm holes take 1.2–2.0 mm, and 25–50 mm holes take 1.6–3.0 mm. Margo moulds open, blind, multi-hole and oval grommets in that range. Holes above 50 mm and bulkhead grommets are cut to print, in any of eight compounds.",
  },
  "/products/sponge-foam-rubber": {
    row: 14,
    q: "What is sponge rubber used for?",
    a: "Sponge rubber at 12–200 kg/m³ seals, insulates and damps: closed-cell grades keep out water, air and dust, and open-cell foam absorbs sound and lets air through. Margo moulds, extrudes and die-cuts both in EPDM, natural rubber, NBR, neoprene and silicone, for HVAC gaskets, weatherseals and acoustic panels. Sponge grades are rated cooler than the same compound in solid form.",
  },
  "/products/leak-test-rubber": {
    row: 16,
    q: "What rubber is used on an alloy wheel leak-test rig?",
    a: "NBR or EPDM, profiled to the rim and bead seat, for 12″ to 24″ rims at 2 to 6 bar test pressure. EPDM is the default compound. Compression set decides how long the seal keeps sealing, so Margo measures it in-house to ASTM D395 and ISO 815-1. Commercial-vehicle rims and non-standard geometry are cut to print.",
  },
  "/industries/oil-gas": {
    row: 18,
    q: "Which seal compound is used for hydrocarbon service?",
    a: "FKM is the usual choice where petroleum oils, fuels or solvents meet sustained heat: it is rated to +250 °C, continuous to +200 °C. NBR suits moderate-temperature oil contact to +120 °C. EPDM is for water and steam, not hydrocarbons. Margo is ISO 9001:2015 certified; NORSOK M-710 and API qualification is a 2027 roadmap item, not held today.",
  },
  "/export": {
    row: 20,
    q: "What lead time and documents come with an export order?",
    a: "Production takes 3–4 weeks ex-works Nashik from drawing approval, or 2 weeks on express where capacity is confirmed. Before the vessel sails, Margo issues the commercial invoice with HS code and the packing list, and arranges the certificate of origin from the Nashik Chamber of Commerce; the shipping line issues the bill of lading. Terms: FOB Nhava Sheva or CIF.",
  },
};

export const answerBlockFor = (path: string): AnswerBlock | undefined => ANSWER_BLOCKS[path];

/** The first mention of each standard on a page links to its publisher (D6). */
export const STANDARD_LINKS: readonly { code: string; href: string }[] = [
  { code: "DIN 3760", href: "https://www.dinmedia.de/en/standard/din-3760/2815256" },
  { code: "ISO 3601", href: "https://www.iso.org/standard/58043.html" },
  { code: "ASME B16.21", href: "https://www.asme.org/codes-standards/find-codes-standards/b16-21-nonmetallic-flat-gaskets-pipe-flanges" },
  { code: "ASTM D2000", href: "https://store.astm.org/d2000-18.html" },
  { code: "ISO 3302-1", href: "https://www.iso.org/standard/62492.html" },
];
