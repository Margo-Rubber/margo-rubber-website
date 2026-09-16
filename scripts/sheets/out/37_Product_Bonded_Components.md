# 37_Product_Bonded_Components.html — Rubber-to-Metal Bonded Components Page Content Sheet

**<title>** Rubber to Metal Bonding India | Bonded Components | Margo
**description** Rubber-to-metal bonded mounts, bushes, rollers and sealing elements, vulcanised to steel, stainless, aluminium or brass in one cure at our Nashik plant. Bonded in-house, not assembled with adhesive. ISO 9001:2015.

## 01 Hero [New]
> live: NO LIVE SECTION → build from the /products/anti-vibration-mounts hero component
- **Eyebrow**: `01 · BONDED COMPONENTS`
- **H1 — 2 lines**: “Rubber Bonded to Metal” / “in One Cure, Not Glued On After.”  (accent: in One Cure, Not Glued On After.)
  _10 words · the H1 states the process distinction rather than naming the product, because the distinction is the product. A buyer whose bonded mount has delaminated is searching for a supplier who bonds during vulcanisation, and this is the sentence they are looking for_
- **Subhead**:
  > Mounts, bushes, rollers, plungers and sealing elements with rubber vulcanised directly onto steel, stainless, aluminium or brass — prepared, primed and cured as one part at our ISO 9001:2015 plant in Nashik. There is no adhesive joint to fail, because there is no joint: the bond forms while the rubber cures.
  _52 words · the final clause is the technical claim the whole page rests on and it is true of co-cured bonding. It is also the reason this page converts — a post-cure adhesive assembly is what most low-cost suppliers ship, and it is what fails in service_
- **Spec chips ×3** (Chip | Why this one):
  | ISO 9001:2015 | Same first chip as every category page. The only certification held |
  | BONDED IN-HOUSE | The claim. Compounding, tooling, metal preparation and bonding under one roof, so a bond failure has one owner |
  | STEEL · STAINLESS · ALUMINIUM · BRASS | The qualifying question. A buyer with an aluminium housing scans for the word before reading anything else |
  _No piece count and no country figure, per the standing rules. And no bond-strength chip — the temptation on this page is a number above the fold, and a number above the fold is the one thing section 06 exists to refuse_
- **CTA slot**: `[ Send your bonded part drawing → /contact?part=Bonded%20Components ]`
  _The hero CTA slot renders empty on several category pages because nothing is passed to it. Populate it. /contact?part=… canonicals to /contact_
  <details><summary>notes (3)</summary>
  - Heading. The page’s only <h1>, two <span class="block"> children — not stacked bare JSX spans, which is the sitewide whitespace bug.
  - Image alt, if a hero image is added: “Rubber-to-metal bonded mounts and bushes moulded at Margo Rubber Products, Nashik”.
  - Chips are <li> in a <ul>, uppercase set in CSS.
  </details>

## 02 What we bond [New]
> live: NO LIVE SECTION → card grid, six cards, from the /products/pads-stoppers-caps component
- **Eyebrow**: `02 · APPLICATIONS`
- **H2**: “Six Places the Bond Is the Part”
  _7 words · frames the section as a capability map rather than a product list, which is what it is. Every card links to a category page — this section is the hub that finally connects the process to the products_
- **Intro**:
  > Most of what we already supply is bonded. These six are the families where the metal and the rubber have to work as one component, and where a bond that separates is a failure of the whole assembly rather than a cosmetic defect.
  _42 words · “most of what we already supply is bonded” is the honest framing and it is the argument for this page existing at all_
- **Cards ×6** (Card | Body | Links to):
  | Anti-vibration mounts | Sandwich, bobbin and conical mounts with rubber vulcanised between two metal faces. The bond carries every load the mount carries, in shear and in compression, for the life of the machine. | /products/anti-vibration-mounts |
  | Bonded bushes and sleeves | Inner sleeve, rubber, outer sleeve, bonded in one cure. Torsional stiffness comes from the rubber section and the interference; the bond is what stops the sleeve spinning inside the housing. | /products/bushes |
  | Rollers and wheels | A rubber covering bonded to a steel or aluminium core, ground to your outside diameter and concentricity after cure. Bonded rather than sleeved, so it cannot creep under torque. | — enquire |
  | Plungers, pistons and stems | A rubber sealing element moulded onto a metal stem. The rubber does the sealing and the metal takes the drive load, and nothing between them is an adhesive joint added later. | /products/pads-stoppers-caps |
  | Diaphragms with moulded-in plates | Where a diaphragm drives a stem or seats against a plate, the metal is bonded in during cure — no assembly stack, no adhesive line, no tolerance chain between two parts. | /products/diaphragms |
  | Vessel and pipework lining | Sheet rubber bonded to a steel vessel, sump or chute to protect it from abrasion or chemical attack. Same process, larger scale, and bonded rather than mechanically fixed. | /products/rubber-lining |
  _Five of six link to a real category page and the sixth says so plainly. Rollers are a genuine capability with no category of their own; “enquire” is honest and a dead link is not.
