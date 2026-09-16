# RES_04_o-ring-size-chart.html — O-Ring Size Chart — the Article, Written

**<title>** O-Ring Size Chart: AS568, ISO 3601-1 & BS 1806 | Margo
**description** How to read an O-ring size: AS568 dash numbers, the ISO 3601-1 codes that replaced BS 1806, and how to measure a ring you already have. With the groove standard that decides the fit.

## 01 The page as it stands [Rename the H1 · replace the body · Related goes 2 → 5]
> live: LIVE → H1 naming a superseded standard · 47-word holding note · two Related cards
- **Breadcrumb · eyebrow**: `Resources / O-Ring Size Chart
SIZING & SPEC · 5 min read`
  _Breadcrumb unchanged — correct as built. The read time goes to 5 minutes, which is what 1,250 words and four tables actually take_
- **H1**: `O-Ring Size Chart: AS568, ISO 3601-1 and BS 1806 Explained`
  _🛑 The one change that matters most on this page. ISO 3601-1 is the standard current drawings cite; BS 1806 is the one they used to. Naming the second and not the first tells an engineer the page is out of date before they read a word.
“BS1806” also gains its space — the standard is written BS 1806, and getting a standard’s own formatting wrong on a page about standards is the kind of detail this audience notices_
- **Holding note**: `Reviewed at our works in Nashik by [name], [title] · Published [date]`
  _Deleted and its promise kept as a byline, feeding reviewedBy. Identical treatment to the gasket guide, and it should be the same component on all seven_
- **Related strip** (Slot | Live | Ships as):
  | 1 | o rings | O-Rings |
  | 2 | pumps valves | Pumps & Valves |
  | 3 | — | Oil Seals |
  | 4 | — | Gaskets |
  | 5 | — | Hydraulics & Oil & Gas |
  _Two cards become five — tell the developer the count changes. An O-ring sizing page has more relevant neighbours than a gasket page, not fewer; two is a rendering default, not an editorial decision.
Oil Seals earns a card because a reader measuring a failed seal is often holding a rotary shaft seal rather than an O-ring, and section 07 tells them how to tell the difference_
  <details><summary>notes (3)</summary>
  - Do not change the slug. o-ring-size-chart is the search term, exactly.
  - 🛑 Changing the H1 does not change the URL. The rename is copy only — no redirect needed, no equity moved.
  - The byline is visible text, not schema-only.
  </details>

## 02 H1, standfirst and the answer up front [The AEO block]

- **Standfirst**:
  > An O-ring is described by two numbers — inside diameter and cross-section — and by at least four numbering systems that express them differently. This guide shows how to read each one, how to convert between them, and how to measure a ring when you have the part but not the paperwork.
  _51 words · the two-numbers framing is the whole subject, and it makes the four standards feel like notation rather than four different products_
- **The answer block <h2>** (composite):
  · H: “How do you identify an O-ring size?”
  · Measure the inside diameter and the cross-section — the thickness of the rubber. Those two figures identify the ring in every system. On an imperial drawing they appear as an AS568 dash number, such as −214. On a current metric drawing they appear as an ISO 3601-1 code giving the inside diameter and cross-section directly, for example 24.99 × 3.53. BS 1806 is the older British imperial series and has been superseded by BS ISO 3601, though legacy drawings and spares lists still quote it.
  _85 words · a complete answer with a worked example in each system and the supersession stated in the same breath.
“The thickness of the rubber” is deliberate — “cross-section” is the correct term and half the people searching this do not know it yet_
  <details><summary>notes (3)</summary>
  - The H2 is the query. “How to identify an O-ring size” is the head term for this topic and it is a question, which is the format that gets lifted.
  - Self-contained, 60–90 words, no anaphora. It has to survive being quoted alone.
  - Two worked examples inside the answer — a dash number and a metric code — so the passage is useful without the tables below it.
  </details>

## 03 The systems, and which are current [🛑 The correction the live H1 needs]

