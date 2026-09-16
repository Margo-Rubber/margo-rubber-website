# 39_Product_Seals.html — Seals Page Content Sheet

**<title>** Rubber Seals Manufacturer India | Plunger, Rod & Piston Seals | Margo
**description** Moulded rubber reciprocating seals — plunger cups, U-cups, rod and piston seals, V-packings and wipers — made to your stroke, pressure and clearance in Nashik, India. Static and rotary seals on their own pages.

## 01 Hero [New]
> live: NO LIVE SECTION → build from the /products/oil-seals hero component
- **Eyebrow**: `01 · SEALS`
- **H1 — 2 lines**: “Reciprocating Seals” / “for Rods, Pistons and Plungers.”  (accent: for Rods, Pistons and Plungers.)
  _7 words · the H1 scopes the page and the title tag takes the head term. That split is deliberate: the title competes for rubber seals manufacturer India, the H1 tells the buyer who has landed exactly which seals they are looking at. A generic “Rubber Seals” H1 would compete with four of our own pages_
- **Subhead**:
  > Plunger cups, U-cups, rod and piston seals, V-packings and wipers — moulded to your stroke, working pressure and clearance gap at our ISO 9001:2015 plant in Nashik. A reciprocating seal is not an oil seal with a different name: it has no garter spring, it works a stroke rather than a rotation, and the rod finish matters more than the compound.
  _57 words · the second sentence is the page’s editorial spine and it corrects the single most common specification error in this category. Buyers order “oil seals” for reciprocating duty constantly, because both are lip seals and both live in a bore. Correcting it in the subhead is worth more than any product list_
- **Spec chips ×3** (Chip | Why this one):
  | ISO 9001:2015 | Same first chip as every category page |
  | MADE TO YOUR HOUSING | No catalogue on this category. Every reciprocating seal is sized to a rod, a bore and a groove |
  | 8 COMPOUNDS IN-HOUSE | Compounding is the differentiator, and on a wetted seal it is what lets the medium drive the choice |
  _No piece count, no country figure. And no pressure rating — a pressure figure above the fold is read as a capability for every seal on the page, and section 06 explains why pressure alone never decides a reciprocating seal_
- **CTA slot**: `[ Send your rod and bore dimensions → /contact?part=Seals ]`
  _Names the two dimensions rather than asking for a drawing, because a reciprocating seal enquiry usually starts from a housing that already exists_
  <details><summary>notes (3)</summary>
  - Heading. The page’s only <h1>, two <span class="block"> children.
  - The H1 must not read “Rubber Seals” on its own. That is the one edit that would turn this page into a duplicate of four others.
  - Image alt, if added: “Moulded rubber plunger cups and rod seals produced at Margo Rubber Products, Nashik”.
  </details>

## 02 Which seal do you need? [🛑 New — non-optional]
> live: NO LIVE SECTION → routing grid, five cards, from the /industries hub component · four of the five link away from this page
- **Eyebrow**: `02 · FIND YOUR SEAL`
- **H2**: “Seals Are Sorted by Motion, Not by Shape”
  _8 words · states the taxonomy the whole catalogue uses. It is true, it is how an engineer thinks, and it is the sentence that makes a page called “Seals” sending four fifths of its traffic elsewhere feel like navigation rather than a dead end_
- **Intro**:
  > What a seal has to do is decided by how the parts move against each other. Get that right and the rest — compound, hardness, section — follows. Below is where each family lives on this site.
  _36 words · short on purpose. This section is a signpost and a long intro would keep a reader on the wrong page_
- **Router cards ×5** (If the parts | You need | Goes to):
  | Do not move — a clamped joint in a groove | Static seals — O-rings | /products/o-rings |
  | Do not move — a bolted flange or face | Static seals — gaskets | /products/gaskets |
  | Rotate — a turning shaft in a housing | Rotary shaft seals, DIN 3760 / ISO 6194 | /products/oil-seals |
  | Flex — a membrane deflecting under pressure | Diaphragms | /products/diaphragms |
  | Stroke — a rod or piston moving in and out | Reciprocating seals | this page ↓ |
  _Four of five cards send the reader away, and that is the design. This page ranks for the generic term and then routes the intent it cannot serve — which is how a hub earns its place instead of cannibalising the pages beneath it.
