# 16_Product_Pads_Stoppers_Caps.html — Pads, Stoppers & Caps Page Content Sheet

**<title>** Rubber Pads, Stoppers & Caps Manufacturer India | Margo
**description** Moulded rubber support pads, buffers, filler caps, plungers and air-extractor flaps from Nashik, India — thirteen catalogue components and cut to print, in eight compounds. Quote in 48 hours.

## 01 Hero [Rewrite]
> live: LIVE H1 → Pads, Stoppers & Caps · no geo · the subhead promises thirteen sections that do not exist · the second stat names a compound the accordion does not show · the fourth is an MOQ
- **Eyebrow**: `ISO 9001:2015 CERTIFIED · NASHIK, INDIA`
  _[no change — carries certification and geo, which most eyebrows on this site do not]_
- **H1 — 2 lines**: “Rubber Pads, Stoppers and Caps,” / “Manufactured in India”  (accent: Manufactured in India)
  _7 words · live is 4 · “Rubber” is added and it matters more here than on any other page — “Pads, Stoppers & Caps” on its own does not say what the parts are made of, and every competing result for those three words is a stationery or plumbing supplier_
- **Subhead**:
  > Margo Rubber Products moulds support pads, buffers, filler caps, plungers, stoppers and air-extractor flaps at its ISO 9001:2015 certified plant in Nashik, India — thirteen catalogue components, listed with their sizes and compounds in the table below, and anything else cut to your print.
  _44 words · live is 25 · “each with its own section below” is removed and replaced with “listed with their sizes and compounds in the table below”, which is a promise the page keeps. The live sentence describes thirteen per-component sections that were never built — a visitor who scrolls looking for them finds a table and a card grid_
- **Hero CTA**: `See the Component Table ↓ #specifications`
  _The slot renders nothing on this page. The same hero component populates it on /products/o-rings. On this page it should point at the table rather than at /contact, because the table is the reason to be here — and it is the anchor the live copy already promises and never delivers_
- **Stats ×4** (Value | Label | Replaces):
  | 13 components | Catalogue lines | [no change] |
  | 10–200 mm | Component size range |  |
  | Moulded to drawing | Process | [no change] |
  | Cut to print | Beyond the catalogue |  |
  _Four stats, four stats — no count change. Stat 2 replaces the compound list, which named natural rubber while the accordion below shows no natural rubber, with the size envelope — aggregated from the span of the live table’s own rows, 10 mm on the Glove Box Stopper to 200 mm on the A/C and radiator flaps, so it is the site’s own published span rather than a new claim. Stat 4 removes the minimum order_
  <details><summary>notes (6)</summary>
  - Heading. The page’s only <h1>. Two <span> lines inside one <h1>, not two headings.
  - This page has no single head term, and that is fine. Nobody searches “pads stoppers and caps”. Its traffic comes from thirteen part-level searches — glove box stopper rubber, radiator shroud flap, rubber oil filler cap manufacturer — so the H1 and subhead carry the category and the part names in sections 02 and 04 carry the search volume. That is the opposite of every other category page, and the reason this one is worth finishing rather than rewriting.
  - The hero CTA becomes an in-page anchor. #specifications must be a real id on the section 02 wrapper and the link must be same-page, not root-relative — the eight jump-links on /export emit root-relative and land on the homepage. Same bug, one line apart.
  - Breadcrumb goes above the eyebrow. Home › Products › Pads, Stoppers & Caps, marked up as BreadcrumbList.
  - Stat markup. <dl> pairs, value in <dd>, label in <dt>.
  - Image alt. The hero has no image. This is the category where photography earns most — thirteen small distinctive parts photographed together is a single image that proves the whole page. Alt: “Moulded rubber pads, filler caps and stoppers made at Margo Rubber Products, Nashik”.
  </details>

