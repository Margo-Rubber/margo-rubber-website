# 19_Product_Sponge_Foam_Rubber.html — Sponge & Foam Rubber Page Content Sheet

**<title>** Sponge & Foam Rubber Manufacturer India | Closed & Open Cell | Margo
**description** Closed-cell and open-cell sponge rubber from Nashik, India — EPDM, neoprene, nitrile, natural rubber and silicone, 12 to 200 kg/m³, sheet, roll, piece and self-adhesive foam tape.

## 01 Hero [Tune]
> live: LIVE H1 → Sponge & Foam Rubber · no geo · two CTAs · a working breadcrumb, the only one on the site · the third stat is a volume figure that must reconcile with the homepage
- **Breadcrumb**: `Home › Products › Sponge & Foam Rubber`
  _Live has this and no other page does. One level is added — the live trail starts at Products. Mark it up as BreadcrumbList and reuse the component on the other ten category pages, where it is listed as a new build in every sheet and is in fact already written_
- **Eyebrow**: `ISO 9001:2015 CERTIFIED · NASHIK, INDIA`
  _[no change]_
- **H1 — 2 lines**: “Sponge and Foam Rubber,” / “Manufactured in India”  (accent: Manufactured in India)
  _6 words · live is 3 · the ampersand is spelled out because the H1 is also the schema name and the breadcrumb label_
- **Subhead**:
  > Closed-cell and open-cell cellular elastomers moulded, extruded and die-cut at our ISO 9001:2015 certified plant in Nashik, India — engineered for thermal insulation, acoustic damping and precision sealing, from EPDM weatherstripping to silicone medical-grade profiles.
  _41 words · live is 30 · the live sentence is strong and its second half is kept intact. What is added is the entity, the geo and the three processes. “VMQ medical-grade” becomes “silicone medical-grade” — the polymer abbreviation means nothing to a procurement search and the full word is what people type_
- **CTA 1**: `Request a Quote` → /contact
  _[no change]_
- **CTA 2**: `Download Datasheet ↓ /resources/sponge-foam-datasheet.pdf`
  _[no change to the label] — but the file has to exist. The live button is wired to nothing, and this is the second download button on the site in that state; the other is the test capability statement on /products. A dead download is worse than no button, because a buyer who clicks it and gets nothing assumes the rest of the page is the same_
- **Stats ×4** (Value | Label | Replaces):
  | 5 | Compounds | [no change] |
  | 2 | Cell structures | [no change] |
  | 12–200 kg/m³ | Density range |  |
  | Sheet · Roll · Piece | Supply form | [no change] |
  _Four stats, four stats — no count change, three unchanged. Stat 3 is the edit, and it is a judgement call worth explaining. The 300K+ HVAC figure is specific and specific is good, but it is a second volume claim on a site that already publishes 17.9 million components a year computed from four sector volumes — and two volume numbers that cannot be reconciled is how eight different market counts happened. The density range is the better hero stat anyway: it is this page’s own governing variable, section 05 is built entirely around it, and it is the one specification a foam buyer filters by. If the 300K figure reconciles with the homepage breakdown, it belongs on this page — in section 07, next to the HVAC application card, where it is evidence rather than decoration_
  <details><summary>notes (5)</summary>
  - Heading. The page’s only <h1>. Two <span> lines inside one <h1>, not two headings.
  - Three head terms live on this page and all three should survive. sponge rubber manufacturer India, closed cell foam rubber and self-adhesive foam tape are different searches from different buyers; the first two belong in the H1 and subhead, and the third has its own section with its own anchor.
  - The breadcrumb is already built. Every other sheet in this set lists it as a new component. It is not — it exists here and needs extending to the other ten pages, which is a much smaller job than the other sheets imply.
  - The datasheet is a real asset if it exists. A downloadable compound and density datasheet is the kind of document that earns links and gets cited, and it is the only gated-feeling asset on a product page. Either produce it or change the button to Request Datasheet, which routes to the form and costs nothing.
  - Stat markup. <dl> pairs, value in <dd>, label in <dt>.
  </details>

