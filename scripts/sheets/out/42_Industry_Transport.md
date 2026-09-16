# 42_Industry_Transport.html — Transport — Rail & Marine Page Content Sheet

**<title>** Rail & Marine Rubber Components | Seals, Mounts, Gaskets | Margo
**description** EPDM window and door seals, hatch and porthole gaskets, acoustic foam and vibration mounts for rolling stock builders and shipyards — moulded and extruded to your drawing in Nashik, India. ISO 9001:2015.

## 01 Hero [New]
> live: NO LIVE SECTION → industry hero component
- **Eyebrow**: `01 · TRANSPORT — RAIL & MARINE`
- **H1 — 2 lines**: “Seals and Mounts for the People” / “Who Build Trains and Ships.”  (accent: Who Build Trains and Ships.)
  _11 words · the H1 states the customer, not the sector, and that is the whole positioning of the page in one line. A rail buyer reading “rail seals” assumes an approved railway supplier; “the people who build trains” says sub-supplier without saying anything defensive_
- **Subhead**:
  > Window, door and hatch seals in extruded EPDM, cellular acoustic insulation, gaskets and vibration mounts — made to the builder’s drawing at our ISO 9001:2015 plant in Nashik. We supply rolling stock builders, integrators and shipyards who hold their own approvals and buy components to their own specification.
  _48 words · the second sentence is the most important on the page and it is deliberately in the subhead rather than buried in section 06. It scopes the offer, sets the customer type, and pre-empts the qualification conversation before a buyer has scrolled once_
- **Spec chips ×3** (Chip | Why this one):
  | ISO 9001:2015 | Same first chip as every industry page. The only certification held |
  | BUILT TO YOUR DRAWING | The scoping claim as a chip. This sector buys to a controlled drawing revision, not from a catalogue |
  | EXTRUDED & MOULDED | A door package needs profile and corner mouldings from the same compound |
  _🛑 No approval chip of any kind. Not RDSO, not EN 45545, not a class society, not “marine grade”. This is the page where a credential chip would do the most damage, because it is the sector where a buyer most expects one_
- **CTA slot**: `[ Send your drawing → /contact?industry=Transport ]`
  _The hero CTA slot renders empty on several industry pages because nothing is passed to it. Populate it. /contact?industry=… canonicals to /contact_
  <details><summary>notes (3)</summary>
  - Heading. The page’s only <h1>, two <span class="block"> children — not stacked bare JSX spans.
  - Image alt, if added: “Extruded EPDM window and hatch seals produced at Margo Rubber Products, Nashik”.
  - Chips are <li> in a <ul>, uppercase set in CSS.
  </details>

## 02 What we supply [New]
> live: NO LIVE SECTION → product routing grid, six cards · every card links to a category page
- **Eyebrow**: `02 · PRODUCTS`
- **H2**: “Six Product Lines, One Drawing Package”
  _6 words · rail and marine buyers issue drawing packages rather than part enquiries, and a supplier who can cover six lines from one package is doing something a stockist cannot_
- **Cards ×6** (Product | On a train or a vessel | Links to):
  | Extrusion Profiles | Cab and saloon window seals, door and gangway seals, hatch and porthole packing, glazing sections. Dies cut in-house, so a builder’s section is a drawing rather than a compromise. | /products/extrusion |
  | Sponge & Foam Rubber | Undercarriage and saloon acoustic insulation, door buffers, closed-cell tape, panel and locker seals. | /products/sponge-foam-rubber |
  | Anti-Vibration Mounts | Isolation for auxiliary equipment, HVAC units, generator sets and machinery skids. | /products/anti-vibration-mounts |
  | Gaskets | Flange and body gaskets for on-board pipework, pumps, tanks and seawater services. | /products/gaskets |
  | Grommets | Cable entries, conduit and panel penetrations, bulkhead and floor cable seals. | /products/grommets |
  | Bonded Components | Bonded acoustic and vibration pads where the rubber is vulcanised to a steel plate rather than glued to it. | /products/bonded-components |
  _All six destinations exist. No card routes to /contact — the defect the medical devices, pumps & valves and agriculture sheets all had to correct.
🛑 Deliberately absent: anything in a safety-critical position. No brake seals, no suspension elements, no stern tube or shaft seals, no fire-barrier products. Those are the parts that need the approvals section 06 says are not held, and listing them as products would undo the scoping the hero establishes_
  <details><summary>notes (3)</summary>
  - Card titles are <h3> with the product-page link on the product name.
  - Six internal links out.
  - All six cards in the DOM at first paint.
  </details>

