# 36_Product_Diaphragms.html — Diaphragms Page Content Sheet

**<title>** Rubber Diaphragm Manufacturer India | Pump & Valve Diaphragms | Margo
**description** Moulded and fabric-reinforced rubber diaphragms for metering pumps, valves and sprayers — made to your effective diameter, stroke and working pressure in Nashik, India. Compound chosen for the medium. ISO 9001:2015.

## 01 Hero [New]
> live: NO LIVE SECTION → build from the /products/bellows hero component · eyebrow, H1, subhead, three spec chips, CTA slot
- **Eyebrow**: `01 · DIAPHRAGMS`
  _Matches the numbered eyebrow pattern used on all eleven category pages_
- **H1 — 2 lines**: “Rubber Diaphragms,” / “Moulded to Your Stroke and Pressure.”  (accent: Moulded to Your Stroke and Pressure.)
  _8 words · the two variables that decide a diaphragm are named in the H1. A buyer scanning eleven supplier pages is looking for the one that talks about their specification rather than their industry_
- **Subhead**:
  > Flat, rolling and convoluted diaphragms for metering pumps, valves, regulators and sprayers — plain or fabric-reinforced, moulded to your drawing at our ISO 9001:2015 plant in Nashik. The diaphragm sits in the medium on every stroke, so we choose the compound from what you are pumping, not from a default.
  _48 words · the last clause is the page’s editorial spine and it appears again in section 04. The compound-default bug runs the length of this site — silicone pre-selected on all three gaskets pages, FKM on all six oil-seal pages, EPDM on the oil filler cap. On a diaphragm it is the most expensive version of that mistake, because the medium is the whole specification_
- **Spec chips ×3** (Chip | Why this one):
  | ISO 9001:2015 | Same first chip as every category page. The only certification held |
  | 8 COMPOUNDS IN-HOUSE | Compounding is Margo’s real differentiator and it is what lets the medium drive the choice |
  | FABRIC-REINFORCED | The capability that separates a diaphragm supplier from a moulder. A buyer with a pressure application scans for this word |
  _No MOQ chip and no country count. The contact page carried both and both came off — a piece count above the fold is the standing instruction, and the country figure is the roadmap claim that lives on the vision build only_
- **CTA slot**: `[ Send your diaphragm drawing → /contact?part=Diaphragms ]`
  _The hero CTA slot renders empty on several category pages because nothing is passed to it. Populate it here. The query string pre-fills the part field on the RFQ form — and /contact?part=… must canonical to /contact_
  <details><summary>notes (4)</summary>
  - Heading. The page’s only <h1>, two <span class="block"> children. Do not stack bare JSX spans — that is the sitewide H1 whitespace bug and it renders as Rubber DiaphragmsMoulded to Your Stroke.
  - Chips are <li> in a <ul>, not headings, set uppercase in CSS rather than typed in caps.
  - Image alt, if a hero image is added: “Fabric-reinforced rubber diaphragms moulded at Margo Rubber Products, Nashik”.
  - Breadcrumb renders above the H1 and emits the BreadcrumbList above.
  </details>

## 02 Diaphragm types [New]
> live: NO LIVE SECTION → card grid, four cards, from the /products/pads-stoppers-caps component
- **Eyebrow**: `02 · TYPES`
- **H2**: “Four Shapes, Chosen by Stroke”
  _5 words · the heading states the selection criterion instead of labelling the section “Our Range”. Stroke is what decides the shape, and saying so in the heading answers the question before the cards do_
- **Intro**:
  > The shape follows the stroke. A short stroke can run on a flat diaphragm; a long one needs the sidewall to roll or the convolution to unfold, or the rubber works in tension and tears at the clamp.
  _38 words · the failure mode is named in the intro because it is the mistake buyers actually make — specifying a flat diaphragm for a stroke that needs a rolling one_