## 02 Cell morphology [Tune]
> live: LIVE H2 → Closed Cell vs Open Cell · two cards, five metrics each — the best explanatory block on the site · one metric on the open-cell card is a measured acoustic value with no test behind it
- **Eyebrow**: `CELL MORPHOLOGY`
  _[no change]_
- **H2**: “Closed Cell vs Open Cell”
  _[no change — it is the literal comparison a buyer searches and it is correctly phrased]_
- **Intro**:
  > Specifying cell structure is the first decision in foam engineering. It controls water absorption, compression set, thermal resistance and acoustic performance simultaneously — which is why it comes before compound, not after it.
  _35 words · live is 26 · the live sentence is excellent and is kept whole. The closing clause is added because it states the ordering principle the section is demonstrating and never says out loud_
- **Card 1 — closed cell** (Metric | Value | Replaces):
  | Water absorption | < 1% by volume | [no change] |
  | Thermal resistance | High — cells trap gas | [no change] |
  | Compression set | Low — recovers fully, to ASTM D395 Method B |  |
  | Typical density | 30–200 kg/m³ | [no change] |
  | Best for | Weatherseals, insulation, HVAC | [no change] |
  _Five metrics, five metrics. One addition: compression set gains its test method, which Margo runs in-house and which section 08 already asks the buyer to state a criterion against. Naming it here connects the two blocks_
- **Card 2 — open cell** (Metric | Value | Replaces):
  | Water absorption | High — pores interconnect | [no change] |
  | Acoustic damping | Excellent — absorption rises with thickness and airflow resistance |  |
  | Compression set | Higher — softer recovery | [no change] |
  | Typical density | 12–60 kg/m³ | [no change] |
  | Best for | Acoustic panels, filters, padding | [no change] |
  _Five metrics, five metrics. The NRC figure comes off. Noise reduction coefficient is measured under ASTM C423 in a reverberation room, on a stated thickness and mounting — it is a property of a tested assembly, not of open-cell foam as a class, and Margo publishes no acoustic test capability anywhere. The replacement says more, not less: that absorption depends on thickness and airflow resistance is the thing an acoustic specifier actually needs to hear, and it opens the conversation the NRC number closed_
  <details><summary>notes (5)</summary>
  - “closed cell vs open cell foam” is a high-volume informational search with a definite answer, and this block answers it better than most of the results that currently rank for it. It is the strongest AEO asset on this page and possibly on the site.
  - Both cards must be real markup, not images. Two five-row metric comparisons rendered as graphics publish nothing. <dl> pairs inside a <section> per card, with an <h3> for each structure name.
  - Give the block its own id and link to it. #cell-structure already exists. It should be linked from the gaskets page, the extrusion page and the industries pages — it is the explainer those pages assume and none of them has.
  - Do not put the density ranges in schema from this block. Section 05 is the canonical density statement; two machine-readable ranges on one page is one too many.
  - The removed NRC figure should not be replaced by any number until an acoustic test exists. If one is commissioned, the right claim names ASTM C423, the thickness and the mounting — and it would be genuinely differentiating, because no Indian competitor publishes one.
  </details>

## 03 Compound selector [Tune]
> live: LIVE H2 → Compound Selection Guide · five tabs, one panel shown at a time · the panels are the same data as the table in section 04, rendered twice
- **Eyebrow**: `MATERIAL SCIENCE`
  _[no change]_
- **H2**: “Compound Selection Guide”
  _[no change]_
- **Intro**:
  > Five elastomer families, each optimised for distinct thermal, chemical and mechanical operating envelopes. Pick the tab that matches your environment; the full comparison is in the table below.
  _29 words · live is 17 · the addition tells a visitor the two blocks are the same data in two views, which stops them reading the tabs one at a time looking for something the table does not have_
