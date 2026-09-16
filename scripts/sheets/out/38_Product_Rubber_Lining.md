# 38_Product_Rubber_Lining.html — Rubber Lining & Conveyor Skirting Page Content Sheet

**<title>** Rubber Lining & Conveyor Skirting Manufacturer India | Margo
**description** Abrasion-resistant rubber sheet lining for chutes, hoppers, tanks and pump casings, and conveyor skirting cut to length — natural rubber, SBR, neoprene or EPDM, cut to your drawing in Nashik. ISO 9001:2015.

## 01 Hero [New]
> live: NO LIVE SECTION → build from the /products/sponge-foam-rubber hero component
- **Eyebrow**: `01 · LINING & SKIRTING`
- **H1 — 2 lines**: “Rubber Lining and Conveyor Skirting,” / “Cut to Your Drawing.”  (accent: Cut to Your Drawing.)
  _9 words · both product names in the H1 because they are two searches and one enquiry. “Cut to your drawing” sets the supply scope in the highest-weight element on the page, which is where a scope boundary is cheapest to establish_
- **Subhead**:
  > Abrasion-resistant sheet lining for chutes, hoppers, tanks, sumps and pump casings, and skirting cut to length for conveyor load points — in the same compounds we mix for moulded components, at our ISO 9001:2015 plant in Nashik. Natural rubber has the best abrasion resistance of the eight, and on a lining that is usually the whole specification.
  _57 words · “the same compounds we mix for moulded components” is the differentiator and it is true. A lining supplier who buys sheet in has no control over the compound; Margo mixes it. That sentence is the reason this page belongs on this domain rather than reading as a bolt-on_
- **Spec chips ×3** (Chip | Why this one):
  | ISO 9001:2015 | Same first chip as every category page |
  | 6 – 25 MM SHEET | The first spec a lining buyer checks. Publishing the range qualifies the enquiry before the form |
  | COMPOUNDED IN-HOUSE | The claim that separates a manufacturer from a stockist in a category full of stockists |
  _No piece count — and on this page a piece count would be meaningless anyway, since lining is quoted by area and skirting by length. See section 09, Q5_
- **CTA slot**: `[ Send your area and duty → /contact?part=Rubber%20Lining ]`
  _“Area and duty” rather than “drawing”, because a lining enquiry usually starts before there is a drawing — sheet 21’s FAQ asks for exactly these two inputs_
  <details><summary>notes (3)</summary>
  - Heading. The page’s only <h1>, two <span class="block"> children — not stacked bare JSX spans.
  - Image alt, if a hero image is added: “Natural rubber chute lining and conveyor skirting cut at Margo Rubber Products, Nashik”.
  - Chips are <li> in a <ul>, uppercase set in CSS.
  </details>

## 02 What we line [New]
> live: NO LIVE SECTION → card grid, six cards, from the /products/pads-stoppers-caps component
- **Eyebrow**: `02 · APPLICATIONS`
- **H2**: “Where the Wear Happens”
  _4 words · names the problem rather than the product. Every card below is a place a plant engineer already knows is failing_
- **Intro**:
  > Lining is not a coating. It is a wear part in sheet form, sacrificial by design, sized so it fails before the steel does and can be replaced without taking the structure apart.
  _33 words · “sacrificial by design” is the framing that stops a buyer treating lining as a paint alternative, and it makes the thickness table in section 03 read as a design decision rather than a price list_
- **Cards ×6** (Card | Body | Links to):
  | Chutes and transfer points | Impact and sliding abrasion in one place, usually with the worst duty at the impact zone and lighter wear downstream. Lined in soft natural rubber, thickest where the material lands. | /industries/mining |
  | Hoppers and bins | Sliding abrasion over large flat areas, plus the build-up problem. A resilient lining sheds material that a steel wall holds. | /industries/mining |
  | Pump casings and sumps | Slurry duty, where the lining protects the casing and the moulded wear components protect the flow path. We supply both halves. | /industries/pumps-valves |
  | Tanks and vessels | Chemical and abrasion protection for process tanks, in EPDM for water, dilute acids and alkalis, or natural rubber where the duty is abrasive rather than aggressive. | /industries/water-fluid-management |
  | Pipework and bends | Bends wear first and wear unevenly. Lined sections are replaced on a schedule instead of the pipe run being rebuilt. | /industries/water-fluid-management |
  | Conveyor skirting and dust curtains | Strips that seal the gap between the belt and the skirtboard at load points, containing fines and dust. Cut to length, softer than the belt cover by design. See section 05. | /industries/mining |
  _All six link to a real industry page — no dead affordances. Three point at mining, which is correct: mining is where lining is bought, and sheet 21 is the page that raised this product line.