- **Cards ×4** (Card | Body | Typical use):
  | Flat diaphragm | A clamped disc, plain or with a moulded-in plate. Simplest to tool and the lowest cost per piece. Stroke is limited to roughly a tenth of the effective diameter before the rubber starts working in tension. | Regulators, pressure switches, low-stroke valve actuators |
  | Rolling diaphragm | The sidewall rolls between the piston and the bore instead of stretching, so the effective area stays near constant through the stroke and the force curve is flat. Needs a controlled piston-to-bore gap, which we confirm against your housing drawing. | Metering and dosing pumps, long-stroke actuators, air cylinders |
  | Convoluted diaphragm | One or more moulded convolutions unfold to give stroke without stretching the rubber. Takes more stroke than a flat diaphragm at the same diameter and tolerates a less precise housing than a rolling one. | Diaphragm pumps, sprayer heads, large actuators |
  | Fabric-reinforced diaphragm | Nylon, polyester or aramid fabric bonded into the moulding. The fabric carries the pressure load and holds the effective area stable; the elastomer seals and takes the chemical duty. Any of the three shapes above can be reinforced. | Anything above roughly 3 bar, and any duty where stretch would change the dose |
  _Four cards, and the fourth is a construction rather than a shape — that is deliberate and the card says so in its last sentence. Reinforcement is the question a pressure application turns on, and burying it inside the other three would hide the capability that wins the enquiry. Section 05 covers it properly.
No card carries a pressure rating. A rating belongs to a part — its diameter, its ply count, its clamp — not to a shape. Publishing a generic one is the same class of claim as the bellows cycle counts_
  <details><summary>notes (3)</summary>
  - Card titles are <h3> under the section <h2>. Four real subheadings, and each is a term buyers search: rolling diaphragm, convoluted diaphragm and fabric-reinforced diaphragm are all distinct queries.
  - All four cards in the DOM at first paint. If this grid is built as a filter or a carousel, every card is hidden with CSS, never conditionally rendered.
  - Internal links on the application names, not on “read more”: metering and dosing pumps → /industries/pumps-valves, sprayer heads → /industries/agriculture.
  </details>

## 03 Specification reference [New]
> live: NO LIVE SECTION → spec table, from the /products/bellows component · row labels change, column count does not
- **Eyebrow**: `03 · SPECIFICATION`
- **H2**: “What We Need to Quote”
  _5 words · the heading is an instruction, not a label. Every other category page heads this block “Specification reference”, which describes the table rather than telling the reader what to do with it_
- **Spec table** (Input | Range | Why we ask):
  | Effective diameter | Ø20 mm – Ø400 mm | Set by tooling, not by the compound. Larger is quotable against the part |
  | Stroke | to drawing | Decides the shape — flat, rolling or convoluted |
  | Working pressure | to drawing | Decides ply count and whether reinforcement is needed at all |
  | Medium | named fluid | Decides the compound. This is the input most enquiries leave out |
  | Service temperature | −60 to +250 °C
across the eight compounds | Narrows the compound with the medium |
  | Cycle rate | strokes/min | A dosing pump at 200 strokes a minute and a regulator that moves twice a day are different parts |
  | Mounting | clamped rim · bead · bolt circle | The clamp is where diaphragms fail. Send the housing detail |
  | Insert | steel · stainless · brass · none | If a plate or stem is moulded in, we need its material and finish |
  | Hardness | 40 – 80 Shore A | Our output, not your input — recommended against the duty unless your drawing fixes it |
  | Dimensional tolerance | ISO 3302-1 class M1 | Tolerance follows the section, as on every moulded part in this catalogue |
  _Ten rows, and the hardness row deliberately inverts the usual direction. Most supplier pages ask the buyer to state a hardness. On a diaphragm that is the wrong question — hardness follows from the stroke, the pressure and the compound, so making it an output rather than an input is both more useful and more credible. The same line appears on the bushes and grommets sheets.