## 03 Applications [New]
> live: NO LIVE SECTION → application card grid, two groups of four · rail and marine are different buyers
- **Eyebrow**: `03 · APPLICATIONS`
- **H2**: “Two Sectors, One Set of Problems”
  _6 words · rail and marine share almost every engineering problem — weather sealing, vibration, acoustics, salt and UV — and almost no purchasing behaviour. The heading acknowledges both_
- **Rail — cards ×4** (Application | Detail | Compound):
  | Cab and saloon window seals | Extruded glazing sections and wedge profiles, with corner mouldings vulcanised to the profile so the joint is not a butt splice on assembly. | EPDM |
  | Door, gangway and vestibule seals | Bubble, fin and P-sections for sliding and plug doors, and inter-car gangway sealing. | EPDM · CR |
  | Undercarriage acoustic foam | Closed-cell insulation for underframe and saloon floor build-ups, cut to the builder’s development. | EPDM · CR |
  | Door buffers and stops | Moulded buffers, end stops and anti-rattle pads. | NR · CR |
- **Marine — cards ×4** (Application | Detail | Compound):
  | Hatch and porthole seals | Extruded and moulded packing sections for hatch covers, portholes and weathertight doors, to the builder’s section drawing. | EPDM · CR |
  | Accommodation and bulkhead seals | Door, locker and panel seals for accommodation and non-class interior positions. | EPDM · CR |
  | Seawater services gasketing | Flange and body gaskets for seawater and ballast pipework, where EPDM handles the water and nitrile handles oil-contaminated bilge duty. | EPDM · NBR |
  | Machinery isolation | Anti-vibration mounts and bonded pads under gensets, pumps and auxiliary skids. | NR · CR |
  _Eight cards, and every one of the four applications sheet 19 names appears — cab window seals, undercarriage acoustic foam, door buffers, hatch and porthole seals. That sector row was the only place this sector has ever been described on the site, and the page it pointed at did not exist.
Neoprene appears in six of the eight, which is right for this sector and unusual across the set. Salt air, moderate oil, ozone and a flame-retardant grade at once is the classic neoprene case, and rail and marine are where all four coincide.
🛑 “Non-class interior positions” in the accommodation card is doing real work. It scopes the marine offer inside a single card, where a buyer is reading rather than in a boundary section they may skip_
  <details><summary>notes (3)</summary>
  - Two <h3> group headings — Rail, Marine — with card titles as <h4>. This is the only section in the set that needs a fourth heading level, and the outline is correct because the two groups are genuinely separate.
  - Anchors #rail and #marine, so the industries hub and any future content can link to the half that applies.
  - All eight cards in the DOM at first paint.
  </details>

## 04 Compound selection [New]
> live: NO LIVE SECTION → router, from the /products/oil-seals compound selector
- **Eyebrow**: `04 · COMPOUND`
- **H2**: “Salt, Sunlight and Twenty Years Outdoors”
  _6 words · the three conditions that decide compound choice in this sector. A vehicle or a vessel is an outdoor structure with a long service life, and that is closer to a facade than to a factory_
- **Intro**:
  > Rolling stock and vessels are outdoor assets with thirty-year lives, washed regularly and exposed continuously. Seals fail by ozone cracking, UV embrittlement and salt attack long before they reach a temperature limit. Every compound we mix is available; these are ranked for transport duty.
  _45 words · same mechanism-first framing as the construction sheet, because the failure mode is the same one. “Washed regularly” is the sector-specific addition — detergent and high-pressure washing is a real ageing input on both trains and ships, and almost nobody mentions it_
- **Compound router** (If the duty is | Compound | Service temperature | Note):
  | External sealing — windows, doors, hatches, gangways | EPDM | −40 to +140 °C | The default for anything exposed. Outstanding ozone, UV and water resistance; tested to ISO 1431-1. Never where oil or fuel is present |
  | Salt air, moderate oil, flame-retardant grades wanted together | Neoprene | −40 to +120 °C | The classic marine and rail compromise, and the reason it appears in six of the eight applications above |
  | Buffers, stops, acoustic and vibration pads | Natural rubber | −20 to +90 °C | Best damping and flex-fatigue of the eight. Protected positions only — poor ozone resistance |
  | Oil, fuel, hydraulic fluid, bilge duty | NBR | −30 to +120 °C | Engine room and oil-contaminated positions. Never on an external seal — nitrile has poor ozone resistance and crazes in sunlight |
  | High-temperature gasketing, exhaust and boiler positions | Silicone | −60 to +220 °C | Where temperature genuinely governs. Low tear strength, so not for a section stretched over a frame |
  | Abrasive water, protected low-cost duty | SBR | −30 to +100 °C | Internal and protected positions only. No exposure, no oil |
  | Aggressive chemistry, fuel systems, hot hydrocarbons | FKM | −20 to +250 °C