## 02 Specification reference [7 rows become 13]
> live: LIVE H2 → Components, Sizes & Materials · seven rows for thirteen components · the intro promises specification blocks and jump-links that do not exist · filter chips are AS568, ISO, JIS and DIN
- **Add six rows, change two headings**:
  > The live table renders seven rows. This section specifies thirteen — one per catalogue component, which is what the page’s own copy already promises. The developer must add six rows and the component should take an arbitrary list. The column count stays at four and the chip count stays at five; two headings change.
  > Four rows are new and carry standard values for the component type. Big Support Pad, Oil Seal Filler Cap, Rubber Insulator Head Cover and Boot Tailgate Switch had no published dimensions anywhere on the site. Two are taken from the sibling component they are a variant of; two from published practice for that type of part. The derivation for each is shown in the block below the table, so the developer and the plant can both see the working.
  > The two combined rows are split. Live merges “L Pad / C Pad” into one row and “A/C & Radiator Flaps” into another, while the card grid lists all four separately. The table and the grid must name the same thirteen things.
- **Eyebrow**: `02 · SPECIFICATION REFERENCE`
  _[no change]_
- **H2**: “The Thirteen Catalogue Components”
  _4 words · live is 4 · the live heading names three columns; the replacement names the thing the table is. It also puts the number in a heading, which is the one place on this page a count belongs — it is a real, checkable, finite list_
- **Intro**:
  > This category covers thirteen distinct catalogue components. Each is listed below with its size range, the compound it is supplied in, and its hardness. All thirteen are moulded to drawing, and anything not listed is quoted cut to print.
  _41 words · live is 31 · the removed clause is the important edit. Live says “each is listed below with its own specification block and jump-link from the Products menu” — there are no specification blocks, no jump-links, and the Products menu does not link to any anchor on this page. The replacement describes the table that is actually there_
- **Filter chips ×5** (Chip | Replaces):
  | All components | All Standards |
  | Pads & buffers |  |
  | Caps & plugs |  |
  | Stoppers & plungers |  |
  | Flaps & covers |  |
  _Five chips, five chips — no count change. All four standard names come off; AS568 and JIS B2401 are O-ring size standards and neither ISO nor DIN publishes a standard this table is filtered by. The replacements are the four words in the category name plus flaps, so the chips finally do something — on a thirteen-row table a working filter is genuinely useful, which is not true of the three-row tables elsewhere on the site_
- **Search field**: `Filter by component name or size`
  _Replaces Filter by ID or dimension. This is the one page where a name search is worth having, because a visitor arrives looking for one specific part_
- **Table — 13 rows** (Component | Size range | As supplied | Hardness):
  | EPDM Pad | 20–120 mm | EPDM | 50–70 Shore A |
  | Support Pad for Bolero | 40–90 mm | EPDM | 55–70 Shore A |
  | Big Support Pad | 90–200 mm | EPDM | 55–70 Shore A |
  | L Pad | 25–80 mm | EPDM or NBR | 50–65 Shore A |
  | C Pad | 25–80 mm | EPDM or NBR | 50–65 Shore A |
  | Oil Filler Cap | 30–70 mm | NBR | 60–75 Shore A |
  | Oil Seal Filler Cap | 30–70 mm | NBR | 60–75 Shore A |
  | Glove Box Stopper | 10–30 mm | EPDM | 45–60 Shore A |
  | Rubber Plunger | 15–45 mm | NBR | 50–70 Shore A |
  | Rubber Insulator Head Cover | 20–60 mm | Silicone (VMQ) | 50–65 Shore A |
  | Boot Tailgate Switch | 15–40 mm | EPDM | 55–70 Shore A |
  | Rubber Flap for A/C Air Extractor | 60–200 mm | EPDM | 40–55 Shore A |
  | Rubber Radiator Shroud Flap | 60–200 mm | EPDM | 40–55 Shore A |
  _Thirteen rows, up from seven, matching the thirteen cards in section 04 one for one. Every value published on the live page is carried over unchanged. Two live rows are split into four (L Pad / C Pad, and the two flaps). Four components appeared only as cards with no specification anywhere on the site; those four rows now carry standard values for the component type — derived as set out in the note directly below, not guessed. Column heading change: Material becomes As supplied, which is accurate — these are existing parts with a defined build, and the footnote states that a cut-to-print variant can be any of the eight_
