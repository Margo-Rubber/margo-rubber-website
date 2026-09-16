# 10_Product_Oil_Seals.html — Oil Seals Page Content Sheet

**<title>** Oil Seal Manufacturer India | FKM, NBR, AEM Rotary Seals | Margo
**description** Rotary and static oil seals moulded to your shaft, bore and width in Nashik, India. AEM, FKM, NBR, EPDM and silicone. ISO 9001:2015. Quotation in 48 hours.

## 01 Hero [Rewrite]
> live: LIVE H1 → Precision Oil Seals · no head term, no geo · fourth stat is an MOQ · subhead says “four compounds” where the site says eight
- **Eyebrow**: `ISO 9001:2015 CERTIFIED · NASHIK, INDIA`
  _(no change)_
- **H1 — 2 lines**: “Rotary and Static Oil Seals,” / “Manufactured in India”  (accent: Manufactured in India)
  _7 words · live is 3 · carries the head term and the two seal families. “Precision Oil Seals” alone carries neither_
- **Subhead**:
  > Margo Rubber Products moulds rotary and static oil seals to your shaft diameter, housing bore and width at its ISO 9001:2015 certified plant in Nashik, India — in AEM, FKM, NBR, EPDM and silicone, to DIN 3760 and ISO 6194 profiles or cut to print. AEM seals go to Mahindra & Mahindra for transmission applications.
  _50 words · live is 30 · “one page, four compounds” comes out — it describes the website rather than the product, and understates the compound range by half_
- **Stats ×4** (Value | Label | Replaces):
  | AEM · FKM · NBR · EPDM · VMQ | Compounds |  |
  | DIN 3760 · ISO 6194 | Profile standards |  |
  | Rotary · Static | Seal types | (no change) |
  | 48 hrs | Quotation Turnaround |  |
  _The bore-tolerance stat is replaced by the profile standards, which is what an oil-seal buyer actually filters on. A single ±0.10 mm figure across every shaft size is the same error as the O-rings hero — tolerance follows the size, and the page has no size data to attach it to_
  <details><summary>notes (4)</summary>
  - Heading. Page’s only <h1>, two <span class="block"> children.
  - The Mahindra clause is the strongest sentence available on this page. AEM transmission seals are the one product line on the site with a named OEM behind it, and this is the category page where that belongs.
  - Breadcrumb Home › Products › Oil Seals, visible and in schema. Absent on all eleven category pages.
  - Alt. alt="Rotary oil seals moulded by Margo Rubber Products, Nashik, India".
  </details>

## 02 Specification reference [Tune]
> live: LIVE H2 → Material Comparison · 4 rows, no dimensions, and a five-chip standards filter that applies to O-rings, not oil seals
- **Remove the filter**:
  > Delete all five chips. All Standards · AS568 · ISO · JIS · DIN are O-ring dimensional catalogues. They filter a four-row table that has no standard column, so they do nothing, and they tell an engineer the page was templated rather than written. The free-text filter also comes out until there is a table long enough to need it.
- **H2**: “Compound Comparison”
  _2 words · live is 2 · unchanged; the section carries one table, as the design has it_
- **Intro**:
  > Compare service temperature and media resistance before specifying. Figures are indicative ranges for the compound family — confirm against the datasheet for your application.
  _24 words · live is 26 · the hedging in the live copy is correct and is kept_
- **Table — 5 rows** (Material | Temp range | Chemical / oil resistance | Typical application):
  | AEM (Vamac®) | −40° to +175°C | Excellent — hot oil, heat and ozone together | Automotive transmission and engine seals |
  | FKM (Viton®) | −20° to +250°C