continuous to +200 °C | Specify on the medium, not the temperature |
  | Hot oil and oil mist above nitrile’s ceiling | AEM | −40 to +175 °C
continuous to +160 °C | Engine-bay positions. The middle answer between NBR and FKM |
  _Every range is the homepage compound table, which governs across all fifteen category pages. FKM and AEM carry the continuous figure beneath the peak.
Neoprene ranks second here and nowhere else in the set. That is the sixth distinct ranking across the six compound routers written in this run — EPDM-then-medium on diaphragms, natural rubber on bonded components and lining, NBR on seals, EPDM on construction, EPDM-then-neoprene here. Six pages, six orders, ranked on duty rather than on margin
🛑 “Flame-retardant grades” in the neoprene row is a compound property and must never be written as a fire rating. EN 45545-2 classification is a tested result on a specific material — see section 06_
  <details><summary>notes (3)</summary>
  - All eight rows in the DOM at first paint.
  - Link each compound name once to its anchor on /products.
  - This table answers “what rubber is used for train window seals” and “which rubber resists salt water” with a routed answer. Keep it as one table.
  </details>

## 05 Standards and approvals [New]
> live: NO LIVE SECTION → standards table · more rows struck than held, and that is the honest shape
- **H2**: “What We Hold, and What We Do Not”
  _8 words · a heading that promises both halves. On a sector defined by approvals, a standards section that lists only what is held is read as evasion — and a buyer will check_
- **Standards table** (Standard or approval | Covers | Our position):
  | ISO 9001:2015 | Quality management system | Held — certificate 09111526A, valid to 21 February 2027 |
  | ASTM D2000 | Line-callout classification for the compound | We quote against a callout if you have one |
  | ISO 3302-1 | Dimensional tolerances — E1–E3 extruded, M1–M4 moulded | Tolerance follows the section |
  | ISO 1431-1 | Ozone resistance test method | Tested at our NABL partner laboratory |
  | EN 681-1 | Elastomeric seals for water and drainage pipe joints | Supplied |
  | RDSO vendor approval | Eligibility to supply rubber components for Indian Railways projects. Item-specific | Application in process — not yet held, and never to be stated as held until it is granted. See section 06 |
  | EN 45545-2 | Fire behaviour of railway vehicle materials — hazard levels HL1, HL2, HL3 | 🛑 Not held. See section 06 |
  | DNV · Lloyd’s Register · ABS · Bureau Veritas · IRS | Class society type approval for components in a surveyed scope | 🛑 Not held. See section 06 |
  | IMO FTP Code | Fire test procedures for marine materials | 🛑 Not held. See section 06 |
  _Five held, four struck, in one table. That ratio is unusual and it is the truthful one for this sector — and a specifier scanning for RDSO or EN 45545 finds the row, finds the answer, and does not have to enquire to learn it.
The five held rows are not filler. ASTM D2000, ISO 3302-1 and ISO 1431-1 are exactly what a builder’s drawing calls up for a non-safety-critical seal, and they are the standards the work on this page is actually done to.
🛑 If RDSO approval is pursued, the struck row becomes a targeted line in the same form as the IATF statement — in progress, targeted [date], never as held, never as structured data. Do not write it speculatively_
  <details><summary>notes (3)</summary>
  - Every standard number is plain text in a table cell. RDSO approved rubber supplier and EN 45545-2 HL3 rubber are both searched terms, and this page answering them honestly is worth more than not appearing.
  - The four struck rows ship visible, with real values, not below the contrast threshold.
  - 🛑 Only ISO 9001:2015 may appear in hasCredential, and only on the homepage Organization node. Nothing else in this table is a credential Margo holds.
  </details>

## 06 Where we sit in the supply chain [🛑 New · the section that defines the page]
> live: NO LIVE SECTION → prose plus table · this is the section the sector needs and the one a buyer will screenshot
- **H2**: “We Supply the Builder, Not the Railway”
  _7 words · the clearest sentence in the whole content set. It is the page’s entire commercial position, it is true, and it converts a limitation into a defined role. A buyer who reads only this heading has understood the offer correctly_