The lining card connects two capabilities the website has always kept apart. Sheet lining is client-confirmed as supplied, bonding is client-confirmed as in-house, and nothing on the site has ever said they are the same process. This card is where that finally gets said.
Sequencing note for the developer: the lining card points at /products/rubber-lining, which is written — sheet 38_Product_Rubber_Lining.html, 2026-09-03. Ship the two together and the card resolves_
  <details><summary>notes (3)</summary>
  - Card titles are <h3>. Bonded bushes, bonded rollers and rubber lined vessel are all distinct searched terms and each needs to be a real heading.
  - Six internal links with descriptive anchors — on the part names, never on “learn more”. This is the highest-value internal-linking block added to the site in this content set: it connects a process page to five product categories in one section.
  - All six cards in the DOM at first paint. If built as a filter, hide with CSS.
  </details>

## 03 How the bond is made [New]
> live: NO LIVE SECTION → accordion, three panels, from the /products/bellows material accordion
- **Eyebrow**: `03 · PROCESS`
- **H2**: “Three Steps, and the Third Is the Cure”
  _8 words · the heading carries the argument. The bond is not a fourth step added after moulding — it happens during it, and that is the whole distinction_
- **Panel 1 — Metal preparation**:
  > Every bond failure we have ever seen started here. The metal is degreased, grit-blasted to a controlled profile and chemically treated, then bonded within a defined window before the surface re-oxidises. A part that sits overnight between blasting and priming is a part that will delaminate in service, so preparation and priming run as one operation, not two shifts.
  _60 words · the most persuasive paragraph on the page and it costs nothing to state. Every experienced buyer knows surface preparation is where bonds are won and lost; saying it first, and naming the failure mode we design against, reads as a supplier who has debugged this rather than one who has read about it_
- **Panel 2 — Two-coat bonding system**:
  > A primer goes onto the prepared metal and a cover coat over it, matched to the compound being bonded. The primer grips the metal; the cover coat co-vulcanises with the rubber. The two are a system — a cover coat chosen for natural rubber will not hold FKM — so the bonding system is selected with the compound, not after it.
  _58 words · describes the standard two-coat architecture without naming a brand. No adhesive supplier is named, which keeps the page accurate whichever system a given part uses and avoids implying an approval Margo does not hold_
- **Panel 3 — Bonded during vulcanisation**:
  > The prepared insert is loaded into the tool and the rubber is moulded onto it. Heat and pressure cure the compound and complete the bond in the same cycle, so the finished part comes out of the tool as one component. Nothing is glued, clamped or pressed together afterwards, and there is no assembly joint to inspect, because there is no assembly.
  _61 words · the payoff for the two panels above. This is the sentence that should be quoted back to us in an enquiry, and it is written to be extractable on its own_
- **Closing note**:
  > Tooling is cut in-house, so the insert location, the flash line and the bond area are designed together rather than negotiated between a toolroom and a moulder. First samples come back 48 to 72 hours from an approved drawing.
  _39 words · the in-house toolroom matters more on a bonded part than on any other category, because insert location is a tooling decision and a bonding decision at the same time. 48–72 hours is the figure used on every page in this set_
  <details><summary>notes (3)</summary>
  - Three accordion panels, all three in the DOM at first paint, headings as <h3>. This section is the page’s topical authority — an unmounted panel here removes the reason the page ranks.
  - Link compound in panel 2 to the compound router in section 05, and tooling in the closing note to /about, where the in-house toolroom is described.
  - No brand names. Not Chemlok, not Cilbond, not Megum. Naming an adhesive system on a category page implies a qualification or an approval, and Margo holds none.
  </details>

## 04 Metals we bond to [New]
> live: NO LIVE SECTION → four-column table, from the /products/bellows spec table component
- **Eyebrow**: `04 · SUBSTRATES`
- **H2**: “Not Every Metal Bonds the Same Way”
  _7 words · a heading that concedes something is a heading buyers trust. It also sets up the aluminium and stainless rows, which are the two a specifier actually needs to ask about_