- **H2**: “Four numbering systems, two of them current”
- **Table** (composite):
    | AS568 | Inch | Current | North American drawings and most global hydraulics. Dash numbers −001 to −475, 369 sizes |
    | ISO 3601-1 | Metric | Current | The international standard. Inside diameters, cross-sections, tolerances and designation codes. European and Asian machinery |
    | BS 1806 | Inch | 🛑 Superseded by BS ISO 3601 | Legacy UK drawings and spares lists. Covers the AS568 cross-section groups plus sizes between them |
    | BS 4518 | Metric | Legacy British metric | The metric counterpart to BS 1806 — sizes given as metric inside diameter and cross-section |
    | JIS B 2401 | Metric | Current, Japanese | Japanese-built equipment. Its own series, not interchangeable by number with ISO 3601 |
  · The two inch systems and the metric systems describe the same rings from different directions, and an AS568 size and an ISO 3601-1 size will often be the same physical ring expressed in different units. They are not interchangeable by number. Convert by dimension, never by assuming the codes line up.
  _🛑 The status column is the point of the table, and it is what the live H1 gets wrong — the page leads with the superseded standard and omits a current one.
BS 1806 stays in the article and in the title, at the back. Legacy drawings are real, and a reader holding one needs this page to acknowledge their number rather than pretend it does not exist.
“Convert by dimension, never by number” is the practical rule and the sentence most likely to prevent a wrong order_
  <details><summary>notes (3)</summary>
  - Real <table> markup, overflow-x:auto — four columns on a 375 px screen.
  - “BS 1806 vs ISO 3601” and “is BS 1806 still used” are real queries with a clean factual answer. This table owns both.
  - Do not claim conformance to any of them. The article says which standard applies; it does not certify Margo against it.
  </details>

## 04 Reading an AS568 dash number [The table the meta description promises]

- **H2**: “Reading an AS568 dash number”
- **Body**:
  > An AS568 dash number is not arbitrary. The first digit group sets the cross-section; the rest counts up through inside diameters at that cross-section. So every −2xx ring is the same thickness of rubber and they differ only in how big the hole is. Once you know the series, you know the thickness without a chart.
- **Table** (composite):
    | −0xx | 0.070 | 1.778 | −012 |
    | −1xx | 0.103 | 2.616 | −115 |
    | −2xx | 0.139 | 3.531 | −214 |
    | −3xx | 0.210 | 5.334 | −325 |
    | −4xx | 0.275 | 6.985 | −432 |
  · The full series runs from −001 to −475, 369 sizes in all. Take −214: the 2 series fixes the cross-section at 0.139 in (3.531 mm), and 14 is its position in the inside-diameter sequence at that thickness. Half the identification is done before you look anything up.
  _Article body 128 words plus the table · the cross-section conversions are computed, not copied — 0.139 × 25.4 = 3.531 mm and so on for each row.
The mm column is the addition that makes this table better than the ones it competes with. Most published AS568 charts give inches only, and the reader with a metric vernier has to convert five numbers before they can start_
  <details><summary>notes (3)</summary>
  - “AS568 dash number meaning”, “what does −214 mean” — the worked example targets the second directly.
  - 🛑 Table markup, not an image. An image of a size chart is invisible to the engines this article is written for.
  - Do not publish the full 369-row chart on this page. It is a reference download, not a scroll — and section 12 offers it properly.
  </details>

## 05 ISO 3601 — the current standard, in three parts [🛑 Absent from the live page entirely]

- **H2**: “ISO 3601: the standard current drawings cite”
- **Body**:
  > ISO 3601 comes in parts, and a drawing may reference more than one of them.
  > Part 1 — inside diameters, cross-sections, tolerances and designation codes. This is the size standard. It defines two tolerance classes: Class A, the tighter one, and Class B, the standard one. Class A size codes correspond to the AS568 dash numbers, which is the bridge between the inch and metric worlds and the single most useful fact on this page.
  > Part 2 — housing dimensions for general applications. The groove, not the ring. Squeeze, groove width and depth, and how full the groove is come from here.
  > Part 3 — quality acceptance criteria. Which surface imperfections are allowed and how large they may be.
  > A complete O-ring specification usually references all three: the size from Part 1, the groove from Part 2, the acceptance grade from Part 3. A drawing that gives only a size has specified a third of the part.
  _168 words · 🛑 the Class A / AS568 correspondence is the most valuable single sentence in this article — it is what lets a buyer holding an imperial drawing order against a metric standard, and almost no supplier page states it.