continuous to 200°C | Excellent — petroleum oils, fuels, solvents | Oil & gas, petrochemical |
  | NBR (Nitrile) | −30° to +120°C | Very good — mineral oils, hydraulic fluid | General industrial, automotive |
  | EPDM | −40° to +140°C | Poor in oil; excellent in water and steam | Water pumps, brake systems |
  | Silicone (VMQ) | −60° to +220°C | Moderate — dry heat, not for fuels | High-temperature static sealing |
  _Four rows become five — AEM added and led, because it is the compound Margo actually supplies for oil seals and the only one with a named OEM behind it. All four live temperature ranges are corrected to the homepage table, which governs: FKM 200 → 250, NBR −40 → −30, EPDM −50/150 → −40/140, VMQ 230 → 220. The resistance and application columns are kept — they are accurate and well judged_
  <details><summary>notes (4)</summary>
  - Real <table> markup with <caption> and scoped headers. All rows in the DOM at first paint.
  - Overflow. Four columns on a narrow screen — overflow-x:auto on the wrapper, never on the body.
  - The live hedging line is kept — “values are indicative, confirm against the compound datasheet”. It is correct, and it is the sentence the technical disclaimer backs up.
  - Link the disclaimer beneath the table: “Typical values. See our technical disclaimer.”
  </details>

## 03 Material selection [Four panels become eight]
> live: LIVE H2 → Which Material Do I Need? · four panels, four wrong ranges, and AEM missing — the compound Margo actually supplies for rotary seals
- **H2**: “Which Oil Seal Material Do I Need?”
  _6 words · live is 4 · adds the product noun. The live H2 is generic across every category page, so four pages compete for one question_
- **Panels ×8** (Compound | Temp range | Hardness | Body | Live):
  | AEM (Vamac®) | −40° to +175°C | 50–80 Shore A | Ethylene acrylic elastomer. Our signature compound for rotary sealing, supplied to Mahindra & Mahindra for transmission applications. Holds compression-set stability where oil, heat and ozone act together. | NEW PANEL |
  | FKM (Viton®) | −20° to +250°C
continuous to 200°C | 60–90 Shore A | Fluorocarbon rubber, the first choice for aggressive chemistry and sustained heat. Resists petroleum oils, fuels and many solvents where nitrile is attacked. |  |
  | NBR (Nitrile) | −30° to +120°C | 40–90 Shore A | Nitrile butadiene rubber, the general-purpose standard for oil sealing. Outstanding resistance to petroleum oils and hydraulic fluids at moderate temperature. |  |
  | EPDM | −40° to +140°C | 40–90 Shore A | Water, steam and brake fluid service, with excellent weather and ozone resistance. Not for petroleum oils — the commonest mis-specification on a seal. |  |
  | Silicone (VMQ) | −60° to +220°C | 30–80 Shore A | The widest service range of the eight, for high-temperature static sealing. Biocompatible grades available. Poor abrasion resistance — not for a rotating shaft. |  |
  | Neoprene (CR) | −40° to +120°C | 40–90 Shore A | Balanced properties across weather, refrigerants and moderate oil. Flame-retardant grades available. Rarely specified for rotary service. | NEW PANEL |
  | SBR | −30° to +100°C | 40–90 Shore A | Abrasion resistance at low cost, for static seals in water and mild service. Not for oil or fuel contact, and rarely specified for rotary service. | NEW PANEL |
  | Natural Rubber (NR) | −20° to +90°C | 30–80 Shore A | The highest resilience of the eight, specified where a seal also has to damp. Not for oil, fuel or sustained heat, and rarely specified for rotary service. | NEW PANEL |
  _Four panels become eight. Ranges match the homepage compound table, which governs across all eleven category pages_
- **Panel order**:
  > AEM, FKM and NBR lead, because those three cover almost all rotary sealing. EPDM and silicone follow. Neoprene, SBR and natural rubber sit last and each carries “rarely specified for rotary service” in its body — a specifying engineer needs to know they exist, and needs to know not to pick them for a shaft seal.
- **Remove**:
  > “Food-grade and medical compounds available on request” in the silicone panel. Food-grade implies FDA compliance, which Margo does not hold, and /industries/medical-devices states plainly that ISO 13485 and FDA registration are not held. Replace with: “Biocompatible grades available; we do not hold FDA registration or ISO 13485.”
  <details><summary>notes (5)</summary>
  - Build note — four new accordion panels. The component renders four today; it needs to take a list.
  - All eight panels in the DOM at first paint, collapsed by CSS, deep-linkable at #aem, #fkm and so on.
  - The generic H2 is a real SEO problem. “Which Material Do I Need?” appears on multiple category pages verbatim. Adding the product noun to each stops eleven pages competing for one passage.
  - Hardness lives here, not in the comparison table — Shore A is a property of the compound, not of the size.
  - Compound ranges are governed by one table. The eight values here match the homepage compound table exactly, which is the single source for the whole site. Two carry an open question — FKM at 250 °C is above the 200–210 °C industry continuous rating and reads as a peak, and AEM at 175 °C is an advanced-grade figure. Both are flagged in sheet 01 section 10; settle them there and the change propagates to all eleven category pages.
  </details>