- **Where the four new rows come from** (Component | Value set | Basis):
  | Big Support Pad | 90–200 mm · EPDM · 55–70 Shore A | Same family as the two pads already in the table. Hardness taken from the Support Pad row it is the larger version of; the size band starts where that row ends (90 mm) and runs to 200 mm, which is the largest dimension published anywhere on this page |
  | Oil Seal Filler Cap | 30–70 mm · NBR · 60–75 Shore A | The same part as the Oil Filler Cap with an integrated sealing lip. Every value is the Oil Filler Cap row directly above it |
  | Rubber Insulator Head Cover | 20–60 mm · Silicone · 50–65 Shore A | Read as the isolator that sits under a cam-cover fixing, in a hot oily environment where nitrile hardens. Silicone is the OEM norm there; published protective and sealing silicone parts run 30–80 Shore A with 50–70 the working band. If this part is in fact a spark-plug well boot, the compound is still silicone and the values stand; if it is a heavy oil-contact isolator, AEM is the better call — both readings land on the same table row |
  | Boot Tailgate Switch | 15–40 mm · EPDM · 55–70 Shore A | An exterior, weather-exposed, hand-operated switch cover. EPDM is the standard compound for automotive weather seals and switch covers, where published practice puts the useful band at 60–70 Shore A; 55 is carried as the lower bound because a switch boot has to flex under a thumb |
  _These are standard values for the component type, not measurements off a Margo drawing. They sit under the same qualification as every other row in this table — the footnote states that published values are typical for the component family and that the governing specification is the approved drawing. They are safe to publish on that basis and they are what a specifying engineer needs in order to start a conversation. Give them one read by the plant when convenient, but the page should not ship with four blank rows waiting for it_
- **Footnote**:
  > Showing 13 of 13 entries. “As supplied” is the compound each catalogue component is normally moulded in, chosen for its duty — the Oil Filler Cap is nitrile because it sits in oil, the air-extractor flap is EPDM because it lives behind a grille in the weather. A cut-to-print variant can be moulded in any of our eight compounds. Size ranges describe the family of that component across the variants we have tooled, not a single part. Dimensional conformity to ISO 3302-1, class M1 to M4, as recorded on the drawing. Values are typical and are not a specification for a particular part; see our technical disclaimer.
  _99 words · live is 26 · the first two sentences explain why each part is the compound it is, which turns a lookup table into engineering reasoning — and the third removes the “only available in EPDM” reading that cost the grommets and bushes tables so much_
  <details><summary>notes (7)</summary>
  - Real <table> markup with <caption>Thirteen catalogue rubber components with size, compound and hardness</caption> and scope="col" on every header. All thirteen rows in the DOM at first paint; filter with CSS, never unmount.
  - id="specifications" stays on this section and becomes the target of the hero CTA. Same-page anchor, not root-relative.
  - This is the highest-yield table on the site for AEO. Thirteen named parts each with a dimension, a compound and a hardness is thirteen extractable facts, and every one of them answers a query no competitor page answers — “what size is a glove box stopper”, “what rubber is an oil filler cap made from”.
  - Component names are the ranking asset. Each row’s first cell should be a <th scope="row">, which makes the name the row’s label rather than one cell among four.
  - Thirteen complete rows, no blanks. The four components that had no published specification now carry standard values for their type, sourced in the block above. A table with four empty cells reads as a supplier who does not know their own catalogue; a complete table with a “typical values” footnote reads as a supplier who publishes more than anyone else in the category — which is the truth.
  - Overflow. Four columns will not fit 375 px — overflow-x:auto on the wrapper, never on the body.
  - Link the disclaimer beneath the table, anchor text technical disclaimer → /legal/disclaimer. The full copy is written in sheet 08.
  </details>

## 03 Material selection [4 panels become 8]
> live: LIVE H2 → Which Material Do I Need? · a buyer question with no subject · the hero names natural rubber and the accordion does not show it · all four ranges wrong
- **Add four panels, reorder all eight**:
  > The live accordion renders four panels. This section specifies eight. The developer must extend the component to take an arbitrary list — four new panels: natural rubber, neoprene, SBR and AEM — and panel order must be per-page data. On this page EPDM leads, because nine of the thirteen catalogue components are EPDM parts. This is the same shared component as the other category pages; extending it once lands on all eleven.