🛑 Do not turn this into a product grid. If the cards gain thumbnails, prices, “view range” buttons or duplicated product copy, the page stops being a router and becomes a fifth competitor for four sets of queries this site already owns. The rows are one line each on purpose.
This section emits the ItemList node. Five items, four with external url values, one self-referential — the machine-readable version of the same routing_
  <details><summary>notes (4)</summary>
  - Five internal links with the family name as anchor text — O-rings, gaskets, rotary shaft seals, diaphragms. Not “view”, not “here”.
  - All five rows in the DOM at first paint. A router that mounts on interaction is not a router.
  - This is the block that answers “what are the different types of rubber seals” — a high-volume informational query — with a four-word taxonomy and five destinations. It is the most linkable section on the page.
  - No Product markup on the four outbound rows. They are ListItem entries pointing at other pages’ products, not products of this one.
  </details>

## 03 Reciprocating seal types [New]
> live: NO LIVE SECTION → card grid, six cards, from the /products/pads-stoppers-caps component
- **Eyebrow**: `03 · TYPES`
- **H2**: “Six Sections, Chosen by Pressure and Duty”
  _7 words · names the two selection criteria in the heading, the same pattern the diaphragms page uses with stroke_
- **Intro**:
  > These are pressure-energised sections: the medium pushes the lip against the sealing surface, so the seal grips harder as pressure rises and runs light when it falls. Which section suits depends on the pressure, whether the duty is single or double acting, and how much clearance the housing leaves.
  _49 words · explains the operating principle once, so six cards do not each have to. Pressure energisation is what distinguishes this family from static seals and it is the mechanism section 06 builds on_
- **Cards ×6** (Card | Body | Typical use):
  | Plunger cups | A cup-section seal on a plunger, sealing on its outside diameter against the bore. Single acting, tolerant of a less precise bore than a U-cup, and the section that has been in service longest. | Dosing and metering pumps, sprayers, hand and foot pumps |
  | U-cups | A U-section lip seal for a rod or a piston, single acting. The lip is energised by pressure and relaxed without it, so it runs cooler and drags less than a squeezed section. | Low and medium-pressure cylinders, pump rods |
  | Rod seals | Seals on the rod, keeping the medium inside the cylinder. Sized to the rod diameter, the groove and the clearance — housings to ISO 5597 where the design follows the standard. | Actuators, jacks, press rams |
  | Piston seals | Seals on the bore, keeping pressure on one side of the piston. Single acting to ISO 6547, or paired back to back for double acting. | Single and double-acting cylinders |
  | V-packings and chevron sets | Stacked V-rings between a male and a female adaptor, adjustable by the gland. The set is tightened as it wears rather than replaced, which suits plant that cannot be stripped often. | Plunger pumps, valve stems, high-wear duty |
  | Wipers and scrapers | Keep dirt, dust and moisture off the rod on the return stroke. Not pressure seals — they protect the rod seal behind them, and they are the cheapest part in the assembly to renew. Housings to ISO 6195. | Any rod running in a dirty environment |
  _The wipers card is the honest one. A wiper is not a seal and saying so — “not pressure seals, they protect the rod seal behind them” — prevents the specification error where a buyer fits a wiper and wonders why it leaks.
Plunger cups lead the six because Margo already makes them. Sheet SKU 31 is a plunger cup page and it is the only reciprocating seal in the catalogue today. Everything else in this section is a capability statement, and the card order says which is which without announcing it.
Three ISO housing standards are named — 5597, 6547, 6195. They are dimensional standards for the housing, not product approvals, and section 07 states that distinction the way the oil-seal sheets do for DIN 3760_
  <details><summary>notes (3)</summary>
  - Card titles are <h3>. plunger cup, U-cup seal, rod seal, piston seal, V-packing and rod wiper are six distinct searched terms, and none of them appears anywhere on this site today.
  - Link the plunger cups card to /products/seals/plunger-seals — sheet SKU 31. That link is the reason this page exists and it must resolve.
  - All six cards in the DOM at first paint.
  </details>