“A drawing that gives only a size has specified a third of the part” is the line that sets up sections 06 and 08, and it is the argument for a manufacturer writing this guide rather than a distributor_
  <details><summary>notes (3)</summary>
  - 🛑 This section is the reason the H1 changes. Publishing it under a heading that omits ISO 3601-1 wastes it.
  - Each part gets an <h3> so the outline shows three distinct entities.
  - “ISO 3601-1 vs AS568” is a searched comparison and the Class A sentence answers it in one line.
  </details>

## 06 The two British series [Kept, and placed correctly]

- **H2**: “BS 1806 and BS 4518: what to do with a legacy drawing”
- **Body**:
  > BS 1806 is the British imperial series, and it was widely used before ISO 3601 replaced it. It covers the same cross-section groups as AS568 plus a number of sizes that fall between AS568 sizes — which is why an old British drawing occasionally calls for a ring that has no AS568 equivalent at all.
  > BS 4518 is its metric counterpart, giving sizes as a metric inside diameter and cross-section rather than as a dash number.
  > Both have been superseded by BS ISO 3601, and neither should be specified for new work. Both are still worth knowing, because spares lists outlive the drawings they came from and a machine built in 1985 is often still running. Send us the old number and we will identify the ring; where the size has no modern equivalent we will make it to the original dimensions.
  _146 words · the “sizes between AS568 sizes” point is the practical one — it is exactly the case where a cross-reference chart fails and a manufacturer is useful.
🛑 The closing offer is a real commercial position, not a courtesy. A distributor cannot supply an obsolete British size; a moulder can, and this is one of the few places on the site where being a manufacturer is the answer to the reader’s actual problem_
  <details><summary>notes (3)</summary>
  - “BS 1806 O-ring” still has real search volume precisely because the standard is old. The article should rank for it and then tell the truth about it.
  - Internal link: make it to the original dimensions → /contact, not to the O-Rings category.
  - Do not imply Margo stocks these. Everything is made to order.
  </details>

## 07 Measuring a ring you already have [The highest-intent section on the page]

- **H2**: “How to measure an O-ring you already have”
- **Body**:
  > Most people arrive at a size chart holding a part, not a drawing. Measure the cross-section first — the thickness of the rubber — with a vernier or a micrometer, gently. Then measure the inside diameter, laid flat on a surface, without stretching it.
  > Three cautions. A ring that has been in service is not the size it was made. It may have swollen in the fluid, in which case it measures large; it may have taken a compression set, in which case the cross-section measures flat on two sides. Measure a spare if you have one, and if you do not, say that the sample is used.
  > Second: an O-ring has a circular cross-section. If the part in your hand is square, rectangular or has a lip on one side, it is not an O-ring — it is a quad ring, a square-section seal or a rotary shaft seal, and it is specified a different way.
  > Third: measure the groove too. The ring tells you what was fitted; the groove tells you what should have been.
  _211 words · 🛑 the swelling and compression-set caution is the section’s reason to exist — copying a used O-ring dimensionally reproduces the failure, and it is the mistake that generates most wrong orders.
The “it may not be an O-ring” paragraph routes readers correctly and is why the Related strip gains an Oil Seals card in section 01.
“The groove tells you what should have been” hands the reader straight into section 08_
  <details><summary>notes (3)</summary>
  - “how to measure an O-ring” is the highest-intent query in this topic and it is a task, not a definition — the passage should read as instructions.
  - Internal link: rotary shaft seal → /products/oil-seals.
  - If a diagram is ever added, alt text describes the measurement being taken, not “O-ring diagram”.
  </details>

## 08 The groove is half the specification [ISO 3601-2 · no rules of thumb]

- **H2**: “The groove is half the specification”
- **Body**:
  > An O-ring does not seal because of its size. It seals because the groove squeezes it — the ring is compressed between the groove floor and the opposing face, and that compression is what closes the joint. Get the groove wrong and a perfectly correct ring will leak.
  > Three things have to be right. Squeeze — too little and it does not seal, too much and it takes a set or extrudes. Groove fill — the ring swells and expands with heat, and the groove must have room for it; a groove filled to capacity has nowhere to put that growth. Surface finish — a scored groove or a rough opposing face abrades the ring, particularly where it moves.
  > ISO 3601-2 gives housing dimensions for general applications, and the figures belong there rather than in a rule of thumb. Take the groove from the standard, or send us the application and we will work it with you — the numbers vary with static or dynamic duty, pressure and compound, and a single quoted percentage would be wrong more often than right.
  _193 words · 🛑 no squeeze percentage and no groove-fill percentage is published here, deliberately — the same discipline as declining to publish m and y values in the gasket guide. The figures are in ISO 3601-2 and they are conditional; a page that prints one number is a page that is wrong for most readers.