- **Metals table** (Substrate | Preparation | Bonds | What to tell us):
  | Mild and carbon steel | Degrease, grit blast, phosphate | Readily | Grade and whether the part is plated. Plating and bonding do not mix — bond first, or specify unplated |
  | Stainless steel (304, 316) | Degrease, grit blast, chemical treatment | Well, with the right primer | The grade. Passivated surfaces need a different primer from mild steel and the bonding system changes with it |
  | Aluminium and alloys | Degrease, grit blast, etch or conversion coat | Well, with preparation | The alloy and any anodising. Anodised surfaces are the most common cause of a failed aluminium bond — tell us before tooling, not after |
  | Brass and bronze | Degrease, grit blast, chemical treatment | Well | Whether the part is machined or cast. Cast surfaces hold more contamination |
  | Zinc, cadmium and chrome plating | — | 🛑 Not recommended | Bond to the bare substrate and plate the exposed metal afterwards, or supply the insert unplated |
  _Five rows and the fifth is a refusal. Bonding to a plated surface is the most common thing a buyer asks for and the most common reason a bonded part comes back — the plating peels and takes the rubber with it. Saying no on the product page saves a failed programme and it is the row that will be screenshotted.
The anodising note is the second-most valuable line here. It is a real, specific, checkable warning that costs nothing to publish, and it is exactly the kind of detail a procurement engineer uses to sort suppliers who have made the part from suppliers who have quoted it.
No bond strength column. The “Bonds” column is qualitative on purpose — a figure here would be a specimen result read as a part rating_
  <details><summary>notes (3)</summary>
  - Real <table>, <th scope="col"> and <th scope="row">, wrapped in overflow-x:auto. This table answers “can you bond rubber to aluminium” and “can you bond rubber to stainless steel” — two high-intent queries with no good answer on any competitor page.
  - The refusal row ships as a visible row with a real value, not greyed out below the contrast threshold.
  - Row labels are not headings. The stat-values-as-headings bug is sitewide; do not reproduce it here.
  </details>

## 05 Compound selection [New]
> live: NO LIVE SECTION → router, from the /products/oil-seals compound selector — ranked, never a menu of equals
- **Eyebrow**: `05 · COMPOUND`
- **H2**: “The Duty Picks the Compound. The Compound Picks the Primer.”
  _10 words · states the dependency chain that makes this page different from every other compound table on the site. On a bonded part the compound choice is also a bonding-system choice, and that is a real constraint worth publishing_
- **Intro**:
  > Every compound we mix can be bonded, and the bonding system changes with each one. These are ranked for bonded parts — tell us the load, the medium and the temperature and we will confirm the pairing.
  _38 words · carries the client instruction of 2026-09-02 — every part in every compound, nothing removed, only ranked_
- **Compound router** (If the duty is | Compound | Service temperature | Note):
  | Vibration isolation, dynamic load, high deflection | Natural rubber | −20 to +90 °C | The default for bonded mounts and bushes. Best flex-fatigue resistance and best damping of the eight, and it bonds more readily than anything else here. No oil contact |
  | Oil, fuel or grease contact | NBR | −30 to +120 °C | The default where natural rubber would swell. Bonds well |
  | Weather, ozone, outdoor, water and steam | EPDM | −40 to +140 °C | For lining and outdoor mounts. Never in oil or fuel |
  | General purpose, marine, moderate oil, flame-retardant | Neoprene | −40 to +120 °C | The compromise compound, and it bonds readily |
  | Abrasion, slurry, lining, low cost | SBR | −30 to +100 °C | Abrasion resistance at commodity cost. No oil contact |
  | Hot oil and oil mist above nitrile’s ceiling | AEM | −40 to +175 °C
continuous to +160 °C | The middle answer between NBR and FKM, at well under FKM cost |
  | Aggressive chemistry, solvents, hot hydrocarbons | FKM | −20 to +250 °C
continuous to +200 °C | Bondable, and it needs its own bonding system. Poor in the cold |
  | Clean, high-temperature, low-load duty | Silicone | −60 to +220 °C | 🛑 The hardest of the eight to bond to metal and the weakest in tear. It needs a dedicated primer system and it is the wrong answer for a load-bearing bonded part. Specify it only where temperature forces it |
  _Every range is the homepage compound table, which governs across all thirteen category pages. FKM and AEM carry the continuous figure beneath the peak, settled 2026-09-03.