The pump casings card does the reconciliation work. Sheets 21 and 24 were rewritten so mining and pumps & valves stop taking opposite positions on wear parts; this card states the settled position in one sentence — moulded components and sheet lining, both supplied_
  <details><summary>notes (3)</summary>
  - Card titles are <h3>. chute lining, tank lining and conveyor skirting are three distinct searched terms and each needs a real heading.
  - Six internal links on the application names, never on “read more”. This page is the missing hub between three industry pages and a product line.
  - All six cards in the DOM at first paint.
  </details>

## 03 Sheet specification [New]
> live: NO LIVE SECTION → spec table, from the /products/sponge-foam-rubber thickness table
- **Eyebrow**: `03 · SPECIFICATION`
- **H2**: “Thickness Is a Wear-Life Decision”
  _5 words · the heading reframes the first question every lining buyer asks. Thickness is usually treated as a price lever; it is a service-interval decision, and saying so positions the quotation conversation correctly_
- **Sheet table** (Duty | Thickness | Hardness | Typical use):
  | Light sliding abrasion | 6 – 8 mm | 55 – 65 Shore A | Hopper walls, launders, low-drop transfer |
  | General abrasion | 10 – 12 mm | 45 – 60 Shore A | Chute bodies, pipework, sumps |
  | Impact and abrasion | 15 – 25 mm | 35 – 45 Shore A | Impact zones, crusher discharge, high-drop transfer |
  | Chemical, non-abrasive | 6 – 10 mm | 60 – 70 Shore A | Tanks and vessels in water and dilute chemistry |
  | Conveyor skirting | 6 – 25 mm | 40 – 60 Shore A | Cut to length, see section 05 |
  _Hardness runs the opposite way to intuition and the table shows it. Impact duty takes the softest rubber, not the hardest — a soft, resilient lining absorbs and rebounds where a hard one cracks. Buyers routinely specify this backwards, and a table that encodes the correct direction is worth more than a paragraph explaining it.
Sheet width and length are quoted against the job and deliberately not published as a stock size. Publishing a roll width invites a buyer to design around a size we may not hold_
- **What to send**:
  > Send the surface area and the duty — what the material is, how far it drops, and how abrasive it is. A drawing or a development helps but is not needed to quote. If you are replacing an existing lining, tell us how long the last one lasted; that single number sizes the next one better than any specification.
  _58 words · the last sentence is the most useful thing on this page. Wear life is empirical, and a buyer who knows their current service interval has already done the engineering. Asking for it reads as experience and it shortens the quotation loop.
The two inputs match sheet 21’s FAQ exactly — “send the surface area, the thickness and the duty” — so the industry page and the product page ask for the same things in the same words_
  <details><summary>notes (3)</summary>
  - Real <table> with <th scope> on both axes, wrapped in overflow-x:auto. This block answers “what thickness rubber lining for a chute” — a specific, high-intent query with no good answer on any Indian competitor page.
  - Row labels are not headings.
  - No stock-size list and no price per square metre.
  </details>

## 04 Compound selection [New]
> live: NO LIVE SECTION → router, from the /products/oil-seals compound selector
- **Eyebrow**: `04 · COMPOUND`
- **H2**: “Abrasive or Aggressive? They Need Different Rubber.”
  _7 words · the routing question stated as the heading. Abrasion duty and chemical duty pull in opposite directions and most lining enquiries are one or the other_
- **Intro**:
  > Every compound we mix is available as sheet. These are ranked for lining — and unlike every other page in this catalogue, the answer here is usually the cheapest one on the list.
  _33 words · carries the client instruction of 2026-09-02, and the second clause is an honest and disarming thing for a manufacturer to say. On lining, natural rubber genuinely does win, and it is not the premium option_
