# 04_Contact.html — Contact Page Content Sheet

**<title>** Request a Quote | Margo Rubber Products, Nashik India
**description** Send a drawing, a specification or a sample. Quotation and feasibility report within 48 hours from Margo Rubber Products, ISO 9001:2015 certified manufacturer in Nashik, India.

## 01 Hero [Rewrite]
> live: LIVE H1 → Let’s Build Your Custom Rubber Solution · three chips, two of which must come off: MOQ 500 PCS and EXPORT TO 30+ COUNTRIES
- **Eyebrow**: `MARGO RUBBER PRODUCTS · NASHIK, INDIA`
  _Unchanged — correctly carries entity and geo, which most eyebrows on this site do not_
- **H1 — 3 lines**: “Send a Drawing,” / “a Specification,” / “or the Part Itself.”  (accent: a Specification,)
  _8 words · live is 6 · names the three things Margo actually accepts. “Let’s build your custom rubber solution” is a sentence a buyer has read on every competitor site this week_
- **Subhead**:
  > Margo Rubber Products quotes moulded and extruded rubber components from a drawing, a specification or a worn sample. Acknowledgement within one business day; quotation and feasibility report inside 48 hours, with a compound recommendation and a lead time.
  _39 words · live is 21 · entity in the first clause, and the promise stated once with two timings that do not contradict each other_
- **Chips ×3** (Replacement | Replaces):
  | ISO 9001:2015 | ISO 9001:2015 — unchanged |
  | QUOTE IN 48 HOURS |  |
  | 8 COMPOUNDS IN-HOUSE |  |
  _MOQ 500 PCS is the most prominent MOQ statement on the site — a chip, above the fold, on the page where a buyer decides whether to enquire. Standing founder instruction, 2026-08-19: never publish a piece count. 30+ countries is a seventh distinct country count across the site; the others are 60+, 50+, 27+, 25+, eight, and zero_
  <details><summary>notes (4)</summary>
  - Heading. Page’s only <h1>, three <span class="block"> children.
  - Keyword. This page targets bottom-funnel intent — rubber components RFQ India, request quote rubber manufacturer. It does not need a head term in the H1; it needs the verb the buyer is about to perform. “Send a drawing” is that verb.
  - Chips are <li> in a <ul>, not headings, and set uppercase in CSS rather than typed in caps.
  - Consistency gate. 48 hours for the quotation, one business day for acknowledgement — the same two strings on every page. Live, this page says “1 business day” in the hero and its own footer says “within 24 hours”, 1,500px apart.
  </details>

## 02 Form — step 1 & direct contact [Rewrite]
> live: LIVE H2 → Request a Quote · the direct-contact panel publishes three contact methods and all three are wrong · the copy offers to accept attachments; the form has no attachment field
- **Eyebrow**: `ENGINEERING INQUIRY`
- **H2**: “Request a Quotation”
  _3 words · live is 3 · “quotation” is the transactional term buyers search and the term used on every other page after this sheet_
- **Intro**:
  > Two steps, about ninety seconds. Or reach the engineering desk directly — the same team answers both.
  _17 words · live is 14 · setting the time cost measurably lifts multi-step form completion_
- **Side panel**: `PRECISION TOOLING · NASHIK FACILITY
Compression, transfer and injection moulding with an in-house
toolroom and test laboratory. Tooling is designed and cut here.`
  _22 words · live is 15 · adds the in-house tooling point, which is the differentiator most likely to matter to someone mid-RFQ_
- **Direct contact ×3** (Channel | Value | Sub-line | Replaces):
  | WhatsApp | +91 96655 79276 | Fastest for Gulf and India enquiries |  |
  | Phone | +91 96655 79276 | Mon–Sat · 09:30–18:30 IST |  |
  | Email | info@margorubber.in | Attach drawings, datasheets or CAD files |  |
  _All three live values are wrong. +91 96655 79276 is the locked NAP number and is confirmed as the WhatsApp line. CONFIRM whether a separate landline should be published — the company profile also carries +91 92251 38339, which has never been reconciled against the one-number decision. If there is no second line, showing one number twice is correct and honest; showing an invented one is not · CONFIRM_
- **Footnote**: `All RFQs are handled by our application engineering team in Nashik
(IST, UTC +5:30).`
  _Unchanged — genuinely useful to an overseas buyer working out when they will hear back_
- **Step 1 fields ×4**: `FULL NAME * COMPANY * WORK EMAIL * PHONE (OPTIONAL)
[ Continue to Requirement → ]
We respond within one business day (IST).`
  _Unchanged. Four fields is right for step 1 — do not add to it_