Natural rubber is ranked first here and nowhere else in the set, and that is correct rather than convenient: it has the best fatigue resistance and damping of the eight and it is the classic bonded-mount compound. An unranked selector would float silicone to the top on temperature range alone — onto a load-bearing bonded part, where it is both the hardest to bond and the weakest in tear.
The silicone row is the same refusal as the diaphragms page makes, for a different reason, and the two pages agreeing is worth more than either saying it alone_
  <details><summary>notes (3)</summary>
  - All eight rows in the DOM at first paint. On /products the same component hides seven of eight compound descriptions from crawlers.
  - Link each compound name once to its anchor on /products.
  - This table answers “what rubber is used for bonded mounts” with a routed answer. Keep it as one table so it can be lifted whole into an AI response.
  </details>

## 06 How the bond is verified [New · carries the page’s one CONFIRM]
> live: NO LIVE SECTION → quality block, from the /products/gaskets component
- **Eyebrow**: `06 · VERIFICATION`
- **H2**: “A Good Bond Fails in the Rubber”
  _7 words · the best heading in this content set. It states the industry’s actual acceptance criterion, it is checkable, it is true, and it replaces the bond-strength number this page is not allowed to publish with something more rigorous than a number would have been_
- **Body**:
  > Bond quality is judged by where the part breaks, not by how hard it was to break. Pull a sound bonded component apart and the tear runs through the rubber, leaving a rubber-covered metal face; a poor bond separates cleanly at the interface and the metal comes back bare. ASTM D429 puts a notation on that — R for failure in the rubber, RC at the rubber-to-cover-coat line, CP between cover coat and primer, M at the metal. The target is 100% R, and anything else is a rejected process, not a weaker part.
  _98 words · this is the page. It gives a specifier something to write into a drawing note, it is the real language of bonded-part qualification, and it lets Margo make a rigorous claim without publishing a single number. Competitor pages in this category publish a peel strength and nothing else — a figure from a specimen that says nothing about their part_
- **Test table** (Check | Method | When):
  | Visual bond line and flash | — | Every part |
  | Adhesion, destructive | ASTM D429 · failure mode to 100% R | Sample per batch, NABL partner laboratory |
  | Hardness | ASTM D2240 | In-house |
  | Tensile and elongation | ASTM D412 | In-house |
  | Compression set | ASTM D395 Method B | In-house |
  | Tear strength | ASTM D624 | NABL partner laboratory |
  | Dimensional conformity | ISO 3302-1 class M1 | In-house |
  |  |  |  |
  _ANSWERED 2026-09-03 — destructive adhesion testing runs at the NABL partner laboratory.
Client-confirmed: at the NABL partner laboratory. The row now reads “sample per batch, NABL partner laboratory”, which puts D429 on the same footing as tear, fluid immersion and ozone — tested, and tested somewhere nameable.
Margo’s published test list — hardness, tensile, compression set, ozone, fluid immersion, brittleness, abrasion, tear, rebound, flammability — does not include D429. Every moulder doing bonded work destroys a sample per batch and reads the failure mode; that is ordinary practice, not a capability claim. The row now says where it happens. That matters more than the method name: a buyer qualifying a bonded-part supplier checks whether the adhesion test is real or asserted, and a named laboratory is the difference.
The struck row stays struck. Dynamic fatigue is not held anywhere, exactly as on the bellows and diaphragms pages, and a bonded mount is precisely the part a buyer will ask cycle life about_
- **Ships with every consignment**:
  > Material test reports, dimensional inspection sheets and a certificate of conformance ship with every consignment. Batch records are retained per shipment and are available on request under NDA. Bonded parts are packed so the bond line is not loaded in transit.
  _42 words · the standard string used across the set, with a part-specific packing sentence, the way the oil-seal sheets add the sealing-lip note_
  <details><summary>notes (3)</summary>
  - The failure-mode paragraph is this page’s extractable answer. It is written to stand alone in an AI response and it is the block that will be quoted. Keep it as one <p>.
  - The four notation letters are <strong>, not an image or a graphic. R, RC, CP and M are the strings a specifier searches.
  - No Certification schema for test methods. A test method is not a credential.
  </details>

## 07 What we need to quote [New]
> live: NO LIVE SECTION → spec table, from the /products/diaphragms component (sheet 36)
- **Eyebrow**: `07 · SPECIFICATION`
- **H2**: “What We Need to Quote”
  _5 words · the same heading as the diaphragms page, deliberately. Two category pages asking for a specification in the same words reads as a house standard rather than a coincidence_
