# 17_Product_Leak_Test_Rubber.html — Leak Test Rubber Page Content Sheet

**<title>** Alloy Wheel Leak Test Rubber Manufacturer India | Margo
**description** Compression sealing rubber for alloy-wheel leak-test rigs, profiled to your rim and bead seat. 12

## 01 Hero [Rewrite]
> live: LIVE H1 → Leak Test Rubber · no geo · the second stat claims sealing life Margo cannot evidence · the fourth is an MOQ, on the one page whose product is a consumable
- **Eyebrow**: `ISO 9001:2015 CERTIFIED · NASHIK, INDIA`
  _[no change — carries certification and geo, which most eyebrows on this site do not]_
- **H1 — 2 lines**: “Alloy Wheel Leak Test Rubber,” / “Manufactured in India”  (accent: Manufactured in India)
  _7 words · live is 3 · “Alloy Wheel” is the addition that matters. “Leak Test Rubber” on its own is ambiguous — it could be gas, plumbing or packaging — and the two words that make it findable by the people who actually buy it are the two the live H1 leaves out_
- **Subhead**:
  > Margo Rubber Products moulds compression sealing rubber for alloy-wheel leak-test rigs at its ISO 9001:2015 certified plant in Nashik, India — profiled to your rim diameter and bead-seat geometry, 12″ to 24″ and cut to print, for test pressures of 2 to 6 bar in NBR and EPDM.
  _46 words · live is 22 · the live sentence is good and its structure is kept; what is added is the entity, the geo, the size range and the pressure range. “Rated for repeated high-cycle sealing” is removed — it is the same unsupportable claim as the cycle counts in the table, in adjective form_
- **Hero CTA**: `Send a Rim Drawing ↗ /contact`
  _The slot renders nothing on this page. The same hero component populates it on /products/o-rings. On this category the rim drawing is the entire enquiry — there is no catalogue size to pick — so the CTA should ask for it directly_
- **Stats ×4** (Value | Label | Replaces):
  | 12″–24″ | Rim diameters |  |
  | 2–6 bar | Test pressure |  |
  | Profiled to rim | Bead seat to your drawing |  |
  | NBR · EPDM | Standard compounds |  |
  _Four stats, four stats — no count change. Stat 1 extends the range to 24″, which is where large SUV and aftermarket alloys now sit; the live table already covers to 22″ and the extra band is cut-to-print. Stat 2 replaces the unsupportable sealing-life claim with the test pressure, which is a real published figure from the live table and the second thing a rig engineer needs to know. Stat 3 keeps the value and gives the label something to say. Stat 4 removes the minimum order and names the two compounds — on a consumable reordered in small lots, a 500-piece floor in the hero is the single most expensive line on this page_
  <details><summary>notes (6)</summary>
  - Heading. The page’s only <h1>. Two <span> lines inside one <h1>, not two headings.
  - This is the narrowest and highest-intent page on the site. alloy wheel leak test rubber, wheel leak test seal manufacturer and rim leak test rubber India are searched by a handful of people a month — and every one of them runs a wheel plant and needs a consumable reordered. Almost no manufacturer publishes for these terms, so the page can own them outright.
  - Both nouns must survive. “Alloy wheel” disambiguates the page from every other kind of leak test; “leak test rubber” is the exact phrase the buyer types. The H1, the title and the first line of the subhead each carry both.
  - Breadcrumb goes above the eyebrow. Home › Products › Leak Test Rubber, marked up as BreadcrumbList.
  - Stat markup. <dl> pairs, value in <dd>, label in <dt>.
  - Image alt. The hero has no image. A photograph of the seal fitted on a rig, or of the profiled ring against a wheel, would do more here than on any other category — the product is unfamiliar enough that a buyer needs to see it to know they are in the right place. Alt: “Profiled leak-test sealing rubber for alloy wheel rigs, made at Margo Rubber Products, Nashik”.
  </details>

