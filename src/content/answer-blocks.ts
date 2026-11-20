/**
 * ANSWER BLOCKS (D6 / T13) — one question and its answer near the top of
 * each page, written so an answer engine can lift it whole: the question as
 * an H2, a 40–60-word answer that leads with a number.
 *
 * Text from 3rd Shade's AEO sheet (15 Oct 2026, "Answer-block rewrites"),
 * reordered on 5 Nov 2026 so each answer opens with its figure (audit of
 * 2 Nov 2026, fix 3). Every figure is one already published on the site. Do
 * not add "95 countries", "200+ SKUs", IATF dates or any minimum other than
 * 10,000.
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
    a: "Margo Rubber Products, in Nashik since 2005, moulds and extrudes rubber parts to customer drawing. The range covers O-rings, oil seals, rubber bushes, grommets, gaskets and diaphragms in eight compounds. Its moulded-component line is certified to ISO 9001:2015 (certificate 09111526A, Integral Certification Ltd, valid to 21 February 2027). Quotation in 48 hours; production in three to four weeks.",
  },
  "/products/o-rings": {
    row: 2,
    q: "Which O-ring standards and compounds does Margo mould?",
    a: "30 to 90 Shore A, depending on the compound, in AEM, EPDM, FKM, NBR and silicone. Margo moulds O-rings to AS568, ISO 3601, JIS B2401 and DIN 3771, and tolerance follows the standard and the cross-section. Sizes outside the catalogue are cut to your drawing. The minimum run is 10,000 pieces per part number, per compound.",
  },
  "/products/oil-seals": {
    row: 3,
    q: "Which oil seal material should I specify?",
    a: "−30 to +120 °C in NBR for mineral oil, fuel and hydraulic fluid, and up to +250 °C in FKM for fuels and aggressive chemistry. Pick by the medium, then the temperature, in a DIN 3760 or ISO 6194 size. EPDM is for water, steam and brake fluid, never petroleum oil. Margo moulds seals in AEM, EPDM, FKM, NBR and silicone.",
  },
  "/products/gaskets": {
    row: 4,
    q: "What is the best rubber for a gasket?",
    a: "+140 °C in EPDM for water, steam and weather, +120 °C in NBR for oil and fuel, +250 °C in FKM for chemicals and fuel: the medium decides, not a single best rubber. Margo moulds and die-cuts gaskets in eight compounds to ASME B16.21, EN 1514-1 and JIS B2404, with tolerance to ISO 3302-1.",
  },
  "/products/bushes": {
    row: 6,
    q: "What sizes and hardness do Margo's rubber bushes come in?",
    a: "8–20 mm bore by 20–40 mm outside diameter for silent-block bushes, 10–30 by 25–60 mm for insulation bushes, and 12–40 by 30–80 mm for linkage bushes. Durometer runs 45 to 75 Shore A and is set on your drawing, because hardness sets the rate. Dimensions are held to ISO 3302-1, class M1 to M4.",
  },
  "/products/bonded-components": {
    row: 7,
    q: "How is rubber bonded to metal?",
    a: "4 preparation steps come first: the insert is degreased, grit-blasted, chemically treated and primed. The rubber then cures onto it in the mould, so the bond is made during vulcanisation and tested to ASTM D429. There is no glued joint to fail. Margo bonds to steel, stainless steel, aluminium and brass. A sound bond fails in the rubber, recorded as 100% R.",
  },
  "/products/extrusion": {
    row: 8,
    q: "What tolerance can a rubber extrusion hold?",
    a: "±0.2 mm on the critical dimensions of an extruded profile, with each tolerance set by the section and recorded to ISO 3302-1, class E1 to E3. Profiles are extruded in EPDM, FKM, NBR, neoprene and silicone, at 40–85 Shore A, across −60 to +250 °C. Pricing is per metre, quoted against your total run length.",
  },
  "/products/rubber-lining": {
    row: 9,
    q: "How thick and how hard should a rubber lining be?",
    a: "6–25 mm thick at 35–65 Shore A, set by the duty. Light sliding abrasion takes 6–8 mm at 55–65 Shore A; general abrasion 10–12 mm at 45–60 Shore A; impact zones such as crusher discharge 15–25 mm at 35–45 Shore A. Natural rubber has the best abrasion resistance of Margo's eight compounds, measured as volume loss to ISO 4649.",
  },
  "/products/seals": {
    row: 10,
    q: "Why does a reciprocating seal leak after a few weeks?",
    a: "0.1–0.4 µm Ra is the usual finish window for a hard chrome-plated rod, and surface finish is the biggest single cause of early failure on a rod or piston seal in an ISO 5597 housing. Pressure and clearance gap come next and decide whether a back-up ring is needed. Send the Ra, plating, clearance, and continuous and peak pressure.",
  },
  "/products/diaphragms": {
    row: 11,
    q: "When does a rubber diaphragm need fabric reinforcement?",
    a: "3 bar, roughly, is the limit: above it, or wherever a stretching diaphragm would change the dose, the rubber alone cannot carry the pressure and fabric reinforcement takes over. Margo moulds flat, rolling and convoluted diaphragms from Ø20 to Ø400 mm effective diameter, at 40–80 Shore A, and picks the compound from the medium you pump, not from a default.",
  },
  "/products/bellows": {
    row: 12,
    q: "Which rubber should a bellows or boot be made from?",
    a: "−20 to +90 °C in natural rubber for flex-fatigue life with no oil, to +120 °C in NBR for petroleum oil and hydraulic fluid, to +140 °C in EPDM for water, steam and weather, and to +250 °C in FKM for fuel at sustained high temperature. Pick by what the bellows touches. Margo moulds convoluted bellows and boots from Ø10 to Ø150 mm.",
  },
  "/products/grommets": {
    row: 13,
    q: "What size rubber grommet do I need?",
    a: "6–12 mm holes take a 1.0–1.6 mm panel, 12–25 mm holes take 1.2–2.0 mm, and 25–50 mm holes take 1.6–3.0 mm: size it from the panel hole and the panel thickness. Margo moulds open, blind, multi-hole and oval grommets in that range. Holes above 50 mm and bulkhead grommets are cut to print, in any of eight compounds.",
  },
  "/products/sponge-foam-rubber": {
    row: 14,
    q: "What is sponge rubber used for?",
    a: "12–200 kg/m³ sponge rubber seals, insulates and damps: closed-cell grades keep out water, air and dust, and open-cell foam absorbs sound and lets air through. Margo moulds, extrudes and die-cuts both in EPDM, natural rubber, NBR, neoprene and silicone, for HVAC gaskets, weatherseals and acoustic panels. Sponge grades are rated cooler than the same compound in solid form.",
  },
  "/products/leak-test-rubber": {
    row: 16,
    q: "What rubber is used on an alloy wheel leak-test rig?",
    a: "12″ to 24″ rims at 2 to 6 bar test pressure take NBR or EPDM, profiled to the rim and bead seat. EPDM is the default compound. Compression set decides how long the seal keeps sealing, so Margo measures it in-house to ASTM D395 and ISO 815-1. Commercial-vehicle rims and non-standard geometry are cut to print.",
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
  // 29 Oct 2026). The two entries still headed "Key facts" stay out of the
  // FAQPage schema (`faq: false`). The 8 part pages were given a real question
  // and a figure-first answer on 5 Nov 2026 (audit fixes 3 and 12), drawn from
  // each page's own compound table.
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
    q: "What hardness and compound should a flat rubber washer be?",
    a: "40–90 Shore A, to your drawing, in the compound the medium decides: EPDM (−40 to +140 °C) for water, steam and glycol, NBR (−30 to +120 °C) for oil and fuel, FKM (−20 to +250 °C) for hot oil, and silicone (−60 to +200 °C) for hot, dry joints. EPDM swells in oil.",
    more: [
      "A flat rubber washer is a ring of rubber sized by three numbers, inside diameter, outside diameter and thickness, plus a hardness. Margo Rubber die-cuts washers from calendered sheet, lathe-cuts them from extruded tube or compression moulds them at its plant in Vilholi, Nashik.",
    ],
  },
  "/products/bellows/convoluted-bellows": {
    row: 0,
    q: "What temperature can a convoluted bellows take?",
    a: "−40 to +120 °C in neoprene (CR), the usual pick for a machine bellows. Margo Rubber moves to NBR (−30 to +120 °C) where it sits in oil or coolant, EPDM (−40 to +140 °C) outdoors or in hot water, and silicone (−60 to +200 °C) near an oven or hot platen.",
    more: [
      "A convoluted bellows is a moulded rubber sleeve with folds that extend and compress with a moving rod, slide or actuator, keeping dust, chips, coolant and wash water off it. Margo Rubber moulds convoluted bellows in one piece to the customer’s drawing in Vilholi, Nashik.",
      "To quote a convoluted bellows, Margo Rubber needs the inside diameter at each end, the free and compressed length, the stroke and the convolution count, plus the medium and temperature. A worn bellows works as a sample, and more convolutions at the same pitch give more travel.",
    ],
  },
  "/products/bellows/dust-covers-boots": {
    row: 0,
    q: "Which compound suits a rubber dust boot?",
    a: "−40 to +120 °C in neoprene (CR), Margo Rubber’s usual compound for an outdoor dust boot that sees weather and light oil splash. Grease or hydraulic oil calls for NBR (−30 to +120 °C), years of sun and rain for EPDM (−40 to +140 °C), and a hot part for AEM (−40 to +160 °C) or silicone (−60 to +200 °C).",
    more: [
      "A protective boot is a moulded rubber cover that stretches over a linkage, lever, switch, rod end or connector and keeps grit, water and wash spray out of the moving joint. Margo Rubber moulds dust covers and boots in one piece to a drawing or sample in Vilholi, Nashik.",
      "A cracked old boot still gives the mounting sizes, so a buyer can send it with the part it fits over and Margo copies it.",
    ],
  },
  "/products/extrusion/edge-trim": {
    row: 0,
    q: "What temperature can rubber edge trim take?",
    a: "−40 to +140 °C in EPDM, the default for sun, rain and ozone on a door, hatch or cabinet edge. Margo Rubber moves to NBR (−30 to +120 °C) where the edge sees oil or fuel, neoprene (−40 to +120 °C) for weather with oil splash, and silicone (−60 to +200 °C) on a hot panel.",
    more: [
      "All-rubber edge trim is an extruded rubber U-profile that pushes onto a panel edge, covers the sharp cut and seals the gap behind it, gripping with internal fins instead of a metal carrier. Margo Rubber extrudes edge trim to a profile drawing or sample in Vilholi, Nashik.",
      "All-rubber edge trim suits a known panel thickness and a part fitted once; trim with a metal carrier grips harder over a wider thickness range. Margo Rubber supplies it in cut lengths or coils.",
    ],
  },
  "/products/gaskets/sanitary-tri-clamp-gaskets": {
    row: 0,
    q: "What temperature can a tri-clamp gasket take?",
    a: "−40 to +140 °C in EPDM, the usual pick for hot water, steam and CIP on dairy and beverage lines, or −60 to +200 °C in silicone where the line runs dry heat. Fatty or oily product calls for NBR (−30 to +120 °C), and hot acid cleaners for FKM (−20 to +250 °C), which is not for steam or hot caustic.",
    more: [
      "A sanitary tri-clamp gasket is the moulded rubber ring that seats between two ferrules on hygienic process pipework and reseals each time the line is opened for cleaning. Margo Rubber moulds tri-clamp gaskets to DIN 32676, ISO 2852 or ASME BPE ferrule sizes in Vilholi, Nashik.",
      "Tri-clamp sizes do not all match across DIN 32676, ISO 2852 and ASME BPE, so a gasket made for one can sit proud or short in another. The drawing should name the standard the ferrules were made to.",
    ],
  },
  "/products/gaskets/ev-battery-pack-gaskets": {
    row: 0,
    q: "What size and temperature can a battery-pack gasket handle?",
    a: "24 × 24 inches (about 610 × 610 mm) moulded endless, and −60 to +200 °C in silicone with low compression set, the default near heat. A cabinet that lives outdoors takes EPDM (−40 to +140 °C), and larger outlines are made as an extruded profile with joined corners.",
    more: [
      "An EV battery-pack gasket is the lid or housing seal that keeps water, dust and wash spray out of a traction-battery pack, charger or BESS cabinet joint. Margo Rubber moulds battery-pack gaskets endless up to 24 × 24 inches (about 610 × 610 mm) in Vilholi, Nashik.",
      "No gasket alone makes a battery pack IP67, because IEC 60529 rates the tested enclosure, including lid stiffness, bolt spacing and closing force. Margo Rubber sizes the gasket section from the lid drawing.",
    ],
  },
  "/products/anti-vibration-mounts/exhaust-hangers-isolators": {
    row: 0,
    q: "What temperature can a rubber exhaust hanger take?",
    a: "−40 to +140 °C in heat-resistant EPDM, the default for a hanger that sees exhaust heat, road water and salt. Margo Rubber moves to AEM (−40 to +160 °C) where the hanger sits close to the manifold or catalyst, or where oil drips onto it.",
    more: [
      "An exhaust hanger is a rubber isolator that carries the exhaust system from the vehicle body and stops engine vibration reaching the cabin. Margo Rubber moulds exhaust hangers in heat-resistant EPDM, plain or bonded to a metal insert, to the hanger-rod positions on the drawing, in Vilholi, Nashik.",
      "Exhaust hangers usually tear at the pin hole because heat hardened the rubber or the system was too heavy for a plain hanger, so Margo Rubber adds a bonded insert where the system is heavy.",
    ],
  },
  "/products/gaskets/rocker-cover-sump-gaskets": {
    row: 0,
    q: "What temperature can a rocker-cover or sump gasket take?",
    a: "+160 °C continuous in AEM, the default for hot engine oil and blow-by on rocker covers and sumps. Margo Rubber moves to FKM (to +250 °C) where the joint sees fuel or runs hotter, EPDM (to +140 °C) on the coolant side, and silicone (to +200 °C) for dry heat.",
    more: [
      "Rocker-cover and sump gaskets are press-in-place or flat moulded rubber seals between an engine cover and its housing that hold back hot oil and blow-by. Margo Rubber moulds rocker-cover, sump and intake-manifold gaskets in AEM, FKM or silicone (VMQ) to the cover drawing in Vilholi, Nashik.",
      "Exhaust-manifold gaskets are multi-layer steel (MLS), not rubber, so Margo does not make them.",
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