- **Tab panels ×5**:
  > Each panel shows the compound code, full name, hardness range, service temperature and key applications — the same five fields as the table row in section 04. Use one data source for both. The corrected temperature values in section 04 must render here too, or the page will show two different figures for the same compound depending on which block a visitor reads.
  _No copy is written separately for this section on purpose. Duplicating the compound copy into a second block is how the site ended up with a hero, a table and an accordion naming three different compound sets on the bushes page. One record, two views_
  <details><summary>notes (4)</summary>
  - All five panels must be in the DOM at first paint and hidden with CSS, not mounted on tab click. A five-tab component that renders one panel publishes one fifth of its content to a crawler.
  - This block and section 04 are duplicate content on the same URL. That is not penalised, but it is wasted — two identical passages compete to be the extracted one. The table should carry the canonical markup and this block should be marked aria-hidden for the redundant text, or the two should be merged.
  - Consider whether both blocks need to exist. The tabs are a nicer interaction; the table is more extractable and sortable. If the design can only keep one, keep the table — but that is a design call, not a content one, and nothing in this sheet requires it.
  - Tab controls are <button> with role="tab" and aria-selected, panels are role="tabpanel". Currently they are styled divs.
  </details>

## 04 Compound comparison [Temperature column rewritten]
> live: LIVE H2 → All Five Compared · five rows, five columns · every service range differs from the homepage table — correctly, because sponge is not solid rubber · but the neoprene row is 25 °C above the published constant rating
- **Eyebrow**: `COMPOUND REFERENCE`
  _[no change]_
- **H2**: “All Five Compared”
  _[no change — short, accurate, and it does not pretend to be a keyword]_
- **Table — 5 rows** (Compound | Full name | Hardness | Service temperature | Key applications):
  | EPDM | Ethylene propylene diene monomer | 20–80 Shore A | −50 to +120 °C constant
+130 °C intermittent | HVAC gaskets, roofing tape, weatherseals, hot-water systems |
  | CR | Chloroprene (neoprene) | 25–70 Shore A | −40 to +75 °C constant
+90 °C intermittent | Marine seals, refrigerant lines, adhesive tape backing |
  | NBR | Nitrile butadiene rubber | 30–90 Shore A | −40 to +100 °C constant
+120 °C intermittent | Hydraulic seals, oil-resistant gaskets, fuel system foam |
  | NR | Natural rubber | 20–60 Shore A | −55 to +80 °C constant | Anti-vibration mounts, acoustic panels, packaging foam |
  | VMQ | Silicone (vinyl methyl) | 10–80 Shore A | −60 to +200 °C constant
+230 °C intermittent | Clean-room seals, food-contact grades, high-temperature ovens |
  _Hardness bands and full names are unchanged. The temperature column is rewritten on all five rows to state constant and intermittent separately — the distinction that matters on cellular rubber, because the cell structure degrades before the polymer does.
Neoprene is the substantive correction: live gives −40 to +100 °C; published closed-cell neoprene sponge to ASTM D1056 is −40 to +75 °C constant with excursions to +90. The live figure is 25 °C above the constant rating, and it is the row most likely to be misused — a refrigerant-line seal specified at +100 hardens in service.
EPDM and NBR upper limits move down to their constant ratings, with the live figures kept as the intermittent values, so nothing is lost.
The applications column changes on one row: silicone drops “medical devices” for “clean-room seals, food-contact grades” — see the FDA note above_
- **Footnote — new**:
  > Sponge grades carry lower service temperatures than the same compound in solid rubber. The cell structure degrades before the polymer does, so a closed-cell EPDM sponge is rated below a solid EPDM moulding — the figures above are cellular ratings to ASTM D1056 and are not the same as the solid-compound table published elsewhere on this site. Constant service is the figure to design to; intermittent covers short excursions, not duty. Density and cell structure both shift these limits, so confirm against the grade quoted for your part.
  _83 words · live has no footnote at all · this paragraph is what stops the next consistency audit reading this table as drift. Nine category pages disagree with the homepage compound table by accident; this one disagrees on purpose, and until now nothing on the page said so. It also teaches the constant-versus-intermittent distinction, which is the single most misread thing in a rubber datasheet_
  <details><summary>notes (5)</summary>
  - Real <table> markup with <caption>Sponge rubber compounds, hardness and cellular service temperature ranges</caption> and scope="col" on every header. All five rows in the DOM at first paint.
  - The constant / intermittent split is an AEO gain. “What temperature can EPDM foam take?” now returns two figures with a stated difference, which is a better answer than one number and is the shape a technical assistant prefers to cite.
  - This table and the tab panels in section 03 must render from one record. Two views, one source. The corrected values must appear in both or the page contradicts itself between two adjacent blocks.
  - The footnote is load-bearing for the whole site. It is the only place that explains why one product page legitimately disagrees with the homepage compound table. Without it, a future audit “corrects” this page back to the solid-rubber figures and publishes a neoprene sponge rated 45 °C above its constant limit.
  - Overflow. Five columns will not fit 375 px — overflow-x:auto on the wrapper, never on the body.
  </details>