The diameter range is a tooling limit and the table says so, which stops it reading as a material constraint. Publishing a different diameter range per compound would imply a limit that does not exist_
- **Footnote**:
  > Send a drawing in PDF, DWG, DXF or STEP — or send the diaphragm you are replacing and tell us how it failed. A hardened, cracked diaphragm means heat; a swollen one that has lost its shape means the wrong compound for the medium; a split at the clamp line means the stroke or the housing, not the rubber.
  _58 words · this is the highest-value paragraph on the page. It converts a buyer who has a failed part and no drawing, which is most of them, and it demonstrates diagnostic competence in three clauses without claiming anything untestable. The same failure-mode framing appears on the oil-seals sheets and it is the most-copied paragraph in this set_
  <details><summary>notes (3)</summary>
  - A real <table> with <th scope="col">. This is the block most likely to be lifted into an AI answer, and a div grid is not extractable.
  - Wrap it in overflow-x:auto so a ten-row table does not scroll the page body sideways at 375px.
  - Do not mark the row labels as headings. They are <th scope="row">, not <h3> — the stat-values-as-headings bug is sitewide and it injects phantom sections into every outline.
  </details>

## 04 Compound selection [New]
> live: NO LIVE SECTION → build as a router from medium to compound, the way sheet 10 rebuilt the oil-seals selector — not as a menu of equals
- **Eyebrow**: `04 · COMPOUND`
- **H2**: “Tell Us the Medium. The Compound Follows.”
  _7 words · states the routing rule as the heading. On a wetted part nothing is pre-selected until the fluid is known, and the heading is where that rule is cheapest to enforce_
- **Intro**:
  > A diaphragm is submerged in the medium on every stroke, so the compound is not a preference — it is the part. EPDM is right for water, dosing chemicals and brake fluid, and it swells until the diaphragm loses its shape in oil, fuel or grease. Every compound we mix is available on every part. These are ranked for a diaphragm.
  _62 words · the last two sentences carry the client instruction of 2026-09-02 — Margo produces every part in every compound it mixes, so nothing is removed from the list, only ranked. Saying “ranked” rather than “available” is what makes an eight-row table useful instead of a menu_
- **Compound router** (If the medium is | Compound | Service temperature | Note):
  | Water, coolant, steam, dosing chemicals, dilute acids and alkalis, brake fluid | EPDM | −40 to +140 °C | The default for water treatment and dosing. Never in oil, fuel or grease |
  | Mineral oil, fuel, hydraulic fluid, grease | NBR | −30 to +120 °C | The default for oil duty and the lowest cost of the oil-capable compounds |
  | Solvents, aggressive chemistry, hot hydrocarbons | FKM | −20 to +250 °C
continuous to +200 °C | The escalation when NBR is out of range. Poor in the cold and it fails in steam and glycol brake fluid |
  | Hot oil and oil mist above nitrile’s ceiling | AEM | −40 to +175 °C
continuous to +160 °C | The middle answer between NBR and FKM, at well under FKM cost. Absent from almost every competitor’s menu |
  | Refrigerants, moderate oil, outdoor and marine | Neoprene | −40 to +120 °C | General purpose with flame-retardant grades available |
  | Large low-pressure diaphragms, high stroke, air or water | Natural rubber | −20 to +90 °C | The best flex-fatigue resistance of the eight. No oil contact |
  | Abrasive slurry, low cost, water | SBR | −30 to +100 °C | Abrasion resistance at commodity cost. No oil contact |
  | Clean, high-temperature, low-pressure duty | Silicone | −60 to +220 °C | 🛑 Widest temperature range and the weakest diaphragm. Low tear strength and poor flex fatigue — specify it only where temperature genuinely forces it, and expect a shorter life |
  _Every range is the homepage compound table, which governs across all twelve category pages. FKM and AEM carry the continuous figure beneath the peak, settled on the homepage sheet 2026-09-03.