## 02 Specification reference [3 rows become 6 · two headings change]
> live: LIVE H2 → Wheel Sizes & Sealing Specification · three rows · a cycle-life column with no test behind it · compound tied to rim diameter · filter chips are AS568, ISO, JIS and DIN
- **Add three rows, change two headings**:
  > The live table renders three rows. This section specifies six, so the developer must add three and the component should take an arbitrary list. The column count stays at four and the chip count stays at five; two headings change.
  > The cycle-life column comes out and is replaced by a typical-application column. The service-life question does not disappear — it moves to the footnote, where it can be answered with the property that actually governs it and with a test standard Margo genuinely runs. A column of unsupportable numbers is replaced by a paragraph of supportable reasoning.
  > The material column stops naming one compound per size band. Rim diameter does not decide compound; the test medium does. Every row now reads the same pair, which is the correction stated in the place the buyer is looking.
- **Eyebrow**: `02 · SPECIFICATION REFERENCE`
  _[no change]_
- **H2**: “Rim Sizes and Test Pressures”
  _5 words · live is 5 · “Sealing Specification” promises more than the table delivers; “Test Pressures” names what is actually in column two and is a term a rig engineer searches_
- **Intro**:
  > Leak-test rubber is profiled to the rim diameter and bead-seat geometry of the wheel under test. Send the rim drawing and the test pressure with the enquiry, and tell us what the rig runs on — air, water, or a line where oil or release agent reaches the seal. That last answer is what decides the compound, not the wheel size.
  _58 words · live is 27 · the live intro’s first two sentences are accurate and are kept. What is added is the third question and the reason for it — it removes the table’s implication that rim diameter picks the compound, and it asks for the one piece of information a rig operator can give without a drawing_
- **Filter chips ×5** (Chip | Replaces):
  | All rim sizes | All Standards |
  | Passenger car |  |
  | SUV & premium |  |
  | Commercial vehicle |  |
  | Cut to print |  |
  _Five chips, five chips — no count change. All four standard names come off; AS568 and JIS B2401 are O-ring size standards and neither ISO nor DIN publishes a standard for wheel-rig sealing rubber. The replacements filter by vehicle class, which is how a wheel plant describes its own line_
- **Search field**: `Filter by rim size or application`
  _Replaces Filter by ID or dimension — this table has no ID column_
- **Table — 6 rows** (Rim size | Test pressure | Compound options | Typical application):
  | 12″–15″ | 2–4 bar | NBR or EPDM | Passenger car, steel and alloy |
  | 16″–18″ | 2–5 bar | NBR or EPDM | Passenger car and crossover alloy |
  | 19″–22″ | 3–6 bar | NBR or EPDM | SUV and premium alloy |
  | 23″–24″ | 3–6 bar | NBR or EPDM | Large SUV and aftermarket alloy — cut to print |
  | Commercial vehicle rims | Per drawing | EPDM or neoprene | Truck and bus wheels — cut to print |
  | Non-standard geometry | Per drawing | Any of the eight | Pressure-decay and air-under-water rigs, castings and housings |
  _Six rows, up from three. Every live value is carried over unchanged — the three rim bands and their pressure ranges are exactly as published. Three rows are added: 23″–24″, commercial vehicle rims, and non-standard geometry. The compound column is decoupled and reads the same pair on every wheel row, because the medium decides it. The last row is the commercial one — it says out loud that this rubber is not only for wheels, which is the widest thing this page can honestly claim and it currently claims nothing of the sort_