- **Compound router** (If the duty is | Compound | Service temperature | Note):
  | Abrasion, impact, slurry — the standard lining duty | Natural rubber | −20 to +90 °C | The default, and the best abrasion resistance of the eight. Soft grades for impact, harder for sliding wear. No oil contact |
  | Abrasion at lower cost, dry duty | SBR | −30 to +100 °C | Close to natural rubber in sliding abrasion, cheaper, less resilient under impact. No oil contact |
  | Water, steam, dilute acids and alkalis, outdoor | EPDM | −40 to +140 °C | The default for tanks and water service. Excellent ozone and weathering. Never in oil or fuel |
  | Oil, fuel or grease contamination in the stream | NBR | −30 to +120 °C | Where natural rubber and SBR would swell. Lower abrasion resistance than either — a trade you make only when you must |
  | Marine, moderate oil, flame-retardant grades | Neoprene | −40 to +120 °C | The general-purpose compromise, and the usual answer where a fire rating is specified |
  | Aggressive chemistry, solvents, hot service | FKM | −20 to +250 °C
continuous to +200 °C | Available as sheet and rarely justified — at lining areas the cost is significant. Specify it on the medium, not on the temperature alone |
  | Hot oil and oil mist | AEM | −40 to +175 °C
continuous to +160 °C | Rarely a lining duty. Listed because every compound is available |
  | Clean, high-temperature, non-abrasive | Silicone | −60 to +220 °C | 🛑 Not a lining compound. Low tear strength and poor abrasion resistance — the two properties a lining exists to provide. Available, and almost never right |
  _Every range is the homepage compound table, which governs across all fourteen category pages. FKM and AEM carry the continuous figure beneath the peak.
Natural rubber ranks first here and on the bonded-components page, for different reasons — abrasion here, fatigue and damping there. Two pages ranking the cheapest compound first is a pattern a buyer notices.
The silicone row is the third refusal in three new pages, and again for a compound-specific reason rather than a generic one: on the diaphragms page it is tear and flex fatigue, on bonded components it is bond difficulty, here it is abrasion. Same conclusion, three different arguments, which is what makes it credible rather than formulaic.
Butyl is absent and that is deliberate. It is the classic chemical-tank lining compound and Margo does not mix it — see the banner at the head of this sheet and Q4 in section 09_
  <details><summary>notes (3)</summary>
  - All eight rows in the DOM at first paint.
  - Link each compound name once to its anchor on /products.
  - This table answers “what rubber is used for chute lining” with a routed answer — keep it as one table so it lifts whole.
  </details>

## 05 Conveyor skirting [New]
> live: NO LIVE SECTION → from the /products/extrusion profile table — sold by the metre, quoted against total length
- **Eyebrow**: `05 · SKIRTING`
- **H2**: “Skirting Should Wear Out Before Your Belt Does”
  _8 words · the single most valuable sentence on this page for a mining buyer, and the one detail most skirting suppliers get wrong. It states the design rule and the failure it prevents in one heading_
- **Body**:
  > Skirting seals the gap between the belt and the skirtboard at a load point, containing fines and dust where the material lands. It has to be softer than the belt’s top cover. A skirting strip harder than the cover does not wear — the belt does, and a grooved belt costs several orders of magnitude more than the strip that grooved it. We supply skirting at 40 to 60 Shore A for that reason, and we will ask what belt you are running before we quote a hardness.
  _86 words · this is the expert paragraph that wins the enquiry. It names a real, expensive, common failure; it explains the mechanism; it justifies a hardness range; and it ends with a qualifying question rather than a product. Nothing else on this page needs to be read for a maintenance engineer to believe the supplier has done this before_