- **Add: file field**: `ATTACH DRAWING / SPEC (OPTIONAL) — PDF, DWG, DXF or image, max 10MB`
  _The page already promises this and the form does not deliver it. The email sub-line says “attach drawings, datasheets, or CAD samples”, the H1 in section 01 says “send a drawing”, and the FAQ on /products tells buyers to send a drawing — but the only route that accepts one is email. The homepage and /products forms both have this field; this one, the primary RFQ page, does not. Put it on step 2 with PROJECT DETAILS_
  <details><summary>notes (5)</summary>
  - NAP. Phone and email here must match the homepage Organization node, the footer and every other page character for character. This page currently breaks all three at once — two invented numbers and a wrong-TLD email.
  - Markup. Phone as <a href="tel:+919665579276">, WhatsApp as <a href="https://wa.me/919665579276">, email as <a href="mailto:info@margorubber.in">. Visible string and href must not diverge.
  - Labels. Every <label for> bound to its input. The live build uses real labels here — keep them; do not switch to placeholder-only, which vanishes the moment the field has content.
  - Heading levels. <h2> for the form, <h3> for “Prefer direct contact?”. Step labels (CONTACT / REQUIREMENT) are <p> inside an <ol> with aria-current="step".
  - File field. enctype="multipart/form-data", accept=".pdf,.dwg,.dxf,.step,.stp,image/*", 10MB server-side cap, and virus scanning before the file reaches anyone’s inbox.
  </details>

## 03 Form — step 2 [Tune]
> live: HIDDEN UNTIL STEP 1 COMPLETES · captured by advancing the wizard · the volume dropdown’s first option reads “500 – 2,000 pcs (at MOQ)” — an MOQ leak inside a form control
- **COUNTRY**: `Australia · United Kingdom · United Arab Emirates · Saudi Arabia · Malaysia
United States · Singapore · Kenya · Tanzania · India · Other`
  _11 options, as live. Reordered to the Top-5 activation sequence first, then the remaining playbook markets. Live order leads with Australia then jumps to UAE, which matches no published sequence_
- **PRODUCT CATEGORY**: `SEALING
O-Rings · Oil Seals · Gaskets · Diaphragms · Reciprocating Seals · Leak Test Rubber
MOUNTING & PROTECTION
Anti-Vibration Mounts · Bushes & Bushings · Bonded Components · Bellows · Grommets · Pads, Stoppers & Caps
SHEET & PROFILE
Extrusion Profiles · Sponge & Foam Rubber · Rubber Lining & Skirting
Not sure / other`
  _Live lists 9 of 11. Extrusion Profiles and Sponge & Foam Rubber are missing — the same two lines missing from the footer. A buyer who wants a foam gasket cannot say so on the RFQ form. “Not sure / other” added: a buyer who does not know the category is exactly the buyer worth capturing_
- **INDUSTRY / END USE**: `Automotive · Mining · Oil & Gas · Pumps & Valves · HVAC
Electrical & Electronics · Agriculture · Medical Devices
Water & Fluid Management · Construction · Transport — Rail & Marine · Other`
  _Unchanged — all nine industries present and correctly named_
- **ORDER VOLUME** (Replacement | Replaces):
  | Prototype or sample quantity |  |
  | Under 5,000 pcs a year |  |
  | 5,000 – 50,000 pcs a year |  |
  | 50,000+ pcs a year | 50,000+ pcs — annualised |
  | Not sure yet | Not sure yet — unchanged |
  | By the metre (extrusion / foam tape) |  |
  _“(at MOQ)” must come out of the option label — it is the founder instruction breached inside a form control, where nobody thinks to look for it. Bands are also re-cut: the bottom band opening at 500 tells a prototype buyer they are below the floor and closes the enquiry. Annualising matches how the company profile states delivered volume. A sixth option added because two of the eleven lines are not sold by the piece at all_
- **PROJECT DETAILS**: `Describe the application, the operating temperature, the media in contact,
and any standard your drawing calls out.`
  _Unchanged — this placeholder is the best-written string on the page. It asks for exactly the four inputs a compound recommendation needs, which is what makes a 48-hour quotation possible_
- **Submit**: `← Back [ Submit Quote Request → ]
We respond within one business day (IST).`
  _Unchanged_
  <details><summary>notes (5)</summary>
  - Crawlability is already correct here, and that is worth protecting. All four selects and their 40-odd options render in the DOM before step 1 is completed — verified. This is the only progressive-disclosure component on the site that does not unmount. Do not "optimise" it.
  - Every option string is content. Eleven product categories and nine industries in the DOM of the RFQ page is a real semantic signal about what Margo makes — which is why the two missing categories cost more than a dropdown gap.
  - Selects need <label>, not just a first option acting as one. “Select country” as option[value=""] is fine as a placeholder, but the accessible name must come from a real bound label.
  - Do not make PHONE required. It is optional on step 1 and should stay so — an overseas buyer at the enquiry stage will abandon rather than hand over a number.
  - Schema. None on this section. Do not attempt to mark up the form itself.
  </details>