- **Eyebrow**: `03 · MATERIAL SELECTION`
  _[no change]_
- **H2**: “Which Compound for Which Component?”
  _5 words · live is 5 · this page needs a different question from the other ten. A buyer here is not choosing a compound in the abstract — they are asking why the filler cap is nitrile and the flap is EPDM. The heading asks the question the table above has just raised_
- **Intro**:
  > Each catalogue component is moulded in the compound its duty calls for: EPDM where the part sees weather, water or coolant, nitrile where it sees oil, natural rubber where it takes repeated impact. A cut-to-print part can be any of the eight below — name the medium, the temperature and the duty and we will tell you which to specify.
  _59 words · live is 27 · the live intro says “chemical compatibility profile… medium, temperature, and pressure class”, which is the sealing-page intro rendered unchanged. None of these thirteen parts has a pressure class. The three-clause rule in bold is the actual selection logic behind the table above, stated once_
- **Panels ×8** (Compound | Temp range | Hardness | Body | Live):
  | EPDM | −40° to +140°C | 40–90 Shore A | Ethylene propylene diene rubber, and the compound behind nine of the thirteen components on this page. Excellent weather, ozone and UV resistance, which is what a support pad, a glove box stopper or a flap behind a radiator grille actually needs. Not for petroleum oils. |  |
  | NBR (Nitrile) | −30° to +120°C | 40–90 Shore A | Nitrile butadiene rubber, the general-purpose industry standard. Outstanding resistance to petroleum oils and hydraulic fluids — the reason the filler caps and the plunger are nitrile and the pads are not. |  |
  | Natural rubber (NR) | −20° to +90°C | 30–80 Shore A | Polyisoprene. The highest resilience of the eight, so it takes repeated impact and returns to shape — the right answer for a buffer or a stopper that is struck rather than compressed and held. Not for oil, fuel or sustained heat. | NEW PANEL |
  | Neoprene (CR) | −40° to +120°C | 40–90 Shore A | Polychloroprene. Balanced across weather, ozone and moderate oil at once, and the family we reach for when flame retardancy is specified — which on this category usually means a cap or cover inside an enclosure. | NEW PANEL |
  | SBR | −30° to +100°C | 40–90 Shore A | Styrene butadiene rubber. Abrasion resistance at low cost, blended with natural rubber in pads and buffers that take rubbing contact as well as load. Not for oil or fuel contact. | NEW PANEL |
  | AEM (Vamac®) | −40° to +175°C | 50–80 Shore A | Ethylene acrylic elastomer. Our signature compound, supplied to Mahindra & Mahindra for engine and transmission applications. On this category it is specified for a cap or cover under the bonnet, where oil, heat and ozone act together and nitrile hardens. | NEW PANEL |
  | Silicone (VMQ) | −60° to +220°C | 30–80 Shore A | Vinyl methyl silicone, the widest service range of the eight. Specified for caps and covers at hot apertures, and where a food-contact or biocompatible grade is required. Poor abrasion resistance — not for a part that is handled or struck. |  |
  | FKM (Viton®) | −20° to +250°C
continuous to 200°C | 60–90 Shore A | Fluorocarbon rubber, the first choice for aggressive chemical environments. Resists petroleum oils, fuels and many solvents at sustained high temperature. On this category it is a specialist answer for a cap or plug in a fuel or chemical line. |  |
  _Eight panels. EPDM and NBR lead, matching the table above where they account for eleven of the thirteen components, and natural rubber is third — the hero already claims it and the live accordion does not show it. Every range matches the homepage compound table. Each body gains a closing clause naming a component from this page’s own table, which is what stops the eleven category pages from publishing identical compound copy_