- **Skirting table** (Item | Range | Note):
  | Thickness | 6 – 25 mm | Set by the skirtboard clamp and the gap |
  | Width | 100 – 300 mm | Cut to your skirtboard. Allow for the wear length, not just the seal |
  | Hardness | 40 – 60 Shore A | Softer than the belt top cover. Tell us the belt grade |
  | Compound | Natural rubber · SBR | Natural rubber for abrasive fines, SBR where cost governs |
  | Supply | cut to length | Quoted against total metreage, not per piece |
  | Also supplied | dust curtains · chute seals | Same compounds, same sheet, cut to your opening |
  _Six rows and the hardness row is the one that carries the argument from the paragraph above into a specification a buyer can act on
“Quoted against total metreage, not per piece” is the commercial model, and it matches the extrusion page exactly — sheet 18 quotes its minimum per profile against total length for the same reason. See section 09, Q5_
- **Boundary note**:
  > We supply skirting rubber and dust curtain sheet. We do not supply skirtboard steelwork, clamps or sealing systems.
  _18 words · a scope boundary stated before it is asked about. Skirting is usually bought as part of a sealing system and the systems are a different trade — saying so stops an enquiry that was never going to close and protects the ones that are_
  <details><summary>notes (3)</summary>
  - This section has its own <h2> and its own anchor — #skirting. conveyor skirting rubber supplier is a distinct search from rubber lining manufacturer, and the industry pages should link to this anchor directly rather than to the page top.
  - The softer-than-the-belt paragraph is this page’s extractable answer. Written to stand alone; it is the block that will be quoted.
  - No belt-grade compatibility chart. That is a belt manufacturer’s data, not ours.
  </details>

## 06 Abrasion, measured [New]
> live: NO LIVE SECTION → quality block, from the /products/gaskets component
- **Eyebrow**: `06 · TESTING`
- **H2**: “We Can Put a Number on the Abrasion”
  _8 words · and on this page, for once, that is true. Abrasion is on Margo’s published test list. The diaphragms page had to refuse cycle life and the bonded-components page had to refuse bond strength — this is the first of the three new product pages where the headline technical question can actually be answered with a measurement, and the heading should say so_
- **Body**:
  > Abrasion resistance is measured as volume loss to ISO 4649 (equivalently ASTM D5963) — a rotating drum test that reports how many cubic millimetres a standard specimen loses over a fixed path. Lower is better, and it is the one number that ranks lining compounds meaningfully. We report it on the compound supplied, per batch, rather than publishing a figure here — a headline number belongs to a specific formulation, and quoting one on a category page is how a buyer ends up designing around a compound they were never sent.
  _92 words · the same discipline as the other two new pages, but with a different outcome: the test exists, Margo has access to it, and the offer is a real report rather than a qualification programme. Publishing the method and withholding the headline number is the honest position and it still ranks for rubber lining abrasion resistance_
- **Test table** (Property | Method | Where):
  | Abrasion loss | ISO 4649 · ASTM D5963 | NABL partner laboratory |
  | Hardness | ASTM D2240 | In-house |
  | Tensile and elongation | ASTM D412 | In-house |
  | Tear strength | ASTM D624 | NABL partner laboratory |
  | Fluid immersion / volume swell | ASTM D471 | NABL partner laboratory |
  | Ozone resistance | ISO 1431-1 | NABL partner laboratory |
  | Adhesion to steel | ASTM D429 · failure mode to 100% R | See sheet 37 |
  |  |  |  |
  _CONFIRM · The struck row is the honest limit of section 06. Abrasion loss ranks compounds; it does not predict months in a chute. Impact energy, particle shape, moisture and drop height all govern, and none of them is in the test. Saying so keeps the number credible — a supplier who claims a laboratory figure predicts service life has told a buyer something they can disprove.
The adhesion row carries sheet 37’s CONFIRM forward. A bonded lining is a rubber-to-metal bond and it is qualified the same way — failure mode, not force. The two pages must give the same answer, so resolve the D429 question once_
- **Ships with every consignment**:
  > Material test reports, dimensional inspection sheets and a certificate of conformance ship with every consignment. Batch records are retained per shipment and are available on request under NDA. Sheet is rolled and packed so the bonding face is not contaminated in transit.
  _44 words · the standard string used across the set, with a part-specific packing sentence — and on lining the packing note matters, because a contaminated bonding face is a lining that does not stick_
  <details><summary>notes (3)</summary>
  - ISO 4649 and ASTM D5963 are plain text in table cells. These are the strings a specifier searches and an AI assistant matches.
  - The struck row ships visible, with a real value, not below the contrast threshold.
  - No Certification schema for test methods.
  </details>