The three failure modes named in plain language — too little, too much, no room to grow — are more useful to a buyer than a percentage they would misapply_
  <details><summary>notes (3)</summary>
  - 🛑 Never publish a squeeze or groove-fill figure Margo has not taken from ISO 3601-2 for a stated duty. One wrong number discredits the article and the domain with it.
  - This section discharges the live description’s “groove dimension guidance” promise honestly — by naming the standard that holds the dimensions.
  - “O-ring groove design” is a high-volume query served mostly by calculators with no standard behind them.
  </details>

## 09 Quality grades — and one honest exclusion [🛑 ISO 3601-3 covers aerospace; Margo does not]

- **H2**: “Quality grades: what ISO 3601-3 allows”
- **Body**:
  > ISO 3601-3 classifies the surface imperfections an O-ring may carry and sets limits on them — flash, parting-line projection, back rind, flow marks, non-fills, indentations, blisters and cracks. It sorts them into grades: Grade N, the general-purpose standard of acceptance; Grade S, for optimum-performance industrial and aerospace applications, with tighter tolerances and fewer allowable imperfections; and Grade CS for the most critical service.
  > Most industrial work is Grade N, and specifying above it costs money for no benefit. Ask for Grade S when the consequence of a leak justifies it, not by default.
  > One exclusion, stated plainly. ISO 3601-3 is written to cover aerospace O-rings as well as industrial ones. We do not supply aerospace — that requires AS9100, which we do not hold. We hold ISO 9001:2015, certificate 09111526A, Integral Certification Ltd, valid to 21 February 2027, scope: rubber moulded components, and we are upgrading to IATF 16949, targeted by the end of 2026.
  _175 words · 🛑 the aerospace paragraph is not optional. The article cites a standard whose own scope names aerospace, and a reader will infer a capability that does not exist unless it is denied in the same section. Margo’s 31 product pages currently claim Aerospace outright — this paragraph is the correct position and it contradicts them.
“Specifying above Grade N costs money for no benefit” argues against the more expensive option, which is what makes the rest of the section believable_
  <details><summary>notes (3)</summary>
  - 🛑 No hasCredential for IATF or AS9100.
  - The certificate number and scope are visible text.
  - 🛑 Publishing this while 31 product pages claim Aerospace is a contradiction a reader can see. Remove the claim from those pages in the same release.
  </details>

## 10 Five mistakes [The linkable block]