## 04 What we need to quote [New]
> live: NO LIVE SECTION → spec table, from the /products/diaphragms component (sheet 36)
- **Eyebrow**: `04 · SPECIFICATION`
- **H2**: “What We Need to Quote”
  _5 words · the house heading, identical on sheets 36 and 37. Three category pages asking in the same words is a standard, not a coincidence_
- **Spec table** (Input | Range | Why we ask):
  | Rod or bore diameter | Ø6 mm – Ø250 mm | Set by tooling, not by the compound. Larger is quotable against the part |
  | Groove dimensions | to drawing | Width and depth, and whether the groove is closed or split |
  | Clearance gap | to drawing | The row most enquiries omit. Pressure and clearance together decide whether a back-up ring is needed — see section 06 |
  | Stroke | to drawing | Governs heat build-up and wear rate |
  | Working pressure | to drawing | Continuous and peak, separately. They are different numbers and both matter |
  | Medium | named fluid | Decides the compound. The input most often left out |
  | Service temperature | −60 to +250 °C
across the eight compounds | Narrows the compound with the medium |
  | Rod or bore surface finish | Ra, µm | The single biggest cause of premature failure. See section 06 |
  | Hardness | 70 – 90 Shore A | Our output, not your input. Reciprocating sections run harder than static ones |
  | Dimensional tolerance | ISO 3302-1 class M1 | Tolerance follows the section, as on every moulded part in this catalogue |
  _Two rows carry a warning rather than a range — clearance gap and surface finish — and both point at section 06. That is deliberate: they are the two inputs that decide whether a correctly specified seal still fails, and they are the two nobody sends.
The hardness band is 70–90 Shore A here, against 40–80 on the diaphragms and bonded-components sheets. That is not an inconsistency: a reciprocating section has to resist extrusion into a clearance gap, so it runs harder than a flexing or a load-bearing one. If a reader compares the three pages, the difference should read as engineering — and it does, because section 06 explains it_
- **Footnote**:
  > Send a drawing in PDF, DWG, DXF or STEP — or send the seal you are replacing and tell us how it failed. A hardened, glazed lip means heat or a rod finish that is too smooth to carry a film; a lip nibbled on one edge means extrusion into the clearance; scoring across the lip means the rod is too rough or the wiper has failed.
  _63 words · the house diagnostic paragraph, and here it names three failure modes that map onto the three inputs buyers omit. Every failure named is one a buyer can see on the part in their hand, which is what makes the paragraph convert rather than impress_
  <details><summary>notes (3)</summary>
  - Real <table>, <th scope> on both axes, overflow-x:auto.
  - Row labels are not headings.
  - Link section 06 as an in-page anchor from both warning rows.
  </details>

## 05 Compound selection [New]
> live: NO LIVE SECTION → router, from the /products/oil-seals compound selector
- **Eyebrow**: `05 · COMPOUND`
- **H2**: “The Medium Decides. The Pressure Sets the Hardness.”
  _8 words · two rules in one heading, and the second is what separates this compound table from the other four in the set_
- **Intro**:
  > A reciprocating seal is submerged in the medium and dragged across a surface thousands of times an hour, so the compound is chosen for the fluid and the hardness for the pressure. Every compound we mix is available. These are ranked for reciprocating duty.
  _45 words · carries the client instruction of 2026-09-02 — every part in every compound, nothing removed, only ranked_
- **Compound router** (If the medium is | Compound | Service temperature | Note):
  | Mineral oil, hydraulic fluid, grease, fuel | NBR | −30 to +120 °C | The default for reciprocating duty and the compound most of this category is made from. Good abrasion resistance at seal hardnesses |
  | Water, coolant, steam, dosing chemicals, brake fluid | EPDM | −40 to +140 °C | The default for pumps handling water and dosing chemistry. Never in mineral oil |
  | Solvents, aggressive chemistry, hot hydrocarbons | FKM | −20 to +250 °C