The silicone row is the one that earns trust. Silicone has the widest temperature range in the table, so an unranked selector puts it at the top and a buyer takes it — onto a flexing part, where low tear strength and poor flex fatigue make it close to the worst choice available. Saying so on our own product page is the single most credible sentence here. It is also the correction the site needs most: silicone is pre-selected as the default on all three gaskets pages today.
Natural rubber is ranked sixth and flagged best-in-class in the same table, which is the honest shape — it is the best flexing compound and it is useless the moment oil is present_
- **Closing line**:
  > Not sure which applies? Send the fluid, the temperature and the pressure and we will recommend the compound with the datasheet, before you commit to a drawing.
  _27 words · a second, lower-commitment conversion path for a buyer who is still specifying. This is the enquiry a competitor with a catalogue cannot answer_
  <details><summary>notes (4)</summary>
  - If this is built as an accordion or tab set, every panel is in the DOM at first paint, hidden with CSS. On /products the same component hides seven of eight compound descriptions from crawlers — it is the highest content cost of any defect in this build.
  - Compound names are <th scope="row"> or <strong>, not headings.
  - Link the compound names once each to the compound anchors on /products. Eight links, each with a real term as its anchor text.
  - This table answers “what material is a pump diaphragm made of” — a high-volume question with a routed, sourced answer. Keep it as one table so it can be lifted whole.
  </details>

## 05 Reinforcement and construction [New]
> live: NO LIVE SECTION → accordion, three panels, from the /products/bellows material accordion
- **Eyebrow**: `05 · CONSTRUCTION`
- **H2**: “What Carries the Pressure”
  _4 words · names the function of the section. On a reinforced diaphragm the fabric carries the load and the rubber seals, and most buyers do not know that_
- **Panel 1 — Fabric reinforcement**:
  > Above roughly 3 bar, or wherever a stretching diaphragm would change the dose, the rubber alone is not the structure. We bond nylon, polyester or aramid fabric into the moulding: the fabric takes the pressure load and holds the effective area constant through the stroke, and the elastomer seals and carries the chemical duty. Ply count, weave and orientation follow your pressure and stroke — send both and we will specify them.
  _72 words · this is the capability that separates a diaphragm supplier from a moulder, and it is a real Margo capability: rubber-to-fabric and rubber-to-metal bonding is done in-house at Nashik, client-confirmed. No pressure rating is published — the 3 bar figure is stated as the point where reinforcement enters the conversation, not as a limit of any part_
- **Panel 2 — Moulded-in inserts**:
  > Where the diaphragm drives a stem or seats against a plate, the metal is moulded in rather than assembled after. The bond is made during cure, so there is no adhesive joint to fail and no stack of tolerances between two parts. Send the insert material and its finish — steel, stainless and brass all bond, and the surface preparation differs for each.
  _63 words · rubber-to-metal bonding appears nowhere on margorubber.in today despite being an in-house capability. It has its own guide at /resources/rubber-to-metal-bonded-parts-guide — link the phrase moulded in to it. This panel and that guide are the two places the capability finally surfaces_
- **Panel 3 — Plain moulded**:
  > Below the pressure where reinforcement earns its cost, a plain moulded diaphragm is lighter, more flexible and cheaper to tool. Most regulator and pressure-switch diaphragms are plain. We will tell you which side of that line your part sits on when we see the pressure and the diameter.
  _48 words · the panel that talks a buyer out of the more expensive construction. Three panels where the third recommends the cheapest option reads as engineering rather than selling, and it is true_
- **Closing note**:
  > Tooling is cut in-house. A new diaphragm tool runs alongside the compound trial, so first samples come back in 48 to 72 hours from an approved drawing.
  _27 words · in-house toolroom is the differentiator that shortens the loop, and 48–72 hours for a prototype is the figure used on every other page in this set_
  <details><summary>notes (3)</summary>
  - Three accordion panels, all three in the DOM at first paint. Panel headings are <h3>. Fabric-reinforced diaphragm is a searched term and it must be a real heading, not a button label injected by script.
  - Two internal links out, on moulded in → /products/bonded-components (written 2026-09-03, sheet 37) and a secondary link to /resources/rubber-to-metal-bonded-parts-guide. The category page is the primary destination now that it exists; the guide is the supporting read.
  - No load or burst-pressure table. A rating is a property of a part, not of a construction — the same rule the bonded-parts guide applies to bond area.
  </details>