## 05 Density [Keep · fix the attribution]
> live: LIVE H2 → Density — The Engineering Variable · a slider, four named bands and a pull-quote · the best-argued block on the site · the quote is attributed to a team, not a company and a place
- **Eyebrow**: `PHYSICAL PROPERTIES`
  _[no change]_
- **H2**: “Density — The Engineering Variable”
  _[no change — it makes an argument in four words, which no other heading on this site does]_
- **Pull-quote**: `"Density is not a secondary spec — it determines whether your foam seals,
insulates, or absorbs. Specify it from the start."`
  _[no change to the quote — it is the single best sentence on this website. It states a principle, it is useful, and it tells the reader what to do]_
- **Attribution**: `Engineering Team
Margo Rubber Products · Nashik`
  _Live reads — Margo Rubber Engineering Team, which is neither the company name nor a location. The extrusion page has the same block and gets it badly wrong, attributing its quote to “Margo Rubber Industries, Pune”. Both pages should carry this identical, correct string_
- **Range indicator**: `12 kg/m³ ———————————— 200 kg/m³
LOW · 12–30 kg/m³ · acoustic, packaging HIGH · 80–200 kg/m³ · structural, sealing`
  _[no change — the visual range with a labelled low and high end is doing real work and matches the hero stat]_
- **Bands ×4** (Density | Use | Replaces):
  | 12–30 kg/m³ | Ultra-light acoustic and packaging foam | [no change] |
  | 30–60 kg/m³ | Standard HVAC duct liner | [no change] |
  | 60–100 kg/m³ | Weatherseal and gasketing applications | [no change] |
  | 100–200 kg/m³ | Structural foam and load-bearing pads |  |
  _Four bands, four bands — no count change and one caption extended. This block is accurate, well argued and needs almost nothing. The top band gains “and load-bearing pads” because that is what 100–200 kg/m³ foam is usually specified for and the two-word caption undersells it_
  <details><summary>notes (4)</summary>
  - This is the block to expose in additionalProperty — density as a range with kg/m3 as the unit code. It is the one specification on this page a buyer filters by, and it is genuine.
  - “What density foam do I need?” is answered here in four bands, which is exactly the shape of a citable answer. Each band should be an <h3> or a <dt>, not a styled div, so the density value and its use are programmatically paired.
  - The slider must not be the only way to read the bands. If the four captions render only on interaction, they publish nothing. All four visible in the DOM at first paint.
  - Markup. The quote is <blockquote> with <cite>. The same component renders on the extrusion page and both attributions should come from one record — that is how the Pune error survives a fix here.
  </details>

## 06 Self-adhesive foam tape [Tune — one claim removed]
> live: LIVE H2 → Self-Adhesive Foam Tape · cross-section build-up, two foam cores, two adhesive systems and a surface-energy engineering note — the most specialised block on the site · the intro claims a 40% assembly-time saving with nothing behind it
- **Eyebrow**: `PRODUCT SUB-CATEGORY · SELF-ADHESIVE SYSTEMS`
  _[no change]_
- **H2**: “Self-Adhesive Foam Tape”
  _[no change — it is the exact phrase a converter or panel builder searches, and it is the only place on the site that carries it]_
- **Intro**:
  > Pre-applied pressure-sensitive adhesive converts any foam compound into an instant-bond sealing tape. The assembly step it removes is the one that causes most field failures — a separately applied adhesive cures at whatever rate the line allows, on whatever surface preparation the operator had time for. A factory-laminated tape arrives with the bond already made.
  _56 words · live is 30 · “reducing assembly time by up to 40%” comes off. It is an up to percentage with no study, no customer and no measurement, and it is the only marketing-style claim on an otherwise expert page. The replacement argues the same benefit from the mechanism instead, which is both true and more persuasive to the engineer who has actually watched a hand-applied bead fail_