## 04 Footer [Rewrite]
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
  <details><summary>notes (8)</summary>
  - The footer contradicts the page above it. The page body promises a response “within 1 business day”; the footer CTA, 1,500 px lower on the same screen, promises “within 24 hours”. The replacement sets both to 48 hours. On the contact page a visible contradiction about responsiveness is the most expensive one on the site.
  - The footer NAP is the only correct contact data on this page. +91 96655 79276 and info@margorubber.in in the footer are right; the three methods in the page body are all wrong. Fixing section 02 makes the page agree with its own footer.
  - Build once, ships forty times. This is one component. The copy above is written out in full on every sheet in this set so nobody has to open two files to build one block, but it is authored once in the codebase.
  - Heading levels. The column labels (PRODUCTS / INDUSTRIES / COMPANY) are <h2> in the live build. As visible <h2>s they inject three phantom sections into every document outline on the site. Change to <p class="col-label">.
  - Link equity. 26 sitewide links from here. Adding /export, /products/extrusion and /products/sponge-foam-rubber gives three orphaned or under-linked URLs a sitewide inbound link each — the cheapest internal-linking win available on this site.
  - NAP markup. Wrap in <address>. Phone as <a href="tel:+919665579276">, email as <a href="mailto:info@margorubber.in">. The visible string and the href must not diverge.
  - Schema. The footer emits nothing. The Organization node on the homepage is the single entity definition and every other page @id-references it. Repeating an Organization block per page creates 40 competing entities.
  - Copyright year. Render from new Date().getFullYear(), not a literal. It has read 2024 for eight months.
  </details>

## 05 What is missing [Add]
> live: No screenshot — these blocks do not exist on the page · the primary conversion page runs 2,262px against a 12,026px About page
- **Address block**: `MARGO RUBBER PRODUCTS
SRNO. 4494/10, behind Furniture Stop, opposite Samarth Dies,
Vilholi, Nashik, Maharashtra 422010, India
Mon–Sat · 09:30–18:30 IST`
  _The contact page carries no address at all in its body — only in the global footer. A buyer arranging a plant audit, a courier or a visit has to scroll past the form to the footer to find where the company is. CONFIRM street address · CONFIRM_
- **Map**:
  > A static map image linking out to Google Maps at coordinates 19.93214315, 73.73324186 — confirmed. A static image, not an embedded iframe: an embed loads third-party JavaScript on the page most sensitive to load time, and adds a consent obligation under DPDP.
- **Logistics block** (Destination | Distance | Transit):
  | JNPT / Nhava Sheva | 185 km | 3 hr 20 min |
  | Mumbai | 156 km | 2 hr 45 min |
  | Pune | 223 km | 4 hr 25 min |
  | Chh. Sambhajinagar | 191 km | 3 hr 15 min |
  _Sourced, specific, and directly relevant to a buyer deciding whether an Indian supplier can hit their port. Nashik sits on NH-160, 35 km from the Samruddhi Mahamarg interchange at Igatpuri, which has run its full 701 km to Nagpur since June 2025_
- **What happens next** (Stage | Timing):
  | Acknowledgement from the engineering desk | 1 business day |
  | Quotation and feasibility report | 48 hours |
  | Prototype from an approved drawing | 48–72 hours |
  | Fitment samples | 2 weeks |
  | Production | 3–4 weeks · 2 express |
  _Five rows, all sourced. This is the single highest-value block that could be added to the page: it answers the question every RFQ visitor has, it is unique to Margo, and no Indian competitor in the teardown publishes it_
- **Three FAQ entries** (Question | Answer):
  | What if we have no drawing? | Send the physical part. Margo measures it, identifies the compound family and quotes against the sample. A large share of the work starts as a worn component in an envelope rather than a CAD file. |
  | What information does a quotation need? | The application, the operating temperature, the media in contact and any standard the drawing calls out. Those four inputs are what make a compound recommendation possible inside 48 hours. |
  | Do you quote against a minimum order? | Margo produces in bulk — minimum run from 10,000 pieces per part number, or quoted against the part on larger sections. Tell us the part and the volume and we will quote it. |
  _Three entries, 40–50 words each, with a FAQPage node. Adds roughly 800px, real AEO surface, and answers the three objections that stop an RFQ being sent. The third replaces the MOQ question rather than dodging it — it is the founder’s own phrasing from the company profile commercial terms_
  <details><summary>notes (5)</summary>
  - These additions roughly double the page. 2,262px is not a length problem in itself — it is a signal that the page answers almost none of the questions a visitor arrives with. Every block above is sourced and already written somewhere in Margo’s own material.
  - Address block markup. <address>, NAP identical to the footer and the Organization node. Do not emit a second PostalAddress in schema.
  - FAQ schema. Add the three pairs to a FAQPage node at #faq, text matching the page verbatim.
  - Map. Static image with alt="Location of the Margo Rubber Products plant in Vilholi, Nashik", wrapped in a link to Google Maps with rel="noopener". Never an iframe on this page.
  - Order. Form first, then what-happens-next, then logistics, then address and map, then FAQ. The form must stay above the fold on desktop — everything added goes below it.
  </details>