- **Body**:
  > Rail and marine are approval-gated sectors. Supplying rubber components directly into an Indian Railways project requires RDSO vendor approval for the item; supplying into a classification society’s surveyed scope requires type approval from that society. We hold neither, and we will not imply otherwise. What we do is supply the builders, integrators and shipyards who hold their own approvals and buy components made to their own drawings — which is most of the rubber on a train or a vessel, and all of it in non-safety-critical positions.
  _85 words · the extractable answer for this page. It names both gates, states the position, and immediately reframes it as a defined role rather than an absence. “Which is most of the rubber on a train” is true and it is the sentence that keeps the enquiry alive_
- **Scope table** (We do | We do not):
  | Window, door, gangway, hatch and porthole seals to the builder’s drawing | Anything requiring EN 45545-2 HL1, HL2 or HL3 classification |
  | Acoustic and thermal insulation cut to the builder’s development | Direct supply to Indian Railways or any RDSO-gated item |
  | Gaskets, grommets and vibration mounts for auxiliary and services positions | Components inside a class society’s surveyed hull or machinery scope |
  | Aftermarket and MRO supply for privately operated fleets | Brake, suspension, stern tube or any safety-critical sealing element |
  | Export supply where the OEM holds the approval | Fire-barrier or fire-stopping products of any kind |
  _Five and five, side by side, in one table. Reading down the right column tells a buyer in ten seconds whether to stop, and the left column tells them what is still worth an enquiry. That is a faster qualification than any form
The fourth right-hand row is the one that matters most technically. Brake, suspension and stern tube seals are where a rubber failure is a safety event, and they are exactly the parts a general rubber supplier is most tempted to quote. Naming them removes the temptation from both sides
Seventh boundary section in seven new sheets — and the only one where the boundary is commercial rather than technical. Diaphragms refused cycle life, bonded components refused bond strength, lining refused polyurethane and butyl, seals refused polyurethane, the datasheet refused food contact and a flame rating, construction refused bridge bearings. Here the refusal is about who Margo is allowed to sell to_
  <details><summary>notes (3)</summary>
  - The body paragraph is this page’s extractable answer. Written to stand alone in an AI response to “does Margo Rubber supply Indian Railways”. That the answer is no, stated by us, is the outcome we want — a wrong yes from an assistant costs a qualification cycle.
  - Keep it as one <p>. Splitting it separates the refusal from the reframe, and the reframe is what makes it commercial rather than defeatist.
  - No schema on this section. There is no markup for an absent capability.
  </details>

## 07 Supplier qualification [Shared · 🛑 carries the two dead downloads]
> live: SHARED BLOCK → identical on all industry pages · and on all nine originals both download buttons are dead
- **Certification block**: `ISO 9001:2015 · Certificate 09111526A
Integral Certification Ltd · Valid to 21 February 2027
Scope: rubber moulded components — quality management, not a product approval
IATF 16949 — upgrade in progress, certification targeted by end 2026
ISO 14001 and ISO 45001 — targeted 2027`
  _The exact string used across the set, client-instructed 2026-08-31 and 2026-09-01. Nothing is added.
The phrase “quality management, not a product approval” earns its place on this page more than anywhere else in the set. This is the sector where a buyer is specifically looking for a product approval, and the scope line answers the question before it is asked_
- **Download buttons ×2** (Button | State on the nine original industry pages | On this page):
  | Download ISO Certificate | Wired to nothing — dead on 9 pages | Renders only once the hosted PDF exists |
  | Download Quality Policy | Wired to nothing — dead on 9 pages | Renders only once the document exists |
  _🛑 Eighteen dead downloads today. This page and sheet 41 must not make it twenty-two. The build checklist tracks it as a Gate 3 item blocked on Gate 2 — the ISO certificate scan has never been supplied as a hosted PDF and appears zero times across all thirty-six live pages, despite being the only real credential Margo holds.
On this sector it is the most expensive dead link on the site. A rail or marine buyer opens a supplier-qualification block specifically to download and file the certificate, and finding the button inert is the moment the supplier stops being credible_
  <details><summary>notes (2)</summary>
  - Only ISO 9001:2015 goes into hasCredential, and only on the homepage Organization node.
  - No potable-water, food-contact or fire claim. Marine accommodation work invites all three.
  </details>

