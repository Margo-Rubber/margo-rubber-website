# 06_Export.html — Export Page Content Sheet

**<title>** Rubber Components Exporter India | FOB Nhava Sheva | Margo
**description** Precision rubber components exported from Nashik, India. Per-lane transit times, FOB / CIF / EXW / DAP, ISPM-15 pallets, Certificate of Origin. ISO 9001:2015.

## 01 Hero [Tune]
> live: LIVE H1 → We Export Worldwide · subhead is accurate and well written · says “eight international markets” while the closing summary lists nine country codes
- **Eyebrow**: `EXPORT HUB · NASHIK → WORLD`
  _Unchanged_
- **H1 — 2 lines**: “Rubber Components,” / “Exported from Nashik.”  (accent: Exported from Nashik.)
  _5 words · live is 3 · the live H1 carries no product noun and no geo — “We Export Worldwide” is true of every exporter_
- **Subhead**:
  > Margo Rubber Products ships precision moulded and extruded rubber components from Nashik, India under an ISO 9001:2015 quality system, FOB Nhava Sheva or CIF to your port. Nine markets have a country-level sourcing playbook below — duty treatment, certificate requirements, transit time and destination port. Click a lane to jump to yours.
  _50 words · live is 27 · entity, process, geo and Incoterm in the first clause. “Nine” corrects the live count — the page has eight lane blocks but Kenya/Tanzania is two countries, which is why the closing summary lists nine codes_
- **Vision-build addition**: `95 MARKETS SCREENED · 18 PLAYBOOKS WRITTEN · 9 LANES DETAILED BELOW`
  _A single strip under the subhead. It is the one place on the site where the full research tier stack belongs, because this is the page that proves it. On the buyer-facing build the third value reads 9 LANES MAPPED rather than served_
  <details><summary>notes (4)</summary>
  - Heading. Page’s only <h1>, two <span class="block"> children.
  - Keyword. rubber components exporter India resolves across H1 and the subhead’s first clause. FOB Nhava Sheva is a genuine long-tail term with buyer intent and appears in both the H1 area and the title tag.
  - Count consistency. Hero says eight, closing summary lists nine codes, market blocks number eight. Fix to nine countries across eight lane blocks and state it that way — Kenya and Tanzania share a block.
  - Alt. alt="Trade lanes from Nashik, India to Margo Rubber Products export markets".
  </details>

## 02 Trade lane strip [Fix the links]
> live: LIVE → TRADE LANES FROM NASHIK · eight numbered chips, 01/08 to 08/08 · every one links to the homepage
- **Label**: `TRADE LANES FROM NASHIK`
  _Unchanged — specific, geo-bearing, and correct_