continuous to +200 °C | The escalation when NBR is out of range on temperature or medium. Poor in the cold, and it fails in steam and glycol brake fluid |
  | Hot oil above nitrile’s ceiling | AEM | −40 to +175 °C
continuous to +160 °C | The middle answer between NBR and FKM at well under FKM cost. Absent from almost every competitor’s menu |
  | Refrigerants, marine, moderate oil | Neoprene | −40 to +120 °C | General purpose, with flame-retardant grades where a fire rating is specified |
  | Low pressure, high stroke, water or air | Natural rubber | −20 to +90 °C | Best flex-fatigue resistance of the eight. Too soft for pressure duty and no oil contact — a narrow but real fit |
  | Abrasive water, low cost | SBR | −30 to +100 °C | Where abrasion governs and pressure is low. No oil contact |
  | Clean, high temperature, very low pressure | Silicone | −60 to +220 °C | 🛑 Almost never right on a reciprocating seal. Low tear strength and poor abrasion resistance, and it extrudes readily — three properties this duty punishes. Available, and we will say so if you ask for it |
  _Every range is the homepage compound table, which governs across all fifteen category pages.
NBR ranks first here, and that is the fourth different compound to lead a router in this run — EPDM-then-medium on diaphragms, natural rubber on bonded components and again on lining, NBR here. Four pages, four honest answers, no house favourite. A buyer comparing them sees a supplier that ranks on duty rather than on margin.
The silicone row is the fourth refusal in four new pages, again for a duty-specific reason: extrusion, tear and abrasion rather than bonding or fatigue. Same conclusion, four different arguments_
- **Boundary line**:
  > For high-pressure hydraulic rod and piston seals, polyurethane is usually the correct material and we do not mould it. Our reciprocating seals are rubber, for pump, sprayer, dosing and lower-pressure cylinder duty. If your specification calls for polyurethane, we will tell you rather than substitute.
  _46 words · the scope limit, on the page rather than in a footnote. Polyurethane is the default for hydraulic rod seals and Margo cannot make it — it is not one of the eight, it appears nowhere else on this site, and it is not a vulcanised rubber, the same three reasons sheet 21 struck it from mining and sheet 38 excludes it from lining. Stating it here stops an entire class of enquiry that was never going to close_
  <details><summary>notes (3)</summary>
  - All eight rows in the DOM at first paint.
  - Link each compound name once to its anchor on /products.
  - Polyurethane must not be marked up as a material we offer anywhere in this section — not in schema, not in a comparison table, not as a “also available”.
  </details>

## 06 Surface finish and the clearance gap [New]
> live: NO LIVE SECTION → accordion, two panels, from the /products/bellows component
- **Eyebrow**: `06 · WHAT KILLS THEM`
- **H2**: “Most Reciprocating Seals Fail on the Housing, Not the Seal”
  _10 words · the strongest heading on this page. It is true, it is counter-intuitive, and it reframes the enquiry from “which seal do I buy” to “is my housing right” — a conversation only a supplier who has debugged these can have_
- **Panel 1 — Surface finish**:
  > A reciprocating seal needs a thin film of the medium under the lip to survive, and the rod finish is what holds it. Too rough and the surface abrades the lip; too smooth and there is nothing for the film to sit in, so the lip runs dry and glazes. Ra 0.1 to 0.4 µm is the usual window for a hard chrome-plated rod. Tell us the finish and the plating — if the rod is ground rather than plated, or has been polished during a rebuild, that changes our recommendation more than the compound does.
  _94 words · the extractable answer for this page. “Too smooth is as bad as too rough” is genuinely surprising to most buyers and it is correct. The rebuild-polishing detail is the kind of specific that only comes from having seen the failure — a rebuilt cylinder with a mirror rod eats seals, and nobody warns the maintenance team_