## 07 Supplied or fitted [🛑 Written both ways — pick one at build time]
> live: NO LIVE SECTION → two accordion panels, from the /products/bellows component · this section carries the page’s one CONFIRM
- **The question**:
  > Client-confirmed 2026-09-03: Margo fits lining. Ship Version B below. Version A stays in this sheet as a record of the decision, not as an option.
  _The client confirmation of 2026-09-02 was that Margo supplies rubber sheet lining and conveyor skirting. It said nothing about installation, and the two are different businesses — fitting means adhesive systems, site crews, surface preparation on the customer’s steel, and either cold bonding or autoclave vulcanising.
Sheets 21, 24 and 28 already publish the phrase “tell us whether you need the lining supplied or fitted”, which offers both — and with fitting confirmed, those three sheets are now correct as written and need no edit. That was the risk this CONFIRM was raised to catch, and it has landed the right way.
Three things follow from the answer and none of them is copy: the page needs a Service node in its schema, a named geographic service area, and a stated exclusions line — scaffolding, confined-space entry and plant shutdown coordination. A service claim carries obligations a product page does not, and Version B shipping without a service area promises national on-site installation by implication. Those three are listed under Version B below_
- **H2**: “Supplied Cut, Prepared and Ready to Bond”
- **Panel 1**:
  > We supply lining as sheet, cut and prepared to your development or template, with the bonding face ready for your applicator’s adhesive system. Skirting ships cut to length. What we do not do is fit — site installation is an applicator’s trade with its own crews, surface preparation and vulcanising equipment, and we would rather tell you that now than on site.
  _62 words · a refusal stated as competence. “We would rather tell you now than on site” is the sentence that keeps a buyer who needed fitting warm for the next enquiry that does not_
- **Panel 2**:
  > Send a development, a template or the dimensions of the surface and we will cut to it. If your applicator has a preferred adhesive system, tell us and we will supply the compound with a bonding face prepared for it.
  _40 words · makes the applicator an ally rather than a competitor, which is how the supply-only model actually wins work_
- **H2**: “Supplied Cut, or Supplied and Fitted”
- **Panel 1**:
  > Lining is supplied cut and prepared to your development, or supplied and fitted — tell us which when you enquire, because it changes the specification as well as the price. A fitted lining is bonded to prepared steel; a supplied one arrives ready for your applicator’s system.
  _47 words · if fitting is confirmed, this is the framing — the choice offered as a specification question rather than an upsell_
- **Panel 2**:
  > Where we fit, the steel is degreased and grit-blasted to a controlled profile before priming, and the lining is bonded within a defined window before the surface re-oxidises — the same discipline described on our bonded components page, at a larger scale.
  _42 words · reuses the surface-preparation argument from sheet 37 section 03, which is the strongest paragraph in this run. Only ships if fitting is confirmed_
- **Also required if Version B ships**:
  > A Service node in the page schema, a named geographic service area, and a line on what is not included — scaffolding, confined-space entry, plant shutdown coordination.
  _A service claim brings obligations a product page does not. If Version B ships without a service area and an exclusions line, the page promises national on-site installation by implication_

## 08 Certification [Shared]
> live: SHARED COMPONENT → identical on all fourteen category pages · do not retype it, do not add to it
- **Certification block**: `ISO 9001:2015 · Certificate 09111526A
Integral Certification Ltd · Valid to 21 February 2027
Scope: rubber moulded components — quality management, not a product approval
IATF 16949 — upgrade in progress, certification targeted by end 2026
ISO 14001 and ISO 45001 — targeted 2027`
  _The exact string used across the set, client-instructed 2026-08-31 and 2026-09-01. Nothing is added.