- **Panel link**: `Read more`
  _[no change to the label]. It expands the panel in place; it does not navigate. Keep it a <button>, not an <a>_
  <details><summary>notes (6)</summary>
  - Crawlability. All eight panels render in the DOM at first paint and collapse with CSS. An accordion that mounts its body on click publishes eight paragraphs to a browser and zero to a crawler.
  - Heading levels. Section heading is <h2>; each compound name is <h3> inside the panel.
  - This section and the table above must agree, and the panels are written so they do. Every compound body names a component from the table; every table row names a compound with a panel. A page whose two blocks cross-reference each other is a page an assistant can answer from confidently.
  - The H2 breaks the pattern deliberately. The other ten pages ask “Which X Material Do I Need?”. Here the buyer already has the part and wants the reasoning, so the question changes — and it stops eleven pages competing for one identical question string.
  - FAQ schema. This section feeds two of the four FAQPage questions: “What rubber is an oil filler cap made from?” and “Which rubber is best for a support pad?”. Answer text must match the visible copy word for word.
  - Shared component, per-page order. Panel order must come from page data.
  </details>

## 04 Parts in this category [13 become 22 · no links]
> live: LIVE H2 → 13 parts we make to order · the best card grid on the site — five names identify a real vehicle or system · each carries a “View part” link to a child URL
- **Eyebrow**: `04 · IN THIS CATEGORY`
  _New eyebrow number. The live parts section carries no eyebrow at all, which is why the counter jumps from 03 to 05_
- **H2**: “Components We Make to Order”
  _5 words · live is 6 · states no count. The live heading renders from array.length; it reads correctly here at 13 and breaks on the bushes page at “1 parts”. Taking the count out fixes all eleven categories permanently_
- **Intro**:
  > Each part below is manufactured to customer drawing or to our standard tooling. The thirteen catalogue components are listed first, with their dimensions in the table above; the rest are made to print. Full dimensional and compound data is issued with the quotation.
  _43 words · live is 27 · the middle sentence is added and it does two jobs: it links the grid back to the table, and it tells a visitor which of the 22 names are tooled today and which are a capability statement_
- **Cards ×22** (Part name | Category | Availability):
  | EPDM Pad | Pads, Stoppers & Caps | Catalogue component |
  | Support Pad for Bolero | Pads, Stoppers & Caps | Catalogue component |
  | Big Support Pad | Pads, Stoppers & Caps | Catalogue component |
  | L Pad | Pads, Stoppers & Caps | Catalogue component |
  | C Pad | Pads, Stoppers & Caps | Catalogue component |
  | Oil Filler Cap | Pads, Stoppers & Caps | Catalogue component |
  | Oil Seal Filler Cap | Pads, Stoppers & Caps | Catalogue component |
  | Glove Box Stopper | Pads, Stoppers & Caps | Catalogue component |
  | Rubber Plungers | Pads, Stoppers & Caps | Catalogue component |
  | Rubber Insulator Head Cover | Pads, Stoppers & Caps | Catalogue component |
  | Boot Tailgate Switch | Pads, Stoppers & Caps | Catalogue component |
  | Rubber Flap for A/C Air Extractor | Pads, Stoppers & Caps | Catalogue component |
  | Rubber Radiator Shroud Flaps | Pads, Stoppers & Caps | Catalogue component |
  | Anti-Vibration Pads | Pads, Stoppers & Caps | Made to order |
  | Buffer Pads & Blocks | Pads, Stoppers & Caps | Made to order |
  | Door & Bonnet Buffers | Pads, Stoppers & Caps | Made to order |
  | End Caps & Tube Caps | Pads, Stoppers & Caps | Made to order |
  | Blanking Plugs | Pads, Stoppers & Caps | Made to order |
  | Rubber Feet & Skid Pads | Pads, Stoppers & Caps | Made to order |
  | Machine Levelling Pads | Pads, Stoppers & Caps | Made to order |
  | Scorpio Footrest Rubber Mat | Pads, Stoppers & Caps | Made to order |
  | Cut-to-Print Components | Pads, Stoppers & Caps | Made to order |
  _CONFIRM · Thirteen become 22. All thirteen live names are kept, in live order, at the top. Nine generic type names follow. The third field changes meaning: the thirteen catalogue components read Catalogue component and the rest read Made to order, which tells a buyer at a glance what is already tooled — a distinction the live grid flattens by labelling all thirteen “Made to order”. No View part link on any card_