- **Spec table** (Input | Range | Why we ask):
  | Insert material | steel · stainless · aluminium · brass | Decides the preparation and the primer. See section 04 |
  | Insert finish | bare · plated · anodised | The single most important line on this table. Plated and anodised surfaces change the answer or rule it out |
  | Insert drawing | PDF · DWG · DXF · STEP | We need the bond face, not just the outline |
  | Rubber section | to drawing | Bond area follows from it, and so does stiffness |
  | Load and direction | static · shear · compression · torsion | A mount loaded in shear and one loaded in compression are different parts at the same size |
  | Medium | named fluid | Decides the compound, and the compound decides the bonding system |
  | Service temperature | −60 to +250 °C
across the eight compounds | Narrows the compound with the medium |
  | Hardness | 40 – 80 Shore A | Our output, not your input — recommended against the duty unless your drawing fixes it |
  | Post-cure machining | ground OD · concentricity | Rollers and wheels are ground after cure; tell us the finished dimension and the runout |
  | Dimensional tolerance | ISO 3302-1 class M1 | Tolerance follows the section, as on every moulded part in this catalogue |
  _Ten rows, and the second is the one that saves a programme. Insert finish is where bonded enquiries go wrong, and asking for it in row two — before the drawing — is the difference between quoting a part and quoting a part that can be made
The hardness row inverts the usual direction, the same way it does on the diaphragms, bushes and grommets sheets: hardness follows from the duty, so it is our output rather than the buyer’s input_
- **Footnote**:
  > Or send the failed part. A bond that separated cleanly and left bare metal is a preparation or primer problem; rubber left on the metal with a tear through the section means the bond held and the compound or the geometry did not. The two failures have different fixes, and we can usually tell which you have from the part.
  _58 words · the diagnostic paragraph, and on this page it is the strongest one in the set. It converts a buyer holding a failed bonded part from a competitor, it demonstrates the failure-mode literacy section 06 sets up, and it claims nothing that cannot be shown. The oil-seals and diaphragms sheets carry the same structure — this is the house pattern_
  <details><summary>notes (2)</summary>
  - Real table, overflow-x:auto, <th scope> on both axes. This is the second-most extractable block on the page after section 06.
  - Link section 04 and the eight compounds as in-page anchors, so the table is navigable without scrolling back.
  </details>

## 08 Certification [Shared]
> live: SHARED COMPONENT → identical on all thirteen category pages · do not retype it, do not add to it
- **Certification block**: `ISO 9001:2015 · Certificate 09111526A
Integral Certification Ltd · Valid to 21 February 2027
Scope: rubber moulded components — quality management, not a product approval
IATF 16949 — upgrade in progress, certification targeted by end 2026
ISO 14001 and ISO 45001 — targeted 2027`
  _The exact string used across the set, client-instructed 2026-08-31 and 2026-09-01. Nothing is added.
One scope note is worth making here, in the rationale rather than on the page: the certificate covers rubber moulded components, and a bonded component is a moulding plus a metal insert. The moulding operation is in scope. If a buyer’s auditor asks whether the bonding operation is separately covered, that is a question for Integral Certification at the next surveillance audit — the same question sheet SKU 14 raised about complete shaft-seal assemblies. Do not pre-empt the answer on the page_
  <details><summary>notes (2)</summary>
  - The certificate PDF link is shared and currently dead across nine industry pages and every category page. Do not add another dead download — either the hosted scan exists at build time or the button does not render.
  - Only ISO 9001:2015 goes into hasCredential, and only on the homepage Organization node. No in-progress row as structured data.
  </details>

## 09 Technical & commercial questions [New]
> live: NO LIVE SECTION → FAQ accordion, six questions, from the /products/bellows component · these six are the FAQPage mainEntity, verbatim
- **Q1**: “Can you bond rubber to aluminium and stainless steel?”
  _64 words · the highest-volume qualifying question in this category, answered yes with the condition attached rather than yes with a caveat buried in a datasheet_
- **Q2**: “How strong is the bond?”
  _104 words · the most important answer on the page and the direct counterpart to the diaphragms page refusing cycle life. Refusing the number and offering the criterion is a stronger commercial position, because the number would be read as a warranty and the criterion is read as competence_
- **Q3**: “Do you bond during moulding or glue the parts afterwards?”
  _61 words · the question a buyer asks when a previous supplier’s part delaminated. Answering it as a flat process fact, not a selling point, is what makes it land_