🛑 The scope note deserves attention on this page more than any other in the set. The certificate covers rubber moulded components. Sheet lining is calendered and cut, not moulded. The badge is honest as a statement of the quality system, and it is not a claim that lining is within the certified scope. Sheet SKU 14 raised the same question about complete shaft-seal assemblies and the answer was the same: ask Integral Certification at the next surveillance audit, and do not pre-empt it on the page.
Do not write “ISO 9001:2015 certified lining” anywhere on this page. The company holds the certificate; the product does not_
  <details><summary>notes (2)</summary>
  - No potable-water claim, on any lining, ever. Tank lining invites it. WRAS, NSF/ANSI/CAN 61, AS/NZS 4020 and KTW-BWGL attach to a compound formulation held by the compound supplier — never to “EPDM” and never to Margo. Sheet 28 carries the full position; use those words if a buyer asks.
  - The certificate PDF link is shared and currently dead across every category page. Do not add another dead download.
  </details>

## 09 Technical & commercial questions [New]
> live: NO LIVE SECTION → FAQ accordion, six questions · these six are the FAQPage mainEntity, verbatim
- **Q1** (composite):
  · H: “Do you supply rubber lining and conveyor skirting?”
  · Yes. Alongside moulded and extruded components we supply rubber sheet lining and conveyor skirting — chute, hopper, tank and pipework lining, and skirting cut to size — in natural rubber, which has the best abrasion resistance of the eight compounds we mix. Send the surface area, the thickness and the duty, and tell us whether you need it supplied cut or supplied and fitted.
  _65 words · this is sheet 21’s FAQ answer, reused verbatim to the comma. The mining page and the product page must give the same answer in the same words — two pages on one domain answering the same question differently is the defect this whole content set exists to remove.
🛑 The final clause depends on section 07. If Version A ships, it becomes “and we will cut to your development” — and sheets 21, 24 and 28 change with it_
- **Q2** (composite):
  · H: “Which rubber lasts longest in an abrasive chute?”
  · Natural rubber, in almost every case. It has the best abrasion resistance of the eight compounds we mix and the best resilience under impact, which is why a soft grade outlasts a hard one where material is dropping. SBR is close on sliding wear and cheaper. The exception is oil or grease in the stream, where both swell and nitrile becomes the answer even though it wears faster.
  _68 words · answers the category’s highest-volume question with a compound, a mechanism and an exception. The exception is what makes it trustworthy — an answer with no boundary reads as a sales line_
- **Q3** (composite):
  · H: “How thick should the lining be?”
  · Thickness is a service-interval decision, not a quality one. Six to eight millimetres suits light sliding wear, ten to twelve is the general case, and fifteen to twenty-five goes where material impacts. If you are replacing an existing lining, the most useful thing you can tell us is how long the last one lasted — that sizes the next one better than any specification.
  _64 words · repeats the section 03 framing for a reader who skipped to the FAQ, which is deliberate house practice across this set_
- **Q4** (composite):
  · H: “Can you line a tank for acid service?”
  · It depends on the acid and the concentration, and there is a boundary we will not cross. EPDM handles water, dilute acids and alkalis well and we supply it as sheet. We do not mix butyl, which is the compound most often specified for concentrated acid tanks, so for that duty we are not the right supplier and will say so rather than substitute. Send the medium, the concentration and the temperature and we will tell you honestly which side of that line you are on.
  _85 words · the refusal that makes the rest of the page believable. Butyl is the obvious ninth compound to claim on a lining page and this site has had a ninth compound offered before — it was struck. Naming the gap, naming the compound, and declining the work is worth more than the enquiry it costs_
- **Q5** (composite):
  · H: “What is the minimum order for lining and skirting?”
  · We deal in bulk, and on sheet product the minimum is quoted against the job rather than as a piece count — by area for lining and by total length for skirting, since a hopper wall and a chute liner are not comparable quantities. Send the area or the metreage with the duty and we will quote it.
  _58 words · the bulk position adapted to a product that is not sold in pieces, exactly as sheet 18 does on extrusion: “the minimum is quoted per profile against total length”. This is the escape clause the client instruction of 2026-09-01 already contains — “or quoted against the part where geometry or tooling makes that unrealistic”. A 10,000-piece minimum on a chute liner would be meaningless, and publishing one would be worse than publishing none_
