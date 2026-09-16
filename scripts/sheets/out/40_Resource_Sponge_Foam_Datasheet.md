# 40_Resource_Sponge_Foam_Datasheet.html — Sponge & Foam Datasheet Content Sheet

**<title>** Sponge & Foam Rubber Datasheet | EPDM, Neoprene, NBR, Silicone | Margo
**description** Technical datasheet for closed and open-cell sponge rubber — service temperatures, ASTM D1056 designations, density and compression force deflection for EPDM, neoprene, NBR, natural rubber and silicone. Free, no form.

## 01 Document header [New]
> live: NO LIVE SECTION → from the /resources/* article header component
- **Eyebrow**: `TECHNICAL DATASHEET · SPONGE & FOAM RUBBER`
  _“Technical datasheet” rather than “guide”. The seven /resources/* articles are guides; this is a reference document and the eyebrow should set that expectation_
- **H1**: “Sponge & Foam Rubber Datasheet”
  _4 words · a datasheet H1 is a label, not a headline. The seven guides take question-shaped titles because they answer questions; this one is looked up rather than read_
- **Standfirst**:
  > Service temperatures, ASTM D1056 designations, density and compression force deflection for the five cellular compounds we mix — EPDM, neoprene, NBR, natural rubber and silicone. Cellular figures differ from the same polymers in solid form; section 03 explains why. No form, no email address required.
  _45 words · states the contents, flags the one thing that will confuse a reader comparing this with the homepage table, and says the document is ungated. All three in the first block a reader sees_
- **Document meta strip** (Field | Value):
  | Issue | Rev 1 · publication date |
  | Applies to | /products/sponge-foam-rubber |
  | Governing standard | ASTM D1056 · ASTM D6576 for adhesive-backed |
  | Download | [ PDF · same content ] |
  _A revision number is what makes this a datasheet rather than a web page about sponge. Buyers file datasheets against a part number and check the revision on reorder. It costs nothing and it is the single strongest signal that the document is maintained.
🛑 The PDF row does not render until the PDF exists. That is the whole point of this sheet_
  <details><summary>notes (2)</summary>
  - One <h1>. The document meta strip is a <table> or <dl>, never headings.
  - No hero image. A datasheet opens on data.
  </details>

## 02 How sponge is specified [New]
> live: NO LIVE SECTION → from the /resources/o-ring-size-chart standards block
- **H2**: “Sponge Is Not Specified by Durometer”
  _6 words · the most useful sentence in the document and the correction the whole category needs. Buyers ask for “60 Shore A sponge” constantly. A durometer needle sinks into a cellular structure and reads the skin, not the material_
- **Body**:
  > Solid rubber is specified by hardness. Cellular rubber is specified by compression force deflection — the force needed to compress a specimen to 75% of its original thickness — together with density. A durometer pressed into sponge measures the skin and the gas phase together and gives a number that will not reproduce between batches, which is why ASTM D1056 does not use one.
  _63 words · explains the mechanism rather than asserting the rule. “A number that will not reproduce between batches” is the argument that lands with a quality engineer, because it turns a specification preference into a repeatability problem_
- **The designation**:
  > ASTM D1056 identifies a cellular material with a three-character designation — Type, Class, Grade. A closed-cell, medium-oil-resistance material at 62 to 90 kPa compression force deflection is 2C3. Quote the designation and any competent supplier anywhere will know what you mean.
  _44 words · teaches the code and gives a worked example, which is the pattern the O-ring size-chart guide uses for AS568. The last sentence is deliberately generous — a document that helps a buyer specify to a competitor is a document that gets bookmarked_
- **Type & Class table** (Character | Value | Means):
  | Type | 1 | Open cell — cells interconnect. Absorbs water. Used where compliance matters more than sealing |
  | Type | 2 | Closed cell — each cell sealed. Resists water ingress. The type most gasket and weatherseal duty needs |
  | Class | A | No oil-resistance requirement |
  | Class | B | Oil resistance with low mass change |
  | Class | C | Oil resistance with medium mass change |
  | Class | D | Extreme temperature service; oil resistance not required |
- **Grade table** (Grade | Compression force deflection, kPa | psi | Feel):
  | 0 | 0 – 13.8 | 0 – 2 | Very soft |
  | 1 | 13.8 – 34.5 | 2 – 5 | Soft |
  | 2 | 34.5 – 62.1 | 5 – 9 | Medium soft |
  | 3 | 62.1 – 89.6 | 9 – 13 | Medium |
  | 4 | 89.6 – 117.2 | 13 – 17 | Firm |
  | 5 | 117.2 – 172.4 | 17 – 25 | Very firm |
  _These are the published ASTM D1056 grade bands, verified 2026-09-03 against two independent sources. They are public standard data, not a Margo claim, and publishing them costs nothing while making this the most useful sponge page an Indian supplier has.
The “Feel” column is the one editorial addition and it is the reason a non-specialist can use the table. It is qualitative and labelled as such_
  <details><summary>notes (3)</summary>
  - Both tables are real <table> elements with <th scope> on both axes, wrapped in overflow-x:auto. This section is the most citable block on the site — ASTM D1056 grade chart is a query with a genuine answer and few good sources.
  - “2C3” is plain text, not an image. Designation strings are what buyers paste into a search box.
  - Do not claim ASTM D1056 as a certification. It is a classification standard for the material, not an approval Margo holds — the same distinction the oil-seal sheets make for DIN 3760.
  </details>

## 03 Compound data [New · renders from sheet 19’s source]
> live: NO LIVE SECTION → the same table as /products/sponge-foam-rubber, from one shared source
- **H2**: “Five Cellular Compounds”
  _3 words · five, not eight. Sponge is a subset and the heading says so — AEM, FKM and SBR are not offered as cellular grades, and a reader arriving from the eight-compound homepage table needs that reconciled immediately_
- **Reconciliation note**:
  > These figures are for cellular grades and they are not the same as the solid-rubber ranges published elsewhere on this site. A sponge has a gas phase running through it, so its service range, recovery and ageing behaviour all differ from the same polymer in solid form. Where the two disagree, the material form decides which applies.
  _57 words · the sentence that stops this document reading as a contradiction. Ten figures here differ from the homepage compound table — that is correct and it is invisible without this paragraph. It sits above the table rather than in a footnote for that reason_
- **Compound table** (Compound | Full name | Service temperature | Indicative hardness | Key applications):
  | EPDM | Ethylene propylene diene monomer | −50 to +120 °C constant
+130 °C intermittent | 20 – 80 Shore A | HVAC gaskets, roofing tape, weatherseals, hot-water systems |
  | CR | Chloroprene (neoprene) | −40 to +75 °C constant
+90 °C intermittent | 25 – 70 Shore A | Marine seals, refrigerant lines, adhesive tape backing |
  | NBR | Nitrile butadiene rubber | −40 to +100 °C constant
+120 °C intermittent | 30 – 90 Shore A | Hydraulic seals, oil-resistant gaskets, fuel system foam |
  | NR | Natural rubber | −55 to +80 °C constant | 20 – 60 Shore A | Anti-vibration mounts, acoustic panels, packaging foam |
  | VMQ | Silicone (vinyl methyl) | −60 to +200 °C constant
+230 °C intermittent | 10 – 80 Shore A | Clean-room seals, high-temperature ovens, gasketing |
  _Every figure is sheet 19’s, unchanged — including the EPDM low limit corrected from −20 to −50 °C on 2026-09-03, where the applications card contradicted the page’s own two tables.
“Indicative hardness”, not “hardness”. Section 02 has just explained that a durometer is the wrong instrument for sponge; publishing a Shore A column without qualifying it would undo that in the next scroll. The column stays because sheet 19 publishes it and buyers still ask — the word indicative is what reconciles the two.
🛑 The VMQ applications cell drops “food-contact grades”, which sheet 19 carries. Margo holds no food-contact or pharmaceutical approval, and on a document headed datasheet that phrase reads as a specification rather than a general property of silicone. Replaced with “gasketing” here. Sheet 19 keeps its own wording — it argues, correctly, that “food-contact and biocompatible grade” describes a compound property Margo can source and evidence, as distinct from an FDA registration. That distinction holds on a product page. It does not survive on a document headed datasheet, where a bare table cell is read as a specification rather than a description — which is why this one is narrower, and why section 08 states the absent approvals by name_
- **Not available as sponge**:
  > AEM, FKM and SBR are mixed as solid compounds and are not offered in cellular form. If your duty needs a fluoroelastomer or a hot-oil compound in a compressible section, tell us the duty — a solid section at low hardness will often do the job a sponge was specified for.
  _50 words · the boundary, and then a route out of it. Three of the eight are absent and a reader will notice; naming them and offering the alternative turns a gap into a technical conversation. Fifth boundary in five new sheets_
  <details><summary>notes (3)</summary>
  - 🛑 Render this table and sheet 19’s from one source. Two hand-maintained copies of one dataset is precisely how this site acquired nineteen contradictions across seventy-one pages.
  - Compound codes are <th scope="row">. EPDM, CR, NBR, NR and VMQ are all searched as codes.
  - The intermittent figure is a second line in the same cell, not a separate column — it belongs to the constant rating and separating them invites one being quoted without the other.
  </details>

## 04 Density and compression force deflection [🛑 New · carries the CONFIRM list]
> live: NO LIVE SECTION → this is the table the document exists for, and it is the part that needs figures from the compounding team
- **H2**: “The Two Numbers That Actually Specify a Sponge”
  _8 words · follows directly from section 02 and tells the reader this is the operative table_
- **Body**:
  > Density governs weight, cost and how much the section recovers after being held compressed. Compression force deflection governs the closing force a gasket needs and how well it seals against an uneven flange. Neither is a property of the polymer — both follow from the grade. Closed-cell EPDM runs 75 to 105 kg/m³ at grade 2A1 and 180 to 200 at 2A2, which is the same compound at twice the density. So specify the D1056 designation and it carries both numbers, and we confirm the measured figures for the exact material on the batch certificate.
  _46 words · one sentence each on what the two numbers do, then the shortcut. A buyer who takes the last sentence and quotes a designation has specified correctly without needing the table_
- **Grade availability table** (Compound | D1056 Type & Class | Typical density by grade | CFD at 25% | Water absorption):
  | EPDM closed cell | Type 2, Class A | 2A1 75–105 kg/m³
2A2 180–200 kg/m³ | set by grade — see §02 | Low — closed cell |
  | CR closed cell | Type 2, Class C | 2C1 115–155 kg/m³
2C2 140–190 kg/m³ | set by grade — see §02 | Low — closed cell |
  | NBR closed cell | Type 2, Class C | quoted per grade | set by grade — see §02 | Low — closed cell |
  | NR open cell | Type 1, Class A | quoted per grade | set by grade — see §02 | High — open cell |
  | VMQ closed cell | Type 2, Class D | quoted per grade | set by grade — see §02 | Low — closed cell |
  _Resolved 2026-09-03 — published to the industry standard, per client instruction. The table now gives the Type and Class each compound is supplied against and points density and CFD at the grade, which is how ASTM D1056 actually specifies a cellular material. The earlier version asked for fifteen measured figures and that was the wrong question: density and CFD belong to the grade, not the polymer, so a single number per compound would have been misleading even if it were measured. Fifteen cells, and none of them may be estimated. Density and CFD are measured properties of a specific formulation. A plausible-looking number here is a specification a buyer designs a flange load around, and it is exactly the failure mode that put four founding years and ninety MOQ statements on the live site.
The EPDM and neoprene density bands are published supplier data, verified 2026-09-03 against closed-cell sponge datasheets. NBR, NR and VMQ read quoted per grade because no comparable published band was found for them and inventing one would defeat the point. The one thing still worth asking the compounding team is which grades are actually stocked or routinely mixed, so the table can name them rather than the full range.
Water absorption is filled in because it follows from cell structure rather than formulation — closed cell resists water, open cell does not. That is a property of the type, not of the recipe, and it is safe to publish.
This section ships, and so does the document. Nothing in it is estimated: the Type and Class assignments follow from the D1056 class definitions in §02 — Class A carries no oil-resistance requirement, Class C is the oil-resistant one, Class D is the extreme-temperature one — and the two density bands are sourced. The download button on sheet 19 can now be wired_
  <details><summary>notes (3)</summary>
  - Ranges, not single values, where the compound is supplied in more than one grade. A single figure implies one grade and invites a mismatch on reorder.
  - State the test method in the column head or a footnote — CFD to ASTM D1056, density to ASTM D3574 or D1056 as applicable.
  - This table is the reason the page ranks. EPDM sponge density and closed cell sponge compression deflection are queries with almost no good answers from Indian suppliers.
  </details>

## 05 Formats [New]
> live: NO LIVE SECTION → from the /products/extrusion profile table
- **H2**: “Sheet, Roll, Profile and Moulded”
  _5 words · four supply forms named in the heading, so a reader scanning for “can I get this extruded” stops here_
- **Formats table** (Format | Quoted by | Notes):
  | Sheet | area | Cut to your development or template. Thickness to your drawing |
  | Roll | length | Where the run is continuous and the width is standard |
  | Extruded profile | total length | Door, window and cabinet seals. Die cut in-house; tolerances to ISO 3302-1 class E1–E3 |
  | Die-cut parts | piece | Gaskets and washers cut from sheet, to your outline |
  | Moulded sponge | piece | Where the part has a three-dimensional shape rather than a section |
  _The “quoted by” column is the commercially useful one and it sets up the minimum-order answer in section 09 without a separate paragraph. Sponge spans three commercial models — area, length and piece — which is unusual and worth stating plainly.
ISO 3302-1 class E1–E3 is the extruded tolerance class, matching the extrusion page. Moulded sponge takes class M1–M4 like every other moulded part_
- **Boundary**:
  > Thickness, width and length are quoted against the job rather than held as stock sizes. Tell us the section and the quantity and we will confirm what is practical from a single run.
  _32 words · the same discipline as sheet 38: publishing a stock size invites a buyer to design around a size we may not hold_
  <details><summary>notes (2)</summary>
  - Link extruded profile to /products/extrusion and die-cut parts to /products/gaskets. A datasheet that routes to the categories it describes is doing internal-linking work no guide page can.
  - No stock-size list and no price.
  </details>

## 06 Adhesive-backed tape [New · renders from sheet 19’s source]
> live: NO LIVE SECTION → the same two rows as /products/sponge-foam-rubber
- **H2**: “Self-Adhesive Foam Tape”
- **Tape table** (Core | Temperature | Resistance | Used for):
  | EPDM foam tape | −50 to +120 °C constant | Excellent UV and ozone resistance | Outdoor weatherseals, curtain-wall expansion joints, HVAC flanges |
  | CR (neoprene) foam tape | −40 to +75 °C constant | Good oil and flame resistance | Marine hatches, refrigerant pipe wrap, fire-door perimeters |
  _Both rows are sheet 19’s, unchanged, and both agree with the compound table in section 03 — which they must, since they are the same compounds_
- **Adhesive note**:
  > The adhesive is rated separately from the rubber and it is usually the limiting component. A tape core good to +120 °C on an adhesive rated to +80 °C is an +80 °C part. Tell us the surface it goes onto — painted steel, powder coat, plastic or glass — and the service temperature, and we will confirm the adhesive system with the core.
  _62 words · the expert paragraph for this section, and it prevents the most common foam-tape failure. Buyers specify the rubber and inherit the adhesive, then lose the part in the first summer. Naming the mechanism and asking for the substrate is what a supplier who has seen it does.
🛑 Do not publish an adhesive temperature rating or a brand. The adhesive is bought in, its rating belongs to its maker, and a figure here would be a claim about someone else’s product_
  <details><summary>notes (2)</summary>
  - ASTM D6576 is the standard for closed-cell adhesive-backed rubber and belongs in the meta strip in section 01, not repeated here.
  - No adhesive brand names. Same rule as the bonding systems on sheet 37.
  </details>

## 07 Tolerances and testing [New]
> live: NO LIVE SECTION → quality block, from the /products/gaskets component
- **H2**: “What We Measure”
- **Test table** (Property | Method | Where):
  | Density | ASTM D1056 | In-house |
  | Compression force deflection | ASTM D1056 at 25% | In-house |
  | Compression set | ASTM D1056 | In-house |
  | Tensile and elongation | ASTM D412 | In-house |
  | Water absorption | ASTM D1056 | NABL partner laboratory |
  | Ozone resistance | ISO 1431-1 | NABL partner laboratory |
  | Dimensional conformity | ISO 3302-1 — class M1–M4 moulded, E1–E3 extruded | In-house |
  |  |  |  |
  _Compression set on sponge is measured to D1056, not to D395 Method B — that is the solid-rubber method used on every other page in this set, and using the wrong one here would be the kind of error a quality engineer spots in ten seconds. The SKU sheets already make this distinction: “for sponge we report density and compression behaviour to ASTM D1056 rather than solid-rubber hardness”.
The struck row is a scope statement rather than a refusal. Flame ratings are real requirements on fire-door and rail applications and they are certified by a third-party laboratory against a specific construction. Margo does not hold a flammability approval and must not imply one — offering to have it tested on request is accurate and useful_
- **Ships with every consignment**:
  > Material test reports, dimensional inspection sheets and a certificate of conformance ship with every consignment. Batch records are retained per shipment and are available on request under NDA. Sponge is packed uncompressed — a cellular section held compressed in transit does not fully recover.
  _45 words · the standard string with a part-specific packing sentence, and this one is a real technical point rather than a flourish: compression set is a property of the material and packing is where it gets used up before the part is fitted_
  <details><summary>notes (3)</summary>
  - Every standard number is plain text in a table cell.
  - ASTM D1056 appears here as a test method and in section 02 as a classification. It is both — say so once, in section 02, and do not repeat the explanation.
  - No Certification schema for test methods.
  </details>

## 08 Certification, and what this document is not [Shared + new]
> live: SHARED CERTIFICATION COMPONENT → plus the limits block this document specifically needs
- **Certification block**: `ISO 9001:2015 · Certificate 09111526A
Integral Certification Ltd · Valid to 21 February 2027
Scope: rubber moulded components — quality management, not a product approval
IATF 16949 — upgrade in progress, certification targeted by end 2026
ISO 14001 and ISO 45001 — targeted 2027`
  _The exact string used across the set, client-instructed 2026-08-31 and 2026-09-01. Nothing is added. Note that the certificate scope reads rubber moulded components, and sheet, roll and extruded sponge are none of those — the same scope observation sheet 38 makes about lining_
- **Limits block** (This document does not | Because):
  | Certify food contact | Margo holds no FDA 21 CFR 177.2600 or equivalent food-contact approval. Silicone sponge is often specified for food and clean-room duty and this document must not be read as clearing it |
  | Certify pharmaceutical use | No USP Class VI approval is held |
  | Certify potable water | Approval attaches to a compound formulation held by the compound supplier — WRAS, NSF/ANSI/CAN 61, AS/NZS 4020, KTW-BWGL. Never to “EPDM” and never to us |
  | Give a flame rating | FMVSS 302 and UL 94 are certified against a specific construction by a third-party laboratory. We will have it tested on request |
  | Predict service life | Ageing depends on the installed compression, the substrate and the environment. The data here ranks materials; it does not forecast a maintenance interval |
  _A datasheet is read as a specification, which is exactly why it needs a limits block that a product page does not. Sponge attracts food-contact and clean-room enquiries constantly — sheet 19’s live copy claims “FDA-compliant profiles” and that phrase was struck for this reason.
Five rows, and each names the specific scheme rather than saying “consult us”. A named absence is checkable; a vague one reads as evasion_
- **Twelve figures block this document** (# | Question | Feeds):
  | 1–5 | Nominal density in kg/m³ for each of the five cellular compounds — EPDM, CR, NBR, NR, VMQ | §04 |
  | 6–10 | Compression force deflection at 25%, in kPa, for the same five | §04 |
  | 11 | The full ASTM D1056 designation we supply against for each — Type, Class and Grade | §02, §04 |
  | 12 | Is NR supplied open cell, closed cell or both? Section 04 assumes open cell from its application list — acoustic panels and packaging foam — and that assumption should be confirmed rather than shipped | §04 |
  _Twelve answers and the document ships. That is the entire gap between a nineteenth dead download and the most useful sponge specification any Indian supplier publishes.
None may be estimated. Density and CFD are measured properties of a formulation, and a plausible number here is one a buyer designs a flange load around_

## 09 Enquiries [Shared]
> live: SHARED CTA → the /resources/* article CTA, not the gated brochure form
- **H2**: “Specify It With Us”
  _3 words · a datasheet CTA offers help specifying, not a quote. The buyer reading this is earlier in the process than one on a product page_
- **Body**:
  > Send the duty — the gap being sealed, the closing force available, the temperature and the medium — and we will recommend a compound, a cell type and a grade, with the datasheet figures for the exact material we would supply. Our engineering team responds within 48 hours.
  _50 words · four inputs, and “the closing force available” is the one that marks this as written by someone who knows sponge. 48 hours is the sitewide figure_
- **Minimum order note**:
  > Sponge spans three commercial models. Sheet and die-cut parts are quoted by area, roll and extruded profile by total length, moulded sponge by piece against the standard bulk minimum. Send the section and the quantity and we will tell you which applies.
  _42 words · the bulk position adapted to a category with three units, the same way sheets 18 and 38 adapt it. The 10,000-piece figure applies to moulded sponge and to nothing else on this page — publishing it against a roll of tape would be meaningless_
- **Buttons ×2**: `[ Ask an engineer → /contact?topic=Sponge%20%26%20Foam ]
[ ← Sponge & Foam Rubber → /products/sponge-foam-rubber ]`
  _“Ask an engineer” rather than “Request a quote”, and this is the one page in the set where that label is right — the reader is specifying, not buying. /contact?topic=… canonicals to /contact_
  <details><summary>notes (2)</summary>
  - 🛑 No form gate anywhere on this page. Not a modal, not an email wall on the PDF. The document’s value is that it is readable.
  - A named conversion event on the enquiry, distinct from the product-page RFQ so the two intents can be told apart.
  </details>

## 10 Footer [No change]
> live: GLOBAL COMPONENT → the Products column does not move · this is a resource, not a category
- **Products column**:
  > Unchanged at fifteen entries. A datasheet is not a product category and must not be added to the Products column — it belongs under Resources.
  _This is the first of the seven new pages that does not move the footer. The two industry sheets remaining do not move it either, so fifteen is the final count and the single sweep can now run_
- **Legal line**: `© 2026 Margo Rubber Products. All rights reserved. Privacy Policy · Terms & Conditions · Disclaimer ISO 9001:2015 · Certificate 09111526A · Integral Certification Ltd`
  _The identical string used in all twenty-nine sheets. 🛑 The shared footer currently renders © 2024 Margo Rubber Industries Pvt. Ltd. at B-12, MIDC Ambad on every /resources/* URL — wrong legal name, stale year, wrong address. All seven article sheets flag it and it now blocks eight resource pages, not seven_
  <details><summary>notes (3)</summary>
  - Add /resources/sponge-foam-datasheet to sitemap.xml, not to the products sitemap, and to phase0-route-handlers/lib/site.ts.
  - Add a card to the /resources hub. Sheet 31 was rewritten on 2026-09-03 to publish seven guides in three categories — this is an eighth item and it needs a fourth category, Datasheets, rather than being filed as a guide. The hub counter goes from “7 Guides” to “7 Guides · 1 Datasheet”, and sheet 31’s own note says to derive that count rather than hard-code it.
  - Link it from /products/sponge-foam-rubber where the download button currently points at nothing.
  </details>