- **Footnote**:
  > Showing 6 of 6 entries. How long a rig seal lasts is a question of compression set, not of a cycle count. A compression seal fails when it has taken enough permanent set that it no longer fills the bead seat — not after a counted number of closings. Compression set is measured to ASTM D395 and ISO 815-1, both of which we run in-house. Tell us the rig, the pressure and the duty and we will state the compression set of the compound we propose, so the replacement interval is yours to calculate rather than ours to promise. Values are typical for the rim band and are not a specification for a particular part; see our technical disclaimer.
  _108 words · live is 26 · the longest footnote in the set and the one carrying the most weight. It replaces three cycle-life figures with the mechanism behind them, names two test standards that are on Margo’s own in-house list rather than at the partner laboratory, and closes with an offer no competitor in this niche is making. This paragraph is what lifts the rubric cap on the section_
  <details><summary>notes (7)</summary>
  - Real <table> markup with <caption>Alloy wheel rim sizes, leak-test pressures and sealing compounds</caption> and scope="col" on every header. All six rows in the DOM at first paint; filter with CSS, never unmount.
  - The footnote is the AEO surface and it is unusually strong. “How long does a leak test seal last?” has no good answer published anywhere by a manufacturer, and this paragraph gives one with a mechanism and two named standards. It should have its own <h3> if the design allows: How long a rig seal lasts.
  - Naming ASTM D395 and ISO 815-1 is the credibility move, and unlike the fatigue standards named on the bellows page, these two are run in-house. That is a materially stronger claim and the copy should say so — it does.
  - Do not put compression set values in schema or in the table. The number is compound- and formulation-specific; the offer to state it per enquiry is the product.
  - The non-standard-geometry row is a deliberate expansion, and it should be watched. If enquiries arrive for castings and housings rather than wheels, that is a signal the page’s H1 is narrower than the capability — but narrow is the right starting position, because the wheel term is winnable now.
  - Overflow. Four columns will not fit 375 px — overflow-x:auto on the wrapper, never on the body.
  - Link the disclaimer beneath the table, anchor text technical disclaimer → /legal/disclaimer. The full copy is written in sheet 08.
  </details>

## 03 Material selection [4 panels become 8]
> live: LIVE H2 → Which Material Do I Need? · a buyer question with no subject · four compounds shown, all four ranges wrong · the intro asks for a “pressure class”, which a wheel rig does not have
- **Add four panels, reorder all eight**:
  > The live accordion renders four panels. This section specifies eight. The developer must extend the component to take an arbitrary list — four new panels: neoprene, natural rubber, SBR and AEM — and panel order must be per-page data. On this page EPDM leads, because most wheel rigs run on air and water. This is the same shared component as the other category pages; extending it once lands on all eleven.
- **Eyebrow**: `03 · MATERIAL SELECTION`
  _[no change]_
- **H2**: “Which Compound for Your Rig?”
  _5 words · live is 5 · the generic question becomes a specific one. “Rig” is the word the buyer uses for their own equipment, and it stops this heading competing with the identical H2 on ten other category pages_
- **Intro**:
  > A rig seal is chosen for two things: what the rig runs on, and how well the compound recovers after being held compressed. Air and water rigs take EPDM; a line where oil, coolant or release agent reaches the seal takes nitrile. Name the medium and we will tell you which to specify.
  _53 words · live is 27 · the live intro asks for “medium, temperature, and pressure class”, which is the flange-gasket intro rendered unchanged — a wheel rig has a test pressure but no pressure class. The replacement names the two axes that actually apply and answers the common case in the same breath_
- **Panels ×8** (Compound | Temp range | Hardness | Body | Live):
  | EPDM | −40° to +140°C | 40–90 Shore A | Ethylene propylene diene rubber, and the default for a wheel leak-test rig. Excellent water, steam and ozone resistance, and it holds its recovery through repeated closings on an air or water line. Not for petroleum oils — if oil or release agent reaches the seal, specify nitrile instead. |  |
  | NBR (Nitrile) | −30° to +120°C | 40–90 Shore A | Nitrile butadiene rubber, the general-purpose industry standard. Outstanding resistance to petroleum oils and hydraulic fluids — the compound for a rig on a machining or casting line where the wheel arrives with oil or release agent still on it. |  |
  | Neoprene (CR) | −40° to +120°C | 40–90 Shore A | Polychloroprene. Balanced across weather, ozone and moderate oil at once, which suits a rig that sits in an open bay or handles wheels from more than one line. Also the family we reach for when flame retardancy is specified. | NEW PANEL |
  | Natural rubber (NR) | −20° to +90°C | 30–80 Shore A | Polyisoprene. The highest resilience of the eight — it recovers its profile faster between closings than anything else here, which matters on a fast-cycling rig. Not for oil, fuel or sustained heat. | NEW PANEL |
  | Silicone (VMQ) | −60° to +220°C | 30–80 Shore A | Vinyl methyl silicone, the widest service range of the eight and very good compression-set recovery. Poor abrasion and tear resistance, though — on a seal that a rim edge drags across on every cycle it will not last, so specify it only where the rig is hot and the contact is clean. |  |
  | SBR | −30° to +100°C | 40–90 Shore A | Styrene butadiene rubber. Abrasion resistance at low cost, for water-only rigs where the seal is a high-turnover consumable and the priority is price per piece. Not for oil or fuel contact. | NEW PANEL |
  | AEM (Vamac®) | −40° to +175°C | 50–80 Shore A | Ethylene acrylic elastomer. Our signature compound, supplied to Mahindra & Mahindra for engine and transmission applications. On a rig it is a specialist answer — a hot line where oil is present and neither EPDM nor nitrile holds. | NEW PANEL |
  | FKM (Viton®) | −20° to +250°C