- **Cross-section build-up**: `Foam core (EPDM or CR)
Acrylic or rubber adhesive
Release liner (PE / silicone)`
  _[no change — three named layers in order is exactly right, and the release liner material is the kind of detail that tells a converter this supplier has made the product]_
- **Foam core comparison ×2** (Core | Temperature | Resistance | Used for):
  | EPDM foam tape | −50 to +120 °C constant | Excellent UV and ozone resistance | Outdoor weatherseals, curtain-wall expansion joints, HVAC flanges |
  | CR (neoprene) foam tape | −40 to +75 °C constant | Good oil and flame resistance | Marine hatches, refrigerant pipe wrap, fire-door perimeters |
  _Two cores, two cores — no count change. Both temperatures are brought into line with the corrected section 04 table, which is the point of correcting it: the neoprene figure appears twice on this page and fixing one and not the other would leave the contradiction in place. The refrigerant pipe wrap application makes the neoprene correction matter — that is precisely the duty where a 25 °C overstatement gets a seal specified into a line it cannot hold_
- **Adhesive comparison ×2** (System | Recommended for | Properties):
  | Acrylic adhesive | Exterior | High temperature resistance to +150 °C · excellent long-term bond durability · good UV and solvent resistance · slower tack, requires dwell time |
  | Rubber adhesive | Interior | Immediate high tack, instant bond · excellent peel strength on irregular surfaces · cost-effective for interior use · lower temperature ceiling, to +80 °C |
  _[no change to any value] — this comparison is correct as written and it is unusually honest. Each system is given a real disadvantage: acrylic needs dwell time, rubber has a lower ceiling. A page that tells a buyer the downside of both options is a page they trust on the upside_
- **Engineering note**:
  > Surface energy of the substrate determines adhesive selection. For low-surface-energy substrates such as PP, PE or powder-coated panels, specify acrylic adhesive with a primer or corona pre-treatment. For metals and glass, either system performs; rubber adhesive delivers superior initial grab.
  _[no change] — the most specialised paragraph on this website. Surface energy is the actual reason foam tapes fail in the field, it is understood by almost nobody outside the adhesives trade, and no competing Indian supplier page mentions it. It should be given its own <h3> so it can be retrieved on its own_
  <details><summary>notes (5)</summary>
  - This block deserves its own URL. self-adhesive foam tape manufacturer India, EPDM foam tape and acrylic vs rubber adhesive tape are three distinct searches with distinct buyers, and this section already contains a better page for all three than most of what ranks. It has an id already. Flagged as a scope decision, not built here — splitting it is a site-architecture change, not a copy change.
  - The engineering note is the citable passage. “Which adhesive for a low surface energy substrate?” has a precise answer here, with the pre-treatment named. Give it <h3>Choosing an adhesive for your substrate</h3> and it becomes independently retrievable.
  - The two comparison blocks must be real tables or <dl> pairs, not styled cards with loose text. Four attributes across two options is a comparison, and comparisons are what get extracted.
  - Do not put the +150 °C and +80 °C adhesive ceilings in schema. They are adhesive-system properties, not product properties, and a machine-readable figure here would be attributed to the foam.
  - The removed 40% claim should not be replaced by any percentage unless a customer measurement exists. If one does, name the customer and the process — an unattributed percentage is worth less than the mechanism argument that replaced it.
  </details>

## 07 Applications in the field [Two cards rewritten]
> live: LIVE H2 → In Production · four application cards, each naming a compound and a cell structure · one claims FDA compliance the legal page denies · another claims 25-year UV durability
- **Eyebrow**: `APPLICATIONS IN THE FIELD`
  _[no change]_
- **H2**: “In Production”
  _[no change — two words, and it claims exactly what it should: these are running parts, not a capability list]_
- **Intro**:
  > Margo foam compounds installed across four critical industrial environments.
  _[no change]_
