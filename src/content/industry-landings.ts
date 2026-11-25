/**
 * INDUSTRY LANDING PAGES — /industries/<industry>/<topic>
 *
 * Set by Ayyaz, 20 Nov 2026: SEO aimed at Tier 1 and Tier 2 automotive
 * suppliers for high-volume work. One page per focus part line (bushes, oil
 * seals, O-rings, grommets, pads, profiles), one for Tier 2 buyers, and one
 * per automotive cluster within road reach of the plant (Pune, Aurangabad,
 * Nashik). Each answers a different search; none is the parent page with
 * the nouns swapped.
 *
 * Every figure here is already on the site or in the claim rules
 * (src/content/site.ts): compounds and ranges from the product answer
 * blocks, 5 million parts a month installed against about 1.5 million in
 * production, a minimum run of 10,000 pieces per part number per compound,
 * quotation in 48 hours, production in three to four weeks, rejection
 * target under 1%, on-time over 99%. Customers named are the site-settings
 * accounts only. No other company is named: a named OEM or Tier 1 on a page
 * reads as a customer claim. `npm run check:claims` scans this file.
 */

export type LandingPart = {
  key: string;
  name: string;
  body: string;
  /** Image slot key (src/content/images.ts). */
  image: string;
  href: string;
};

export type Landing = {
  slug: string;
  kind: "part" | "buyer" | "city";
  /** Breadcrumb and link-list label. */
  navLabel: string;
  status: "published" | "draft";
  seo: { title: string; description: string };
  badge: string;
  h1Lines: string[];
  intro: string;
  /** The answer paragraph under the hero buttons: figure first, quotable. */
  answer: string;
  chips: string[];
  /** Value for the contact form's part pre-fill. */
  enquiryPart: string;
  /**
   * Part pages only: the product category this page is the industry version
   * of. That category page links here, and the two split the keywords: the
   * category owns the generic term ("rubber bush manufacturer india"), this
   * page owns the industry one ("automotive rubber bushes manufacturer india").
   */
  productCategory?: string;
  parts: { eyebrow: string; heading: string; body: string; items: LandingPart[] };
  specs: {
    eyebrow: string;
    heading: string;
    body: string;
    items: { icon: "shield" | "wave" | "thermo" | "dust"; name: string; body: string }[];
    table?: { caption: string; columns: string[]; rows: { cells: string[] }[] };
  };
  uses: { eyebrow: string; heading: string; items: { name: string; body: string }[] };
  faqs: { q: string; a: string }[];
  closing: { lines: string[]; body: string };
};

/* ── Shared part cards ─────────────────────────────────────────────── */
const P = {
  aemBush: { key: "aem-insulation-bush", name: "AEM insulation bush", body: "Engine and transmission insulation bush in AEM, for heat and oil under the bonnet.", image: "sku.bushes--aem-insulation-bush.photo", href: "/products/bushes/aem-insulation-bush" },
  bushes: { key: "bushes", name: "Rubber bushes & silent blocks", body: "Silent-block, insulation, linkage and cushion bushes, bore and OD to drawing.", image: "products.bushes.hero", href: "/products/bushes" },
  bumpStop: { key: "cv-suspension-bump-stop", name: "Suspension bump stop", body: "Commercial-vehicle suspension bump stop, moulded to the OEM sample.", image: "sku.anti-vibration-mounts--cv-suspension-bump-stop.photo", href: "/products/anti-vibration-mounts/cv-suspension-bump-stop" },
  bumperStopper: { key: "bumper-stopper", name: "Bumper stopper", body: "Bumper and tailgate stoppers that take the closing load without marking paint.", image: "sku.anti-vibration-mounts--bumper-stopper.photo", href: "/products/anti-vibration-mounts/bumper-stopper" },
  oilSeals: { key: "oil-seals", name: "Rubber oil seals", body: "Shaft seals in DIN 3760 and ISO 6194 sizes, single and double lip.", image: "products.oil-seals.hero", href: "/products/oil-seals" },
  fkmSeal: { key: "fkm-oil-seal", name: "FKM oil seals", body: "For fuel, hot oil and aggressive chemistry, rated to +250 °C.", image: "sku.oil-seals--fkm.photo", href: "/products/oil-seals/fkm" },
  nbrSeal: { key: "nbr-oil-seal", name: "NBR oil seals", body: "The default for mineral oil, fuel and hydraulic fluid, −30 to +120 °C.", image: "products.oil-seals.material.nbr", href: "/products/oil-seals/nbr" },
  oRings: { key: "o-rings", name: "O-rings", body: "AS568, ISO 3601, JIS B2401 and DIN 3771 sizes, or cut to your drawing.", image: "products.o-rings.hero", href: "/products/o-rings" },
  fillerCapORing: { key: "seal-filler-cap-o-rings", name: "Filler cap O-rings", body: "Oil and coolant filler cap seals that re-seat on every opening.", image: "sku.o-rings--seal-filler-cap-o-rings.photo", href: "/products/o-rings/seal-filler-cap-o-rings" },
  grommets: { key: "grommets", name: "Wiring harness grommets", body: "Open, blind, multi-hole and oval grommets for harness and firewall pass-throughs.", image: "products.grommets.hero", href: "/products/grommets" },
  threePin: { key: "3-pin-hole-pad", name: "3-pin hole pad", body: "Multi-hole grommet pad that seals three wires through one panel opening.", image: "sku.grommets--3-pin-hole-pad.photo", href: "/products/grommets/3-pin-hole-pad" },
  internalFit: { key: "internal-fit", name: "Internal-fit grommet", body: "Push-in grommet that grips a panel hole from inside.", image: "sku.grommets--internal-fit.photo", href: "/products/grommets/internal-fit" },
  pads: { key: "pads-stoppers-caps", name: "Pads, stoppers & caps", body: "Support pads, glove-box stoppers, filler caps and shroud flaps to drawing.", image: "products.pads-stoppers-caps.hero", href: "/products/pads-stoppers-caps" },
  boleroPad: { key: "bolero-support-pad", name: "Bolero support pad", body: "Support pad made against a controlled drawing for a utility-vehicle line.", image: "products.pads-stoppers-caps.hero", href: "/products/pads-stoppers-caps/bolero-support-pad" },
  bigPad: { key: "big-support-pad", name: "Rubber support pad", body: "Load-bearing support pad that isolates a panel or bracket from vibration.", image: "products.pads-stoppers-caps.hero", href: "/products/pads-stoppers-caps/big-support-pad" },
  sideStep: { key: "side-step-pad", name: "Side step pad", body: "Anti-slip step pad for utility and commercial vehicles.", image: "sku.pads-stoppers-caps--side-step-pad.photo", href: "/products/pads-stoppers-caps/side-step-pad" },
  gloveBox: { key: "glove-box-stopper", name: "Glove-box stopper", body: "Small interior stopper that stops rattle on a closing lid.", image: "products.pads-stoppers-caps.hero", href: "/products/pads-stoppers-caps/glove-box-stopper" },
  shroudFlaps: { key: "radiator-shroud-flaps", name: "Radiator shroud flaps", body: "EPDM flaps that direct air through the radiator and A/C condenser.", image: "products.pads-stoppers-caps.hero", href: "/products/pads-stoppers-caps/radiator-shroud-flaps" },
  edgeTrim: { key: "edge-trim", name: "Rubber edge trim", body: "All-rubber U-profile that covers a panel edge and seals behind it.", image: "products.extrusion.hero", href: "/products/extrusion/edge-trim" },
  glazing: { key: "rear-windscreen-glazing-rubber", name: "Windscreen glazing rubber", body: "Extruded glazing profile that holds and seals a fixed rear windscreen.", image: "sku.extrusion--rear-windscreen-glazing-rubber.photo", href: "/products/extrusion/rear-windscreen-glazing-rubber" },
  profiles: { key: "extrusion", name: "Rubber profiles & cords", body: "Door, hatch and channel seals and solid cords extruded to a profile drawing.", image: "products.extrusion.hero", href: "/products/extrusion" },
  boots: { key: "dust-covers-boots", name: "Dust boots & gaiters", body: "Boots for linkages, steering and driveshafts, Ø10 to Ø150 mm.", image: "products.bellows.hero", href: "/products/bellows/dust-covers-boots" },
} satisfies Record<string, LandingPart>;