- **Panel 2 — Extrusion and the clearance gap**:
  > Under pressure a rubber section is pushed towards the clearance between rod and housing. If the gap is too wide for the pressure and the hardness, the seal extrudes into it and the extruded edge is nibbled away on every stroke — the classic bitten-lip failure. Three things fix it and they trade against each other: close the gap, raise the hardness, or fit a back-up ring behind the seal. That is why we ask for the clearance and the pressure together, and why a harder compound is sometimes the answer to a leak rather than a softer one.
  _98 words · explains the 70–90 Shore A band in section 04 without cross-referencing it, names the failure a buyer can identify on the part, and ends on a counter-intuitive but correct piece of advice. Together with panel 1 this section is the reason a specifier would choose this supplier over a catalogue_
  <details><summary>notes (3)</summary>
  - Two accordion panels, both in the DOM at first paint, headings as <h3>. rod surface finish for seals and seal extrusion clearance gap are both real queries with poor answers online.
  - Panel 1 is written to stand alone in an AI response. Keep it as one <p> and do not split the too-rough / too-smooth sentence.
  - No back-up ring product claim. Back-up rings are usually PTFE or polyurethane and Margo moulds neither — name the solution, do not offer the part.
  </details>

## 07 Tolerances, testing and what ships [New]
> live: NO LIVE SECTION → quality block, from the /products/gaskets component
- **Eyebrow**: `07 · QUALITY`
- **H2**: “Tested Before It Ships”
  _4 words · the house heading, matching sheet 36_
- **Test table** (Property | Method | Where):
  | Hardness | ASTM D2240 | In-house |
  | Tensile and elongation | ASTM D412 | In-house |
  | Compression set | ASTM D395 Method B | In-house |
  | Tear strength | ASTM D624 | NABL partner laboratory |
  | Abrasion loss | ISO 4649 · ASTM D5963 | NABL partner laboratory |
  | Fluid immersion / volume swell | ASTM D471 | NABL partner laboratory |
  | Dimensional conformity | ISO 3302-1 class M1 | In-house |
  | Dynamic seal life / cycles to failure | — | no test rig |
  _The struck row is the same refusal the bellows and diaphragms pages make, and on this category it is the one buyers most want. There is no reciprocating test rig in-house and none at the NABL partner. A seal-life figure would be read as a warranty and there is nothing behind it.
Compression set and abrasion are the two rows that matter here and both are real: compression set predicts whether the lip recovers between strokes, abrasion predicts wear against the rod. They are the closest honest proxies for seal life and the page offers them instead of the number it cannot give.
Housing standards are dimensional, not approvals. ISO 5597, ISO 6547 and ISO 6195 define groove geometry. Say so on the page, the way the oil-seal sheets say it for DIN 3760 and ISO 6194_
- **Ships with every consignment**:
  > Material test reports, dimensional inspection sheets and a certificate of conformance ship with every consignment. Batch records are retained per shipment and are available on request under NDA. Seals are packed so the lip is not deformed in transit.
  _40 words · the standard string with a part-specific packing sentence, matching the oil-seal sheets’ sealing-lip note_
  <details><summary>notes (3)</summary>
  - Every standard number is plain text in a table cell.
  - The struck row ships visible, with a real value.
  - No Certification schema for test methods or housing standards.
  </details>

## 08 Certification [Shared]
> live: SHARED COMPONENT → identical on all fifteen category pages · do not retype it, do not add to it
- **Certification block**: `ISO 9001:2015 · Certificate 09111526A
Integral Certification Ltd · Valid to 21 February 2027
Scope: rubber moulded components — quality management, not a product approval
IATF 16949 — upgrade in progress, certification targeted by end 2026
ISO 14001 and ISO 45001 — targeted 2027`
  _The exact string used across the set, client-instructed 2026-08-31 and 2026-09-01. Nothing is added.
ISO 5597, ISO 6547 and ISO 6195 are named in sections 03 and 07 and must never appear near this block. They are dimensional standards for a housing, not certifications, and a housing standard sitting beside a certificate number reads as a fourth credential. Sheet SKU 14 makes the same separation for DIN 3760: “these are dimensional standards, not certifications” — use that sentence_
  <details><summary>notes (2)</summary>
  - The certificate PDF link is shared and currently dead across every category page. Do not add another dead download.
  - No food-contact, pharmaceutical or potable-water claim. Dosing-pump seals invite all three.
  </details>