- **Cards ×4** (Tag | Card | Body | Replaces):
  | EPDM CLOSED CELL | HVAC insulation | Pipe wrap and duct liner rated for −50 °C to +120 °C service | −20 °C to +120 °C — the low limit contradicted this page’s own compound table and foam-tape table, both of which publish −50 °C. Published EPDM closed-cell sponge datasheets run to −50/−57 °C, so −50 is the correct figure and the card was the outlier |
  | NBR / CR SHEET | Industrial gaskets | Die-cut gaskets for oil-resistant and refrigerant environments | [no change] |
  | EPDM SPONGE | Automotive seals | Extruded door and window seals, with ozone and weathering resistance tested to ISO 1431-1 |  |
  | VMQ SILICONE | Clean-room foam | Food-contact and biocompatible grade profiles for pharmaceutical and food processing environments |  |
  _Four cards, four cards — two unchanged, two rewritten.
Card 4 is the serious one. “FDA-compliant” is a regulatory status, and Margo’s own disclaimer states in writing that it does not hold FDA registration. One page claiming what another page denies is worse than an unsupported claim, because both are on the same domain. “Food-contact and biocompatible grade” is a compound property Margo can source and evidence, it keeps the application, and it is what the silicone panel on every other category page already says.
Card 3 replaces a 25-year service-life figure with the test that actually backs the property. Margo’s weathering work runs at a NABL partner to ISO 1431-1 and produces a resistance rating, not a number of years_
  <details><summary>notes (5)</summary>
  - The FDA correction has to propagate. Any other page reaching for a medical or food claim must use the same wording — food-contact and biocompatible grades, never registration or compliance. The disclaimer copy in sheet 08 is the governing statement and this card must not contradict it.
  - These four cards are the closest thing to case evidence on the site, and the case studies page has been deferred. Each names a compound, a cell structure and a real duty. If any of the four has a customer who would allow a name, this block becomes the strongest proof on the website for the cost of one email.
  - The 300K+ HVAC volume figure belongs here, on card 1, if it reconciles with the homepage 17.9 million breakdown. A volume number attached to a named application is evidence; the same number floating in a hero stat is decoration.
  - Card titles are <h3>, the compound tag is a <p> or a <span> with a class, not a heading.
  - ISO 1431-1 named on card 3 is a gain, not a loss. A test standard is checkable; a 25-year claim is not, and an engineer reads the second as marketing.
  </details>

## 08 Specification guide [Rename · content keeps]
> live: LIVE H2 → Specify in Four Lines · four parameters with worked examples — better than the extrusion page’s version · but both pages carry the identical heading
- **Eyebrow**: `ENGINEERING BRIEF`
  _[no change]_
- **H2**: “Specify Foam in Four Lines”
  _4 words · live is 4 · one word added, and it resolves a collision. The extrusion page carries the identical heading Specify in Four Lines, and both pages will also carry a HowTo schema node — two nodes with the same name on one domain compete for the same question and neither wins cleanly. Adding “Foam” costs nothing, keeps the pattern recognisable across the site, and gives each page its own phrase_
- **Intro**:
  > Our engineers can size a compound and a density from four operating parameters. No lengthy RFQ forms — just these four data points, and a recommendation back within 48 hours.
  _31 words · live is 28 · three words added. The live block asks the buyer to assemble four parameters and never says what they get or when. 48 hours is the site constant and it belongs in the sentence that asks for effort — the same edit made to the extrusion page’s version_
