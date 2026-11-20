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
  productCategories?: string[];
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
    productCategories: ["bushes"],
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
        { name: "Cab and body", body: "Cushion bushes and support pads that isolate a cab, bracket or panel from road vibration." },
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
    productCategories: ["oil-seals"],
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
    productCategories: ["o-rings"],
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
    productCategories: ["grommets"],
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
    productCategories: ["pads-stoppers-caps"],
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
    productCategories: ["extrusion"],
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

/* ── Medical devices ───────────────────────────────────────────────────
 * Same claim line as the live medical page (sanity industry-medical-devices):
 * non-patient-contact parts for medical, laboratory and diagnostic
 * equipment; biocompatibility sits with the finished device; ISO 9001:2015
 * with medical-device certification in progress; no cleanroom, no FDA or
 * ISO 13485 claim; no fixed minimum quoted (the medical page sets it
 * against part size and tooling). The only customer named is Vactech
 * Surgical Equipment, from Site settings.
 */
const M = {
  fluidORings: { key: "fluid-path-o-rings", name: "Fluid-path O-rings", body: "O-rings for analyser, pump and valve fluid paths in EPDM, FKM or silicone.", image: "industries.medical-devices.part.fluid-path-o-rings", href: "/products/o-rings" },
  manifold: { key: "valve-manifold-gaskets", name: "Valve-manifold gaskets & flange seals", body: "Gaskets that seal valve blocks and manifolds in diagnostic instruments.", image: "industries.medical-devices.part.valve-manifold-gaskets", href: "/products/gaskets#valve-manifold-gaskets-flange-seals" },
  valveDiaphragm: { key: "instrument-valve-diaphragms", name: "Instrument valve diaphragms", body: "Flat and convoluted diaphragms for pinch, isolation and dosing valves.", image: "industries.medical-devices.part.instrument-valve-diaphragms", href: "/products/diaphragms#instrument-valve-diaphragms" },
  pumpDiaphragm: { key: "micro-pump-diaphragms", name: "Micro-pump diaphragms", body: "Small diaphragms for sample, reagent and vacuum micro-pumps.", image: "industries.medical-devices.part.micro-pump-diaphragms", href: "/products/diaphragms#instrument-micro-pump-diaphragms" },
  tubing: { key: "silicone-pump-tubing", name: "Silicone pump tubing & profiles", body: "Extruded silicone tubing for pump sets and silicone sealing profiles.", image: "industries.medical-devices.part.silicone-pump-tubing", href: "/products/extrusion#silicone-pump-tubing-profiles" },
  lidGasket: { key: "instrument-door-lid-gaskets", name: "Instrument door & lid gaskets", body: "Door and lid gaskets for analysers, incubators and cabinets.", image: "industries.medical-devices.part.instrument-door-lid-gaskets", href: "/products/gaskets#instrument-door-lid-gaskets" },
  sterilGasket: { key: "steriliser-door-gaskets", name: "Steriliser lid & door gaskets", body: "EPDM door and lid gaskets for steam sterilisers and autoclaves.", image: "industries.medical-devices.part.steriliser-door-gaskets", href: "/products/gaskets#steriliser-lid-door-gaskets" },
  plugs: { key: "access-port-plugs-grommets", name: "Access-port plugs & grommets", body: "Port plugs and pass-through grommets for cables and tubing.", image: "industries.medical-devices.part.access-port-plugs-grommets", href: "/products/grommets#access-port-plugs-pass-through-grommets" },
  feet: { key: "instrument-feet", name: "Instrument feet & suction feet", body: "Feet that hold an instrument still on the bench and damp vibration.", image: "industries.medical-devices.part.instrument-feet", href: "/products/pads-stoppers-caps#instrument-feet-suction-feet" },
  stoppers: { key: "laboratory-stoppers", name: "Laboratory stoppers", body: "Solid and bored stoppers for flasks, tubes and glassware.", image: "industries.medical-devices.part.laboratory-stoppers", href: "/products/pads-stoppers-caps#laboratory-stoppers" },
} satisfies Record<string, LandingPart>;

const MED_PROCESS = {
  icon: "shield" as const,
  name: "Documented every shipment",
  body: "Production runs against your controlled drawing revision, the revision is recorded on every despatch document, and material test reports ship with every shipment.",
};
const MED_SPEED = {
  icon: "dust" as const,
  name: "Prototype to volume",
  body: "Prototype in 48 to 72 hours with an existing tool, about 1 week for a new part. Installed capacity is 5 million parts a month for the volume run.",
};
const MED_SCOPE = "We make non-patient-contact parts for medical, laboratory and diagnostic equipment; biocompatibility is assessed on the finished device.";