## 09 Technical & commercial questions [New]
> live: NO LIVE SECTION → FAQ accordion, six questions · these six are the FAQPage mainEntity, verbatim
- **Q1** (composite):
  · H: “What is the difference between an oil seal and a reciprocating seal?”
  · Motion. An oil seal is designed for a rotating shaft — it has a garter spring holding the lip against the shaft, and the lip is shaped to pump fluid back as the shaft turns. A reciprocating seal works a stroke: no garter spring, a section that is energised by pressure rather than by a spring, and a lip that has to survive being dragged along the rod. Fitting one where the other belongs is the most common specification error we see. Rotary duty is on our oil seals page; this page is reciprocating.
  _92 words · the extractable answer and the anti-cannibalisation answer at the same time. It wins a real informational query, it corrects the error the whole page exists to correct, and its last sentence routes rotary intent to /products/oil-seals from inside the FAQ schema_
- **Q2** (composite):
  · H: “My seal is leaking after a few weeks. What is wrong?”
  · Usually the housing rather than the seal. Look at the failed part: a glazed, hardened lip means heat or a rod too smooth to carry a lubricating film; a lip nibbled along one edge means it is extruding into the clearance gap under pressure; scoring across the lip means the rod is too rough, or the wiper in front of it has failed and is letting grit through. Send us the part and the rod finish and we will tell you which of the three you have.
  _88 words · the highest-intent question in this category and the one that converts a maintenance engineer holding a failed part. Three failures, three causes, each identifiable by eye — and the answer ends in an offer rather than a product_
- **Q3** (composite):
  · H: “Do you work to ISO 5597 and ISO 6195 housings?”
  · Yes. Where your design follows the standard we mould to the standard groove; where it does not, we mould to your drawing. These are dimensional standards for the housing, not certifications, and we hold no product approval against them — send the groove dimensions either way and we will confirm the section.
  _52 words · answers a qualifying question and closes the standards-as-credentials door in the same breath. The phrasing mirrors sheet SKU 14 on DIN 3760, which is the house position on dimensional standards_
- **Q4** (composite):
  · H: “Can you supply polyurethane hydraulic seals?”
  · No. Polyurethane is the usual material for high-pressure hydraulic rod and piston seals and we do not mould it — we compound and mould vulcanised rubber, in eight compounds. Our reciprocating seals suit pump, sprayer, dosing and lower-pressure cylinder duty. If your specification calls for polyurethane we will say so rather than substitute a nitrile section that will not hold the pressure.
  _62 words · the refusal that makes the page trustworthy, and the third page in this run to decline work by naming a material Margo does not mix — polyurethane on mining and lining, butyl on lining, polyurethane again here. Substituting a nitrile section into a polyurethane application is exactly the failure this answer prevents, and it would be an easy sale to make_
- **Q5** (composite):
  · H: “What is the minimum order quantity for seals?”
  · We supply in bulk. The minimum run is 10,000 pieces per part number, per compound, or quoted against the part where geometry or tooling makes that unrealistic. Prototype and first-article lots sit outside the minimum.
  _36 words · the standard answer, client-instructed 2026-09-01, unchanged. Do not reword it_
- **Q6** (composite):
  · H: “What are your payment and delivery terms for international orders?”
  · TT and LC accepted, discussed per order. Ex-works Nashik or FOB Nhava Sheva. Commercial invoice, packing list and certificate of origin are issued with every consignment. Seals are packed to protect the sealing lip.
  _38 words · the standard commercial string, matching the oil-seal sheets exactly_
  <details><summary>notes (3)</summary>
  - All six panels in the DOM at first paint.
  - Q1 and Q2 are the extractable answers. Q1 wins “oil seal vs reciprocating seal” and routes rotary intent away; Q2 wins the diagnostic query.
  - Q1’s closing sentence carries an internal link on oil seals page. A routing link inside a schema answer is unusual and it is the point.
  </details>