## 06 Tolerances, testing and what ships [New]
> live: NO LIVE SECTION → quality block, from the /products/gaskets component
- **Eyebrow**: `06 · QUALITY`
- **H2**: “Tested Before It Ships”
  _4 words · a claim the test list underneath actually supports, which is the whole point of the section_
- **Test table** (Property | Method | Where):
  | Hardness | ASTM D2240 | In-house |
  | Tensile and elongation | ASTM D412 | In-house |
  | Compression set | ASTM D395 Method B | In-house |
  | Tear strength | ASTM D624 | NABL partner laboratory |
  | Fluid immersion / volume swell | ASTM D471 | NABL partner laboratory |
  | Ozone resistance | ISO 1431-1 | NABL partner laboratory |
  | Dimensional conformity | ISO 3302-1 class M1 | In-house |
  | Pressure-cycle life | ISO 132 · ASTM D430 · ASTM D813 | not held |
  _The struck row is the point of the table. Dynamic fatigue is the test a diaphragm buyer cares about most and Margo does not have the rig — not in-house and not at the partner laboratory. Listing it as not held, next to seven tests that are, is worth more than quietly omitting it: a procurement engineer reading a test list checks for the gap, and finding it declared is the difference between a supplier who measured and a supplier who guessed.
Tear strength is on the list deliberately. It is the property that governs diaphragm life at the clamp, and it is the one that disqualifies silicone in section 04_
- **Ships with every consignment**:
  > Material test reports, dimensional inspection sheets and a certificate of conformance ship with every consignment. Batch records are retained per shipment and are available on request under NDA. Diaphragms are packed flat and unloaded, so the sealing bead is not set before installation.
  _44 words · the first sentence is the standard string used on all 31 SKU pages — do not reword it. The packing sentence is part-specific, the way the oil-seal sheets add the sealing-lip note and the pad sheets add “ship flat and unloaded”_
  <details><summary>notes (3)</summary>
  - Every standard number is plain text in a table cell, not an image and not inside a tooltip. These are the strings an AI assistant matches when asked whether a supplier tests to ASTM D412.
  - The struck row ships as a real row with a visible “not held” value — not deleted, and not styled so faintly it fails contrast.
  - No Certification schema for the test methods. A test method is not a credential.
  </details>

## 07 Certification [Shared]
> live: SHARED COMPONENT → identical on all twelve category pages · do not retype it, do not add to it
- **Certification block**: `ISO 9001:2015 · Certificate 09111526A
Integral Certification Ltd · Valid to 21 February 2027
Scope: rubber moulded components — quality management, not a product approval
IATF 16949 — upgrade in progress, certification targeted by end 2026
ISO 14001 and ISO 45001 — targeted 2027`
  _The exact string used across the set, client-instructed 2026-08-31 and 2026-09-01. Nothing is added on this page. Diaphragms attract three approvals Margo does not hold and must never imply: food contact (FDA 21 CFR 177.2600), pharmaceutical (USP Class VI) and potable water (WRAS, NSF/ANSI/CAN 61, AS/NZS 4020, KTW-BWGL). Potable-water approval attaches to a specific compound formulation held by the compound supplier, never to “EPDM” and never to Margo.
Only the ISO 9001:2015 row goes into hasCredential, and only on the homepage Organization node. No in-progress row is emitted as structured data in any form_
  <details><summary>notes (2)</summary>
  - The certificate PDF link is shared and currently dead across nine industry pages and eleven category pages. This page must not add a twelfth dead download — either the hosted scan exists at build time or the button does not render.
  - Scope line is not optional. “Rubber moulded components” is what the certificate covers, and a diaphragm with a moulded-in metal insert is within it.
  </details>