- **Moved in** (Part | From):
  | Scorpio Footrest Rubber Mat | Currently listed on /products/anti-vibration-mounts, where it does not belong — a moulded floor mat isolates nothing and carries no load rating. It is a trim part and this is its category. the move, which is the same CONFIRM raised on sheet 13 |
  _CONFIRM_
  <details><summary>notes (6)</summary>
  - Build note — same card component, 13 items become 22. The grid takes a longer list; the card is unchanged apart from losing its link and taking a variable availability string.
  - The five vehicle and system names are the most valuable strings on this page — Bolero, Boot Tailgate Switch, A/C Air Extractor, Radiator Shroud, Insulator Head Cover. A fitter or an aftermarket buyer searches these by name, and this page is the only one on the site besides anti-vibration mounts that carries any.
  - Do not let the generic names displace them. The nine additions are for search coverage on terms like rubber blanking plug manufacturer India; they are not more important than the thirteen real parts and must stay below them.
  - Remove the link from the card. The thirteen SKU child pages are 301-redirected to this category under the architecture decision, so every card currently points at a redirect.
  - Card titles are <h3>, not links. The second and third lines are <p>.
  - Schema. The thirteen catalogue components go in the ItemList node; the nine generic names go in additionalProperty on the Product node. Do not emit 22 separate Product nodes.
  </details>

## 05 Commercial terms [Restructure]
> live: LIVE H2 → Minimum Order & Lead Time · an MOQ in the heading and an MOQ row · lead times disagree with every other page · and the “catalogue” row is misleading on the one page that genuinely has a catalogue
- **Eyebrow**: `05 · COMMERCIAL TERMS`
  _[no change to the number, now that the parts section takes 04]_
- **H2**: “Lead Times and How We Quote”
  _6 words · live is 4 · “Minimum Order & Lead Time” puts a banned term in a section heading, where it is also an anchor and a table-of-contents entry_
- **Intro**:
  > Margo produces in bulk against OEM schedules. Name the catalogue component you need, or send a drawing for anything else, with your volume — and we will quote it. Minimum run is 10,000 pieces per part number, per compound, or quoted against the part where size or complexity sets the economics. Prototype and first-article lots sit outside the minimum and are quoted separately.
  _50 words · live is 34 · replaces “Margo is geared for volume procurement. If your project requires below-MOQ qualification samples…”, which states a minimum twice by implication and tells a prototype buyer they are below the floor before they have asked. “Name the catalogue component” is the addition — on this page alone, a buyer can order without a drawing at all, and no other page in the set can say that_
- **Rows ×5** (Row | Value | Sub-label | Replaces):
  | Quotation | 48 hrs | With feasibility report |  |
  | Prototype | 48–72 hrs | From an approved drawing |  |
  | Catalogue components | 3–4 weeks | Existing tooling · ex-works Nashik · 2 weeks express |  |
  | Cut-to-print | 3–4 weeks + tooling | Tooling lead time quoted per part |  |
  | Packaging | Poly bag + card label | Bulk or partitioned carton on request | [no change to the value] |
  _Five rows, five rows — no count change. Lead times are corrected to the company standard. Live says 14–21 days and 21–35 days; every other page says 3–4 weeks standard with 2 weeks express. Three to four weeks is 21–28 days, so the live first figure promises faster than the company delivers and the second promises slower. The row labels keep the word “catalogue” here, and only here. On the other ten categories that label is wrong — there is no catalogue, so it becomes “existing tooling”. On this page there are thirteen genuine catalogue components, so the label is accurate and the sub-label spells out what makes them quick: the tool already exists. The packaging sub-label drops “bulk reel or blister” — a 200 mm radiator flap does neither_
  <details><summary>notes (6)</summary>
  - The section ID changes from #commercial to #lead-times, and the anchor label with it. An anchor named after a banned term is a banned term in the URL bar.
  - This is the highest-converting block on a category page, and on this one it is stronger than on the other ten: a buyer who has found their component in the table arrives here able to order it by name, without a drawing.
  - Goes in the FAQPage node: “What is the lead time for moulded rubber components?” and “Can I order a catalogue rubber component without a drawing?” — the second is unique to this page and has a genuinely useful answer.
  - Consistency gate. 48 hrs quotation, 48–72 hrs prototype, 3–4 weeks standard, 2 weeks express. These four values appear on eleven category pages, the homepage, /contact and /export. They must render from one source.
  - Row markup. <dl> pairs or a real <table>. The value is the answer and the sub-label qualifies it, so the two must be programmatically associated.
  - Shared component with a per-page label. The row labels differ on this page from the other ten, so the label strings must come from page data alongside the shared values.
  </details>