continuous to 200°C | 60–90 Shore A | Fluorocarbon rubber, the first choice for aggressive chemical environments. On a wheel rig it is rarely justified — it appears here because we mould it, and because a rig testing castings against a solvent occasionally needs it. |  |
  _Eight panels. EPDM and NBR lead, matching the table above and the two compounds the page actually sells. The silicone panel is the one worth reading — it is honest about a real trade-off, saying that silicone has excellent compression-set recovery but will not survive rim drag, which is exactly the mistake a rig engineer would otherwise make after reading the footnote in section 02. Every range matches the homepage compound table. Each body closes on this page’s own application rather than the generic sealing copy that renders on ten other categories_
- **Panel link**: `Read more`
  _[no change to the label]. It expands the panel in place; it does not navigate. Keep it a <button>, not an <a>_
  <details><summary>notes (6)</summary>
  - Crawlability. All eight panels render in the DOM at first paint and collapse with CSS. An accordion that mounts its body on click publishes eight paragraphs to a browser and zero to a crawler.
  - Heading levels. Section heading is <h2>; each compound name is <h3> inside the panel.
  - The silicone caveat is the trust signal. Section 02 tells a buyer that compression set governs seal life; silicone has the best compression set of the eight; the obvious inference is wrong and this panel says so. A page that heads off the mistake its own copy invites reads as written by someone who has made the part.
  - This is the one page where the H2 should not follow the house pattern. Ten category pages asking “Which X Material Do I Need?” compete with each other for one question string; changing this one to “Which Compound for Your Rig?” costs nothing and gives it a phrase of its own.
  - FAQ schema. This section feeds two of the four FAQPage questions: “Which rubber is used for wheel leak test seals?” and “Can leak test rubber be used where there is oil on the line?”. Answer text must match the visible copy word for word.
  - Shared component, per-page order. Panel order must come from page data.
  </details>

## 04 Commercial terms [Restructure]
> live: LIVE H2 → Minimum Order & Lead Time · live eyebrow reads 05, skipping the parts section this page does not have · an MOQ on the one page whose product is a reordered consumable · lead times disagree with every other page
- **Eyebrow**: `04 · COMMERCIAL TERMS`
  _Renumbered from 05. The live counter is hard-coded to the category template, which has a parts section at 04; this page does not have one, so the visible numbering skips a step. Same defect as the bellows page_
- **H2**: “Lead Times and How We Quote”
  _6 words · live is 4 · “Minimum Order & Lead Time” puts a banned term in a section heading, where it is also an anchor and a table-of-contents entry_
- **Intro**:
  > Margo produces in bulk against OEM schedules. Send the rim drawing, the test pressure and what the rig runs on, with your volume, and we will quote it. Repeat orders against an existing profile ship from the same tool, which is where the lead time drops — tell us the part reference and the annual volume and we will schedule against it.
  _57 words · live is 34 · replaces “Margo is geared for volume procurement. If your project requires below-MOQ qualification samples…”. The second bold sentence exists only on this page and it is the most commercially useful line in the whole set: a rig seal is a consumable, the buyer will reorder it many times, and telling them the tool is already cut and the reorder is scheduled against their annual usage is what a rig operator needs to hear_