- **Q6** (composite):
  · H: “What are your payment and delivery terms for international orders?”
  · TT and LC accepted, discussed per order. Ex-works Nashik or FOB Nhava Sheva. Commercial invoice, packing list and certificate of origin are issued with every consignment. Lining sheet is rolled for transport; tell us the container type and we will pack to suit.
  _44 words · the standard commercial string with one part-specific sentence appended, the same pattern the SKU sheets use_
  <details><summary>notes (3)</summary>
  - All six panels in the DOM at first paint. FAQPage answers not present in the HTML are a structured-data mismatch.
  - Q1 must match sheet 21’s FAQ string exactly — character for character. If one changes, both change.
  - Q2 and Q4 are the extractable answers. Q2 wins the compound query; Q4 is the one that will be quoted when an assistant is asked whether an Indian supplier can line an acid tank.
  </details>

## 10 Enquiries [Shared]
> live: SHARED CTA COMPONENT → use the one that renders correctly, not the variant on the four industry pages that prints +91 (Nashik) and Contact for number
- **Eyebrow**: `10 · ENQUIRIES`
- **H2**: “Request a Lining Quotation”
  _4 words · “quotation” is the term used on every page in this set_
- **Body**:
  > Send the surface area or the metreage and tell us the duty — what the material is, how far it drops, and how abrasive it is. If you are replacing a worn lining, tell us how long it lasted. Our engineering team responds within 48 hours with a compound and thickness recommendation and a quotation.
  _55 words · the two inputs from section 03 and the wear-life question repeated at the point of conversion. 48 hours is the sitewide figure_
- **Buttons ×2**: `[ Request a quote → /contact?part=Rubber%20Lining ]
[ ← Back to Products → /products ]`
  _Primary and secondary, the same pair as every category page. A named conversion event fires on submit_
  <details><summary>notes (2)</summary>
  - /contact?part=Rubber%20Lining canonicals to /contact.
  - Add a “Rubber Lining & Skirting” option to the contact form dropdown, which currently lists eleven categories plus “Not sure / other”. With diaphragms and bonded components it becomes fourteen.
  </details>

## 11 Footer [One string, all pages]
> live: GLOBAL COMPONENT → fourteenth category · still do not sweep it
- **Products column**: `SEALING
O-Rings · Oil Seals · Gaskets · Diaphragms · Reciprocating Seals · Leak Test Rubber
MOUNTING & PROTECTION
Anti-Vibration Mounts · Bushes & Bushings · Bonded Components · Bellows · Grommets · Pads, Stoppers & Caps
SHEET & PROFILE
Extrusion Profiles · Sponge & Foam Rubber · Rubber Lining & Skirting`
  _The sweep has run. The Products column now ships grouped in all twenty-nine sheets — Sealing (6), Mounting & protection (6), Sheet & profile (3) — because fifteen entries in a column designed for eleven is not readable as a flat list. The third group is also the commercial split: those three are quoted by length or area rather than by piece count. “Seals” ships as “Reciprocating Seals” so it is not read as a parent of O-Rings and Oil Seals. Group labels are <p> or <div>, never headings. /products/seals is the next page in this run and will make fifteen. Sweep the footer once, when all seven new pages exist — and consider whether fifteen entries in one column is still a usable footer, or whether the Products column should become a two-column group. That is a design question worth raising before the sweep, not after_
- **Legal line**: `© 2026 Margo Rubber Products. All rights reserved. Privacy Policy · Terms & Conditions · Disclaimer ISO 9001:2015 · Certificate 09111526A · Integral Certification Ltd`
  _The identical string used in all twenty-nine sheets_
  <details><summary>notes (4)</summary>
  - Footer column labels are <p> or <div>, never headings.
  - Add /products/rubber-lining to sitemap/products/0.xml and to phase0-route-handlers/lib/site.ts.
  - Add it to the /products hub grid. It does not belong in the moulded group — the grid is split moulded / continuous profile & cellular, and lining is neither. A third group is needed: sheet and lining products. Raise it with the design before building the card.
  - Point sheet 37’s lining card here. Card six on the bonded-components page links to this URL and is currently the only forward reference in the set that resolves to nothing.
  </details>