- **Q4**: “Can you supply the metal inserts, or do we send them?”
  _55 words · a commercial question with a technical answer, and it surfaces the in-house toolroom for the second time without repeating the earlier sentence_
- **Q5**: “What is the minimum order quantity for bonded components?”
  _64 words · the standard answer, client-instructed 2026-09-01, with one part-specific sentence appended — the same pattern the SKU sheets use. The standard sentences are not reworded_
- **Q6**: “What are your payment and delivery terms for international orders?”
  _48 words · the standard commercial string, unchanged, with the sitewide 3–4 week lead time_
  <details><summary>notes (3)</summary>
  - All six panels in the DOM at first paint. FAQPage schema whose answers are not in the HTML is a structured-data mismatch.
  - Questions are <h3>, answers are <p>, and the schema strings match the rendered text character for character.
  - Q1 and Q2 are the two extractable answers. Q1 wins the long-tail substrate queries; Q2 is the one an AI assistant will quote when asked how to specify a bonded part.
  </details>

## 10 Enquiries [Shared]
> live: SHARED CTA COMPONENT → use the one that renders correctly, not the variant on the four industry pages that prints +91 (Nashik), Contact for number and Contact for email
- **Eyebrow**: `10 · ENQUIRIES`
- **H2**: “Request a Bonded Component Quotation”
  _5 words · “quotation” is the transactional term used on every page in this set_
- **Body**:
  > Send the insert drawing and the rubber section, and tell us the insert finish, the load direction and the medium. Or send the part that failed and we will tell you whether the bond or the compound let go. Our engineering team responds within 48 hours with a compound and bonding-system recommendation, dimensional confirmation and a quotation.
  _58 words · both entry points — the drawing and the failed part — offered at the point of conversion. 48 hours is the sitewide figure_
- **Buttons ×2**: `[ Request a quote → /contact?part=Bonded%20Components ]
[ ← Back to Products → /products ]`
  _Primary and secondary, the same pair as every category page. A named conversion event fires on submit_
  <details><summary>notes (2)</summary>
  - /contact?part=Bonded%20Components canonicals to /contact.
  - Add a “Bonded Components” option to the contact form product dropdown, which currently lists eleven categories plus “Not sure / other”. With diaphragms it becomes thirteen.
  </details>

## 11 Footer [One string, all pages]
> live: GLOBAL COMPONENT → the Products column grows again · do not sweep it yet
- **Products column**: `SEALING
O-Rings · Oil Seals · Gaskets · Diaphragms · Reciprocating Seals · Leak Test Rubber
MOUNTING & PROTECTION
Anti-Vibration Mounts · Bushes & Bushings · Bonded Components · Bellows · Grommets · Pads, Stoppers & Caps
SHEET & PROFILE
Extrusion Profiles · Sponge & Foam Rubber · Rubber Lining & Skirting`
  _The sweep has run. The Products column now ships grouped in all twenty-nine sheets — Sealing (6), Mounting & protection (6), Sheet & profile (3) — because fifteen entries in a column designed for eleven is not readable as a flat list. The third group is also the commercial split: those three are quoted by length or area rather than by piece count. “Seals” ships as “Reciprocating Seals” so it is not read as a parent of O-Rings and Oil Seals. Group labels are <p> or <div>, never headings. The identical eleven-category string ships in twenty-nine sheets today. Diaphragms made it twelve, this page makes it thirteen, and /products/rubber-lining and /products/seals are both still to be written in this run. Sweep the footer once, after all seven new pages exist — four separate sweeps of twenty-nine files is four chances to leave the set inconsistent, which is the exact defect this content set was commissioned to remove_
- **Legal line**: `© 2026 Margo Rubber Products. All rights reserved. Privacy Policy · Terms & Conditions · Disclaimer ISO 9001:2015 · Certificate 09111526A · Integral Certification Ltd`
  _The identical string used in all twenty-nine sheets. Not © 2024 Margo Rubber Industries Pvt. Ltd., which is what the shared footer renders today on the seven resource-article URLs_
  <details><summary>notes (4)</summary>
  - Footer column labels are <p> or <div>, never headings.
  - Add /products/bonded-components to sitemap/products/0.xml and to the URL registry in phase0-route-handlers/lib/site.ts, which is the single source every canonical and JSON-LD block derives from.
  - Add it to the /products hub grid, moulded group.
  - Update the link in sheet 36, section 05. The diaphragms page links moulded in to /resources/rubber-to-metal-bonded-parts-guide with a note to repoint it here once this page exists. It exists.
  </details>