## 08 Technical & commercial questions [New]
> live: NO LIVE SECTION → FAQ accordion, six questions · these six are the FAQPage mainEntity, verbatim
- **Q1** (composite):
  · H: “Are you an RDSO-approved vendor?”
  · No. RDSO vendor approval is item-specific and we do not hold it, so we cannot supply rubber components directly into an Indian Railways project. We supply rolling stock builders, integrators and private fleet operators who buy to their own drawings under their own approvals. If your enquiry is for an RDSO-gated item, we will tell you at enquiry rather than at qualification.
  _64 words · the first question on the page, because it is the first question in the buyer’s head. Answering it before anything else is what makes the other five credible. The last clause is the commercial argument — a supplier who declines early is a supplier worth keeping on file_
- **Q2** (composite):
  · H: “Can you supply material classified to EN 45545-2?”
  · Not as classified material. EN 45545-2 hazard levels — HL1, HL2 and HL3 — are tested classifications covering flame spread, ignitability, heat release, smoke opacity and toxicity, awarded on a specific material by a testing house. We hold no classification. We do supply flame-retardant neoprene grades where a specification asks for a compound property, and we will arrange third-party testing on request. We will not describe a flame-retardant compound as EN 45545 compliant.
  _75 words · the same structure as the construction sheet’s fire answer and deliberately so — two industry pages giving the same answer to the same class of question in the same voice is a house position. Naming the five tested parameters shows the refusal is informed rather than reflexive_
- **Q3** (composite):
  · H: “Do you have class society type approval for marine components?”
  · No — not from DNV, Lloyd’s Register, ABS, Bureau Veritas, ClassNK or the Indian Register of Shipping. Components inside a surveyed hull or machinery scope need type approval from the vessel’s society and we hold none. We supply shipyards and marine equipment builders for accommodation, interior and auxiliary positions outside that scope, made to their drawing.
  _57 words · names all six societies rather than saying “class approval”, because a buyer searches the society name. A named absence is checkable; a vague one reads as evasion_
- **Q4** (composite):
  · H: “Which rubber lasts longest on an external vehicle seal?”
  · EPDM. Rolling stock and vessels are outdoor assets with thirty-year lives, washed regularly and exposed continuously, and seals fail by ozone cracking and UV embrittlement rather than by reaching a temperature limit. Neoprene is the answer where salt air, some oil and a flame-retardant grade are wanted together. Nitrile is the common cheap substitute on external positions and it crazes within a season in sunlight.
  _66 words · the technical answer that earns the page its keep, and it is the same mechanism the construction sheet explains for facades. The nitrile warning appears on both pages because the mistake is made on both sectors_
- **Q5** (composite):
  · H: “Can you make a non-standard section for our door or hatch?”
  · Yes — that is most of what we do on this sector. Dies are cut in-house, so a section drawn for your vehicle is a drawing rather than a compromise, and corner mouldings can be vulcanised to the profile so the joint is not a butt splice on assembly. Send the section drawing and the annual metreage and we will quote the die with it.
  _65 words · the qualifying answer for a builder, and the vulcanised-corner detail is what separates a component maker from a stockist on both this sector and construction_
- **Q6** (composite):
  · H: “What is the minimum order for a build programme?”
  · We deal in bulk, and this sector buys both ways on one purchase order. Extruded profile is quoted per section against total length; moulded components carry the standard minimum of 10,000 pieces per part number, per compound, or are quoted against the part where tooling makes that unrealistic. Send the drawing package with the build quantity and we will price it as a package.
  _64 words · the bulk position adapted to a sector that buys metres and pieces together, matching sheets 18, 38 and 41. “Price it as a package” is the right commercial answer for a builder issuing a drawing set rather than a part enquiry_
  <details><summary>notes (3)</summary>
  - All six panels in the DOM at first paint.
  - Q1, Q2 and Q3 are the extractable answers and all three are refusals. That is correct for this sector — the highest-value thing an assistant can say about Margo and rail is the accurate thing.
  - Questions are <h3>, answers are <p>, and the schema strings match the rendered text character for character.
  </details>

## 09 Enquiries [Shared · 🛑 use the working variant]
> live: SHARED CTA COMPONENT → not the variant on HVAC, electrical, agriculture and water that prints +91 (Nashik) and Contact for number
- **Eyebrow**: `09 · ENQUIRIES`
- **H2**: “Send Us the Drawing Package”
  _5 words · names the unit this sector actually enquires in. Every other industry page asks for a part; a builder issues a package, and asking for the right thing is a qualification signal in itself_