/* ── Shared specification cards ────────────────────────────────────── */
const VOLUME = {
  icon: "dust" as const,
  name: "Volume and spare capacity",
  body: "Installed capacity is 5 million parts a month against about 1.5 million in current production. The minimum run is 10,000 pieces per part number, per compound.",
};
const CONTROL = {
  icon: "shield" as const,
  name: "Checked through the run",
  body: "Every mixed batch is checked, every run at set-up and every half hour, and every despatch lot for dimensions and hardness. Target rejection is under 1%; on-time delivery is over 99%.",
};

const AUTO_CUSTOMERS = "Automotive customers include Mahindra & Mahindra, Tata and Hyundai, alongside component suppliers such as Satish Injecto-Plast, Abhijeet Plastics (India) and Ukay Metal Industries.";

/* ── Automotive ────────────────────────────────────────────────────── */
const AUTOMOTIVE: Landing[] = [
  {
    slug: "rubber-bushes",
    kind: "part",
    productCategory: "bushes",
    navLabel: "Automotive rubber bushes",
    status: "published",
    seo: {
      title: "Automotive Rubber Bushes Manufacturer India | Margo",
      description: "Suspension, engine mounting, silent-block and cushion rubber bushes for automotive OEMs, Tier 1 and Tier 2 suppliers. Moulded to drawing in Nashik.",
    },
    badge: "AUTOMOTIVE · RUBBER BUSHES · HIGH-VOLUME",
    h1Lines: ["Automotive Rubber Bushes", "for OEMs, Tier 1 & Tier 2"],
    intro: "Suspension, engine mounting, silent-block, torque rod and cushion bushes, moulded to your drawing in Nashik for vehicle makers and the Tier 1 and Tier 2 suppliers who build their assemblies.",
    answer: "Margo Rubber Products moulds automotive rubber bushes in 8–20 mm bore by 20–40 mm OD for silent blocks, 10–30 by 25–60 mm for insulation bushes and 12–40 by 30–80 mm for linkage bushes, at 45 to 75 Shore A, with dimensions held to ISO 3302-1 class M1 to M4. AEM covers −40 to +175 °C under the bonnet. Minimum run 10,000 pieces per part number; installed capacity 5 million parts a month.",
    chips: ["Bonded and unbonded", "45–75 Shore A", "AEM · NBR · NR · EPDM"],
    enquiryPart: "Rubber Bushes",
    parts: {
      eyebrow: "AUTOMOTIVE BUSHES WE MOULD",
      heading: "Bushes for suspension, engine and body mounting.",
      body: "Every bush is made to your drawing or an OEM sample. Hardness is set on the drawing, because hardness sets the rate.",
      items: [P.bushes, P.aemBush, P.bumpStop, P.bumperStopper],
    },
    specs: {
      eyebrow: "SIZES, HARDNESS AND COMPOUNDS",
      heading: "What goes on the drawing.",
      body: "Bore, outside diameter, length, hardness and compound decide how a bush behaves in the vehicle. Send them, or send the part, and we confirm each before tooling.",
      items: [
        { icon: "thermo", name: "AEM for heat and oil", body: "AEM holds −40 to +175 °C, continuous to about +160 °C, where engine oil, heat and ozone act together. Natural rubber suits a cool suspension position; NBR suits oil splash." },
        { icon: "wave", name: "Rate set by hardness", body: "Durometer runs 45 to 75 Shore A. Isolation only begins above about 1.4 times the system natural frequency, so the rate is matched to the mounting, not to a catalogue softness." },
        VOLUME,
        CONTROL,
      ],
      table: {
        caption: "Automotive rubber bush size ranges",
        columns: ["Bush type", "Bore (mm)", "Outside diameter (mm)", "Typical position"],
        rows: [
          { cells: ["Silent block", "8–20", "20–40", "Suspension arm, link"] },
          { cells: ["Insulation bush", "10–30", "25–60", "Engine, transmission, cab"] },
          { cells: ["Linkage bush", "12–40", "30–80", "Torque rod, shackle, spring eye"] },
        ],
      },
    },
    uses: {
      eyebrow: "WHERE OUR BUSHES ARE FITTED",
      heading: "From the suspension arm to the cab mount.",
      items: [
        { name: "Suspension and chassis", body: "Silent-block, shackle and spring eye bushes for control arms, leaf springs and stabiliser links." },
        { name: "Engine and transmission", body: "AEM insulation bushes and torque rod bushes where heat and oil end a natural rubber part." },
        { name: "Cab and body", body: "Cushion bushes and [support pads](/products/pads-stoppers-caps/big-support-pad) that isolate a cab, bracket or panel from road vibration." },
        { name: "Two-wheeler and commercial vehicle", body: "Swing-arm, handlebar and cab-mount bushes in volumes from 10,000 pieces per part number." },
      ],
    },
    faqs: [
      { q: "Do you make bonded and unbonded automotive bushes?", a: "Yes. Unbonded bushes are moulded rubber alone. Bonded bushes are cured onto a steel, stainless, aluminium or brass sleeve that is degreased, grit-blasted, treated and primed first, and the bond is tested to ASTM D429. Both are made to your drawing at our Nashik plant." },
      { q: "What volumes can you supply for a Tier 2 bush programme?", a: "The minimum run is 10,000 pieces per part number, per compound. Installed capacity is 5 million parts a month against about 1.5 million in current production, so a new bush programme has room. Send the drawing and annual volume and we quote within 48 hours." },
      { q: "Which compound should an engine mounting bush use?", a: "AEM where the bush sits near the engine: it holds −40 to +175 °C and resists engine oil and heat ageing. Natural rubber gives the best fatigue behaviour in a cool, dry suspension position. NBR suits oil splash below +120 °C. We propose the compound against the mounting position on your drawing." },
    ],
    closing: { lines: ["Send the bush drawing", "and your annual volume."], body: "Bore, OD, length, hardness and position, or the existing part. We reply within 48 hours with a compound recommendation, tooling plan and quotation." },
  },
  {
    slug: "oil-seals",
    kind: "part",
    productCategory: "oil-seals",
    navLabel: "Automotive oil seals",
    status: "published",
    seo: {
      title: "Automotive Oil Seal Manufacturer India | Margo",
      description: "NBR and FKM oil seals for gearbox, crankshaft, wheel hub and pump shafts, in DIN 3760 and ISO 6194 sizes, for automotive Tier 1 and Tier 2 suppliers.",
    },
    badge: "AUTOMOTIVE · OIL SEALS · HIGH-VOLUME",
    h1Lines: ["Automotive Oil Seals", "for Tier 1 & Tier 2 Suppliers"],
    intro: "Rotary shaft seals for gearboxes, crankshafts, wheel hubs, steering and pumps, moulded in NBR, FKM, AEM, EPDM and silicone at our plant in Nashik, in DIN 3760 and ISO 6194 sizes or to your drawing.",
    answer: "Margo Rubber Products moulds automotive oil seals in NBR for mineral oil, fuel and hydraulic fluid from −30 to +120 °C, and in FKM up to +250 °C for fuel and aggressive chemistry, in DIN 3760 or ISO 6194 sizes. EPDM is used for water, steam and brake fluid, never petroleum oil. Minimum run 10,000 pieces per part number, per compound; quotation in 48 hours.",
    chips: ["DIN 3760 · ISO 6194", "NBR · FKM · AEM", "Metal-cased and rubber-covered"],
    enquiryPart: "Oil Seals",
    parts: {
      eyebrow: "AUTOMOTIVE OIL SEALS WE MOULD",
      heading: "Pick by the medium, then the temperature.",
      body: "A shaft seal fails on the wrong compound before it fails on anything else. Tell us what the lip touches and how hot it runs.",
      items: [P.oilSeals, P.nbrSeal, P.fkmSeal, P.fillerCapORing],
    },
    specs: {
      eyebrow: "COMPOUNDS AND STANDARDS",
      heading: "The compound follows the fluid.",
      body: "Seals are moulded in five compounds. The table is where each one belongs in a vehicle.",
      items: [
        { icon: "thermo", name: "Heat", body: "NBR to +120 °C, AEM to about +160 °C continuous, FKM to +250 °C. A seal run above its compound's range hardens and leaks." },
        { icon: "shield", name: "Fluid", body: "NBR for mineral oil and fuel, FKM for fuel blends and hot synthetic oil, EPDM for coolant and brake fluid only." },
        VOLUME,
        CONTROL,
      ],
      table: {
        caption: "Oil seal compound by automotive position",
        columns: ["Compound", "Range", "Typical position"],
        rows: [
          { cells: ["NBR", "−30 to +120 °C", "Gearbox, axle, wheel hub, steering"] },
          { cells: ["AEM", "−40 to about +160 °C continuous", "Crankshaft and engine-side seals"] },
          { cells: ["FKM", "up to +250 °C", "Fuel system, hot synthetic oil"] },
          { cells: ["EPDM", "water, steam, brake fluid", "Coolant pump, brake system"] },
        ],
      },
    },
    uses: {
      eyebrow: "WHERE OUR SEALS ARE FITTED",
      heading: "Every shaft that leaves a housing.",
      items: [
        { name: "Engine", body: "Crankshaft front and rear seals, camshaft and valve stem seals." },
        { name: "Transmission and axle", body: "Gearbox input and output seals, differential and wheel hub seals." },
        { name: "Pumps and steering", body: "Water pump, oil pump and power-steering shaft seals." },
        { name: "Two-wheeler", body: "Fork, crankcase and gear-shift seals in high-volume runs." },
      ],
    },
    faqs: [
      { q: "Do you make metal-cased oil seals for automotive use?", a: "Yes. We mould rubber onto a prepared metal case, the skeleton or metal-bonded oil seal, and also make rubber-covered seals where the housing bore needs a rubber OD. Sizes follow DIN 3760 or ISO 6194, or your drawing for a non-standard shaft." },
      { q: "NBR or FKM for a gearbox oil seal?", a: "NBR for a gearbox on mineral oil running below +120 °C, which covers most manual and commercial-vehicle gearboxes. FKM where the oil is synthetic and runs hot, or where the seal sees fuel. FKM costs more, so we specify it only where the temperature or fluid calls for it." },
      { q: "Can you supply oil seals in volume to a Tier 2 assembler?", a: "Yes. The minimum run is 10,000 pieces per part number, per compound, and installed capacity is 5 million parts a month. Every despatch lot is checked for dimensions and hardness. Send the shaft size, housing bore, fluid and temperature and we quote within 48 hours." },
    ],
    closing: { lines: ["Send the shaft, bore", "and the fluid."], body: "Shaft diameter, housing bore, width, fluid, temperature and annual volume, or the existing seal. We reply within 48 hours with a compound and a quotation." },
  },
  {
    slug: "o-rings",
    kind: "part",
    productCategory: "o-rings",
    navLabel: "Automotive O-rings",
    status: "published",
    seo: {
      title: "Automotive O-Ring Manufacturer India | Margo Rubber",
      description: "NBR, FKM, AEM, EPDM and silicone O-rings for fuel, transmission, cooling and A/C systems. AS568 and ISO 3601 sizes for automotive suppliers in India.",
    },
    badge: "AUTOMOTIVE · O-RINGS · HIGH-VOLUME",
    h1Lines: ["Automotive O-Rings", "Moulded in Volume in India"],
    intro: "O-rings for fuel, transmission, cooling, A/C and filler-cap seals, moulded in Nashik to AS568, ISO 3601, JIS B2401 and DIN 3771, or cut to your drawing, for vehicle makers and their Tier 1 and Tier 2 suppliers.",
    answer: "Margo Rubber Products moulds automotive O-rings at 30 to 90 Shore A, depending on the compound, in AEM, EPDM, FKM, NBR and silicone, to AS568, ISO 3601, JIS B2401 and DIN 3771. Tolerance follows the standard and the cross-section. Sizes outside the catalogue are cut to your drawing. Minimum run 10,000 pieces per part number, per compound; installed capacity 5 million parts a month.",
    chips: ["AS568 · ISO 3601 · DIN 3771", "30–90 Shore A", "5 compounds"],
    enquiryPart: "O-Rings",
    parts: {
      eyebrow: "AUTOMOTIVE O-RINGS WE MOULD",
      heading: "Standard sizes and drawing sizes.",
      body: "Catalogue sizes run on existing tools; anything else is cut to print in our own tool room.",
      items: [P.oRings, P.fillerCapORing, P.oilSeals, P.grommets],
    },
    specs: {
      eyebrow: "COMPOUND BY SYSTEM",
      heading: "One ring, five possible compounds.",
      body: "The same cross-section fails in weeks or lasts the vehicle's life depending on the compound. We choose it from the medium and temperature.",
      items: [
        { icon: "shield", name: "Fuel and oil", body: "NBR for mineral oil and fuel to +120 °C; FKM for fuel blends and hot oil to +250 °C." },
        { icon: "thermo", name: "Coolant and A/C", body: "EPDM for coolant, water and brake fluid; silicone for dry heat and wide-range static seals." },
        VOLUME,
        CONTROL,
      ],
    },
    uses: {
      eyebrow: "WHERE OUR O-RINGS ARE FITTED",
      heading: "Static and slow-moving seals across the vehicle.",
      items: [
        { name: "Fuel system", body: "Injector, fuel rail, pump and filter O-rings in NBR or FKM." },
        { name: "Transmission and engine", body: "Under-bonnet, sensor, dipstick and transmission O-rings in AEM, NBR or FKM." },
        { name: "Cooling and A/C", body: "Hose connector and coolant-pipe O-rings in EPDM." },
        { name: "Filler caps", body: "Oil and coolant filler cap seals that re-seat on every opening." },
      ],
    },
    faqs: [
      { q: "Which standards do your automotive O-rings follow?", a: "AS568, ISO 3601, JIS B2401 and DIN 3771. Tolerance follows the standard and the cross-section. A size outside those catalogues is cut to your drawing in our own tool room, and a first-article sample is approved before volume release." },
      { q: "Can you mould O-rings in high volume for an automotive supplier?", a: "Yes. The minimum run is 10,000 pieces per part number, per compound, and installed capacity is 5 million parts a month against about 1.5 million in current production. Quotation in 48 hours; production in three to four weeks from drawing approval." },
      { q: "Do you make Viton (FKM) O-rings for fuel systems?", a: "Yes. FKM, the material sold under the Viton name, is rated to +250 °C and is our choice for fuel blends and hot synthetic oil. For mineral oil and fuel below +120 °C, NBR does the job at a lower price." },
    ],
    closing: { lines: ["Send the O-ring size", "and the system it seals."], body: "ID, cross-section, standard, fluid, temperature and annual volume. We reply within 48 hours with a compound and a quotation." },
  },
  {
    slug: "grommets",
    kind: "part",
    productCategory: "grommets",
    navLabel: "Automotive rubber grommets",
    status: "published",
    seo: {
      title: "Automotive Rubber Grommets Manufacturer India | Margo",
      description: "Wiring harness, firewall and bulkhead rubber grommets for automotive Tier 1 and Tier 2 suppliers. Open, blind and multi-hole, moulded to drawing in India.",
    },
    badge: "AUTOMOTIVE · GROMMETS · HIGH-VOLUME",
    h1Lines: ["Automotive Rubber Grommets", "for Harness & Body Suppliers"],
    intro: "Wiring harness, firewall, bulkhead and body-panel grommets, moulded in Nashik for harness makers, body-shop suppliers and vehicle assembly lines. Open, blind, multi-hole and oval, in any of eight compounds.",
    answer: "Margo Rubber Products moulds automotive grommets sized from the panel hole and panel thickness: 6–12 mm holes take a 1.0–1.6 mm panel, 12–25 mm holes take 1.2–2.0 mm, and 25–50 mm holes take 1.6–3.0 mm. Open, blind, multi-hole and oval grommets come in that range; holes above 50 mm and bulkhead grommets are cut to print. Minimum run 10,000 pieces per part number.",
    chips: ["Open · blind · multi-hole", "6–50 mm holes", "EPDM · NBR · silicone"],
    enquiryPart: "Grommets",
    parts: {
      eyebrow: "AUTOMOTIVE GROMMETS WE MOULD",
      heading: "Sized from the hole and the panel.",
      body: "A grommet that is a fraction too thick for the panel pops out on the line; one too thin leaks. We size the groove from your panel drawing.",
      items: [P.grommets, P.threePin, P.internalFit, P.boots],
    },
    specs: {
      eyebrow: "GROMMET SIZING",
      heading: "Panel hole, panel thickness, compound.",
      body: "Three numbers size a grommet. The compound follows what it sees: weather, oil or heat.",
      items: [
        { icon: "shield", name: "Compound", body: "EPDM for weather and water at the firewall and body; NBR where oil or fuel splash reaches; silicone near the exhaust and turbo." },
        { icon: "wave", name: "Fit on the line", body: "Groove width matched to panel thickness so the grommet seats by hand, stays put and seals around the harness." },
        VOLUME,
        CONTROL,
      ],
      table: {
        caption: "Grommet size by panel hole",
        columns: ["Panel hole (mm)", "Panel thickness (mm)"],
        rows: [
          { cells: ["6–12", "1.0–1.6"] },
          { cells: ["12–25", "1.2–2.0"] },
          { cells: ["25–50", "1.6–3.0"] },
          { cells: ["Above 50, bulkhead", "Cut to print"] },
        ],
      },
    },
    uses: {
      eyebrow: "WHERE OUR GROMMETS ARE FITTED",
      heading: "Every place a wire or pipe passes a panel.",
      items: [
        { name: "Firewall and bulkhead", body: "Harness pass-throughs that keep water, fumes and noise out of the cabin." },
        { name: "Doors and tailgate", body: "Door and tailgate harness grommets that flex with every opening." },
        { name: "Engine bay", body: "Sensor, pipe and cable grommets in NBR or silicone for oil and heat." },
        { name: "Lamps and switches", body: "Multi-hole pads and switch grommets for lamp and electrical connectors." },
      ],
    },
    faqs: [
      { q: "Do you supply grommets to wiring harness makers?", a: "Yes. Harness makers are typical Tier 2 buyers for us. We mould open, blind, multi-hole and oval grommets to the harness drawing, in volumes from 10,000 pieces per part number, with installed capacity of 5 million parts a month." },
      { q: "Which rubber is best for an automotive firewall grommet?", a: "EPDM in most vehicles: it handles weather, water and engine-bay heat to about +140 °C. NBR where oil or fuel can reach the grommet, and silicone near the exhaust or turbo where the temperature runs higher." },
      { q: "Can you copy a grommet from a sample?", a: "Yes. Send the physical grommet or the panel drawing. We measure it, propose a compound and hardness, cut the tool in-house and send a first-article sample for approval before volume production." },
    ],
    closing: { lines: ["Send the panel hole", "and the harness drawing."], body: "Hole size, panel thickness, the number and size of wires or pipes, and your annual volume. We reply within 48 hours with a quotation." },
  },
  {
    slug: "rubber-pads-stoppers",
    kind: "part",
    productCategory: "pads-stoppers-caps",
    navLabel: "Automotive rubber pads & stoppers",
    status: "published",
    seo: {
      title: "Automotive Rubber Pads & Stoppers Manufacturer | Margo",
      description: "Rubber support pads, stoppers, filler caps and shroud flaps for automotive OEMs, Tier 1 and Tier 2 suppliers, moulded to drawing in Nashik, India.",
    },
    badge: "AUTOMOTIVE · PADS & STOPPERS · HIGH-VOLUME",
    h1Lines: ["Automotive Rubber Pads,", "Stoppers & Caps"],
    intro: "Support pads, step pads, glove-box and tailgate stoppers, oil filler caps and A/C and radiator shroud flaps, moulded in Nashik against controlled drawings for vehicle makers and their Tier 1 and Tier 2 suppliers.",
    answer: "Margo Rubber Products moulds automotive rubber pads, stoppers and caps in EPDM, NBR and natural rubber to the customer's controlled drawing, including the Bolero support pad and side step pad. Each part is approved as a first-article sample before volume release. Minimum run 10,000 pieces per part number, per compound; installed capacity 5 million parts a month; quotation in 48 hours.",
    chips: ["EPDM · NBR · NR", "Drawing-controlled", "First-article approval"],
    enquiryPart: "Pads, Stoppers & Caps",
    parts: {
      eyebrow: "AUTOMOTIVE PADS AND STOPPERS WE MOULD",
      heading: "Small parts, made by the hundred thousand.",
      body: "These are the parts a vehicle needs in the largest numbers. They are made against a controlled drawing revision, with no substitutions without approval.",
      items: [P.boleroPad, P.bigPad, P.sideStep, P.gloveBox, P.shroudFlaps, P.pads],
    },
    specs: {
      eyebrow: "COMPOUND AND CONTROL",
      heading: "Chosen for the position.",
      body: "A cabin stopper and an under-bonnet flap look alike on a drawing and need different compounds.",
      items: [
        { icon: "thermo", name: "Under the bonnet", body: "EPDM for shroud flaps and air guides near the radiator; NBR where oil reaches a filler cap." },
        { icon: "wave", name: "In the cabin", body: "Natural rubber and EPDM stoppers tuned so a lid or door closes quietly without rattle." },
        VOLUME,
        CONTROL,
      ],
    },
    uses: {
      eyebrow: "WHERE OUR PADS ARE FITTED",
      heading: "Body, cabin and engine bay.",
      items: [
        { name: "Body and chassis", body: "Support pads, side step pads and bumper stoppers on utility and commercial vehicles." },
        { name: "Cabin", body: "Glove-box stoppers, tailgate switch boots and trim buffers." },
        { name: "Engine bay", body: "Oil filler caps, insulator head covers and radiator shroud flaps." },
        { name: "A/C and air management", body: "A/C air-extractor flaps and air guides in EPDM." },
      ],
    },
    faqs: [
      { q: "Can you make a support pad to an OEM drawing?", a: "Yes. The Bolero support pad and side step pad are made that way: against a controlled drawing revision, with a first-article sample approved before volume release. A change to compound, hardness or geometry is quoted and approved as a change, never made silently." },
      { q: "Which rubber is used for automotive support pads?", a: "EPDM where the pad sees weather, sun and road water; natural rubber where it carries load and must recover; NBR where oil or fuel can reach it. We propose the compound and hardness against the position on your drawing." },
      { q: "What volumes can you take on?", a: "The minimum run is 10,000 pieces per part number, per compound. Installed capacity is 5 million parts a month against about 1.5 million in current production. Production takes three to four weeks from drawing approval." },
    ],
    closing: { lines: ["Send the drawing", "or the part."], body: "The controlled drawing or a sample, with the position on the vehicle and the annual volume. We reply within 48 hours with a compound and a quotation." },
  },
  {
    slug: "rubber-profiles",
    kind: "part",
    productCategory: "extrusion",
    navLabel: "Automotive rubber profiles",
    status: "published",
    seo: {
      title: "Automotive Rubber Profiles & Seals Manufacturer | Margo",
      description: "EPDM door, glazing and edge-trim rubber profiles and cords for automotive and commercial-vehicle builders, extruded to drawing in Nashik, India.",
    },
    badge: "AUTOMOTIVE · RUBBER PROFILES · EXTRUDED",
    h1Lines: ["Automotive Rubber Profiles", "& Extruded Seals"],
    intro: "Windscreen glazing rubber, edge trim, door, hatch and channel seals and solid cords, extruded in Nashik to a profile drawing or sample for vehicle, bus and commercial-vehicle body builders.",
    answer: "Margo Rubber Products extrudes automotive rubber profiles to ±0.2 mm on the critical dimensions, recorded to ISO 3302-1 class E1 to E3, in EPDM, FKM, NBR, neoprene and silicone at 40–85 Shore A, across −60 to +250 °C. EPDM edge trim covers −40 to +140 °C for sun, rain and ozone. Pricing is per metre against your total run length.",
    chips: ["±0.2 mm critical dimensions", "EPDM · neoprene · silicone", "Cut lengths or coils"],
    enquiryPart: "Extrusion",
    parts: {
      eyebrow: "AUTOMOTIVE PROFILES WE EXTRUDE",
      heading: "Seals by the metre.",
      body: "Profiles are extruded to your section drawing and supplied in cut lengths, coils or joined frames.",
      items: [P.glazing, P.edgeTrim, P.profiles, P.boots],
    },
    specs: {
      eyebrow: "TOLERANCE AND COMPOUND",
      heading: "Held on the section that seals.",
      body: "Each tolerance is set by the section and recorded to ISO 3302-1 class E1 to E3.",
      items: [
        { icon: "thermo", name: "Weather and sun", body: "EPDM is the default for doors, glazing and edges: −40 to +140 °C with sun, rain and ozone." },
        { icon: "shield", name: "Oil and heat", body: "NBR where the profile sees oil or fuel; neoprene for weather with oil splash; silicone on a hot panel." },
        VOLUME,
        CONTROL,
      ],
    },
    uses: {
      eyebrow: "WHERE OUR PROFILES ARE FITTED",
      heading: "Glass, doors, hatches and edges.",
      items: [
        { name: "Glazing", body: "Rear windscreen and fixed-glass glazing rubber for cars, buses and cabs." },
        { name: "Doors and hatches", body: "Door, hatch and service-panel seals for commercial vehicles and special-purpose bodies." },
        { name: "Edges", body: "All-rubber edge trim that covers a cut panel edge and seals the gap behind it." },
        { name: "Cords and channels", body: "Solid cords and channels for sealing grooves and cable runs." },
      ],
    },
    faqs: [
      { q: "What tolerance can an automotive rubber profile hold?", a: "±0.2 mm on the critical dimensions of an extruded profile, with each tolerance set by the section and recorded to ISO 3302-1, class E1 to E3. Non-critical dimensions follow the wider class for that section." },
      { q: "Do you supply profiles to bus and commercial-vehicle body builders?", a: "Yes. Glazing rubber, door and hatch seals and edge trim go to vehicle and body builders, including special-purpose vehicles such as Minerva Special Purpose Vehicle. Pricing is per metre against your total run length." },
      { q: "Can you match a profile from a sample?", a: "Yes. Send a short length of the existing profile or the section drawing. We cut the die, propose a compound and hardness, and send a sample length for approval before the run." },
    ],
    closing: { lines: ["Send the section drawing", "and the total length."], body: "The profile section or a sample, the compound or where it fits, and the metres per year. We reply within 48 hours with a die plan and a per-metre price." },
  },
  {
    slug: "tier-2-suppliers",
    kind: "buyer",
    navLabel: "Rubber parts for Tier 2 suppliers",
    status: "published",
    seo: {
      title: "Rubber Parts Supplier for Tier 2 Automotive Firms | Margo",
      description: "Rubber bushes, seals, O-rings, grommets and pads for Tier 2 automotive suppliers in India. 10,000-piece runs, 5 million parts a month installed, Nashik.",
    },
    badge: "FOR TIER 2 AND TIER 1 AUTOMOTIVE SUPPLIERS",
    h1Lines: ["Rubber Parts Supplier", "for Tier 2 Automotive Suppliers"],
    intro: "If you build sub-assemblies, harnesses, lamps, moulded plastics or metal parts for a Tier 1 or a vehicle maker, the rubber inside them can come from one plant in Nashik, made to your drawing, in the volumes your programme runs at.",
    answer: "Margo Rubber Products supplies Tier 2 and Tier 1 automotive suppliers with rubber bushes, oil seals, O-rings, grommets, pads, stoppers, boots and extruded profiles, moulded to drawing at its ISO 9001:2015 certified plant in Nashik. Installed capacity is 5 million parts a month against about 1.5 million in production. Minimum run 10,000 pieces per part number, per compound. Quotation in 48 hours; production in three to four weeks.",
    chips: ["5 million parts a month installed", "10,000-piece runs", "Quote in 48 hours"],
    enquiryPart: "Automotive components",
    parts: {
      eyebrow: "WHAT TIER 2 SUPPLIERS BUY FROM US",
      heading: "The rubber inside your assembly.",
      body: "One supplier for the rubber content of a sub-assembly, so a lamp, harness or bracket programme is not waiting on five different moulders.",
      items: [P.bushes, P.oilSeals, P.oRings, P.grommets, P.pads, P.profiles],
    },
    specs: {
      eyebrow: "WHY TIER 2 BUYERS USE US",
      heading: "Capacity, control and speed.",
      body: "A Tier 2 supplier carries the Tier 1's delivery and quality demands. These are the numbers we hold ourselves to.",
      items: [
        VOLUME,
        CONTROL,
        { icon: "wave", name: "Tooling in-house", body: "Moulds are cut in our own tool room, so a new part or a drawing change does not wait on an outside toolmaker." },
        { icon: "thermo", name: "Compounds mixed in-house", body: "We mix our own compound in eight bases, including AEM, NBR, EPDM, FKM, silicone and natural rubber, and check every mixed batch." },
      ],
      table: {
        caption: "Margo for Tier 2 automotive buyers",
        columns: ["What you need", "What we hold to"],
        rows: [
          { cells: ["Quotation", "Within 48 hours of the drawing"] },
          { cells: ["Production lead time", "Three to four weeks from drawing approval"] },
          { cells: ["Minimum run", "10,000 pieces per part number, per compound"] },
          { cells: ["Capacity", "5 million parts a month installed, about 1.5 million in use"] },
          { cells: ["Rejection target", "Under 1%"] },
          { cells: ["On-time delivery", "Over 99%"] },
        ],
      },
    },
    uses: {
      eyebrow: "WHO WE SUPPLY",
      heading: "Vehicle makers and the suppliers behind them.",
      items: [
        { name: "Plastic moulders", body: "Rubber seals, grommets and buffers that go into moulded lamp, trim and interior assemblies." },
        { name: "Metal and fabrication shops", body: "Bushes, pads and bonded parts for brackets, mounts and chassis sub-assemblies." },
        { name: "Harness makers", body: "Harness, firewall and connector grommets moulded to the harness drawing." },
        { name: "Vehicle makers", body: AUTO_CUSTOMERS },
      ],
    },
    faqs: [
      { q: "Do you supply Tier 2 automotive suppliers directly?", a: "Yes. Tier 2 component suppliers already buy from us directly. " + AUTO_CUSTOMERS + " We quote within 48 hours of a drawing." },
      { q: "How much capacity do you have for a new automotive programme?", a: "Installed capacity is 5 million parts a month against about 1.5 million in current production, so a new programme has room. The minimum run is 10,000 pieces per part number, per compound, and production takes three to four weeks from drawing approval." },
      { q: "What documents come with each automotive shipment?", a: "Every component is produced against a controlled drawing revision, with first-article approval before volume release. Each shipment carries batch records and material certificates, and the drawing revision is recorded on the despatch documentation." },
      { q: "Are you IATF 16949 certified?", a: "We hold ISO 9001:2015, certificate 09111526A, issued by Integral Certification Ltd, and are upgrading our quality management system to IATF 16949:2016, targeting certification by the end of 2026. Tier 2 buyers already receive drawing-controlled production, first-article approval and batch traceability." },
    ],
    closing: { lines: ["Send us the rubber content", "of your next programme."], body: "Drawings or samples, compounds if specified, and annual volumes. We reply within 48 hours with compound recommendations, tooling and a quotation." },
  },
  {
    slug: "pune",
    kind: "city",
    navLabel: "Automotive rubber parts in Pune",
    status: "published",
    seo: {
      title: "Automotive Rubber Parts Manufacturer for Pune | Margo",
      description: "Rubber bushes, oil seals, O-rings and grommets for automotive suppliers in Pune, Chakan, Ranjangaon and Talegaon. Moulded in Nashik, about 210 km away.",
    },
    badge: "PUNE · CHAKAN · RANJANGAON · TALEGAON",
    h1Lines: ["Automotive Rubber Parts", "for Pune & Chakan Suppliers"],
    intro: "Pune's automotive belt, from Pimpri-Chinchwad and Bhosari to Chakan, Talegaon and Ranjangaon, buys rubber parts in the millions. We mould them in Nashik, about 210 km by road, to your drawing and in your volumes.",
    answer: "Margo Rubber Products supplies automotive rubber parts to suppliers in Pune, Chakan, Talegaon and Ranjangaon from its plant in Vilholi, Nashik, about 210 km by road. Rubber bushes, oil seals, O-rings, grommets, pads and profiles are moulded to drawing, with a minimum run of 10,000 pieces per part number and installed capacity of 5 million parts a month. Quotation in 48 hours.",
    chips: ["About 210 km by road", "Passenger, two-wheeler, CV", "Quote in 48 hours"],
    enquiryPart: "Automotive components",
    parts: {
      eyebrow: "WHAT PUNE SUPPLIERS BUY FROM US",
      heading: "Rubber for passenger cars, two-wheelers and trucks.",
      body: "Pune builds all three, and the Tier 1 and Tier 2 suppliers around Chakan and Pimpri-Chinchwad need rubber for each.",
      items: [P.bushes, P.oilSeals, P.oRings, P.grommets, P.pads, P.boots],
    },
    specs: {
      eyebrow: "SUPPLY INTO PUNE",
      heading: "Close enough to visit, large enough to supply.",
      body: "Nashik and Pune sit on the same road network, so samples, first-article approvals and plant visits do not need a flight.",
      items: [
        { icon: "dust", name: "Road distance", body: "About 210 km from Vilholi, Nashik to Pune, with Chakan and Talegaon on the way in. Samples and approvals move by road." },
        { icon: "wave", name: "Plant visits", body: "Pune buyers can audit the moulding, mixing and tool room in Nashik in a day trip." },
        VOLUME,
        CONTROL,
      ],
    },
    uses: {
      eyebrow: "PUNE'S AUTOMOTIVE AREAS",
      heading: "Where our parts go in the Pune belt.",
      items: [
        { name: "Chakan and Talegaon", body: "Passenger-vehicle and component plants: bushes, O-rings, grommets and body pads." },
        { name: "Pimpri-Chinchwad and Bhosari", body: "Commercial-vehicle and component suppliers: oil seals, bushes and boots." },
        { name: "Ranjangaon", body: "Assembly and component plants: grommets, stoppers and profiles." },
        { name: "Two-wheeler suppliers", body: "Fork, crankcase and swing-arm seals and bushes in high-volume runs." },
      ],
    },
    faqs: [
      { q: "Do you supply automotive rubber parts to Pune and Chakan?", a: "Yes. We mould in Vilholi, Nashik, about 210 km by road from Pune, and despatch to suppliers in Pune, Chakan, Talegaon, Ranjangaon and Pimpri-Chinchwad. " + AUTO_CUSTOMERS },
      { q: "Is there a rubber bush manufacturer near Pune for high volumes?", a: "Our Nashik plant moulds rubber bushes, silent blocks and cushion bushes in runs from 10,000 pieces per part number, with installed capacity of 5 million parts a month. It is a road trip from Pune, close enough for a plant visit and sample approval in a day." },
      { q: "How fast can a Pune supplier get a quotation and samples?", a: "Quotation within 48 hours of the drawing. A part with an existing tool can be sampled quickly; a new tool is cut in our own tool room. Production takes three to four weeks from drawing approval." },
    ],
    closing: { lines: ["Pune supplier?", "Send the drawing."], body: "Drawing or sample, compound if specified, annual volume and your plant location. We reply within 48 hours and can arrange a visit to the Nashik plant." },
  },
  {
    slug: "aurangabad",
    kind: "city",
    navLabel: "Automotive rubber parts in Aurangabad",
    status: "published",
    seo: {
      title: "Automotive Rubber Parts for Aurangabad Suppliers | Margo",
      description: "Rubber bushes, oil seals, O-rings and grommets for automotive suppliers in Aurangabad (Chhatrapati Sambhajinagar), Waluj and Shendra. Moulded in Nashik.",
    },
    badge: "AURANGABAD · WALUJ · SHENDRA · BIDKIN",
    h1Lines: ["Automotive Rubber Parts", "for Aurangabad Suppliers"],
    intro: "Aurangabad, now Chhatrapati Sambhajinagar, is one of Maharashtra's largest two-wheeler, three-wheeler and component clusters. We mould its rubber parts in Nashik, about 190 km by road, to drawing and in volume.",
    answer: "Margo Rubber Products supplies automotive rubber parts to suppliers in Aurangabad (Chhatrapati Sambhajinagar), Waluj, Shendra and Bidkin from its plant in Vilholi, Nashik, about 190 km by road. Oil seals, rubber bushes, O-rings, grommets, boots and pads are moulded to drawing, with a minimum run of 10,000 pieces per part number and installed capacity of 5 million parts a month.",
    chips: ["About 190 km by road", "Two- and three-wheeler", "Quote in 48 hours"],
    enquiryPart: "Automotive components",
    parts: {
      eyebrow: "WHAT AURANGABAD SUPPLIERS BUY FROM US",
      heading: "Rubber for two-wheelers, three-wheelers and components.",
      body: "Two-wheeler programmes run at volumes where a seal or bush is ordered by the hundred thousand. That is the volume our plant is built for.",
      items: [P.oilSeals, P.bushes, P.oRings, P.grommets, P.boots, P.pads],
    },
    specs: {
      eyebrow: "SUPPLY INTO AURANGABAD",
      heading: "One road from Nashik.",
      body: "Nashik and Aurangabad are connected by road through Vaijapur, so samples and approvals do not wait on courier routes.",
      items: [
        { icon: "dust", name: "Road distance", body: "About 190 km from Vilholi, Nashik to Aurangabad, with Waluj on the near side of the city." },
        { icon: "thermo", name: "Two-wheeler compounds", body: "NBR and FKM fork and crankcase seals, natural rubber and AEM bushes, EPDM boots and grommets." },
        VOLUME,
        CONTROL,
      ],
    },
    uses: {
      eyebrow: "AURANGABAD'S AUTOMOTIVE AREAS",
      heading: "Where our parts go around Aurangabad.",
      items: [
        { name: "Waluj MIDC", body: "Two-wheeler, three-wheeler and component suppliers: oil seals, O-rings and bushes." },
        { name: "Shendra and Bidkin (AURIC)", body: "New assembly and component plants: grommets, pads, stoppers and profiles." },
        { name: "Chikalthana", body: "Component and engineering suppliers: bushes, boots and seals." },
        { name: "Tier 2 moulders and fabricators", body: "Rubber content for plastic, metal and electrical sub-assemblies." },
      ],
    },
    faqs: [
      { q: "Do you supply automotive rubber parts to Aurangabad and Waluj?", a: "Yes. We mould in Vilholi, Nashik, about 190 km by road from Aurangabad (Chhatrapati Sambhajinagar), and despatch to suppliers in Waluj, Shendra, Bidkin and Chikalthana. " + AUTO_CUSTOMERS },
      { q: "Can you supply two-wheeler oil seals in volume?", a: "Yes. Fork, crankcase and gear-shift seals are moulded in NBR or FKM to DIN 3760, ISO 6194 or your drawing. The minimum run is 10,000 pieces per part number, per compound, and installed capacity is 5 million parts a month." },
      { q: "How quickly can an Aurangabad supplier get a quotation?", a: "Within 48 hours of the drawing. Production takes three to four weeks from drawing approval, and every despatch lot is checked for dimensions and hardness before it leaves Nashik." },
    ],
    closing: { lines: ["Aurangabad supplier?", "Send the drawing."], body: "Drawing or sample, compound if specified, annual volume and your plant location. We reply within 48 hours." },
  },
  {
    slug: "nashik",
    kind: "city",
    navLabel: "Automotive rubber parts in Nashik",
    status: "published",
    seo: {
      title: "Automotive Rubber Parts Manufacturer in Nashik | Margo",
      description: "Rubber bushes, oil seals, O-rings, grommets and pads moulded in Nashik for automotive suppliers in Satpur, Ambad, Sinnar and Igatpuri. Since 2005.",
    },
    badge: "NASHIK · SATPUR · SINNAR · IGATPURI",
    h1Lines: ["Automotive Rubber Parts", "Manufacturer in Nashik"],
    intro: "We have moulded rubber parts in Nashik since 2005. For automotive suppliers in Satpur, Sinnar, Igatpuri and the Ambad industrial area, the plant in Vilholi is a short drive away.",
    answer: "Margo Rubber Products has moulded rubber parts in Vilholi, Nashik since 2005, and supplies automotive suppliers across Satpur, Sinnar, Igatpuri and the Ambad industrial area. Rubber bushes, oil seals, O-rings, grommets, pads and profiles are moulded to drawing, with a minimum run of 10,000 pieces per part number, installed capacity of 5 million parts a month and quotation in 48 hours.",
    chips: ["In Nashik since 2005", "Local supply and visits", "Quote in 48 hours"],
    enquiryPart: "Automotive components",
    parts: {
      eyebrow: "WHAT NASHIK SUPPLIERS BUY FROM US",
      heading: "Local rubber for the Nashik automotive belt.",
      body: "Utility vehicles, tractors, electricals and components are built around Nashik, and the suppliers to those lines need rubber close by.",
      items: [P.boleroPad, P.bushes, P.oilSeals, P.oRings, P.grommets, P.sideStep],
    },
    specs: {
      eyebrow: "LOCAL SUPPLY",
      heading: "Short lines, quick approvals.",
      body: "A supplier in Satpur or Sinnar can bring a part to the plant, approve a sample on site and take delivery by road the same day.",
      items: [
        { icon: "dust", name: "On the doorstep", body: "Vilholi sits on the Nashik–Mumbai side of the city, a short drive from Satpur, Ambad industrial area, Sinnar and Igatpuri." },
        { icon: "wave", name: "Engineering on site", body: "Bring the part, the drawing or the problem; our tool room, compound mixing and moulding are on the same site." },
        VOLUME,
        CONTROL,
      ],
    },
    uses: {
      eyebrow: "NASHIK'S INDUSTRIAL AREAS",
      heading: "Where our parts go around Nashik.",
      items: [
        { name: "Satpur and the Ambad industrial area", body: "Component, electrical and fabrication suppliers: bushes, grommets, pads and seals." },
        { name: "Sinnar and Malegaon MIDC", body: "Engineering and component plants: oil seals, O-rings and boots." },
        { name: "Igatpuri and Gonde", body: "Assembly and component plants on the Mumbai road: pads, stoppers and profiles." },
        { name: "Utility vehicles and tractors", body: "Support pads, step pads, bushes and seals for utility and agricultural vehicle lines." },
      ],
    },
    faqs: [
      { q: "Is Margo a rubber parts manufacturer in Nashik?", a: "Yes. Margo Rubber Products has moulded rubber parts at its plant in Vilholi, Nashik since 2005, and mixes its own compound, cuts its own tools and moulds by compression, transfer and injection on the same site. " + AUTO_CUSTOMERS },
      { q: "Can Nashik suppliers visit the plant and approve samples on site?", a: "Yes. The plant is a short drive from Satpur, Sinnar and Igatpuri. Bring the part or drawing, review compound and tooling with our engineers, and approve the first-article sample on site before volume production." },
      { q: "What volumes do you run for Nashik automotive suppliers?", a: "From 10,000 pieces per part number, per compound, up to installed capacity of 5 million parts a month. Quotation in 48 hours; production in three to four weeks from drawing approval." },
    ],
    closing: { lines: ["Nashik supplier?", "Bring the part in."], body: "Send the drawing or bring the part to Vilholi. We reply within 48 hours with a compound recommendation, tooling plan and quotation." },
  },
];

export const LANDINGS: Record<string, Landing[]> = {
  automotive: AUTOMOTIVE,
};

export const landingsFor = (industry: string): Landing[] =>
  (LANDINGS[industry] ?? []).filter((l) => l.status === "published");

export const landingBySlug = (industry: string, slug: string): Landing | undefined =>
  landingsFor(industry).find((l) => l.slug === slug);

/** Every published landing path, for the sitemap. */
export const landingPaths = (): string[] =>
  Object.keys(LANDINGS).flatMap((industry) => landingsFor(industry).map((l) => `/industries/${industry}/${l.slug}`));

/** The industry landing pages that are the industry version of a product category. */
export const landingsForCategory = (category: string): { industry: string; landing: Landing }[] =>
  Object.keys(LANDINGS).flatMap((industry) =>
    landingsFor(industry)
      .filter((l) => l.productCategory === category)
      .map((landing) => ({ industry, landing })),
  );