## 08 Technical & commercial questions [New]
> live: NO LIVE SECTION → FAQ accordion, six questions, from the /products/bellows component · these six are the FAQPage mainEntity, verbatim
- **Q1** (composite):
  · H: “What is the minimum order quantity for diaphragms?”
  · We supply in bulk. The minimum run is 10,000 pieces per part number, per compound, or quoted against the part where geometry or tooling makes that unrealistic. Prototype and first-article lots sit outside the minimum.
  _36 words · client-instructed 2026-09-01, the standard answer used across the set. Do not reword it and do not add a second number — the live site states an MOQ about ninety times, including twice in one FAQ answer in two different figures_
- **Q2** (composite):
  · H: “How long will the diaphragm last?”
  · We do not publish a cycle figure, because we do not own a fatigue rig and a number without a test behind it is worthless to you. What we will do is qualify against your duty: give us the stroke, the working pressure and the target cycle life, and we will propose a compound and construction, run samples, and have them tested at a named laboratory to ISO 132, ASTM D430 or ASTM D813 — with the report in your name.
  _78 words · the most important answer on the page. Cycle life is the first thing a pump engineer asks and the easiest claim to fabricate; the bellows page had four invented cycle ratings removed for exactly this reason. Refusing the number and offering the test is a stronger commercial position than a published figure, because a published figure is read as a warranty and this offer is read as competence. It is also the only honest answer available_
- **Q3** (composite):
  · H: “Can you reverse-engineer a diaphragm from a failed sample?”
  · Yes. Send the old diaphragm and tell us how it failed. We size from the housing and the stroke rather than from the worn part, and the failure tells us what to change — hardened and cracked means heat, swollen and distorted means the wrong compound for the medium, split at the clamp line means the stroke or the housing rather than the rubber.
  _64 words · the same diagnostic framing as section 03, which is deliberate: a buyer who skips to the FAQ gets the same answer as one who reads the page_
- **Q4** (composite):
  · H: “Do you supply fabric-reinforced diaphragms?”
  · Yes. Nylon, polyester and aramid are all bonded in-house during cure, with ply count and orientation specified against your pressure and stroke. Metal inserts — steel, stainless or brass — are moulded in the same way, so there is no adhesive joint to fail.
  _45 words · answers the qualifying question a pressure application turns on, and surfaces the bonding capability that appears nowhere else on the site_
- **Q5** (composite):
  · H: “Are your diaphragms approved for drinking water or food contact?”
  · No, and we will not imply otherwise. Potable-water approval is granted to a specific compound formulation held by the compound supplier, not to a polymer and not to us — the schemes are WRAS to BS 6920 in the UK, NSF/ANSI/CAN 61 in North America, AS/NZS 4020 in Australia and New Zealand, and KTW-BWGL with DVGW W270 in Germany. Tell us which scheme your market requires and we will confirm what we can supply against it. We hold no food-contact or pharmaceutical approvals.
  _82 words · the exact position from sheets 24 and 28, and the reason it belongs on this page specifically: dosing and metering pumps are a water-treatment product, so this is the page where a buyer will assume approval unless told. Answering “no” first and then being useful is what makes the rest of the page credible_
- **Q6** (composite):
  · H: “What are your payment and delivery terms for international orders?”
  · TT and LC accepted, discussed per order. Ex-works Nashik or FOB Nhava Sheva. Commercial invoice, packing list and certificate of origin are issued with every consignment. Production is three to four weeks from drawing approval, or two weeks on an express basis where we have confirmed capacity.
  _48 words · the standard commercial string, unchanged. The lead time matches every other page — 3–4 weeks standard, 2 weeks express. Not 14–21 days, which is the live site’s figure and promises faster than the company delivers_
  <details><summary>notes (3)</summary>
  - All six panels open in the DOM at first paint. An unmounted accordion panel does not exist for a crawler, and FAQPage schema whose answers are not in the HTML is a structured-data mismatch.
  - Questions are <h3>, answers are <p>, and the schema strings match the rendered text exactly — character for character, including the em dashes.
  - Q2 is the extractable answer for this page. It is written to stand alone in an AI response without the surrounding page, and it is the one that will be quoted.
  </details>