- **Body**:
  > Send the section and moulding drawings with the build quantity, and tell us which positions are inside your approval scope and which are not — that answer shapes what we can quote. Our engineering team responds within 48 hours with a compound recommendation, dimensional confirmation and a quotation.
  _48 words · asking which positions sit inside the buyer’s approval scope is the single best qualifying question on this page. It is a question only a supplier who understands the gate would ask, and the answer tells us immediately whether the enquiry is winnable. 48 hours is the sitewide figure_
- **Buttons ×2**: `[ Request a quote → /contact?industry=Transport ]
[ ← All Industries → /industries ]`
  _Primary and secondary, the same pair as every industry page. 🛑 The contact panel must render the real values — info@margorubber.in and +91 96655 79276_
  <details><summary>notes (3)</summary>
  - /contact?industry=Transport canonicals to /contact.
  - Add a “Transport — rail & marine” option to the contact form’s industry dropdown, which currently lists nine industries plus “Other”. With construction it becomes eleven.
  - A named conversion event fires on submit.
  </details>

## 10 Footer [🛑 Both columns are now final — run the sweep]
> live: GLOBAL COMPONENT → eleventh industry · this is the last page in the run of seven
- **Industries column**: `Automotive · Mining · Oil & Gas · Pumps & Valves · HVAC · Electrical & Electronics · Agriculture · Medical Devices · Water & Fluid Management · Construction · Transport — Rail & Marine`
  _Eleventh entry, and the last. Nine industries ship in twenty-nine sheets today; construction made it ten and this makes it eleven_
- **Products column**: `SEALING
O-Rings · Oil Seals · Gaskets · Diaphragms · Reciprocating Seals · Leak Test Rubber
MOUNTING & PROTECTION
Anti-Vibration Mounts · Bushes & Bushings · Bonded Components · Bellows · Grommets · Pads, Stoppers & Caps
SHEET & PROFILE
Extrusion Profiles · Sponge & Foam Rubber · Rubber Lining & Skirting`
  _The sweep has run. The Products column now ships grouped in all twenty-nine sheets — Sealing (6), Mounting & protection (6), Sheet & profile (3) — because fifteen entries in a column designed for eleven is not readable as a flat list. The third group is also the commercial split: those three are quoted by length or area rather than by piece count. “Seals” ships as “Reciprocating Seals” so it is not read as a parent of O-Rings and Oil Seals. Group labels are <p> or <div>, never headings. Unchanged at fifteen, and final. Diaphragms, bonded components, rubber lining and seals were added across sheets 36–39; nothing after that moved it_
- **🛑 The single sweep, now due** (Item | Detail):
  | Products column | 11 → 15. Do not ship fifteen as a flat list — the column was designed for eleven. Group it: Sealing / Vibration & mounting / Sheet & profile. That repeats the taxonomy sheet 39 section 02 establishes and turns the footer into something that teaches the catalogue |
  | Industries column | 9 → 11 |
  | 🛑 Routing | The live footer’s four industry links all resolve to the same /industries/ The full twenty-six-row footer link map is in sheet 01_Homepage.html, footer section — fifteen product links and eleven industry links, with the three label/slug mismatches called out., recorded in the build checklist. Adding two entries to a broken column makes eleven broken links. Fix the routing in the same commit |
  | Scope | Twenty-nine sheets carry the identical footer strings. One edit, one commit, all pages — which is why it was deliberately deferred through all seven new pages rather than run four times |
  _This deferral was a decision, not an oversight. Sweeping the footer after each of sheets 36, 37, 38 and 39 would have meant four passes over twenty-nine files — four chances to leave the set inconsistent, which is the exact defect this content set was commissioned to remove. Both columns are now final and the sweep runs once_
  <details><summary>notes (4)</summary>
  - Footer column labels are <p> or <div>, never headings — and if the Products column is grouped, the group labels follow the same rule. Three more phantom sections is not an improvement on one.
  - Add /industries/transport to sitemap.xml and to phase0-route-handlers/lib/site.ts.
  - Add a card to the /industries hub grid, and move Transport out of sheet 05’s “additional sectors” prose into its ItemList — the second of the six to earn a URL.
  - Update sheet 19’s sector table: the Transport row’s destination changes from no industry page exists to this URL. That was the last such annotation in the set.
  </details>