const MEDICAL: Landing[] = [
  {
    slug: "silicone-rubber-parts",
    kind: "part",
    navLabel: "Silicone rubber parts for medical equipment",
    status: "published",
    productCategories: ["extrusion"],
    seo: {
      title: "Silicone Rubber Parts for Medical Equipment, India | Margo",
      description: "Silicone tubing, profiles, seals and gaskets for medical, laboratory and diagnostic equipment makers, moulded and extruded to drawing in Nashik, India.",
    },
    badge: "MEDICAL EQUIPMENT · SILICONE · DRAWING-MATCHED",
    h1Lines: ["Silicone Rubber Parts", "for Medical Equipment Makers"],
    intro: "Silicone (VMQ) tubing, profiles, seals, gaskets and diaphragms for medical, laboratory and diagnostic equipment, moulded and extruded at our plant in Nashik to your drawing.",
    answer: "Margo Rubber Products moulds and extrudes silicone (VMQ) parts for medical, laboratory and diagnostic equipment: pump tubing, profiles, door and lid gaskets, O-rings and diaphragms. Standard silicone covers −60 to +200 °C in dry air and suits dry-heat sterilisers; it is not suitable for steam above 121 °C, where EPDM is used instead. Extruded profiles hold ±0.2 mm on critical dimensions. Prototype in 48 to 72 hours with an existing tool.",
    chips: ["−60 to +200 °C dry heat", "Moulded and extruded", "±0.2 mm on profiles"],
    enquiryPart: "Silicone components",
    parts: {
      eyebrow: "SILICONE PARTS WE MAKE",
      heading: "Tubing, profiles, seals and gaskets.",
      body: "Silicone is the default where a part sees dry heat or needs to stay soft and clean. We extrude tubing and profiles and mould seals, gaskets and diaphragms.",
      items: [M.tubing, M.lidGasket, M.fluidORings, M.valveDiaphragm],
    },
    specs: {
      eyebrow: "WHEN SILICONE, WHEN NOT",
      heading: "Silicone for dry heat, EPDM for steam.",
      body: "The sterilisation method decides the compound. We confirm it from your cleaning or sterilisation cycle and say what the compound supplier can evidence.",
      items: [
        { icon: "thermo", name: "Dry heat", body: "Standard silicone holds −60 to +200 °C in dry air, which suits dry-heat steriliser gaskets and seals." },
        { icon: "wave", name: "Steam", body: "Silicone is not suitable for steam above 121 °C and has a limited life in steam below that. Steam and autoclave parts are made in EPDM." },
        MED_SPEED,
        MED_PROCESS,
      ],
      table: {
        caption: "Compound by sterilisation and fluid",
        columns: ["Compound", "Choose it for", "Limit"],
        rows: [
          { cells: ["Silicone (VMQ)", "Dry heat, soft tubing and profiles", "Not for steam above 121 °C"] },
          { cells: ["EPDM", "Steam, autoclave, aqueous reagents", "Not for oils and solvents"] },
          { cells: ["FKM", "Solvents and oils", "Higher cost; specified where the fluid needs it"] },
        ],
      },
    },
    uses: {
      eyebrow: "WHERE OUR SILICONE PARTS ARE USED",
      heading: "Inside the instrument, not on the patient.",
      items: [
        { name: "Pumps and fluid handling", body: "Silicone pump tubing and profiles for peristaltic pumps and sample handling." },
        { name: "Dry-heat sterilisers and ovens", body: "Silicone door and lid gaskets that hold their seal at temperature." },
        { name: "Analysers and diagnostics", body: "Silicone O-rings and diaphragms in fluid paths that see dry heat or need a soft seal." },
        { name: "Cabinets and incubators", body: "Silicone door and panel seals for enclosures that run warm." },
      ],
    },
    faqs: [
      { q: "Can silicone be used for steam sterilisation?", a: "Not above 121 °C, and its life in steam below that is limited. For steam and autoclave cycles we mould the part in EPDM. Silicone is our choice for dry-heat sterilisers and for soft tubing and profiles that do not see steam." },
      { q: "Do you make medical-grade silicone parts?", a: MED_SCOPE + " We tell you the silicone grade, confirm what the compound supplier can evidence for your fluid and cleaning method, and ship material test reports with every shipment." },
      { q: "Can you extrude silicone tubing to our drawing?", a: "Yes. Silicone tubing and profiles are extruded to your section drawing, with critical dimensions held to ±0.2 mm and each tolerance recorded to ISO 3302-1, class E1 to E3. Pricing is per metre against your total run length." },
    ],
    closing: { lines: ["Send the drawing and", "the sterilisation method."], body: "Drawing or sample, the fluid contacted, the cleaning or sterilisation method and the working temperature. We reply within 48 hours with a compound recommendation and a quotation." },
  },
  {
    slug: "o-rings-seals",
    kind: "part",
    navLabel: "Medical equipment O-rings & seals",
    status: "published",
    productCategories: ["o-rings"],
    seo: {
      title: "Medical Equipment O-Rings & Seals Manufacturer India | Margo",
      description: "Fluid-path O-rings and seals in EPDM, FKM and silicone for medical, laboratory and diagnostic equipment. AS568 and ISO 3601 sizes or your drawing.",
    },
    badge: "MEDICAL EQUIPMENT · O-RINGS & SEALS",
    h1Lines: ["O-Rings & Seals for", "Medical & Lab Equipment"],
    intro: "Fluid-path O-rings, valve seals and manifold gaskets for analysers, pumps, valves and sterilisers, moulded in Nashik in EPDM, FKM or silicone, chosen by the chemistry they see.",
    answer: "Margo Rubber Products moulds O-rings and seals for medical, laboratory and diagnostic equipment in EPDM for steam and aqueous reagents, FKM for solvents and oils, and silicone for dry heat, at 30 to 90 Shore A depending on the compound. Sizes follow AS568 and ISO 3601, or your drawing. Prototype in 48 to 72 hours with an existing tool; material test reports ship with every shipment.",
    chips: ["AS568 · ISO 3601", "EPDM · FKM · silicone", "Prototype in 48–72 hours"],
    enquiryPart: "O-Rings",
    parts: {
      eyebrow: "SEALS WE MOULD FOR MEDICAL EQUIPMENT",
      heading: "Seals for the fluid path.",
      body: "Every seal is chosen from the fluid, the cleaning or sterilisation method and the temperature, not from a default compound.",
      items: [M.fluidORings, M.manifold, M.valveDiaphragm, M.plugs],
    },
    specs: {
      eyebrow: "COMPOUND BY CHEMISTRY",
      heading: "The reagent picks the rubber.",
      body: "Send the fluids and the cleaning or sterilisation method. We recommend the compound and confirm what its supplier can evidence.",
      items: [
        { icon: "shield", name: "EPDM", body: "Steam, autoclave cycles and aqueous reagents. Not for oils or hydrocarbon solvents." },
        { icon: "thermo", name: "FKM", body: "Solvents and oils, where EPDM and silicone would swell." },
        MED_SPEED,
        MED_PROCESS,
      ],
    },
    uses: {
      eyebrow: "WHERE OUR SEALS ARE USED",
      heading: "Analysers, pumps, valves and sterilisers.",
      items: [
        { name: "Analysers", body: "Fluid-path O-rings and manifold gaskets for sample and reagent handling." },
        { name: "Pumps and valves", body: "O-rings and seals for dosing, sampling and vacuum pumps and their valves." },
        { name: "Sterilisers", body: "EPDM seals on steam lines, doors and ports." },
        { name: "Laboratory equipment", body: "O-rings for centrifuges, incubators, washers and dispensers." },
      ],
    },
    faqs: [
      { q: "Which O-ring compound for a diagnostic analyser fluid path?", a: "EPDM for aqueous reagents, buffers and steam cleaning; FKM where the path carries solvents or oils; silicone for dry heat. Send the reagent list and cleaning method and we confirm the compound and what the compound supplier can evidence." },
      { q: "Do you mould O-rings to AS568 and ISO 3601?", a: "Yes, at 30 to 90 Shore A depending on the compound. Tolerance follows the standard and the cross-section. Sizes outside the catalogues are cut to your drawing in our own tool room." },
      { q: "Are your O-rings suitable for patient contact?", a: MED_SCOPE + " Our O-rings and seals sit inside the instrument, in the fluid path or on doors and ports." },
    ],
    closing: { lines: ["Send the seal size", "and the fluid list."], body: "Size or drawing, the fluids and cleaning method, the temperature and your annual volume. We reply within 48 hours with a compound and a quotation." },
  },
  {
    slug: "diaphragms",
    kind: "part",
    navLabel: "Medical equipment diaphragms",
    status: "published",
    productCategories: ["diaphragms"],
    seo: {
      title: "Diaphragms for Medical & Lab Equipment, India | Margo",
      description: "Valve and micro-pump rubber diaphragms for medical, laboratory and diagnostic equipment, Ø20 to Ø400 mm, in EPDM, FKM or silicone. Moulded in India.",
    },
    badge: "MEDICAL EQUIPMENT · DIAPHRAGMS",
    h1Lines: ["Rubber Diaphragms for", "Medical & Lab Equipment"],
    intro: "Valve and micro-pump diaphragms for analysers, dosing systems and laboratory pumps, moulded in Nashik flat, rolling or convoluted, in the compound the pumped fluid calls for.",
    answer: "Margo Rubber Products moulds flat, rolling and convoluted rubber diaphragms from Ø20 to Ø400 mm effective diameter, at 40–80 Shore A, for medical, laboratory and diagnostic equipment valves and micro-pumps. Above roughly 3 bar, or wherever a stretching diaphragm would change the dose, fabric reinforcement takes over. The compound is picked from the medium pumped: EPDM, FKM or silicone.",
    chips: ["Ø20–Ø400 mm", "40–80 Shore A", "Flat · rolling · convoluted"],
    enquiryPart: "Diaphragms",
    parts: {
      eyebrow: "DIAPHRAGMS WE MOULD",
      heading: "For valves that dose and pumps that move fluid.",
      body: "A diaphragm in a dosing path has to move the same volume every stroke. Geometry, hardness and reinforcement are set for that.",
      items: [M.valveDiaphragm, M.pumpDiaphragm, M.fluidORings, M.manifold],
    },
    specs: {
      eyebrow: "DESIGN POINTS",
      heading: "Size, hardness, reinforcement, compound.",
      body: "Four choices decide whether a diaphragm doses accurately and lasts. We set them with you from the drawing.",
      items: [
        { icon: "wave", name: "Reinforcement", body: "Above roughly 3 bar, or where a stretching diaphragm would change the dose, fabric reinforcement carries the pressure." },
        { icon: "shield", name: "Compound", body: "EPDM for aqueous media and steam cleaning, FKM for solvents and oils, silicone for dry heat." },
        MED_SPEED,
        MED_PROCESS,
      ],
      table: {
        caption: "Medical equipment diaphragm range",
        columns: ["Property", "Range"],
        rows: [
          { cells: ["Effective diameter", "Ø20 to Ø400 mm"] },
          { cells: ["Hardness", "40 to 80 Shore A"] },
          { cells: ["Types", "Flat, rolling, convoluted"] },
          { cells: ["Reinforcement", "Fabric above about 3 bar or where stretch changes the dose"] },
        ],
      },
    },
    uses: {
      eyebrow: "WHERE OUR DIAPHRAGMS ARE USED",
      heading: "Valves and pumps in the instrument.",
      items: [
        { name: "Diagnostic analysers", body: "Pinch, isolation and dosing valve diaphragms in the reagent path." },
        { name: "Laboratory pumps", body: "Micro-pump diaphragms for sample, reagent and vacuum duty." },
        { name: "Dispensers and dosing systems", body: "Diaphragms that move a set volume every stroke." },
        { name: "Sterilisers and washers", body: "EPDM diaphragms on steam and water valves." },
      ],
    },
    faqs: [
      { q: "When does a medical pump diaphragm need fabric reinforcement?", a: "Above roughly 3 bar, or wherever a stretching diaphragm would change the dose. Below that, a moulded rubber diaphragm alone usually carries the pressure. We decide from the pressure, stroke and dosing accuracy on your drawing." },
      { q: "What sizes of diaphragm can you mould?", a: "Flat, rolling and convoluted diaphragms from Ø20 to Ø400 mm effective diameter, at 40 to 80 Shore A. Micro-pump diaphragms at the small end of that range are cut to your drawing in our own tool room." },
      { q: "Which compound for a reagent diaphragm?", a: "EPDM for aqueous reagents and steam cleaning, FKM for solvents and oils, silicone for dry heat. Send the reagent list and we confirm the compound and what its supplier can evidence. " + MED_SCOPE },
    ],
    closing: { lines: ["Send the diaphragm drawing", "and the medium."], body: "Drawing or sample, the medium pumped, pressure, stroke and annual volume. We reply within 48 hours with a design check and a quotation." },
  },
  {
    slug: "steriliser-door-gaskets",
    kind: "part",
    navLabel: "Steriliser & autoclave door gaskets",
    status: "published",
    productCategories: ["gaskets"],
    seo: {
      title: "Autoclave & Steriliser Door Gasket Maker India | Margo",
      description: "EPDM autoclave and steam steriliser door gaskets, plus instrument door and lid gaskets, moulded to the OEM drawing in Nashik, India, for equipment makers.",
    },
    badge: "MEDICAL EQUIPMENT · STERILISER GASKETS",
    h1Lines: ["Steriliser & Autoclave", "Door Gaskets"],
    intro: "Door and lid gaskets for steam sterilisers, autoclaves, incubators and analyser cabinets, moulded in Nashik to the equipment maker's drawing, in EPDM for steam and silicone for dry heat.",
    answer: "Margo Rubber Products moulds steriliser and autoclave door gaskets in EPDM, the compound for steam and autoclave cycles, and dry-heat steriliser gaskets in silicone, to the equipment maker's drawing. Silicone is not suitable for steam above 121 °C. Instrument door and lid gaskets for analysers and incubators are made the same way, with material test reports and the drawing revision on every shipment.",
    chips: ["EPDM for steam", "Silicone for dry heat", "Made to the OEM drawing"],
    enquiryPart: "Gaskets",
    parts: {
      eyebrow: "DOOR AND LID GASKETS WE MOULD",
      heading: "Seals for chambers that cycle.",
      body: "A steriliser door gasket is compressed, heated and released every cycle. The compound and section are chosen for that cycle.",
      items: [M.sterilGasket, M.lidGasket, M.manifold, M.plugs],
    },
    specs: {
      eyebrow: "COMPOUND BY CYCLE",
      heading: "Steam or dry heat decides it.",
      body: "Tell us the sterilisation method, temperature and cycle count. We choose the compound and section from them.",
      items: [
        { icon: "thermo", name: "Steam and autoclave", body: "EPDM: the compound for steam and autoclave sterilisation and aqueous cleaning." },
        { icon: "wave", name: "Dry heat", body: "Silicone holds −60 to +200 °C in dry air. It is not used for steam above 121 °C." },
        MED_SPEED,
        MED_PROCESS,
      ],
    },
    uses: {
      eyebrow: "WHERE OUR GASKETS ARE FITTED",
      heading: "Doors, lids and chambers.",
      items: [
        { name: "Steam sterilisers and autoclaves", body: "EPDM door, lid and chamber gaskets made to the OEM drawing." },
        { name: "Dry-heat sterilisers and ovens", body: "Silicone door gaskets for dry-heat cycles." },
        { name: "Incubators and cabinets", body: "Door and panel gaskets that keep temperature and humidity in." },
        { name: "Analysers", body: "Lid and cover gaskets that keep dust and splashes out of the instrument." },
      ],
    },
    faqs: [
      { q: "Which rubber is best for an autoclave door gasket?", a: "EPDM. It is the compound for steam and autoclave sterilisation. Silicone is not suitable for steam above 121 °C and has a limited life in steam below that, so we use silicone only for dry-heat steriliser doors." },
      { q: "Can you make a replacement steriliser door gasket from a sample?", a: "Yes. Send the old gasket or the door drawing. We measure the section, confirm the compound from the sterilisation method, cut the tool in-house and send a pre-production sample for approval. Prototype takes about 1 week for a new part." },
      { q: "Do you supply steriliser gaskets to equipment makers in volume?", a: "Yes. Steriliser and instrument gaskets are made against the equipment maker's controlled drawing revision, and installed capacity is 5 million parts a month. Medical equipment customers include Vactech Surgical Equipment." },
    ],
    closing: { lines: ["Send the door drawing", "and the cycle."], body: "Drawing or old gasket, the sterilisation method, temperature and annual volume. We reply within 48 hours with a compound recommendation and a quotation." },
  },
  {
    slug: "plugs-grommets-feet",
    kind: "part",
    navLabel: "Medical equipment plugs, grommets & feet",
    status: "published",
    productCategories: ["grommets", "pads-stoppers-caps"],
    seo: {
      title: "Rubber Plugs, Grommets & Feet for Medical Equipment | Margo",
      description: "Access-port plugs, pass-through grommets, instrument feet and laboratory stoppers for medical and laboratory equipment makers, moulded to drawing in India.",
    },
    badge: "MEDICAL EQUIPMENT · PLUGS, GROMMETS & FEET",
    h1Lines: ["Rubber Plugs, Grommets", "& Feet for Lab Equipment"],
    intro: "Access-port plugs, pass-through grommets, instrument feet, suction feet and laboratory stoppers for medical, laboratory and diagnostic equipment, moulded in Nashik to your drawing.",
    answer: "Margo Rubber Products moulds access-port plugs, pass-through grommets, instrument feet, suction feet and laboratory stoppers for medical, laboratory and diagnostic equipment, in EPDM, FKM or silicone. Grommets are sized from the panel hole and thickness, from 6 mm holes on a 1.0 mm panel to 50 mm holes on a 3.0 mm panel. Prototype in 48 to 72 hours with an existing tool, about 1 week for a new part.",
    chips: ["Plugs · grommets · feet", "6–50 mm panel holes", "EPDM · FKM · silicone"],
    enquiryPart: "Grommets",
    parts: {
      eyebrow: "BENCH AND PANEL PARTS WE MOULD",
      heading: "The small parts every instrument needs.",
      body: "Ports, cable entries and feet are the parts an instrument needs in every unit. They are made against a controlled drawing like any other part.",
      items: [M.plugs, M.feet, M.stoppers, M.lidGasket],
    },
    specs: {
      eyebrow: "SIZING",
      heading: "From the panel hole and the bench.",
      body: "Grommets and plugs are sized from the panel; feet from the instrument weight and the vibration you want to stop.",
      items: [
        { icon: "shield", name: "Grommets and plugs", body: "6–12 mm holes take a 1.0–1.6 mm panel, 12–25 mm holes 1.2–2.0 mm, and 25–50 mm holes 1.6–3.0 mm. Larger holes are cut to print." },
        { icon: "wave", name: "Feet", body: "Instrument and suction feet hold an instrument still on the bench and damp vibration from pumps and centrifuges." },
        MED_SPEED,
        MED_PROCESS,
      ],
    },
    uses: {
      eyebrow: "WHERE THEY ARE FITTED",
      heading: "Panels, ports and benches.",
      items: [
        { name: "Instrument panels", body: "Pass-through grommets for cables and tubing, and blanking plugs for unused ports." },
        { name: "Analysers and centrifuges", body: "Instrument feet and suction feet that stop walking and damp vibration." },
        { name: "Laboratory glassware", body: "Solid and bored stoppers for flasks and tubes." },
        { name: "Cabinets and enclosures", body: "Cable-entry grommets and access-port plugs." },
      ],
    },
    faqs: [
      { q: "What size grommet does an instrument panel need?", a: "Size it from the panel hole and thickness: 6–12 mm holes take a 1.0–1.6 mm panel, 12–25 mm holes take 1.2–2.0 mm, and 25–50 mm holes take 1.6–3.0 mm. Holes above 50 mm and bulkhead grommets are cut to print." },
      { q: "Do you make laboratory rubber stoppers?", a: "Yes. Solid and bored laboratory stoppers are moulded to your sizes in EPDM, FKM or silicone, chosen by what the stopper will touch. " + MED_SCOPE },
      { q: "Can you make rubber feet for medical equipment?", a: "Yes. Instrument feet and suction feet are moulded to your drawing, with hardness set for the instrument weight and the vibration you want to damp. Prototype in 48 to 72 hours with an existing tool, about 1 week for a new part." },
    ],
    closing: { lines: ["Send the panel drawing", "or the part."], body: "Drawing or sample, the material it touches and annual volume. We reply within 48 hours with a compound recommendation and a quotation." },
  },
  {
    slug: "tier-2-suppliers",
    kind: "buyer",
    navLabel: "Rubber parts for medical equipment suppliers",
    status: "published",
    seo: {
      title: "Rubber Parts Supplier for Medical Equipment Makers | Margo",
      description: "Rubber seals, gaskets, diaphragms, tubing and grommets for medical equipment makers and their Tier 1 and Tier 2 suppliers in India. Moulded in Nashik.",
    },
    badge: "FOR MEDICAL EQUIPMENT MAKERS AND THEIR SUPPLIERS",
    h1Lines: ["Rubber Components Supplier", "for Medical Equipment Makers"],
    intro: "If you build medical, laboratory or diagnostic equipment, or the sub-assemblies inside it, the rubber parts can come from one plant in Nashik, made to your drawing with the documents your device file needs.",
    answer: "Margo Rubber Products supplies medical, laboratory and diagnostic equipment makers and their Tier 1 and Tier 2 suppliers with O-rings, gaskets, diaphragms, silicone tubing, grommets, plugs and feet, moulded to drawing in EPDM, FKM or silicone at its ISO 9001:2015 certified plant in Nashik. Prototype in 48 to 72 hours with an existing tool. Installed capacity is 5 million parts a month, and material test reports ship with every shipment.",
    chips: ["5 million parts a month installed", "Prototype in 48–72 hours", "MTR every shipment"],
    enquiryPart: "Medical components",
    parts: {
      eyebrow: "WHAT MEDICAL EQUIPMENT SUPPLIERS BUY",
      heading: "The rubber inside the instrument.",
      body: "One supplier for the rubber content of an instrument or sub-assembly, documented the same way on every part.",
      items: [M.fluidORings, M.valveDiaphragm, M.sterilGasket, M.tubing, M.plugs, M.feet],
    },
    specs: {
      eyebrow: "WHY EQUIPMENT MAKERS USE US",
      heading: "Documentation, speed and capacity.",
      body: "Your device file needs the same documents for every part. These are the ones we supply.",
      items: [
        MED_PROCESS,
        MED_SPEED,
        { icon: "wave", name: "Change control", body: "A change to compound, hardness or geometry is quoted and approved as a change, never made silently." },
        { icon: "thermo", name: "Compound evidence", body: "We recommend EPDM, FKM or silicone from your fluid and sterilisation method, and confirm what the compound supplier can evidence." },
      ],
      table: {
        caption: "Margo for medical equipment buyers",
        columns: ["What you need", "What we supply"],
        rows: [
          { cells: ["Quotation", "Within 48 hours of the drawing"] },
          { cells: ["Prototype", "48 to 72 hours with an existing tool; about 1 week for a new part"] },
          { cells: ["Approval", "Pre-production sample before volume release"] },
          { cells: ["Records", "Material test report and drawing revision with every shipment"] },
          { cells: ["Certification", "ISO 9001:2015; medical-device certification in progress"] },
        ],
      },
    },
    uses: {
      eyebrow: "WHO WE SUPPLY",
      heading: "Equipment makers and the suppliers behind them.",
      items: [
        { name: "Diagnostic and laboratory equipment makers", body: "Fluid-path seals, diaphragms, tubing and bench hardware." },
        { name: "Steriliser and autoclave makers", body: "EPDM door and chamber gaskets and steam-line seals." },
        { name: "Pump, valve and sub-assembly suppliers", body: "O-rings, diaphragms and gaskets for the sub-assemblies they build into instruments." },
        { name: "Surgical equipment makers", body: "Medical equipment customers include Vactech Surgical Equipment." },
      ],
    },
    faqs: [
      { q: "Do you supply medical equipment makers and their Tier 2 suppliers?", a: "Yes. We mould non-patient-contact parts for medical, laboratory and diagnostic equipment makers and the suppliers that build their sub-assemblies. Medical equipment customers include Vactech Surgical Equipment. Quotation within 48 hours of the drawing." },
      { q: "Do you hold ISO 13485 approval?", a: "We do not hold it. We hold ISO 9001:2015, certificate 09111526A, and medical-device certification is in progress. Regulatory responsibility for the finished device stays with the manufacturer; we supply the material certificates, batch records and drawing-revision documentation the device file needs." },
      { q: "How much volume can you take on?", a: "Installed capacity is 5 million parts a month. Send the drawing and annual volume and we quote both the tooling and the part price within 48 hours." },
    ],
    closing: { lines: ["Send us the rubber content", "of your next instrument."], body: "Drawings or samples, fluids, sterilisation method and annual volumes. We reply within 48 hours with compound recommendations, tooling and a quotation." },
  },
  {
    slug: "gujarat",
    kind: "city",
    navLabel: "Medical equipment rubber parts in Gujarat",
    status: "published",
    seo: {
      title: "Medical Equipment Rubber Parts for Gujarat Makers | Margo",
      description: "Rubber seals, gaskets, diaphragms and silicone tubing for medical and laboratory equipment makers in Ahmedabad, Vadodara and Gujarat. Made in Nashik.",
    },
    badge: "AHMEDABAD · VADODARA · GUJARAT",
    h1Lines: ["Medical Equipment Rubber Parts", "for Gujarat Makers"],
    intro: "Gujarat is home to many of India's medical device and laboratory equipment makers, in and around Ahmedabad, Vadodara and the state's industrial estates. We mould their rubber parts in Nashik and send them by road.",
    answer: "Margo Rubber Products supplies rubber parts to medical, laboratory and diagnostic equipment makers in Ahmedabad, Vadodara and across Gujarat from its plant in Vilholi, Nashik: fluid-path O-rings, diaphragms, steriliser door gaskets, silicone tubing, grommets and feet, in EPDM, FKM or silicone. Prototype in 48 to 72 hours with an existing tool; material test reports ship with every shipment.",
    chips: ["Ahmedabad · Vadodara", "Road supply from Nashik", "Quote in 48 hours"],
    enquiryPart: "Medical components",
    parts: {
      eyebrow: "WHAT GUJARAT MAKERS BUY FROM US",
      heading: "Rubber for instruments, sterilisers and pumps.",
      body: "The same parts we make for every medical equipment buyer, documented the same way.",
      items: [M.fluidORings, M.sterilGasket, M.valveDiaphragm, M.tubing, M.plugs, M.feet],
    },
    specs: {
      eyebrow: "SUPPLY INTO GUJARAT",
      heading: "Western India, one road network.",
      body: "Nashik and Gujarat are connected by road, so samples, approvals and volume shipments move without air freight.",
      items: [
        { icon: "dust", name: "By road", body: "Samples and production lots go by road from Vilholi, Nashik to Ahmedabad, Vadodara and the Gujarat industrial estates." },
        { icon: "wave", name: "Plant visits", body: "Gujarat buyers can audit our compound mixing, tool room and moulding in Nashik before approving a part." },
        MED_SPEED,
        MED_PROCESS,
      ],
    },
    uses: {
      eyebrow: "GUJARAT'S EQUIPMENT MAKERS",
      heading: "Where our parts go in Gujarat.",
      items: [
        { name: "Ahmedabad", body: "Diagnostic, laboratory and hospital equipment makers: seals, gaskets and diaphragms." },
        { name: "Vadodara", body: "Instrument and process-equipment makers: O-rings, diaphragms and tubing." },
        { name: "Industrial estates", body: "Sub-assembly and component suppliers: grommets, plugs and feet." },
        { name: "Pharma equipment", body: "Process-line seals and clamp gaskets alongside the medical range." },
      ],
    },
    faqs: [
      { q: "Do you supply medical equipment rubber parts to Ahmedabad and Gujarat?", a: "Yes. We mould in Vilholi, Nashik and send samples and production lots by road to equipment makers in Ahmedabad, Vadodara and across Gujarat. " + MED_SCOPE },
      { q: "How fast can a Gujarat maker get a prototype?", a: "48 to 72 hours with an existing tool, about 1 week for a new part, then road transit to you. Quotation within 48 hours of the drawing." },
      { q: "What documents come with each shipment?", a: "Material test reports ship with every shipment, and the drawing revision the parts were made to is recorded on every despatch document. The compound supplier's data is shared on request for your device file." },
    ],
    closing: { lines: ["Gujarat equipment maker?", "Send the drawing."], body: "Drawing or sample, the fluid and sterilisation method, annual volume and your location. We reply within 48 hours." },
  },
  {
    slug: "mumbai-pune",
    kind: "city",
    navLabel: "Medical equipment rubber parts in Mumbai & Pune",
    status: "published",
    seo: {
      title: "Medical Equipment Rubber Parts, Mumbai & Pune | Margo",
      description: "Rubber seals, gaskets, diaphragms and silicone tubing for medical and laboratory equipment makers in Mumbai, Thane, Navi Mumbai and Pune. Made in Nashik.",
    },
    badge: "MUMBAI · THANE · NAVI MUMBAI · PUNE",
    h1Lines: ["Medical Equipment Rubber Parts", "for Mumbai & Pune Makers"],
    intro: "Mumbai, Thane, Navi Mumbai and Pune are home to many of Maharashtra's medical, laboratory and pharma equipment makers. Our plant in Nashik is about 170 km by road from Mumbai, close enough for samples and visits in a day.",
    answer: "Margo Rubber Products supplies rubber parts to medical, laboratory and diagnostic equipment makers in Mumbai, Thane, Navi Mumbai and Pune from its plant in Vilholi, Nashik, about 170 km by road from Mumbai. Fluid-path O-rings, diaphragms, steriliser door gaskets, silicone tubing, grommets and feet are moulded to drawing in EPDM, FKM or silicone. Prototype in 48 to 72 hours with an existing tool.",
    chips: ["About 170 km from Mumbai", "Same-state supply", "Quote in 48 hours"],
    enquiryPart: "Medical components",
    parts: {
      eyebrow: "WHAT MUMBAI AND PUNE MAKERS BUY",
      heading: "Rubber for instruments, sterilisers and pumps.",
      body: "Parts for diagnostic, laboratory, steriliser and pharma equipment, all produced against a controlled drawing revision.",
      items: [M.fluidORings, M.sterilGasket, M.valveDiaphragm, M.tubing, M.plugs, M.stoppers],
    },
    specs: {
      eyebrow: "SUPPLY INTO MUMBAI AND PUNE",
      heading: "Same state, short road.",
      body: "Nashik sits between Mumbai and the rest of Maharashtra, so samples, approvals and plant visits fit in a day.",
      items: [
        { icon: "dust", name: "Road distance", body: "About 170 km from Vilholi, Nashik to Mumbai, and about 210 km to Pune." },
        { icon: "wave", name: "Visit and approve", body: "Mumbai and Pune buyers can review compound, tooling and the pre-production sample at the plant in a day trip." },
        MED_SPEED,
        MED_PROCESS,
      ],
    },
    uses: {
      eyebrow: "WHERE OUR PARTS GO",
      heading: "Mumbai, Thane, Navi Mumbai and Pune.",
      items: [
        { name: "Mumbai and Thane", body: "Diagnostic, laboratory and hospital equipment makers: seals, gaskets and stoppers." },
        { name: "Navi Mumbai", body: "Instrument and pharma equipment makers: O-rings, diaphragms and silicone tubing." },
        { name: "Pune", body: "Equipment and sub-assembly makers: grommets, plugs, feet and steriliser gaskets." },
        { name: "Pharma equipment", body: "Process-line seals and clamp gaskets alongside the medical range." },
      ],
    },
    faqs: [
      { q: "Do you supply medical equipment rubber parts in Mumbai and Pune?", a: "Yes. We mould in Vilholi, Nashik, about 170 km by road from Mumbai and about 210 km from Pune, and supply equipment makers in Mumbai, Thane, Navi Mumbai and Pune. Medical equipment customers include Vactech Surgical Equipment." },
      { q: "Can Mumbai buyers visit the plant?", a: "Yes. The plant is a day trip from Mumbai. Review compound selection and tooling with our engineers and approve the pre-production sample on site." },
      { q: "Do you make patient-contact parts?", a: "No. " + MED_SCOPE + " We supply material test reports and drawing-revision records with every shipment." },
    ],
    closing: { lines: ["Mumbai or Pune maker?", "Send the drawing."], body: "Drawing or sample, the fluid and sterilisation method, annual volume and your location. We reply within 48 hours." },
  },
];

export const LANDINGS: Record<string, Landing[]> = {
  automotive: AUTOMOTIVE,
  "medical-devices": MEDICAL,
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
      .filter((l) => l.productCategories?.includes(category))
      .map((landing) => ({ industry, landing })),
  );

/** Per-industry wording the shared template needs. */
export const INDUSTRY_LANDING_COPY: Record<
  string,
  { buyers: string; faqHeading: string; productLinkBody: string; buyerPage: { slug: string; label: string } }
> = {
  automotive: {
    buyers: "automotive buyers",
    faqHeading: "Questions from automotive buyers.",
    productLinkBody: "Volumes, compounds and sizes for vehicle makers and their Tier 1 and Tier 2 suppliers.",
    buyerPage: { slug: "tier-2-suppliers", label: "Rubber parts for Tier 2 automotive suppliers" },
  },
  "medical-devices": {
    buyers: "medical equipment buyers",
    faqHeading: "Questions from medical equipment makers.",
    productLinkBody: "Compounds, sterilisation and documentation for medical, laboratory and diagnostic equipment makers and their suppliers.",
    buyerPage: { slug: "tier-2-suppliers", label: "Rubber parts for medical equipment suppliers" },
  },
};