## 04 Parts in this category [Full list, no links]
> live: LIVE H2 → 6 parts we make to order · four are compound variants of one product, two are not oil seals · every card carries a “View part” link to a child URL
- **Eyebrow**: `IN THIS CATEGORY`
- **H2**: “Oil Seals We Mould”
  _4 words · live is 5 · states no count, which removes the “6 parts” / “1 parts” pluralisation bug permanently_
- **Intro**:
  > Every seal below is moulded to a customer drawing, a standard profile reference, or a worn sample. Compound, hardness and dimensions are set from your specification; full dimensional data is issued with the quotation.
  _38 words · live is 27_
- **Cards** (# | Part name | Second line):
  | 01 | Rotary Shaft Oil Seals | Oil Seals · Made to order |
  | 02 | Static Oil Seals | Oil Seals · Made to order |
  | 03 | Single Lip Oil Seals | Oil Seals · Made to order |
  | 04 | Double Lip Oil Seals | Oil Seals · Made to order |
  | 05 | Spring-Loaded Oil Seals | Oil Seals · Made to order |
  | 06 | Dust Seals | Oil Seals · Made to order |
  | 07 | Rubber Covered Oil Seals | Oil Seals · Made to order |
  | 08 | Metal Cased Oil Seals | Oil Seals · Made to order |
  | 09 | Transmission Oil Seals | Oil Seals · Made to order |
  | 10 | Engine Oil Seals | Oil Seals · Made to order |
  | 11 | Gearbox Oil Seals | Oil Seals · Made to order |
  | 12 | Pump Shaft Seals | Oil Seals · Made to order |
  | 13 | Wheel Hub Seals | Oil Seals · Made to order |
  | 14 | Valve Stem Seals | Oil Seals · Made to order |
  | 15 | V-Ring Seals | Oil Seals · Made to order |
  | 16 | Cut-to-Print Oil Seals | Oil Seals · Made to order |
  _Sixteen cards, same three-line format as live: number, part name, category and order basis. No descriptions — a specifying engineer scans names, and the compound and dimensional detail is already covered in sections 02 and 03_
- **Removed** (Live item | Why):
  |  | Compound variants of one product, not separate parts. Material selection is covered properly in section 03, with eight compounds instead of four. |
  |  |
  |  |
  |  |
  |  | Not oil seals. They belong under /products/leak-test-rubber or /products/pads-stoppers-caps. |
  |  |
  _CONFIRM which._
- **Remove the link**:
  > View part → comes off every card. Nothing in this section links anywhere. The child URLs are 301-redirected to this category under the architecture decision, and the list exists to show range, not to route.
  <details><summary>notes (6)</summary>
  - Build note. Same card component, link removed, six cards become sixteen. The grid must take a variable count.
  - Sixteen part names is the point. Each is a phrase a buyer searches — “wheel hub seal manufacturer India”, “double lip oil seal supplier” — and together they tell an assistant what this category covers. Four compound variants told it almost nothing.
  - Card titles are <h3>, not links. The second line is a <p>.
  - The count comes out of the heading. “Oil Seals We Mould” never breaks; {n} parts from array.length reads “6 parts” here and “1 parts” on O-rings.
  - All sixteen names are client-confirmed, 2026-09-01. Metal-cased seals are insert-moulded rather than plain moulded, and rubber-to-metal bonding is now confirmed as an in-house process, so that entry stands with the rest.
  - Schema. The Product node’s additionalProperty can carry the part types. Do not emit sixteen separate Product nodes — they are variants of one category.
  </details>

## 05 Commercial terms [Restructure]
> live: LIVE H2 → Minimum Order & Lead Time · an MOQ in the heading, an MOQ row, and “geared for volume procurement” · lead times disagree with every other page
- **Eyebrow**: `05 · COMMERCIAL TERMS`
  _(no change)_
- **H2**: “Lead Times and How We Quote”
  _6 words · live is 4 · “Minimum Order & Lead Time” puts a banned term in a section heading, where it is also an anchor and a table-of-contents entry_
- **Intro**:
  > Margo produces in bulk against OEM schedules. Tell us the shaft, the bore, the width and the volume and we will quote it. Minimum run is 10,000 pieces per part number, per compound, or quoted against the part where size or complexity sets the economics. Prototype and first-article lots sit outside the minimum and are quoted separately.
  _46 words · live is 34 · replaces “Margo is geared for volume procurement. If your project requires below-MOQ qualification samples…”, which states an MOQ twice by implication and tells a prototype buyer they are below the floor before they have asked. The replacement is the founder’s own phrasing from the commercial terms, with the three oil-seal dimensions named_
- **Rows ×5** (composite):
    | Quotation | 48 hrs | With feasibility report |  |
    | Prototype | 48–72 hrs | From an approved drawing |  |
    | Catalogue sizes | 3–4 weeks | Ex-works Nashik, from drawing approval · 2 weeks express |  |
    | Cut-to-print | 3–4 weeks + tooling | Tooling lead time quoted per part |  |
    | Packaging | Poly bag + card label | Bulk or blister on request | (no change) |
  · Lead times are corrected to the company standard. Live says 14–21 days for catalogue and 21–35 for custom; every other page on the site says 3–4 weeks standard with 2 weeks express. Three to four weeks is 21–28 days, so the live catalogue figure promises faster than the company delivers and the custom figure promises slower.
  · Four MOQ statements come off this page: the hero stat, the section heading, the standard-MOQ row, and the fourth in the global footer. Standing founder instruction, 2026-08-19 — never publish a piece count, never claim to take only large orders.
  <details><summary>notes (5)</summary>
  - The section ID changes from #commercial to #lead-times, and the anchor label with it. An anchor named after a banned term is a banned term in the URL bar.
  - This is the highest-converting block on a category page. A buyer who has read the compound table and picked a material arrives here to find out whether the timeline works. Answering with an MOQ instead of a lead time loses them.
  - Goes in the FAQPage node: “What is the lead time for custom oil seals?” and “How is a custom oil seal quoted?” — both verified buyer questions from the fan-out research.
  - Consistency gate. 48 hrs quotation, 48–72 hrs prototype, 2 weeks samples, 3–4 weeks production. The same four figures on all eleven category pages and every other page on the site.
  - Shared component. This block renders identically on all eleven category pages, so the fix lands eleven times from one change — including forty-four MOQ statements in total.
  </details>

## 06 Enquiry CTA and footer [Tune]
> live: LIVE H2 → Request Oil Seal Specs · “within two working days” again · footer is the global component
- **H2**: “Send a Drawing, a Sample, or Three Numbers”
  _8 words · live is 3 · the three numbers are shaft, bore and width — which is genuinely all Margo needs to quote an oil seal, and saying so lowers the barrier to enquiring_
- **Body**:
  > Shaft diameter, housing bore, width and the fluid it runs in. That is enough to quote. We reply within one business day, and a quotation with a compound recommendation follows inside 48 hours. No drawing? Send the worn seal.
  _40 words · live is 33 · “within two working days” corrected — the sixth value the site publishes for this promise_
- **CTAs ×2**: `Send Enquiry → /contact
Call Technical Sales → tel:+919665579276`
  _(no change to labels) · the phone CTA must carry the locked NAP number_
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
  <details><summary>notes (4)</summary>
  - Footer: global component, copy written out above. Products column 9 → 11 gives the two missing categories a sitewide link, and the footer MOQ comes off, which resolves the fourth MOQ statement on this page.
  - Response-time consistency. One business day to acknowledge, 48 hours to quote. Eighth RFQ entry point on the site and still none tracked.
  - Prefill the product field from the category on arrival at /contact.
  - “Send the worn seal” is worth keeping. Reverse engineering from a physical part is a real Margo capability and a genuine differentiator against a distributor.
  </details>