- **Rows ×5** (Row | Value | Sub-label | Replaces):
  | Quotation | 48 hrs | From the rim drawing |  |
  | Prototype | 48–72 hrs | One-off seal for rig trial |  |
  | Repeat order, existing tool | 2–3 weeks | Ex-works Nashik · scheduled against annual volume |  |
  | New profile | 3–4 weeks + tooling | Tooling lead time quoted per profile |  |
  | Packaging | Poly bag + card label | Bulk or interleaved on request | [no change to the value] |
  _Five rows, five rows — no count change. The row labels are page-specific and they matter here more than anywhere else in the set. “Catalogue sizes” and “custom / cut-to-print” describe a choice that does not exist on this category — every seal is profiled to a rim, so the only real distinction is whether the tool already exists. “Repeat order, existing tool” is the line that converts this page, and 2–3 weeks is stated rather than the 3–4 week standard because no tooling step is involved. CONFIRM the 2–3 week repeat figure with the plant — it is the one value on this sheet that is faster than the published company standard, and it should not ship unless it is real · CONFIRM_
  <details><summary>notes (5)</summary>
  - The section ID changes from #commercial to #lead-times, and the anchor label with it.
  - This block converts harder on this page than on any other. The visitor is usually a maintenance or quality engineer whose rig seal has worn out, not a designer starting a project. They need to know they can reorder without a minimum and how fast it arrives, and both answers are now in the first two rows.
  - Goes in the FAQPage node: “Can I reorder leak test rubber in small quantities?” and “What is the lead time for a replacement rig seal?” — the first is unique to this page and has an answer no competitor publishes.
  - Consistency gate, with one deliberate exception. 48 hrs quotation and 48–72 hrs prototype match the site constant. The 2–3 week repeat figure is intentionally faster than the 3–4 week standard because it skips tooling — it must be flagged as a per-page override in the code, not typed in, or the next audit will read it as another drift.
  - Row markup. <dl> pairs or a real <table>, with the value and sub-label programmatically associated.
  </details>

## 05 Enquiries [Tune]
> live: LIVE H2 → Request Leak Test Rubber Specs · live eyebrow reads 06 · the body promises a response “within two working days”, the sixth different response time published on this site
- **Eyebrow**: `05 · ENQUIRIES`
  _Renumbered from 06, following the section-04 renumbering above_
- **H2**: “Request Leak Test Rubber Specifications”
  _5 words · live is 5 · “Specs” spelled out. It is a heading, an anchor and a schema string, and on this page it is also the last place the exact product phrase appears_
- **Body**:
  > Send the rim drawing and the test pressure, tell us what the rig runs on, and send the worn seal if you have one — it tells us more about the duty than a drawing does. Our engineering team responds within 48 hours with a recommended compound, its compression set, and a quotation.
  _54 words · live is 34 · “within two working days” becomes 48 hours. The site publishes six different response times; two working days contradicts the 48 hours promised on the homepage, the contact page and the commercial terms directly above. Two additions are page-specific: asking for the worn seal, which on a consumable is the single most informative thing a buyer can send — how it failed says whether the compound, the profile or the pressure was wrong — and promising the compression set figure, which is the offer made in section 02 and must be repeated at the point of enquiry_
- **Button 1**: `Send Enquiry` → /contact
  _[no change]_
- **Button 2**: `Call Technical Sales` → tel:+919665579276
  _[no change to the label]. The href must be a real tel: link and the digits must match the footer and the Organization node exactly_
- **Confirmation copy**: `Enquiry received. A named engineer replies within 48 hours to {email}.`
  _New string — it fills the existing post-submit state, which currently shows nothing. Neither form on the site has confirmation copy, so a buyer who submits a drawing has no evidence it arrived_
  <details><summary>notes (4)</summary>
  - Schema. Emit nothing here. ContactPoint lives on the homepage Organization node and every page @id-references it.
  - Analytics. Named conversion event on submit and on the tel: click. On a page this narrow, five enquiries a quarter would be a strong result and none of them is currently measurable.
  - Heading level. <h2>. The two buttons are <a> elements, not <div>s with click handlers.
  - The 48-hour promise is the site’s single most repeated commercial claim. It renders on the homepage, /contact, /export and all eleven category pages twice each. Render it from one constant.
  </details>