- **H2**: “Five mistakes when ordering O-rings to a size chart”
- **List <ol> · each item an <h3>** (# | Mistake | Body):
  | 1 | Measuring a used ring | A ring that has swollen measures large; one that has taken a set measures flat. Copying it dimensionally reproduces the failure. Measure a spare, or say the sample is used. |
  | 2 | Cross-referencing by number | AS568 dash numbers and ISO 3601-1 codes do not map onto each other arithmetically. Convert by dimension. |
  | 3 | Specifying BS 1806 for new work | It has been superseded by BS ISO 3601. Quote it only when you are matching an existing drawing. |
  | 4 | Giving the size and nothing else | A size is one of three references a complete O-ring drawing carries. The groove and the acceptance grade are the other two. |
  | 5 | Ordering a size without naming the fluid | The dimension identifies the ring; the compound decides whether it survives. The same −214 in nitrile and in EPDM are different parts. |
  _Article body 138 words · the most quotable block in the guide.
Item 5 is the bridge to the gasket guide and to every product page — a size chart is where buyers forget that rubber has chemistry, and it is exactly the mistake the compound-default bug on Margo’s own product pages encourages_
  <details><summary>notes (3)</summary>
  - An <ol> of <h3>s, each self-contained.
  - Not part of FAQPage. The FAQ block is section 11 and duplication hurts both.
  - Item 5 links to the gasket material guide once that guide is live, and to /products/o-rings meanwhile.
  </details>

## 11 FAQ [5 questions · FAQPage schema]

- **Q1**:
  > The series sets the cross-section and the remaining digits set the inside diameter. A −2xx ring has a 0.139 in (3.531 mm) cross-section; a −3xx ring has 0.210 in (5.334 mm). The full range runs from −001 to −475, 369 sizes.
  `What do the numbers in an AS568 O-ring size mean?`
  _42 words · two worked series and the range, all figures verified_
- **Q2**:
  > It has been superseded by BS ISO 3601, so it should not be specified for new designs. It is still widely quoted on legacy UK drawings and spares lists, and it includes some sizes that fall between AS568 sizes, so it remains useful for cross-reference. Send us the old number and we will identify the ring.
  `Is BS 1806 still valid?`
  _55 words · the direct answer first, then the reason it is still worth knowing_
- **Q3**:
  > Measure the cross-section — the thickness of the rubber — then the inside diameter, laid flat and unstretched. Use a spare rather than a used ring if you can: a ring that has swollen in service measures large, and one that has taken a compression set measures flat on two sides.
  `How do I measure an O-ring?`
  _50 words · the instruction and the caution in one answer, which is how it gets quoted_
- **Q4**:
  > Often the same physical ring, but not interchangeable by number — the two systems count differently. ISO 3601-1 Class A size codes correspond to the AS568 dash numbers, which is the usable bridge between them. Convert by dimension, and check the tolerance class as well as the size.
  `Are AS568 and ISO 3601 sizes interchangeable?`
  _48 words · 🛑 the Class A correspondence is the single most useful fact on the page and it belongs in the FAQ as well as the body_
- **Q5**:
  > Yes — we mould to your dimensions in any compound we mix, including obsolete British sizes with no modern equivalent. The minimum run is 10,000 pieces per part number, per compound. Prototype and first-article lots sit outside the minimum. We respond within 48 hours.
  `Can you make an O-ring to a non-standard size?`
  _45 words · client-instructed 2026-09-01 · the non-standard-size answer is the commercial payoff of the whole article — it is what a manufacturer can say and a distributor cannot_
  <details><summary>notes (3)</summary>
  - FAQPage schema matching these five verbatim.
  - All five in the DOM at first paint, hidden with CSS if collapsed.
  - Questions are <h3>. Q3 is the highest-volume query in the set.
  </details>

## 12 Closing CTA & the chart itself [The one download worth building]

- **Closing block**:
  > Send the two measurements, or the old part number, and we will identify the ring — and tell you the compound the application needs, which the size chart cannot. We respond within 48 hours.
  `[ Ask our engineers → /contact?topic=O-ring%20sizing ]`
  _35 words · “which the size chart cannot” is the line that carries the reader to a conversation rather than to a competitor’s chart_
- **The full chart**:
  > 🛑 The 369-row AS568 table with its ISO 3601-1 equivalents is the one download on this website worth building. It is the asset that earns links, it is what people bookmark, and Margo currently offers 124 download buttons across the site that serve no file at all.
  `[ Download the full AS568 / ISO 3601-1 cross-reference (PDF) ]`
  _Ungated. A gated size chart is not a size chart — nobody links to a form, and the links are the entire reason to publish it.
Build one real download before fixing 124 fake ones, and this is the one_
  <details><summary>notes (3)</summary>
  - 🛑 Do not label the button “Download” until the file exists. The rule that applies to all 31 product pages applies here.
  - Serve the chart as HTML as well as PDF. A PDF is linkable; an HTML table is also quotable.
  - /contact?topic=… must canonical to /contact and the parameter must land in the form.
  </details>

## 13 Footer [🛑 Unchanged, and still blocking]

  <details><summary>notes (4)</summary>
  - 🛑 © 2024 Margo Rubber Industries Pvt. Ltd. at B-12, MIDC Ambad — wrong legal name, stale year, and an address that is not the confirmed works at Vilholi. Identical to the gasket sheet: it is one shared component and one fix.
  - “50+ countries” and “within 24 hours”, against the 48 hours this article states — two contradictions on the same screen as the guide.
  - The Products column lists nine of eleven categories. O-Rings is present, which is what matters here.
  - Column labels are <h2>, injecting three phantom sections into this article’s outline — and this article’s outline is its main AEO asset, because the section headings are the entity list.
  </details>