## 09 Enquiries [Shared]
> live: SHARED CTA COMPONENT → use the one that renders correctly, not the variant on the four industry pages that prints +91 (Nashik), Contact for number and Contact for email
- **Eyebrow**: `09 · ENQUIRIES`
- **H2**: “Request a Diaphragm Quotation”
  _4 words · “quotation” is the transactional term buyers search and the term used on every other page in this set_
- **Body**:
  > Send your drawing with the effective diameter, stroke and working pressure, or the diaphragm you are replacing with a note of how it failed. Tell us the medium and the cycle rate. Our engineering team responds within 48 hours with a compound recommendation, dimensional confirmation and a quotation.
  _48 words · the three inputs from section 03 repeated at the point of conversion. 48 hours is the sitewide figure — not “two working days”, not “within 24 hours”, both of which appear on the live site_
- **Buttons ×2**: `[ Request a quote → /contact?part=Diaphragms ]
[ ← Back to Products → /products ]`
  _Primary and secondary, the same pair as every category page. A named conversion event fires on submit — this is the sixth RFQ entry point on the site and none of the others is tracked_
  <details><summary>notes (2)</summary>
  - /contact?part=Diaphragms canonicals to /contact. Six parameterised entry points otherwise become six duplicate URLs.
  - The “Diaphragms” option must exist in the contact form’s product dropdown. That dropdown currently lists eleven categories plus “Not sure / other” — adding this page without adding the option sends every diaphragm enquiry to “other”.
  </details>

## 10 Footer [One string, twelve pages]
> live: GLOBAL COMPONENT → the Products column becomes twelve categories, not eleven
- **Products column**: `SEALING
O-Rings · Oil Seals · Gaskets · Diaphragms · Reciprocating Seals · Leak Test Rubber
MOUNTING & PROTECTION
Anti-Vibration Mounts · Bushes & Bushings · Bonded Components · Bellows · Grommets · Pads, Stoppers & Caps
SHEET & PROFILE
Extrusion Profiles · Sponge & Foam Rubber · Rubber Lining & Skirting`
  _The sweep has run. The Products column now ships grouped in all twenty-nine sheets — Sealing (6), Mounting & protection (6), Sheet & profile (3) — because fifteen entries in a column designed for eleven is not readable as a flat list. The third group is also the commercial split: those three are quoted by length or area rather than by piece count. “Seals” ships as “Reciprocating Seals” so it is not read as a parent of O-Rings and Oil Seals. Group labels are <p> or <div>, never headings. The identical eleven-category string currently ships in twenty-nine sheets, so this is one component edit that lands on every page at once — and every one of those sheets now describes a twelve-category footer. Update them together or not at all; a footer that lists eleven on some pages and twelve on others is the class of defect this whole set exists to remove_
- **Legal line**: `© 2026 Margo Rubber Products. All rights reserved. Privacy Policy · Terms & Conditions · Disclaimer ISO 9001:2015 · Certificate 09111526A · Integral Certification Ltd`
  _The identical string used in all twenty-nine sheets. Not © 2024 Margo Rubber Industries Pvt. Ltd., which is what the shared footer renders today on the seven resource-article URLs — wrong legal name, wrong year, and a second address_
  <details><summary>notes (3)</summary>
  - Footer column labels are <p> or <div>, never <h2>/<h3>. As headings they inject three phantom sections into every document outline on the site.
  - Add /products/diaphragms to the products sitemap — sitemap/products/0.xml, which currently carries eleven URLs, and to the URL registry in phase0-route-handlers/lib/site.ts, which is the single source every canonical and JSON-LD block derives from.
  - Add it to the /products hub grid, which shows eleven cards grouped moulded (9) / continuous profile & cellular (2). Diaphragms joins the moulded group, making it ten.
  </details>