## 06 Footer [Rewrite]
> live: LIVE → 50+ countries, © 2024, and the wrong legal entity · Products column shows 9 of 11 categories · /export appears nowhere
- **Wordmark**: `MARGO
RUBBER PRODUCTS`
- **Description**:
  > ISO 9001:2015 certified manufacturer of precision moulded and extruded rubber components in Nashik, India. Sealing and anti-vibration parts to customer drawing, supplied to OEMs and distributors in 95 countries.
  _29 words · live is 26 · opens with the entity definition, since the footer repeats on all 40 pages_
- **NAP block**: `+91 96655 79276
info@margorubber.in
Margo Rubber Products, SRNO. 4494/10, Vilholi,
Nashik, Maharashtra 422010, India`
  _CONFIRM street address — SRNO. 4494/10, Vilholi, Nashik, Maharashtra 422010, settled 2026-09-03. Not B-12 MIDC Ambad, which is what the live site still shows. One string, everywhere, forever · CONFIRM_
- **Column 1 — Products**: `SEALING
O-Rings · Oil Seals · Gaskets · Diaphragms · Reciprocating Seals · Leak Test Rubber
MOUNTING & PROTECTION
Anti-Vibration Mounts · Bushes & Bushings · Bonded Components · Bellows · Grommets · Pads, Stoppers & Caps
SHEET & PROFILE
Extrusion Profiles · Sponge & Foam Rubber · Rubber Lining & Skirting`
  _15 entries in three groups, up from 11. Adds Diaphragms, Bonded Components, Rubber Lining & Skirting and Reciprocating Seals (sheets 36–39), plus /products/extrusion and /products/sponge-foam-rubber, which had no sitewide inbound link at all. The column was designed for eleven and fifteen flat is not readable, so it is grouped — Sealing (6), Mounting & protection (6), Sheet & profile (3). The third group is also the commercial split: those three are quoted by length or area rather than by piece count, per sheets 18, 38 and 40. “Seals” is labelled “Reciprocating Seals” so it is not read as a parent of O-Rings and Oil Seals — sheet 39 §02 explains why. Group labels are <p> or <div>, never headings — three more phantom sections is not an improvement on one. One label also changes: Bushes & Sleeves becomes Bushes & Bushings, matching that category’s own H1. Its URL stays /products/bushes_
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
  - What it fixes on this page specifically: the footer is the third place a minimum order is stated on this page. Removing it here removes it on all forty.
  - What it fixes on this page specifically: the footer is the third place a minimum order is stated here — and this is the category where a piece-count floor does most damage, because the product is a consumable reordered in small lots. Removing it once removes it on all forty pages.
  - This page has no outbound links at all in its body — no parts section, no sibling links. The footer’s eleven product entries are the only route from here to anywhere else on the site, which makes the Products column going from 9 to 11 more consequential here than on most pages.
  - Build once, ships forty times. This is one component. The copy above is written out in full on every sheet in this set so nobody has to open two files to build one block, but it is authored once in the codebase.
  - Heading levels. The column labels (PRODUCTS / INDUSTRIES / COMPANY) are <h2> in the live build. As visible <h2>s they inject three phantom sections into every document outline on the site. Change to <p class="col-label">.
  - Link equity. 26 sitewide links from here. Adding /export, /products/extrusion-profiles and /products/sponge-foam-rubber gives three orphaned or under-linked URLs a sitewide inbound link each — the cheapest internal-linking win available on this site.
  - NAP markup. Wrap in <address>. Phone as <a href="tel:+919665579276">, email as <a href="mailto:info@margorubber.in">. The visible string and the href must not diverge.
  - Schema. The footer emits nothing. The Organization node on the homepage is the single entity definition and every other page @id-references it. Repeating an Organization block per page creates 40 competing entities.
  - Copyright year. Render from new Date().getFullYear(), not a literal. It has read 2024 for eight months.
  </details>