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
export type AnswerBlock = {
  row: number;
  q: string;
  a: string;
  /** Further paragraphs under the first — the "Key facts" of the Oct 2026 pages. */
  more?: string[];
  /** False keeps a heading that is not a question ("Key facts") out of FAQPage. */
  faq?: boolean;
};

export const ANSWER_BLOCKS: Record<string, AnswerBlock> = {
  "/": {
    row: 1,
    q: "Who makes custom rubber parts to drawing in Nashik, India?",
    // N2 (to-do, 25 Oct 2026): the parts list sits between the extrusion
    // sentence and the certificate's scope, so an answer engine cannot merge
    // the two into "ISO 9001:2015 certified … extruded". Same words, reordered.
    a: "Margo Rubber Products, in Nashik since 2005, moulds and extrudes rubber parts to customer drawing. The range covers O-rings, oil seals, gaskets, bellows and bonded parts in eight compounds. Its moulded-component line is certified to ISO 9001:2015 (certificate 09111526A, Integral Certification Ltd, valid to 21 February 2027). Quotation in 48 hours; production in three to four weeks.",
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
  "/manufacturing": {
    // K5 (keyword pack, 25 Oct 2026). The answer is the pack's opening answer
    // block verbatim; the pack supplies no question, so this one is drafted
    // here — reword freely, the answer must stay as written.
    row: 0,
    q: "How does Margo mould a rubber part?",
    a: "Margo Rubber Products mixes its own compound, makes its own moulds and produces rubber parts as per your drawing by compression, transfer and injection moulding at one plant in Vilholi, Nashik. Every mixed batch is checked, every run is checked at set-up and every half hour, and every despatch lot is checked for dimensions and hardness before release. Quotation in 48 hours, production in three to four weeks.",
  },
  "/export": {
    row: 20,
    q: "What lead time and documents come with an export order?",
    a: "Production takes 3–4 weeks ex-works Nashik from drawing approval, or 2 weeks on express where capacity is confirmed. Before the vessel sails, Margo issues the commercial invoice with HS code and the packing list, and arranges the certificate of origin from the Nashik Chamber of Commerce; the shipping line issues the bill of lading. Terms: FOB Nhava Sheva or CIF.",
  },
  // ── October 2026 release: the 12 new pages ─────────────────────────────
  // "Key facts" from each page.md in Drive › Margo 2 › 10 (final copy,
  // 29 Oct 2026), pasted as written. The pages give the heading, not a
  // question, so these render as "Key facts" and stay out of the FAQPage
  // schema (`faq: false`).
  "/industries/food-beverage-pharma": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "Food, beverage and pharma process seals are the gaskets, O-rings, valve seats and door seals on lines that are opened and cleaned often. Margo Rubber moulds and extrudes them to the equipment builder’s drawing in Vilholi, Nashik, in EPDM, silicone, NBR or FKM.",
    more: [
      "Margo Rubber’s pharma and biotech work is process equipment only: it does not make patient-contact parts. For a food or pharma line, the buyer names the product, the temperature and the cleaning cycle, and Margo picks the compound for that duty; it holds no food-contact certificate.",
      "For food and pharma lines, Margo Rubber uses EPDM (−40 to +140 °C) for hot water, steam and CIP, silicone (−60 to +200 °C) for dry oven heat, NBR for fats and oils, and FKM (−20 to +250 °C) for fats, oils and hot acid cleaners, not for steam or hot caustic.",
    ],
  },
  "/industries/ev-energy-storage-renewables": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "EV and energy-storage gaskets are the lid, door and cable-entry seals that keep water and dust out of battery packs, BESS cabinets, solar junction boxes and inverters. Margo Rubber makes them to the builder’s drawing in Vilholi, Nashik, in silicone, EPDM, neoprene (CR) or NBR.",
    more: [
      "Margo Rubber moulds one-piece gaskets up to 24 × 24 inches (about 610 × 610 mm). Larger pack and cabinet outlines are made as an extruded profile with joined corners, so a large cabinet door seal does not need one oversized mould.",
      "A gasket alone cannot make an enclosure IP67. IEC 60529 rates the tested enclosure, so the gasket, the lid stiffness, the bolt spacing and the closing force are rated together. Margo Rubber sizes the gasket section and compression from the lid drawing, and holds no UL listing.",
    ],
  },
  "/products/gaskets/flat-rubber-washers": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "A flat rubber washer is a ring of rubber sized by three numbers, inside diameter, outside diameter and thickness, plus a hardness. Margo Rubber die-cuts washers from calendered sheet, lathe-cuts them from extruded tube or compression moulds them at its plant in Vilholi, Nashik.",
    more: [
      "The medium decides a washer’s compound. EPDM suits water, steam and glycol but swells in oil, so Margo Rubber specifies NBR (−30 to +120 °C) for oil and fuel, FKM (−20 to +250 °C) for hot oil and silicone (−60 to +200 °C) for hot, dry joints.",
    ],
  },
  "/products/bellows/convoluted-bellows": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "A convoluted bellows is a moulded rubber sleeve with folds that extend and compress with a moving rod, slide or actuator, keeping dust, chips, coolant and wash water off it. Margo Rubber moulds convoluted bellows in one piece to the customer’s drawing in Vilholi, Nashik.",
    more: [
      "To quote a convoluted bellows, Margo Rubber needs the inside diameter at each end, the free and compressed length, the stroke and the convolution count, plus the medium and temperature. A worn bellows works as a sample, and more convolutions at the same pitch give more travel.",
    ],
  },
  "/products/bellows/dust-covers-boots": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "A protective boot is a moulded rubber cover that stretches over a linkage, lever, switch, rod end or connector and keeps grit, water and wash spray out of the moving joint. Margo Rubber moulds dust covers and boots in one piece to a drawing or sample in Vilholi, Nashik.",
    more: [
      "Neoprene (CR), rated −40 to +120 °C, is Margo Rubber’s usual compound for an outdoor dust boot that sees weather and light oil splash. A cracked old boot still gives the mounting sizes, so a buyer can send it with the part it fits over and Margo copies it.",
    ],
  },
  "/products/extrusion/edge-trim": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "All-rubber edge trim is an extruded rubber U-profile that pushes onto a panel edge, covers the sharp cut and seals the gap behind it, gripping with internal fins instead of a metal carrier. Margo Rubber extrudes edge trim to a profile drawing or sample in Vilholi, Nashik.",
    more: [
      "All-rubber edge trim suits a known panel thickness and a part fitted once; trim with a metal carrier grips harder over a wider thickness range. Margo Rubber extrudes edge trim in EPDM (−40 to +140 °C) for sun, rain and ozone, in cut lengths or coils.",
    ],
  },
  "/products/gaskets/sanitary-tri-clamp-gaskets": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "A sanitary tri-clamp gasket is the moulded rubber ring that seats between two ferrules on hygienic process pipework and reseals each time the line is opened for cleaning. Margo Rubber moulds tri-clamp gaskets to DIN 32676, ISO 2852 or ASME BPE ferrule sizes in Vilholi, Nashik.",
    more: [
      "Tri-clamp sizes do not all match across DIN 32676, ISO 2852 and ASME BPE, so a gasket made for one can sit proud or short in another. The drawing should name the standard the ferrules were made to. Margo Rubber moulds them in EPDM to +140 °C or silicone to +200 °C.",
    ],
  },
  "/products/gaskets/ev-battery-pack-gaskets": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "An EV battery-pack gasket is the lid or housing seal that keeps water, dust and wash spray out of a traction-battery pack, charger or BESS cabinet joint. Margo Rubber moulds battery-pack gaskets endless up to 24 × 24 inches (about 610 × 610 mm) in Vilholi, Nashik.",
    more: [
      "No gasket alone makes a battery pack IP67, because IEC 60529 rates the tested enclosure, including lid stiffness, bolt spacing and closing force. Margo Rubber sizes the gasket section from the lid drawing, in silicone (−60 to +200 °C) with low compression set, or EPDM to +140 °C.",
    ],
  },
  "/products/anti-vibration-mounts/exhaust-hangers-isolators": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "An exhaust hanger is a rubber isolator that carries the exhaust system from the vehicle body and stops engine vibration reaching the cabin. Margo Rubber moulds exhaust hangers in heat-resistant EPDM, plain or bonded to a metal insert, to the hanger-rod positions on the drawing, in Vilholi, Nashik.",
    more: [
      "Exhaust hangers usually tear at the pin hole because heat hardened the rubber or the system was too heavy for a plain hanger. Margo Rubber moves hot positions from EPDM (to +140 °C) to AEM (to +160 °C), and adds a bonded insert where the system is heavy.",
    ],
  },
  "/products/gaskets/rocker-cover-sump-gaskets": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "Rocker-cover and sump gaskets are press-in-place or flat moulded rubber seals between an engine cover and its housing that hold back hot oil and blow-by. Margo Rubber moulds rocker-cover, sump and intake-manifold gaskets in AEM, FKM or silicone (VMQ) to the cover drawing in Vilholi, Nashik.",
    more: [
      "Margo Rubber specifies AEM for rocker covers and sumps to +160 °C continuous, silicone (VMQ) to +200 °C and FKM to +250 °C. Exhaust-manifold gaskets are multi-layer steel (MLS), not rubber, so Margo does not make them.",
    ],
  },
  "/products/rubber-mats": {
    row: 0,
    q: "Key facts",
    faq: false,
    a: "Margo Rubber moulds 11 types of rubber mat in solid rubber at its plant in Vilholi, Nashik: car floor and boot mats, mud flaps, anti-fatigue, IS 15652 electrical insulating, ribbed, checker, coin, diamond-pattern, anti-vibration and drainage mats. None has a PVC, TPE or foam layer.",
    more: [
      "Margo Rubber makes electrical insulating mats to IS 15652, which, as amended in Amendment No. 2, sets three classes: Class A for use up to 3.3 kV at 2.0 mm thick, Class B to 11 kV at 2.5 mm and Class C to 33 kV at 3.0 mm.",
      "What lands on a rubber mat decides its compound. Margo Rubber specifies natural rubber or SBR for dry floors and vehicles, EPDM (−40 to +140 °C) for sun and wash-down water, and NBR (−30 to +120 °C) where oil, fuel or coolant reaches the mat.",
    ],
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