- **Chips ×8** (# | Market | Correct href | Live href):
  | 01 / 08 | Australia | /export#australia |  |
  | 02 / 08 | United Kingdom | /export#uk |  |
  | 03 / 08 | UAE & Saudi | /export#uae-saudi |  |
  | 04 / 08 | Malaysia | /export#malaysia |  |
  | 05 / 08 | USA | /export#usa |  |
  | 06 / 08 | Singapore | /export#singapore |  |
  | 07 / 08 | Kenya & Tanzania | /export#east-africa |  |
  | 08 / 08 | US & EU | /export#us-eu |  |
  _Order changes to the Top-5 activation sequence — Australia, UK, UAE & Saudi, Malaysia first, then the rest. Live order puts UK fourth and Malaysia fifth, which matches no published sequence. Target IDs are already correct on the page; only the href prefix is wrong_
  <details><summary>notes (5)</summary>
  - The anchor bug is a one-line component fix and it currently breaks the primary navigation of the site’s best page. Every chip sends the buyer to the homepage, where none of the eight IDs exist, so they land at the top of / with no explanation.
  - Same fault class as /products, where #range and #catalogue emit root-relative. Fix the anchor helper once.
  - Markup. <nav aria-label="Trade lanes"> wrapping an <ol> — the 01/08 numbering is real sequence. Chips are <a>, not buttons; they navigate.
  - Scroll behaviour. scroll-margin-top on each target section equal to the sticky header height, or the anchor lands with the heading hidden behind the nav.
  - US & EU sits last because it is the only block that is a region rather than a market, and it duplicates the USA block. See section 04.
  </details>

## 03 World map [Tune]
> live: LIVE → full-width interactive map, ~3,550px tall, with eight clickable pins · the single largest element on the site
- **Pin labels**: `NASHIK, IN (origin)
AUSTRALIA · UNITED KINGDOM · UNITED ARAB EMIRATES · SAUDI ARABIA
MALAYSIA · UNITED STATES · SINGAPORE · KENYA · TANZANIA`
  _Nine destination labels, matching the closing summary’s nine codes. Live shows eight pins with Kenya/Tanzania combined_
- **Pin tooltip**: `AUSTRALIA
Melbourne, Sydney, Brisbane · 18–22 days · FCL or LCL`
  _New. The map currently carries no transit data at all, while the blocks below it carry excellent transit data. Putting the number on the pin is what makes the map informative rather than decorative_
- **Vision-build layer**:
  > Add a second, dimmer pin class for the 13 remaining playbook markets — South Korea, Kenya, South Africa, Singapore, Norway, Chile, Zambia, Tanzania, Ghana, Peru, Trinidad & Tobago, Jordan — and a faint dot layer for the balance of the 95 screened. Three visual tiers on one map is the clearest possible statement of the research, and it is the slide the whole vision build exists to produce.
  <details><summary>notes (5)</summary>
  - Inline SVG, not an image. Country names and transit figures must be in the text layer. A raster map with the labels burned in is 3,550px of page that a crawler and an assistant read as nothing.
  - Accessibility. role="img" with <title> and <desc> on the <svg>; pins as focusable <a> elements in tab order; and a visually-hidden list of the same nine lanes with their transit times as the non-visual equivalent.
  - 3,550px is a quarter of the page for one element. Consider halving it. The transit table below is doing more work per pixel, and the map’s LCP and CLS cost lands on the site’s most important page.
  - Every pin animation behind prefers-reduced-motion.
  - No Place node per pin. areaServed on the homepage ContactPoint carries the country list.
  </details>

## 04 Market blocks ×8 [Keep & correct]
> live: LIVE → eight blocks, ~4,565–10,627px · the best content on the site · real transit times, real duty schemes, real certificate requirements · three corrections and one structural fix
- **Structure**:
  > Eight blocks become nine. The live US & EU block duplicates the USA block and bundles two markets with entirely different rules. Split into United States and European Union; the Incoterms table living inside it moves out to section 05. Nine blocks for nine countries, which reconciles the hero’s “eight markets” against the closing summary’s nine codes.
  > Every block keeps the live four-part shape: eyebrow · H2 · standfirst · four bullets, then a caveat line and two internal links. Standfirsts run 38–46 words, matching live.
- **01 — Australia** (composite):
  · `AUSTRALIA`
  · H: “Supplying Australian Industrial Buyers”
  · Australian manufacturers and mining-equipment OEMs source precision moulded rubber components from Margo Rubber Products in Nashik. Anti-vibration mounts, O-rings, bushes and sealing gaskets for abrasive, high-load plant — precision components, not wear linings. FCL or LCL from Nhava Sheva.
    - Transit 18–22 days to Melbourne, Sydney and Brisbane
    - ISPM-15 heat-treated pallets on every consignment — Australian biosecurity rejects untreated timber at the wharf, and a rejection is the buyer’s cost
    - SGS pre-shipment inspection available on request
    - Certificate of Origin issued by the Nashik Chamber of Commerce
  · _Australia applies standard import duties under the Customs Tariff Act 1995. Verify current duty and GST treatment with your Australian customs broker._
  · `→ Rubber components for mining & resources /industries/mining
→ Seals & gaskets catalogue /products/gaskets`
  _Standfirst 41 words · live is 38 · the mining positioning line is added because the hub card and the mining page both make it and this block did not_
- **02 — United Kingdom** (composite):
  · `UNITED KINGDOM`
  · H: “Export to the United Kingdom”
  · UK importers and distributors buy moulded and extruded rubber components from Margo Rubber Products under an ISO 9001:2015 quality system. Post-Brexit import procedure follows the UK Global Tariff, separate from EU rules, and we work with forwarders experienced in that regime.
    - Transit 22–28 days FCL to Felixstowe or Southampton
    - UK Global Tariff applies — commodity code and origin declaration on every commercial invoice
    - UKCA marking: where a rubber component forms part of a product requiring UKCA, the conformity assessment obligation rests with the UK importer or manufacturer, not with us
    - Non-preferential Certificate of Origin issued by the Nashik Chamber of Commerce
  · _India and the UK are in active Free Trade Agreement negotiations. Check current duty status with your UK customs broker before placing orders on anticipated preferential treatment._
  · `→ Seals & gaskets catalogue /products/gaskets
→ Extrusion profiles /products/extrusion`
  _Standfirst 40 words · the UKCA bullet is the strongest line in this block — correctly assigning the obligation to the importer is what a buyer’s compliance team checks first_
- **03 — UAE & Saudi Arabia** (composite):
  · `UAE & SAUDI ARABIA`
  · H: “Gulf Region Export, UAE & Saudi Arabia”
  · Margo Rubber Products ships to buyers in the UAE and the Kingdom of Saudi Arabia serving oil and gas, petrochemical, water treatment and general industrial sectors. FKM seals rated to 250 °C for hydrocarbon service. Nhava Sheva to Jebel Ali is the shortest and most frequently served lane we run.
    - Transit 5–8 days, Nhava Sheva to Jebel Ali — the fastest lane on this page
    - Saudi Arabia: goods may require a Certificate of Conformity from an approved body. Tell your freight forwarder at order stage, not at the port
    - Material and composition declarations available where required by the customer
    - LCL and FCL for both UAE and KSA consignments
  · _NORSOK M-710 and API elastomer qualification are not held today. The qualification programme is under way and is targeted for 2027. Where a specification calls for either, tell us at enquiry stage and we will confirm the current position on that programme before you commit engineering time._
  · `→ Rubber components for oil & gas /industries/oil-gas
→ FKM and NBR seal specifications /products/oil-seals#fkm`
  _Standfirst 45 words · live is 42 · the NORSOK/API caveat is new — it appears on /industries/oil-gas but not here, on the block where a Gulf oil-and-gas buyer actually lands. “Halal declarations” is dropped: halal certification for industrial rubber is not a category that exists, and offering it invites a question with no good answer_
- **04 — Malaysia** (composite):
  · `MALAYSIA`
  · H: “Supplying Malaysian Manufacturers”
  · Malaysian manufacturers and palm oil processors source seals, gaskets and custom moulded components from Margo Rubber Products. Nhava Sheva to Port Klang is a short, well-served lane with frequent sailings and groupage available for smaller consignments.
    - Transit 10–14 days, Nhava Sheva to Port Klang
    - FCL and LCL; groupage consolidation for smaller orders
    - ASEAN–India FTA may offer preferential duty — verify HS code and Form AI eligibility with your customs agent
    - Eight compounds available: AEM, FKM, silicone, EPDM, NBR, neoprene, SBR and natural rubber
  · `→ Rubber components for palm oil processing /industries/water-fluid-management
→ Full compound range /products#compounds`
  _Standfirst 37 words · live is 36 · the compound bullet is corrected from five to eight — live lists “NR, SBR, NBR, EPDM and Silicone” and omits AEM, FKM and neoprene_
- **05 — United States** (composite):
  · `UNITED STATES`
  · H: “Exporting to the United States”
  · US industrial buyers evaluating Indian-origin rubber components as part of supply-chain diversification work with Margo Rubber Products, a Made-in-India manufacturer with the documentation infrastructure US customs and procurement teams require. All goods are manufactured at our Nashik plant.
    - Transit 18–22 days to West Coast ports, 22–28 days to East Coast, FCL or LCL
    - Commercial invoices state HTS heading, unit price and total value in USD
    - Importer Security Filing (ISF 10+2) data provided to your US customs broker on request
    - Payment: T/T in advance for new accounts; open terms or L/C for established buyers
  · _Compound composition declarations are produced per part on request. We do not hold FDA registration; food-contact qualification rests with the buyer._
  · `→ Technical rubber compounds overview /products#compounds
→ Anti-vibration mounts /products/anti-vibration-mounts`
  _Standfirst 42 words · live is 40 · the FDA caveat replaces “FDA-grade compound documentation available for food-contact applications”. Margo holds no FDA registration and /industries/medical-devices says so plainly_
- **06 — European Union** (composite):
  · `EUROPEAN UNION`
  · H: “Export to the European Union”
  · EU importers buy moulded and extruded rubber components from Margo Rubber Products under preferential origin schemes where they apply. We are familiar with EU documentation requirements and issue the origin paperwork your broker will ask for before the container sails.
    - EUR.1 movement certificate or GSP Form A available for preferential origin claims
    - Customs value declared per the transaction value method — no invoice manipulation, on any lane
    - Compound composition declarations on request. A full REACH SVHC screen across all product families is a roadmap item
    - ISPM-15 heat-treated pallets on all wooden packaging
  · _Verify current India-to-EU duty treatment with your broker. Preferential schemes change, and eligibility depends on your commodity code._
  · `→ Seals & gaskets catalogue /products/gaskets
→ Certifications and test standards /certifications`
  _New block, split from US & EU. CONFIRM — is the EU a target market at all? It appears in no Top-5 or 18-market playbook, which suggests the original block existed to look complete. If it is not a target, delete rather than split. The no invoice manipulation line is retained verbatim and moved here: it is the single most trust-building sentence on the page and almost no supplier writes it · CONFIRM_
- **07 — Singapore** (composite):
  · `SINGAPORE`
  · H: “Singapore, Distribution Hub & Direct Supply”
  · Singapore buyers order from Margo Rubber Products both for local plant use and for onward distribution across South-East Asia. Marine, process and general industrial applications, with the same ISO 9001:2015 release documentation on every despatch lot.
    - Transit 8–12 days, Nhava Sheva to the Port of Singapore figure
    - ASEAN–India FTA may offer preferential duty — verify Form AI eligibility with your customs agent
    - Re-export documentation supported where Singapore is a distribution point rather than the end market
    - FCL, LCL and air freight for urgent replenishment
  · `→ Pumps & valves components /industries/pumps-valves
→ O-rings and seals /products/o-rings`
  _Transit 8–12 days, Nhava Sheva to the Port of Singapore. Published carrier schedules on this lane run from about 6 days on the fastest direct service to 13 on a transhipped one, so 8–12 is the honest working range and matches the format every other block on this page uses — the missing figure is more conspicuous here than anywhere, because the eight blocks are read as a set_
- **08 — Kenya & Tanzania** (composite):
  · `EAST AFRICA`
  · H: “East Africa, Kenya & Tanzania”
  · Kenyan and Tanzanian industrial buyers source rubber seals, gaskets and moulded components from Margo Rubber Products for water infrastructure, agriculture and general plant. Pre-shipment inspection is mandatory into both markets and we arrange it at quotation stage rather than at the port.
    - PVoC pre-shipment inspection is required for both Kenya and Tanzania — arranged through an approved body before departure
    - Ports and transit: Mombasa for Kenya, 10–19 days from Nhava Sheva · Dar es Salaam for Tanzania, 14–21 days. CMA CGM’s Swahili Express publishes 19 and 21 days on its scheduled service; faster direct sailings run nearer the bottom of each range. Confirm the booked figure with the forwarder at quotation stage, as the footnote already says
    - Sealing rings to IS 5382 for water, gas and sewer mains
    - Certificate of Origin issued by the Nashik Chamber of Commerce
  · `→ Water & fluid management /industries/water-fluid-management
→ Agriculture components /industries/agriculture`
  _Two countries in one block, which is why the page says eight markets and the summary lists nine codes. Keep them together — the PVoC requirement and the buyer profile are the same — but say “nine countries across eight lane blocks” in the hero_
  <details><summary>notes (37)</summary>
  - Transit 18–22 days to Melbourne, Sydney and Brisbane
  - ISPM-15 heat-treated pallets on every consignment — Australian biosecurity rejects untreated timber at the wharf, and a rejection is the buyer’s cost
  - SGS pre-shipment inspection available on request
  - Certificate of Origin issued by the Nashik Chamber of Commerce
  - Transit 22–28 days FCL to Felixstowe or Southampton
  - UK Global Tariff applies — commodity code and origin declaration on every commercial invoice
  - UKCA marking: where a rubber component forms part of a product requiring UKCA, the conformity assessment obligation rests with the UK importer or manufacturer, not with us
  - Non-preferential Certificate of Origin issued by the Nashik Chamber of Commerce
  - Transit 5–8 days, Nhava Sheva to Jebel Ali — the fastest lane on this page
  - Saudi Arabia: goods may require a Certificate of Conformity from an approved body. Tell your freight forwarder at order stage, not at the port
  - Material and composition declarations available where required by the customer
  - LCL and FCL for both UAE and KSA consignments
  - Transit 10–14 days, Nhava Sheva to Port Klang
  - FCL and LCL; groupage consolidation for smaller orders
  - ASEAN–India FTA may offer preferential duty — verify HS code and Form AI eligibility with your customs agent
  - Eight compounds available: AEM, FKM, silicone, EPDM, NBR, neoprene, SBR and natural rubber
  - Transit 18–22 days to West Coast ports, 22–28 days to East Coast, FCL or LCL
  - Commercial invoices state HTS heading, unit price and total value in USD
  - Importer Security Filing (ISF 10+2) data provided to your US customs broker on request
  - Payment: T/T in advance for new accounts; open terms or L/C for established buyers
  - EUR.1 movement certificate or GSP Form A available for preferential origin claims
  - Customs value declared per the transaction value method — no invoice manipulation, on any lane
  - Compound composition declarations on request. A full REACH SVHC screen across all product families is a roadmap item
  - ISPM-15 heat-treated pallets on all wooden packaging
  - Transit 8–12 days, Nhava Sheva to the Port of Singapore figure
  - ASEAN–India FTA may offer preferential duty — verify Form AI eligibility with your customs agent
  - Re-export documentation supported where Singapore is a distribution point rather than the end market
  - FCL, LCL and air freight for urgent replenishment
  - PVoC pre-shipment inspection is required for both Kenya and Tanzania — arranged through an approved body before departure
  - Ports and transit: Mombasa for Kenya, 10–19 days from Nhava Sheva · Dar es Salaam for Tanzania, 14–21 days. CMA CGM’s Swahili Express publishes 19 and 21 days on its scheduled service; faster direct sailings run nearer the bottom of each range. Confirm the booked figure with the forwarder at quotation stage, as the footnote already says
  - Sealing rings to IS 5382 for water, gas and sewer mains
  - Certificate of Origin issued by the Nashik Chamber of Commerce
  - These eight passages are the most citable content Margo owns. Each carries a named port, a numeric transit range, a named certificate and a named duty scheme — four checkable facts in a 60-word block, which is exactly the shape an assistant lifts for “how long does shipping from India to Australia take?”.
  - Heading levels. Each block <h2>, with the market name as the eyebrow <p>. Bullets are <ul>. Currently correct.
  - Section IDs already exist and are correct. Do not rename them when fixing the anchor hrefs in section 02 — only the link prefix is wrong.
  - Two internal links per block, as live — to the most relevant product or industry page. Australia → /industries/mining, UAE → /industries/oil-gas, Malaysia → palm oil processing. This pattern is correct and should be preserved through the rewrite.
  - The hedging is an asset, not timidity. “Verify current duty treatment with your customs broker” appears in six of eight blocks. It is the correct thing to say, it protects Margo, and it reads as expertise rather than evasion.
  </details>

## 05 Incoterms [Promote to its own section]
> live: LIVE → four-term table, correct definitions, currently buried inside the US & EU block · it applies to every market
- **Placement**:
  > Move it out of the US & EU block to its own section, directly after the map and before the market blocks. Incoterms apply to all nine lanes; burying them inside one regional block means a buyer reading the Australia block never sees them, and the anchor nav offers no way to reach them.
- **H2**: “Incoterms We Trade On”
  _4 words · live label is INCOTERMS WE OFFER, a <p> rather than a heading — which is why it cannot be linked to_
- **Terms ×4** (Term | Name | Definition):
  | FOB | Free On Board | Risk transfers when goods pass the ship’s rail at Nhava Sheva / JNPT. You arrange freight and insurance from there. Our standard term. |
  | CIF | Cost, Insurance & Freight | We cover freight and marine insurance to your named destination port. Risk transfers on delivery to carrier. |
  | EXW | Ex Works, Nashik | Goods collected from our Nashik plant. All onward freight, export clearance and insurance on the buyer. |
  | DAP | Delivered at Place | We deliver to your named location; import duties and unloading remain with the buyer. By agreement. |
  _Definitions unchanged — all four are correct, which is more than can be said for most supplier sites. Only addition is marking FOB as standard, which the rest of the site already states_
- **Footnote**: `Preferred term is agreed at quotation stage. We work with experienced CHAs at
Nhava Sheva and can recommend freight forwarders with a track record in your country.`
  _Unchanged_
  <details><summary>notes (5)</summary>
  - Give it an ID and a nav chip. /export#incoterms, added to the trade-lane strip as a ninth chip or a separate secondary link. A buyer searching “FOB vs CIF India supplier” should land here.
  - Markup. Real <table> or <dl> with <dt> term and <dd> definition — live uses <dl>, which is correct and should stay.
  - Heading. Promote INCOTERMS WE OFFER from <p> to <h2>. As a styled paragraph it is invisible to the document outline and cannot be a jump target.
  - Four DefinedTerm nodes in a DefinedTermSet at #incoterms, same pattern as the compound table. Ties the trade vocabulary to the entity.
  - Do not attempt to explain Incoterms further. The definitions are already correct and correctly scoped to what Margo does. Expanding them turns a supplier page into a glossary competing with the ICC.
  </details>

## 06 Export process [Rewrite]
> live: LIVE H2 → Export Process, Step by Step · six steps, factually accurate but written as category labels · the intro promises “what we need from you” and the steps never say it · step 01 promises a quotation in 3 business days
- **Eyebrow**: `HOW IT WORKS`
- **H2 — 2 lines**: “From Drawing to Delivery” / “in Three to Four Weeks”  (accent: in Three to Four Weeks)
  _7 words · live is 5 · the live H2 “Export Process, Step by Step” describes the format rather than the outcome. This states the lead time, which is what a buyer is scanning for_
- **Intro**:
  > Six stages, and at each one it is clear what we owe you and what we need from you. Quotation in 48 hours, prototype in 48 to 72, production in three to four weeks.
  _34 words · live is 16 · the live intro promises “what we need from you” and then the six steps never say it. This version delivers on that promise and puts the three timings in the opening block, where an export buyer is looking for them_
- **Steps ×6** (composite):
    | 01 | Drawing & Quotation | We need: a drawing, a specification, or the physical component — a worn part in an envelope is how a large share of our work begins. Plus quantity, operating temperature and the media it sits in.
You get back: a quotation and feasibility report within 48 hours, with price, tooling cost if the part is new, and lead time. |
    | 02 | Tooling & Samples | We do: design and cut the mould or die in our own toolroom — no third-party shop in the loop, which is why revisions take days rather than weeks.
You get back: a prototype 48 to 72 hours from an approved drawing, then fitment samples inside two weeks.
We need: your dimensional approval on the first-off sample before we commit to volume. |
    | 03 | Production & Inspection | We do: produce under ISO 9001:2015 with a first-article dimensional check, then in-process inspection through the run. Every despatch lot is released against hardness and dimensional criteria from our own laboratory.
You get back: signed inspection release data per lot, with compound batch, cure parameters and results retrievable per production batch. APQP and PPAP where your programme requires it. |
    | 04 | Export Packaging | We do: poly-bag and carton the components, label each carton with part number and gross/net weight, and stack on heat-treated ISPM-15 marked pallets.
Why it matters: untreated timber is rejected at the wharf in Australia, the US, the EU and the UK — and the rejection lands as the buyer’s cost, not ours. |
    | 05 | Customs Clearance | We do: clear through our CHA at Nhava Sheva, 185 km and about three hours twenty by road from the plant. Bill of Lading, packing list, commercial invoice and Certificate of Origin are all issued before departure.
We need: your confirmed Incoterm and consignee details at order stage, not at loading. |
    | 06 | Documentation & Delivery | We do: send the full document set electronically and by courier so it reaches your broker ahead of the container, not with it. HS code declarations, MSDS where the compound requires one, and SGS or PVoC pre-shipment inspection on request.
Why it matters: documents arriving after the vessel is the most common cause of demurrage on a first order. |
  · What changed and why. The titles stay plain nouns, close to the live ones — a procurement buyer scanning six stages wants to know which one they are reading, not to be entertained. Two are sharpened: Quote becomes Drawing & Quotation because the drawing is the buyer’s half of that stage, and Shipping (Incoterm) becomes Customs Clearance, which is what actually happens there and is also the term people search.
  · The work is in the bodies, not the headings. The live steps run 20–28 words of description and never say what the buyer has to supply, even though the intro promises exactly that. Splitting each body into We do / We need / You get back makes the obligation unambiguous at every stage without changing a single heading.
  · Two steps carry a “why it matters” line. Packing and documentation are where a first-time importer loses money, and neither reason is obvious to someone who has not imported before — untreated timber rejected at the wharf, documents arriving after the vessel. Naming the failure mode is what makes a process list useful rather than procedural.
  · Step 01 fixes the timing. Live promises a quotation in 3 business days, the slowest of five values the site publishes for one promise. The company profile states 48 hours.
  _Step bodies 45–60 words · live steps run 20–28 · the live cards are visually tall with a lot of dead space, so they absorb this without a layout change. Check the six-card grid at 1024px_
  <details><summary>notes (4)</summary>
  - Response-time consistency is the single most repeated defect on this site. Five values across five pages for one promise. One string: acknowledgement in one business day, quotation in 48 hours. Set it in one constant and render it everywhere.
  - Markup. <ol> — real sequence. Step labels are <p>, step titles <h3>. The We do / We need / You get back lead-ins are <strong> inside the paragraph, not sub-headings — six steps × three sub-headings would put eighteen phantom entries in the document outline.
  - Schema. The six steps go into the page’s FAQPage node phrased as questions: “How long does an export quotation take?”, “How are export shipments packaged?”, “Who clears customs at Nhava Sheva?”. Six steps, six answers, all already written.
  - Do not use HowTo. It is for instructions the reader performs. This is a commercial process the supplier performs.
  </details>

## 07 Export documents [Keep]
> live: LIVE H2 → Export Documents We Issue · eight documents, each with a real description · the best-written section on the site, and it needs one word changed
- **Documents ×8** (Document | Verdict):
  | Commercial Invoice | Keep verbatim — HS code, unit price, total value, Incoterm stated. |
  | Packing List | Keep verbatim — carton-by-carton, part number, quantity, gross/net, dimensions. |
  | Certificate of Origin | Keep verbatim — Nashik Chamber of Commerce, named issuing body. |
  | Bill of Lading / AWB | Keep verbatim — negotiable B/L for L/C transactions correctly noted. |
  | Inspection Certificate | Rename to Inspection Release Report. Content is correct: hardness, dimensional sampling, AQL level per batch. The word “certificate” implies third-party issuance. |
  | SGS / PVoC Inspection | Keep verbatim — Kenya and Tanzania requirement correctly flagged. |
  | MSDS / SDS | Keep verbatim. |
  | ISPM-15 Packaging | Keep verbatim — AU, US, EU, UK phytosanitary requirement correctly stated. |
  _Seven of eight are accurate, specific and correctly scoped. This section required almost no work, which on this site is worth saying out loud_
- **Intro**:
  > Every shipment leaves with a standard document set. Market-specific additions — PVoC, SGS, MSDS — are arranged at quotation stage.
  _Unchanged — 20 words, and it states both the default and the exception_
  <details><summary>notes (4)</summary>
  - Eight named document types with real descriptions is a genuine authority signal for export queries, and an assistant asked “what documents does an Indian rubber exporter provide?” has eight extractable answers here and nowhere else in the category.
  - Markup. <dl> with <dt> document name and <dd> description, or a table. Currently a card grid with <h3> names, which is also fine.
  - “Certificate” is a load-bearing word in procurement. An inspection certificate is normally understood to come from a third party. Margo issues its own release data, which is standard and adequate — but calling it a certificate sets up a request Margo cannot meet without engaging SGS.
  - Cross-link. The ISPM-15 entry should link to the Australia block, which also mentions it. Internal links between related passages on a 14,000px page help both readers and extraction.
  </details>

## 08 Export quote form [Rewrite the bullets]
> live: LIVE H2 → Get an Export Quote · five well-chosen fields including PREFERRED INCOTERM · two of the four assurance bullets must change: an MOQ and an inspection-certificate claim
- **H2**: “Get an Export Quotation”
  _4 words · live is 4_
- **Body**:
  > Send component drawings, quantities and destination country. We respond with pricing, lead time and a recommended Incoterm within 48 hours.
  _21 words · live is 25 · 3 business days corrected to 48 hours, matching section 06 and the rest of the site_
- **Bullets ×4** (Replacement | Replaces):
  | Drawings accepted: DXF, DWG, PDF, STEP | Unchanged — specific and useful |
  | Eight compounds in-house: AEM, FKM, Silicone, EPDM, NBR, Neoprene, SBR, Natural Rubber |  |
  | Tooling cost quoted upfront, amortised into piece price or credited against committed volume |  |
  | Inspection release data with every despatch lot |  |
  _Bullet 2 lists seven compounds and calls FKM by its trade name Viton while omitting AEM — the one compound with a named OEM behind it. Bullet 3 is an MOQ mention; the replacement is the founder’s own tooling language from the commercial terms and is a stronger offer besides. Bullet 4 is the same non-existent document class as sections 06 and 07_
- **Form fields ×5**: `COMPANY * DESTINATION COUNTRY * EMAIL *
PREFERRED INCOTERM COMPONENT & QUANTITY *`
  _Unchanged. PREFERRED INCOTERM is the best field on any form on this site — it qualifies the buyer’s export literacy in one dropdown and tells the quotation team how to price before anyone picks up the phone_
- **Footnote**: `Response within 48 hours. Your details are used solely for responding to this enquiry.`
  _Timing corrected. The data-use sentence is unchanged and is the only DPDP-appropriate line on any form on the site_
  <details><summary>notes (5)</summary>
  - Add the drawing upload field. The bullet says “Drawings accepted: DXF, DWG, PDF, STEP” and the form has no way to attach one. Same defect as /contact. accept=".dxf,.dwg,.pdf,.step,.stp", 10MB cap, virus scan.
  - Prefill DESTINATION COUNTRY from the market block the buyer arrived at. Someone who read the Australia block and scrolled to the form has already told you where it is going.
  - Labels bound, autocomplete on organization / country-name / email, server-side validation, honeypot. Same rules as the other three forms.
  - Success state and a named conversion event. This is the fifth RFQ entry point on the site and none is tracked. Export enquiries are the highest-value leads Margo can receive and there is no way to count them.
  - Schema. None. ContactPoint lives on the homepage node.
  </details>

## 09 Closing summary [Keep]
> live: LIVE H2 → We Export Worldwide, From Nashik · six-row summary table · accurate, useful, and the best closing block on the site
- **H2**: “Every Shipment,” / “Same Quality System.”  (accent: Same Quality System.)
  _5 words · live is 5 · the live H2 repeats the page’s own H1, which wastes the closing heading_
- **Body**:
  > Every shipment leaves our Nashik plant under the same ISO 9001:2015 quality system, regardless of destination. Incoterm, freight mode and documentation are agreed per order.
  _Unchanged — 26 words, accurate, and it says the one thing a first-time export buyer needs to hear_
- **Summary rows ×6** (Row | Value | Change):
  | Certified Standard | ISO 9001:2015 | Unchanged |
  | Export Port | Nhava Sheva (JNPT), Mumbai · 185 km, 3 h 20 by road | Distance and drive time added — sourced, and it answers the next question |
  | Incoterms Available | FOB · CIF · EXW · DAP | Unchanged |
  | Freight Modes | FCL · LCL · Air Freight | Unchanged |
  | Payment Terms | T/T in advance · L/C · D/P by agreement | Unchanged — and rare. Almost no supplier site publishes payment terms |
  | Countries Served | AU · GB · AE · SA · MY · US · SG · KE · TZ · +86 MORE |  |
  _Codes reordered to the activation sequence, UK corrected to the ISO code GB, and +86 MORE carries the 95 total (95 − 9 = 86). Same format as the /industries hero stat. On the buyer-facing build the row label reads Markets Mapped_
  <details><summary>notes (4)</summary>
  - This six-row table is the page’s summary passage and the block most likely to be lifted whole. Port, Incoterms, freight modes and payment terms in one structured table answers four buyer questions in one extraction.
  - Markup. <dl> as live, or a <table> with <caption>. Either is extractable; a div grid is not.
  - Country codes must be ISO 3166-1 alpha-2. UK is not one; GB is. It matters because areaServed in the schema uses ISO codes and prose and schema should not disagree.
  - Heading. Do not repeat the H1 in the closing <h2>. Two identical headings on one page split the signal and waste the second.
  </details>

## 10 Footer [Rewrite]
> live: LIVE → 50+ countries, © 2024, and the wrong legal entity · Products column shows 9 of 11 categories · /export appears nowhere
- **Wordmark**: `MARGO
RUBBER PRODUCTS`
- **Description**:
  > ISO 9001:2015 certified manufacturer of precision moulded and extruded rubber components in Nashik, India. Sealing and anti-vibration parts to customer drawing, supplied to OEMs and distributors in 95 countries.
  _29 words · live is 26 · opens with the entity definition, since the footer repeats on all 40 pages_
- **NAP block**: `+91 96655 79276
info@margorubber.in
SRNO. 4494/10, behind Furniture Stop,
opposite Samarth Dies, Vilholi,
Nashik, Maharashtra 422010, India`
  _Client-confirmed 2026-09-01 — this exact string, on all 40 pages, in the PostalAddress node and on the Google Business Profile. The landmarks are part of the address and stay in; B-12, MIDC Ambad is wrong and comes off the site. The company name is not repeated inside the address line — the wordmark above it already carries it_
- **Column 1 — Products**: `SEALING
O-Rings · Oil Seals · Gaskets · Diaphragms · Reciprocating Seals · Leak Test Rubber
MOUNTING & PROTECTION
Anti-Vibration Mounts · Bushes & Bushings · Bonded Components · Bellows · Grommets · Pads, Stoppers & Caps
SHEET & PROFILE
Extrusion Profiles · Sponge & Foam Rubber · Rubber Lining & Skirting`
  _15 entries in three groups, up from 11. Adds Diaphragms, Bonded Components, Rubber Lining & Skirting and Reciprocating Seals (sheets 36–39), plus /products/extrusion and /products/sponge-foam-rubber, which had no sitewide inbound link at all. The column was designed for eleven and fifteen flat is not readable, so it is grouped — Sealing (6), Mounting & protection (6), Sheet & profile (3). The third group is also the commercial split: those three are quoted by length or area rather than by piece count, per sheets 18, 38 and 40. “Seals” is labelled “Reciprocating Seals” so it is not read as a parent of O-Rings and Oil Seals — sheet 39 §02 explains why. Group labels are <p> or <div>, never headings — three more phantom sections is not an improvement on one_
- **Column 2 — Industries**: `Automotive · Mining · Oil & Gas · Pumps & Valves · HVAC ·
Electrical & Electronics · Agriculture · Medical Devices ·
Water & Fluid Management · Construction · Transport — Rail & Marine`
  _11 entries, up from 9 — adds Construction (sheet 41) and Transport — Rail & Marine (sheet 42), the first two of the six “additional sectors” on sheet 05 to earn a URL. Automotive still leads, matching real volume. 🛑 The live footer’s four industry links all resolve to the same /industries/ The full twenty-six-row footer link map is in sheet 01_Homepage.html, footer section — fifteen product links and eleven industry links, with the three label/slug mismatches called out. — adding two entries to a column whose links are broken makes eleven broken links, so fix the routing in this same commit_
- **Column 3 — Company**: `About Us · Certifications · Export Markets · Case Studies ·
Resources · Contact Us`
  _6 entries · Export Markets is new and fixes the orphaned /export page · Why Choose Us comes out — that page is recommended for deletion, its job is done better by /certifications and /export_
- **CTA lines**: `Ready to source precision rubber components?
Quotation from our engineering team within 48 hours.
[ Request Quote → ]`
  _“within 24 hours” becomes 48 hours. The footer CTA is the fastest of the six response times published on this site, and it contradicts the page body on /contact, /industries and /export. One constant, rendered everywhere_
- **Legal line**: `© 2026 Margo Rubber Products. All rights reserved.
Privacy Policy · Terms & Conditions · Disclaimer
ISO 9001:2015 · Certificate 09111526A · Integral Certification Ltd`
  _Fixes © 2024 and Margo Rubber Industries Pvt. Ltd. — GSTIN 27AAKFM8595Q1Z1 embeds PAN AAKFM8595Q, whose 4th character F denotes a firm, not a company. Pvt. Ltd. is positively excluded. The ISO line gains the certificate number and the issuer, which makes it checkable on all 40 pages instead of decorative_
  <details><summary>notes (9)</summary>
  - The footer fix is what un-orphans this page. Adding Export Markets to the Company column gives /export a sitewide inbound link from all 40 pages, where today there are zero. Nothing else on this sheet matters until that link exists.
  - Response-time conflict again. This page body says 3 business days; the footer CTA says 24 hours — the two values are 6× apart on one screen. Both become 48 hours.
  - The country count. The live footer says “50+ countries” while this page details nine markets in depth; the footer figure is the eighth distinct market count on the site. The replacement reads 95, matching the research and every other page in this set.
  - Build once, ships forty times. This is one component. The copy above is written out in full on every sheet in this set so nobody has to open two files to build one block, but it is authored once in the codebase.
  - Heading levels. The column labels (PRODUCTS / INDUSTRIES / COMPANY) are <h2> in the live build. As visible <h2>s they inject three phantom sections into every document outline on the site. Change to <p class="col-label">.
  - Link equity. 26 sitewide links from here. Adding /export, /products/extrusion and /products/sponge-foam-rubber gives three orphaned or under-linked URLs a sitewide inbound link each — the cheapest internal-linking win available on this site.
  - NAP markup. Wrap in <address>. Phone as <a href="tel:+919665579276">, email as <a href="mailto:info@margorubber.in">. The visible string and the href must not diverge.
  - Schema. The footer emits nothing. The Organization node on the homepage is the single entity definition and every other page @id-references it. Repeating an Organization block per page creates 40 competing entities.
  - Copyright year. Render from new Date().getFullYear(), not a literal. It has read 2024 for eight months.
  </details>