## 10 Enquiries [Shared]
> live: SHARED CTA COMPONENT → use the one that renders correctly, not the broken industry-page variant
- **Eyebrow**: `10 · ENQUIRIES`
- **H2**: “Request a Seal Quotation”
  _4 words · “quotation” is the term used on every page in this set_
- **Body**:
  > Send the rod or bore diameter, the groove, the clearance and the working pressure — or send the seal that failed and the rod finish, and we will tell you what killed it. Our engineering team responds within 48 hours with a section and compound recommendation, dimensional confirmation and a quotation.
  _51 words · both entry points at the point of conversion, and the second is the one that converts. 48 hours is the sitewide figure_
- **Buttons ×2**: `[ Request a quote → /contact?part=Seals ]
[ ← Back to Products → /products ]`
  _Primary and secondary, the same pair as every category page_
  <details><summary>notes (2)</summary>
  - /contact?part=Seals canonicals to /contact.
  - Add a “Seals — reciprocating” option to the contact form dropdown. Label it with the qualifier, or a buyer wanting an O-ring picks “Seals” and the routing this page does is undone at the form.
  </details>

## 11 Footer [Fifteenth category — and the column needs a decision]
> live: GLOBAL COMPONENT → the sweep is now due, and it is no longer only a string change
- **Products column**: `SEALING
O-Rings · Oil Seals · Gaskets · Diaphragms · Reciprocating Seals · Leak Test Rubber
MOUNTING & PROTECTION
Anti-Vibration Mounts · Bushes & Bushings · Bonded Components · Bellows · Grommets · Pads, Stoppers & Caps
SHEET & PROFILE
Extrusion Profiles · Sponge & Foam Rubber · Rubber Lining & Skirting`
  _The sweep has run. The Products column now ships grouped in all twenty-nine sheets — Sealing (6), Mounting & protection (6), Sheet & profile (3) — because fifteen entries in a column designed for eleven is not readable as a flat list. The third group is also the commercial split: those three are quoted by length or area rather than by piece count. “Seals” ships as “Reciprocating Seals” so it is not read as a parent of O-Rings and Oil Seals. Group labels are <p> or <div>, never headings. Fifteen entries, and this is where the single sweep should run — the four product pages in this run are now written and /resources/sponge-foam-datasheet, /industries/construction and /industries/transport add nothing to the Products column.
🛑 But fifteen entries in one column is a design problem, not a string. The column was built for eleven. At fifteen it either runs past the footer’s vertical rhythm or wraps unevenly. Two options, and this is a design decision rather than a content one: split the Products column into two, or group it — Sealing, Vibration & mounting, Sheet & profile. Grouping is the better answer because it repeats the taxonomy section 02 establishes, and a footer that teaches the catalogue’s structure is worth more than an alphabetical list of fifteen.
“Seals” adjacent to “O-Rings” and “Oil Seals” in a flat list is exactly the ambiguity section 02 exists to remove. If the column stays flat, label this entry Seals — Reciprocating_
- **Legal line**: `© 2026 Margo Rubber Products. All rights reserved. Privacy Policy · Terms & Conditions · Disclaimer ISO 9001:2015 · Certificate 09111526A · Integral Certification Ltd`
  _The identical string used in all twenty-nine sheets_
  <details><summary>notes (4)</summary>
  - Footer column labels are <p> or <div>, never headings. If the column is grouped, the group labels are the same — three more phantom sections is not an improvement on one.
  - Add /products/seals and /products/seals/plunger-seals to sitemap/products/0.xml and to phase0-route-handlers/lib/site.ts. Two URLs, not one — the SKU page is a child of this category.
  - Add it to the /products hub grid, in whichever group the taxonomy decision lands on.
  - Sheet SKU 31 needs no edit. Its canonical, its JSON-LD category and its back-link were all written against this URL and are correct as they stand — which is the one piece of luck in this sheet.
  </details>