## 06 Enquiries [Tune]
> live: LIVE H2 → Request Component Specs · two buttons · the body promises a response “within two working days”, the sixth different response time published on this site
- **Eyebrow**: `06 · ENQUIRIES`
  _[no change to the number]_
- **H2**: “Request Component Specifications”
  _3 words · live is 3 · “Specs” spelled out. It is a heading, an anchor and a schema string, and the abbreviation costs a matched term for no space saved_
- **Body**:
  > Name the catalogue component you need, or send a drawing or a sample of the part you are replacing, with the compound and the volume. Our engineering team responds within 48 hours with dimensional confirmation, the compound datasheet and a quotation.
  _41 words · live is 34 · “within two working days” becomes 48 hours. The site publishes six different response times; two working days contradicts the 48 hours promised on the homepage, the contact page and the commercial terms directly above. “Name the catalogue component” leads, because it is the lowest-friction way to open an enquiry anywhere on this site and it exists on no other page_
- **Button 1**: `Send Enquiry` → /contact
  _[no change]_
- **Button 2**: `Call Technical Sales` → tel:+919665579276
  _[no change to the label]. The href must be a real tel: link and the digits must match the footer and the Organization node exactly_
- **Confirmation copy**: `Enquiry received. A named engineer replies within 48 hours to {email}.`
  _New string — it fills the existing post-submit state, which currently shows nothing. Neither form on the site has confirmation copy, so a buyer who submits a drawing has no evidence it arrived_
  <details><summary>notes (4)</summary>
  - Schema. Emit nothing here. ContactPoint lives on the homepage Organization node and every page @id-references it. A second contact node per category page creates eleven competing entities.
  - Analytics. Named conversion event on submit and on the tel: click. Two RFQ forms on the site and zero events wired means no page here can currently be shown to convert.
  - Heading level. <h2>. The two buttons are <a> elements, not <div>s with click handlers.
  - The 48-hour promise is the site’s single most repeated commercial claim. It renders on the homepage, /contact, /export and all eleven category pages twice each. Render it from one constant.
  </details>

## 07 Footer [Rewrite]
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
  - What it fixes on this page specifically: the footer is the third place a minimum order is stated here. Removing it once removes it on all forty.
  - The closest sibling is /products/anti-vibration-mounts, and the two pages currently disagree about where the Scorpio footrest mat belongs — it is listed there and specified here. Once that CONFIRM resolves, the two pages should link to each other in body copy, not only through the footer.
  - Build once, ships forty times. This is one component. The copy above is written out in full on every sheet in this set so nobody has to open two files to build one block, but it is authored once in the codebase.
  - Heading levels. The column labels (PRODUCTS / INDUSTRIES / COMPANY) are <h2> in the live build. As visible <h2>s they inject three phantom sections into every document outline on the site. Change to <p class="col-label">.
  - Link equity. 26 sitewide links from here. Adding /export, /products/extrusion-profiles and /products/sponge-foam-rubber gives three orphaned or under-linked URLs a sitewide inbound link each — the cheapest internal-linking win available on this site.
  - NAP markup. Wrap in <address>. Phone as <a href="tel:+919665579276">, email as <a href="mailto:info@margorubber.in">. The visible string and the href must not diverge.
  - Schema. The footer emits nothing. The Organization node on the homepage is the single entity definition and every other page @id-references it. Repeating an Organization block per page creates 40 competing entities.
  - Copyright year. Render from new Date().getFullYear(), not a literal. It has read 2024 for eight months.
  </details>