- **Parameters ×4** (# | Parameter | Example | Body):
  | 01 | Temperature | e.g. −30 °C to +110 °C | Minimum and maximum service temperature in °C. Include any cyclic or shock excursions — constant duty and intermittent excursion are different specifications on cellular rubber. |
  | 02 | Fluid contact | e.g. R-410A + UV exterior | List any chemicals, oils, UV, ozone or steam the foam will contact. |
  | 03 | Duty cycle | e.g. static seal, 50% compression | Static seal or dynamic compression? Cyclic frequency if known, and the closing force available. |
  | 04 | Compression set | e.g. < 25% after 70 h | Maximum allowable permanent deformation after long-term compression. We test to ASTM D395 Method B as standard. |
  _Four parameters, four parameters — no count change and the worked examples are kept verbatim. They are the best thing about this block: R-410A + UV exterior is a real refrigerant against a real exposure, and an example that specific tells the buyer exactly what format to answer in. Three small additions: parameter 01 gains the constant-versus-intermittent point the section 04 footnote now makes, parameter 03 gains closing force — which the live CTA already asks for and this block does not — and parameter 04 gains the test method, which Margo runs in-house_
  <details><summary>notes (5)</summary>
  - HowTo node with four HowToStep children, name = “How to specify sponge and foam rubber”. Distinct from the extrusion page’s node, which is why the heading had to change.
  - This version is better than the extrusion page’s, because it carries worked examples. The extrusion block should borrow the pattern — an example in the format the answer should take is worth more than another sentence of explanation.
  - Heading levels. <h2> for the section, <h3> for each parameter. Numbers are presentational and belong in CSS, not in the heading text.
  - Closing force is the parameter buyers forget and the one that decides whether a foam seals at all. It appears in the live CTA heading and nowhere in the specification guide; adding it here joins the two.
  - The 48-hour figure renders from the site constant, same as the eleven other places it appears.
  </details>

## 09 Sectors and applications [8 cards become 9]
> live: LIVE H2 → Sectors & Applications · eight sectors, each with four applications and a compound preference — the richest sector block on the site · but it is the third different sector count across three pages
- **Eyebrow**: `MARKET COVERAGE`
  _[no change]_
- **H2**: “Sectors & Applications”
  _[no change]_
- **Intro**:
  > Nine sectors served, each with its own compound preference. Each card links through to the industry page for the moulded and extruded parts we make alongside the foam.
  _28 words · live is 9 · the count changes from eight to nine and the linking sentence is added. This page currently has no outbound links in its body at all_
- **Cards ×9** (Sector | Applications | Compounds | Links to):
  | Automotive | Door and window seals, NVH foam, boot seals, battery tray pads | EPDM, NBR, CR | /industries/automotive |
  | HVAC & refrigeration | Duct liner, pipe wrap, compressor gaskets, anti-vibration pads | EPDM, CR | /industries/hvac |
  | Construction | Facade expansion joints, flame-retardant grades, roof membrane tape | EPDM, CR | /industries/construction |
  | Electrical & electronics | EMI foam gaskets, keypad pads, display seals, cable entry grommets | CR, EPDM | /industries/electrical-electronics |
  | Medical & food | Clean-room seals, packaging liner, conveyor wiper blades | VMQ, NR | /industries/medical-devices |
  | Transport — rail and marine | Cab window seals, undercarriage acoustic foam, door buffers, hatch and porthole seals | EPDM, CR, NBR | /industries/transport |
  | Mining | Skirting and chute seals, dust curtains, cab acoustic lining, screen deck pads | NR, EPDM | /industries/mining |
  | Water & fluid management | Pump housing gaskets, access cover seals, tank lid foam | EPDM, NBR | /industries/water-fluid-management |
  | General industry | Press tooling pads, grip handles, impact-absorption sheets, machine guard seals | NR, NBR | /industries/pumps-valves |
  _“fire-rated seals” struck 2026-09-03 — a fire rating belongs to a tested assembly, not a compound; see sheet 41 §06 · Eight become nine. All eight live sectors survive — Marine and Rail merge into a single Transport card, which frees a slot and is the honest grouping, since the applications and compounds overlap almost entirely. Two are added: Mining, which the site publishes as an industry and which is a genuine foam market, and Water & fluid management, likewise. Automotive moves to first, matching the site-wide ordering. The compound tags stay — naming two or three compounds per sector is the detail that makes this the richest sector block on the site, and neither the extrusion page nor the industries hub does it_
- **Card link**: `Rubber components for {sector}` → /industries/{slug}
  _Anchor text per card rather than nine identical “Learn more” links. Two cards have no destination — Construction and Transport. Construction is the same gap the extrusion sheet flags; it is named on both pages and the site has nowhere to send it_
  <details><summary>notes (5)</summary>
  - Three pages, three different sector counts. This page says eight, the extrusion page says six, the rest of the site says nine. They should all render from one list with per-page application text — the sectors are a property of the company, not of the product.
  - The 35 application names are the AEO surface, and the compound tags make them better than the extrusion page’s equivalent: “which foam for a battery tray pad” is answered on the card itself.
  - Nine internal links out of a page that currently has none. Together with the extrusion page’s nine, that is eighteen new links into the industry pages, which are the thinnest URLs on the site.
  - Construction has no industry page and is named on two product pages. Second flag; same decision.
  - Card titles are <h3> and the application list is a <ul>, not a comma string.
  </details>

## 10 Enquiries [Tune]
> live: LIVE H2 → “Send the closing force available and the gap to be sealed.” · the best CTA heading on the site — it asks for two specific things instead of saying “get in touch”
- **Eyebrow**: `START THE CONVERSATION`
  _[no change]_
- **H2**: “Send the closing force available” / “and the gap to be sealed.”
  _[no change] — this is the best CTA on the website and it should be left alone. Every other page says some version of “request a quote”. This one asks for two specific engineering inputs, which does three things at once: it qualifies the enquiry, it demonstrates competence, and it tells the buyer the conversation will be technical. The pattern should be copied to the other ten category pages, each asking for the two inputs that matter on that product_
- **Body**:
  > Those two numbers decide density and cell structure before anything else is discussed. Send them with the temperature range and what the foam will contact, and our engineers respond within 48 hours with a compound, a density and a cut form — or send a sample of the foam you are replacing, which answers all four at once.
  _57 words · new copy — the live block has a heading and buttons but no body paragraph carrying the promise. It explains why those two inputs are the ones asked for, states the turnaround, and offers the shortcut a maintenance buyer will actually take_
- **Buttons ×2**: `Request a Quote → /contact
Download Datasheet ↓ /resources/sponge-foam-datasheet.pdf`
  _Mirrors the hero. The datasheet must exist or the label changes to Request Datasheet — the same dead-download problem flagged in section 01, and it appears twice on this page_
- **Confirmation copy**: `Enquiry received. A named engineer replies within 48 hours to {email}
with a compound, a density and a recommended cut form.`
  _New string — it fills the existing post-submit state, which currently shows nothing. It restates the three things coming back, which matters most on the page that asked the buyer for the most specific inputs_
  <details><summary>notes (5)</summary>
  - Schema. Emit nothing here. ContactPoint lives on the homepage Organization node.
  - Analytics. Named conversion event on submit and on the datasheet click, counted separately — a download and an enquiry are different intents.
  - The heading is a question in disguise and should stay one. “What closing force do I need for a foam seal?” is a real search, and a page whose CTA asks for closing force will be surfaced for it.
  - Heading levels. <h2>. Both buttons are <a> elements.
  - This page ends better than it begins, which is rare. The last thing a visitor reads is a technical question rather than a sales line, and that is the right note for an engineering audience.
  </details>

## 11 Footer [Rewrite]
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
  - What it fixes on this page specifically: the footer states a minimum order on a page that sells sheet, roll and cut piece — three supply forms, none of them counted in pieces. Removing it once removes it on all forty pages.
  - This page is one of the two categories with no sitewide inbound link at all. /products/sponge-foam-rubber is absent from the live footer Products column, which shows 9 of 11 entries. Adding it here is the only sitewide route to the longest and most technically ambitious page on the site.
  - Build once, ships forty times. This is one component. The copy above is written out in full on every sheet in this set so nobody has to open two files to build one block, but it is authored once in the codebase.
  - Heading levels. The column labels (PRODUCTS / INDUSTRIES / COMPANY) are <h2> in the live build. As visible <h2>s they inject three phantom sections into every document outline on the site. Change to <p class="col-label">.
  - Link equity. 26 sitewide links from here. Adding /export, /products/extrusion-profiles and /products/sponge-foam-rubber gives three orphaned or under-linked URLs a sitewide inbound link each — the cheapest internal-linking win available on this site.
  - NAP markup. Wrap in <address>. Phone as <a href="tel:+919665579276">, email as <a href="mailto:info@margorubber.in">. The visible string and the href must not diverge.
  - Schema. The footer emits nothing. The Organization node on the homepage is the single entity definition and every other page @id-references it. Repeating an Organization block per page creates 40 competing entities.
  - Copyright year. Render from new Date().getFullYear(), not a literal. It has read 2024 for eight months.
  </details>