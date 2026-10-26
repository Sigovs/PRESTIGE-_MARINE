# Prestige Marine homepage v1: independent critique

26 Oct 2026 · `design-critic` · review only, nothing in `site/` was edited.
Reviewed against `DESIGN-READ.md` (§0 rulings bind), `TASTE.md` §2b and `.claude/rules/design-dna.md`.

**Read this first: `index_v2.html` uses byte-identical copies of the v1 CSS and JS.** `cmp` shows `marine_v2.css` and `marine_v2.js` are identical to v1, and the HTML differs only in the two asset links. So every defect below is in v2 as well, unless it gets fixed there. Port the fixes, not just the azure.

## How it was measured

- Rendered in an isolated Chrome (Playwright from `design_dna/node_modules`, channel `chrome`, so H.264 plays). Viewports: 1440×900, 1280×800, 1024×768, 768×1024, 390×844, plus 1440×900 under `prefers-reduced-motion: reduce`.
- Scrolling used `__lenis.scrollTo(y,{immediate:true})`.
- I moved off the shared Playwright MCP browser mid-review. Another agent (the v2 work) resized it to 390×844 under me, so it was not safe for numbers.
- Contrast was measured on the **composited** render, with text made transparent and the background sampled inside each glyph box. For the hero, six frames were taken across the playing loop. The preview server (Python SimpleHTTP) returns `seekable.end = 0`, so the video cannot be seeked and frames were captured by letting it play.
- Scripts and evidence images: `/private/tmp/claude-501/-Users-alex-Desktop-WORK-PRESTIGE/6c3fca31-7582-4161-983a-eec213125451/scratchpad/m/` (`out/` holds the PNGs and JSON).

## Declarations found

The Design Read is complete: four-line read, concept sentence, named peak (Act II), signature move, HYBRID style mode (refined-elegance anchor and technical-luxury contrast), SUPPORT dimensionality, scroll budget, performance budget and section ledger. **The gate chain has never run.** There is no `site/.gates/declare.json`, so `npm run gates` exits with code 2 and Gates 1–4 are NOT RUN. Gate 5 is Alex's and is unfinished, not passed. I did not write the declaration: that is the builder's commitment, and writing it would make me its author.

---

## Findings, most severe first

### D1 · Defect · CRITICAL: the hero CTAs cannot be clicked or tapped
`.stage__flow` (z-index 1, `margin-top:-100vh`) starts with `.stage__spacer` (100vh). The spacer lies over the whole sticky stage.
- `document.elementFromPoint` at the centre of "View inventory" and of the hero "305-947-1000" returns `DIV.stage__spacer`, at both 1440 and 390.
- A real Playwright click times out on "element is not stable / obscured".
- Keyboard Tab and Enter still work. Mouse and touch do not.

On mobile this kills the large call button. The only call route left is an 18 px header icon (D7). The reduced-motion path works, because the spacer is `display:none` there.
**Fix:** `pointer-events:none` on `.stage__flow` and `pointer-events:auto` on `.passage, .plate`. Alternatively, give `.hero` its own stacking above the flow while `t > .2`.

### D2 · Defect · HIGH: an opaque sand bar paints over the water stage
`onWater = y < passTop − 0.6vh`, which is about 245 px at 1440. `inPassage` only starts at `y > 0.35vh`, which is 315 px. Between those two points the header is visible with `data-tone="sand"`.
- Screenshot at y=280: a solid sand bar across the top of the water, with the H1 still at 0.55 opacity.

This breaks DESIGN-READ §7 ("transparent over the water… hidden through Act II") and anti-patterns U-tier ("opaque surfaces that cross live content").
**Fix:** switch tone on the same threshold that hides the header, or hide before tone change: `inPassage` from `y > passTop − vh`.

### D3 · Defect · HIGH: text on text and figure on live controls in the bow crossing
The H1 fade runs over `(bow − h1.top) / 0.45vh`, so it only starts once the bow has reached the H1.
- **y=280:** the bow is over the "View inventory" / phone buttons (35% visible, clickable at t ≥ .2) while the H1 is at 0.55.
- **y=400–450:** the "Bow" fact (ink, opacity 1) sits directly under the ghost of "starts here." (H1 at 0.19–0.3). The boxes overlap from x 332 to 476 and y 445 to 515 at 1440.
- **Mobile:** the same ghosting happens at y≈420–520.

This also undercuts DESIGN-READ §5 "the words arrive once… never makes comprehension wait": the first fact is read through a fading headline.
**Fix:** finish the H1 fade before the bow reaches the CTA row (map `t` from bow at CTA-bottom + 15vh down to bow at CTA-bottom). Do not reveal fact 1 until hero opacity is under .05.

### D4 · Defect · HIGH: the passage collapses between 721 and 1100 px
The desktop fact formula `min(32ch, 50% − hull×.2 − 48px)` runs out of room when the hull is tall and the viewport narrow.
- **768×1024:** each fact column is **89 px** wide, at 1–2 words per line. "Carbon exposed hard top…" runs to 12 lines and 349 px.
- **1024×768:** 267 px, which is acceptable.

The mobile authoring (hull right, facts left) only switches on at ≤720. This is the band failure `U19` / `C12` exist for: the narrow end of the band was never looked at. DESIGN-READ §11 sets the floor itself: "under 20 characters per line" is the reason to change layout.
**Fix:** extend the phone layout to ≤1100 in portrait (`(max-width:1100px) and (orientation:portrait)`), or clamp `--hull-h` against `vw` so each fact keeps ≥ 26ch.

### D5 · Defect · HIGH: the hull is enlarged beyond its pixels on every retina screen (§0.5 ruling)
- `me52-hull.webp` is 324×1236. `--hull-h: min(1236px,128vh)` renders it at 1152 CSS px at 1440×900, 1024 at 1280×800, and 1236 at 768×1024.
- At DPR 2 that is 2304–2472 device px drawn from 1236: a **1.86–2.0× upscale**. Alex ruled "sized so it is never enlarged beyond its pixels".
- The sidecar's rule is written backwards: it says "never exceed pixel height × DPR". The correct constraint is `≤ pixel height ÷ DPR`.
- `me52-hull-720.webp` exists but is never referenced, so there is no `srcset` either.

This is the peak's only bespoke asset, and on a MacBook it is soft.
**Fix:** cap at `min(618px, 68vh)` for DPR ≥ 2 (`@media (min-resolution:2dppx)`), or accept a shorter passage. Correct the sidecar. The real cure is the drone original, which the rulings say cannot be requested. So the cap stands.

### D6 · Defect · HIGH (composition, core: no defer): Act III does not carry the concept on the render
CG7, walked on the render: the sentence is "boats read from straight above, as one figure on a ground". The brand frames contradict it.
- **Tecnomar:** a small diagonal boat on deep navy, off the declared single grade (DNA23, "Biscayne green-teal"). Its loop is effectively a still: mean frame difference is 0.57/255 between the first frame and 1.5 s.
- **Midnight Express:** a tight oblique crop of the stern seats in saturated cyan. The loop has a hard seam: first-to-last-frame difference is **21.8/255** on a 3.48 s loop, so it jump-cuts every 3.5 s.
- **VanDutch:** a low oblique bow-on running shot, not overhead. Seam 8.9/255 every 4.08 s.
- **Iguana:** overhead, but bow-right.

None is "bow-up" as §6 promises ("every bow is rotated to point up the page"). CG3 swap test: replace these four frames with any marine stock and the section means the same, so here the device is decoration.
**Fix:** re-cut every brand loop to its overhead segment, rotated bow-up and graded once. Loop ≥ 6 s with a crossfaded seam (§6 asks for ≈6 s trims). Where no overhead exists (Midnight Express), use a still overhead frame and no loop. One true overhead still is better than an oblique video.

### D7 · Defect · MEDIUM: tap targets under DNA68 (44 px below 900 px wide)
- **390×844:** the header phone link is **18×44**. It is the only working call route on mobile because of D1. The same icon-only link is 18 px wide at 768 and 1024, which fails WCAG 2.5.8's 24 px floor even at desktop.
- **390×844:** the brand-card links (tecnomar.com, Watch full video and the others) are 25 px tall. So are all footer links and "All sold boats".

**Fix:** pad the header tel to 44×44. Give inline links `padding-block` to reach 44 on touch widths.

### D8 · Defect · MEDIUM: focus ring fails non-text contrast on the page's own ground
`:focus-visible` uses `--camel-deep` #D99A5F, which measures **1.82:1** on sand #EBDED4. WCAG 1.4.11 needs 3:1, and color-taste requires visible focus states. On the camel buttons the ring sits next to camel, so it is even weaker. The direction itself specified camel for focus rings (DESIGN-READ §10), so this is a direction error the build carried out faithfully.
**Fix:** ink ring (11.3:1) on sand. Keep camel only where the ground is ink.

### D9 · Defect · MEDIUM: the full-screen menu does not trap focus
After the last menu item, Tab continues into the page behind the opaque menu: "View inventory", "View this boat", "tecnomar.com"… (sequence recorded). Focus goes to elements nobody can see (WCAG 2.4.11), and the page behind is not `inert`.
**Fix:** set `inert` on `main` and `footer` while the menu is open, and move the Menu/Close toggle into the trap's cycle.

### D10 · Defect · MEDIUM: white small type on the water dips under 4.5:1
Measured on the playing loop, six frames, worst 5% of each glyph box:

| Text | 1440×900 | 1280×800 |
|---|---|---|
| Eyebrow (16 px / 600) | 4.20–4.32 | 4.10–4.19 |
| Header "Menu" | 4.12–4.29 | n/a |
| Header phone number | 4.30–4.50 | n/a |
| H1 (large text) | 4.3–4.4 (pass at 3:1) | n/a |
| Mobile H1 | 3.3–3.6 (pass) | n/a |

Over the tide, the 14 px "Bow" label in ink-2 drops to **3.77–4.04** as it rises into the green (desktop y=400–500, mobile y=420–520). The fact body in ink holds 7.3 or better.
**Fix:** the calm band is generated (GI5), so deepen it in the azure regeneration for v2 instead of adding scrim. Set the eyebrow and header in 600 weight at 18 px. Use ink, not ink-2, for fact labels.

### D11 · Defect · MEDIUM: the mobile rail lacks `data-lenis-prevent`, and mobile Act III is static
- `.brands__list` scrolls horizontally but has no `data-lenis-prevent` (measured `false`). DNA90 and DESIGN-READ §11 both require it.
- §11's "only the loop of the unit ≥60% in view plays" was not built. Mobile shows posters only, and nothing says so. That is an **unstated yield**. Either build it or write the yield down with its reason (data budget is a fair one).

### D12 · Defect · MEDIUM: type roles collide in Act III
The section H2 "The Prestige Marine brands" and every brand H3 render at the **same size, weight and width**: 55.36 px, 500, wdth 118 (51.5 at 1280). The section title does not dominate its children (typography I1/I8). The only role cue is ink versus ink-2 on the inactive names.
**Fix:** drop the brand names a step (`--t-h3` scaled up, or 0.8× of h2), or set the section H2 smaller as a running head over the index.

### D13 · Defect · LOW–MEDIUM: the reduced-motion still is not the one §12 authored
- The water ends in a **hard horizontal edge** at the bottom of the hero, with flat sand below. The dissolve is gone (`.tide{top:0;background:var(--sand)}`).
- The bow does not show on the first screen. §12 says the still "shows the H1, with the hull's bow at the bottom".
- The surf video is still fetched under reduce: `loadSrc` runs on intersection and downloads 1.76 MB to show a frame the poster already shows.

**Fix:** keep the tide gradient under reduce. Pull the passage up by `hull-h × .1` so the bow shows. Skip `loadSrc` when `reduce` is set.

### D14 · Defect · LOW: smaller behaviour defects
- **Enquire:** it scrolls to Contact and preselects the boat, but focus stays on `BODY`. Move focus to the Name field.
- **Brand frame centring:** the sticky offset uses `min(36vw,64vh)×1.25`, but the frame's width is `min(36vw, 64vh×.8)`. At 1440 the frame sits at top 127 against a true centre of 162. Use one expression for both.
- **Brands lede alignment:** the lede starts at x=964 and the frame at x=874. The two right-hand masses do not share an edge.
- **Lenis anchor offset:** `anchors.offset −64` against a desktop header of 76 px. When you navigate upward (footer brand links) the returning header covers about 12 px of the target.
- **Mobile posters:** `gen-water-topdown-m-poster.jpg` and `gen-surf-topdown-m-poster.jpg` exist but are unused. Mobile gets the 1600×900 landscape poster cropped, which breaks §11's "separately authored, not a crop" until the video arrives.

### Y1 · Yield · unstated: repeated primary CTAs on the first screen
- The header has "Inventory" (camel) and the hero has "View inventory" (camel): the same action twice, in the same fill, on one screen.
- The phone also appears twice.
- The wordmark appears twice: header "Prestige Marine / A Division of Prestige Imports" and eyebrow "Prestige Marine · A Division of the Prestige Imports Family".

The header line is **not** the verbatim line DESIGN-READ §1 says carries through untouched. That is a content defect within this yield.
**Fix:** drop the eyebrow, or make it the place line, and quote the division line verbatim in the header. If the double CTA stays, write the yield down (the header CTA serves the 50th visit; the hero one serves the first).

### Y2 · Yield · stated but not executed: the II→III seam "must read as a cut"
The §15 table accepts this with "a hard change of ground treatment and type mass". On the render, the ground does not change (sand to sand); only a 1 px rule marks the seam. §2b: "Accept without a corresponding change in the work is a lie the next run will inherit."
**Fix:** make the cut real (ground step to `--sand-deep`, or the index opening on its frame), or re-dispose the point as reject-with-reason.

### Y3 · Yield · check with Alex: the beige ground
color-taste now carries an invariant that a beige or cream ground is chosen only when asked for. The direction justifies it from the surf-footer must-have (DESIGN-READ §10), and the reason is stated, which is right. But Alex's "sand arrives too early" note suggests he asked for the sea and the shore, not a beige page. One line confirming the ground choice closes it.

### J1 · Judgment / composition: the scroll budget is inverted against the peak
Declared budget: Act II 2.4 vh and Act III 2.6 vh. Built at 1440×900:

| Act | Built height | In vh |
|---|---|---|
| Passage + plate (peak) | 1,513 px | 1.7 |
| Brands | 2,389 px | 2.65 |

The four brand rows are `min-height:56vh` with roughly 250 px of content each, so about 250 px of each row is empty sand. Brands to Land is the largest void on the page, at **278 px** with no rule (every other seam has one). The page's longest act is its least concept-bearing one (D6). I would shorten the rows to content + `--s-9` and give the saved height to the passage, which is held down by D5 anyway.

### J2 · Judgment: the footer join is a gradient, not a match
The ground is #EBDED4. At the join, the surf loop's own sand measures about (215,201,182) to (222,202,184): darker and yellower. The gradient (46–62%) hides it well enough at 1440, but §6's "already nearly invisible join… sampled from the loop" is not true at this crop. Resample the ground from the regenerated loop, or regenerate the loop's dry band to the ground's value.

### J3 · Judgment: contact and footer merge into one sand mass
Below the form note there is about 430 px of undifferentiated sand on the left before the footer wordmark, and nothing separates Act VI from Act VII except the surf arriving much lower. A rule, or starting the footer gradient higher, would give the exhale an edge. The footer also lacks "Contact Us", which §6 Act VII lists.

### Performance and assets: within budget, with notes
- **Full scroll:** 5.94 MB at 1440 (4.85 MB of MP4) and 3.28 MB at 390. Budget is 12 MB, so this passes.
- **Hero loop:** 1.50 MB (budget ≤1.8). **Surf:** 1.76 MB (≤2.5). Brand loops are 0.06–0.81 MB.
- **First screen:** about 1.8 MB, because the water loop has `preload="auto"` with no AVIF poster and no WebM/AV1. The ≤1.2 MB first-screen budget excludes the loop only if you read it generously.
- **404:** one request 404s on every viewport (probably the favicon).
- **Unreferenced files in `site/assets`:** about 2.4 MB, among them `me52-hull.png` (516 KB), `me52-hull-720.webp`, the six brand `.jpg`/`.webp` full frames, the four `inv-*.jpg` fallbacks, and the mobile posters. The new `gen-azure-*` belongs to v2.
- **Preview server:** Python SimpleHTTP has no Range support. Safari will not play the MP4s from it, so Alex sees posters only if he previews in Safari. Use `design_dna/gates/lib/server.mjs`, or anything that supports Range.

### Content provenance
- "View all 8 boats" is an undated count, which drifts (CP: dated figures carry their date). Put "as of 26 Oct" on it, or drop the number.
- The hours and "Marina Palms" are simulated (ledgered in `research/SIMULATED.md`, under Alex's ruling §0.6), so this is acceptable for a mock-up. They are not marked in the render, which CP4 would ask for. Alex's ruling overrides; I am only noting it.

---

## Critique panel (TASTE.md §2b, on the build)

**1 · Composition.**
- **Central idea, in one sentence:** the boat you'd buy, seen from above like your car. The passage delivers it.
- **What strengthens it:** the hull, its level facts and the stern plate on price. The Land car is the hinge that works.
- **What competes:** Act III frames (D6) argue "brand lifestyle video" instead, and the inventory cards do the same.
- **A different direction?** The Tecnomar navy and Midnight cyan read as another art direction (DNA23).
- **Role confusion:** H2 equals H3 in the index (D12).
- **A device doing nothing:** the 56vh brand row height. It holds no content and only stretches the least concept-bearing act (J1).
- **Edges:** at 768 the passage edge fails (D4).

**2 · Craft.**
- **Click:** the hero CTA is blocked, `elementFromPoint` returns the spacer (D1).
- **Focus:** ring 1.82:1 (D8). The menu has no focus trap (D9).
- **Contrast:** eyebrow 4.1–4.3 and "Menu" 4.1 on the composited water (D10).
- **Taps:** 18 px tel (D7).
- **Resolution:** hull at 1.86× on DPR 2 (D5).
- **Gates:** 0 of 4 artefacts exist.

**3 · User advocate.**
- **(a) Call:** on mobile the big phone button is dead (D1). The header icon is 18 px wide. So the first job of a dealer page fails on the device most callers use.
- **(b) See stock:** the hero CTA is dead; the header "Inventory" works (1 tap on desktop; on mobile the route is Menu then New Inventory, 2 taps).
- **(c) Find a brand:** Menu works and the anchors land correctly (VanDutch measured at 164 px from the top, frame switches).
- **On the 50th visit:** the header vanishes for the whole passage scrolling down, and then for every downward scroll after it.

**4 · Brief advocate.**
- "Represent is one of the main parts": it got the most room, but not the concept (D6).
- "The page reads boats the way that client already reads cars — from straight above": served by Act II and Act IV, and violated by Act III's frames.
- "Hidden through Act II" (§7): violated for about 70 px of scroll (D2).
- "Never enlarged beyond its pixels" (§0.5): violated on retina (D5).

**5 · Contrarian.** The strongest case against: the page's single best idea is a 1,500 px scroll past *one used boat*, and on a retina screen that boat is soft. The rest is a well-spaced but conventional dealer page whose brand section looks like any marine template's. Alternative most worth considering: make Act III a second, smaller overhead passage of four bow-up figures side by side on the sand. Each figure is a still cut-out, at the same altitude as the hull, with its name beneath. The sticky video frame goes. The concept then carries through Act III instead of stopping after Act II, the page gets lighter by about 1.5 MB, and the 1.86× upscale question goes away for those frames because stills can be sized to their pixels. The cost: loses "every act has something moving" (§5). That was Alex's Omaya feeling, and the surf and water may have to carry it alone.

---

## Disposition table

Dispositions are the reviewer's recommendation. The builder or Alex confirms. Core points (concept, dominant composition, Anchor, desire, perceived value) are not deferred.

| # | Severity | Where | Evidence | Proposed fix | Disposition |
|---|---|---|---|---|---|
| D1 | Critical | Hero CTAs, all non-reduced viewports | `elementFromPoint` returns `.stage__spacer`; click times out | `pointer-events:none` on `.stage__flow`, `auto` on `.passage, .plate` | **accept** |
| D2 | High | Header, y≈245–315 @1440 | screenshot at y=280: sand bar over water; tone flips at passTop−0.6vh, hide starts at 0.35vh | one threshold for tone and hide | **accept** |
| D3 | High | Bow crossing, desktop and mobile | H1 at 0.55 while the bow covers the CTAs; "Bow" fact under H1 ghost (overlap x332–476) | finish H1 fade before the bow reaches the CTAs; gate fact 1 on hero <.05 | **accept** (core: dominant composition) |
| D4 | High | Passage at 721–1100, portrait | facts 89 px wide at 768×1024, 12-line blocks | phone layout to ≤1100 portrait, or clamp hull to keep ≥26ch | **accept** |
| D5 | High | Hull, every DPR≥2 screen | 324×1236 source drawn at 1152–1236 CSS px = 1.86–2.0× | cap `--hull-h` by DPR; fix the sidecar formula | **accept** (core: perceived value; §0.5 ruling) |
| D6 | High | Act III frames and loops | no frame bow-up; 2 of 4 not overhead; Tecnomar static (0.57); Midnight seam 21.8 every 3.5 s; navy and cyan off-grade | re-cut overhead, bow-up, one grade, ≥6 s with crossfaded seam, or stills | **accept** (core: central proposition) |
| D7 | Medium | Header tel (≤1100), brand and footer links (mobile) | 18×44; 25 px links | 44×44 hit areas | **accept** |
| D8 | Medium | `:focus-visible` | camel-deep on sand 1.82:1 | ink ring on sand | **accept** |
| D9 | Medium | Menu | Tab leaves the menu into hidden page content | `inert` on main/footer while open | **accept** |
| D10 | Medium | Eyebrow, header text on water; "Bow" label on tide | p95 4.10–4.32; label 3.77–4.04 | deepen the generated calm band (v2 azure); 18 px/600; ink labels | **accept** |
| D11 | Medium | Mobile brand rail | no `data-lenis-prevent`; no loops on mobile, unstated | add attribute; build the ≥60% loop or state the yield | **accept** |
| D12 | Medium | Act III type | H2 = H3 = 55.36 px / 500 / wdth 118 | step the brand names down | **accept** |
| D13 | Low–Med | Reduced motion | hard water/sand edge; no bow on first screen; surf MP4 fetched | keep the tide gradient; raise the passage; skip loadSrc under reduce | **accept** |
| D14 | Low | Enquire focus, frame centring, lede edge, anchor offset, mobile posters | measured as listed | as listed | **accept** |
| Y1 | Medium | First screen CTAs and wordmark | double Inventory, double phone, double wordmark; header misquotes the verbatim line | drop the eyebrow or make it the place line; quote verbatim; write the yield if the CTA pair stays | **accept** |
| Y2 | Medium | II→III seam | §15 "accept" with no change on the render | build the cut or re-dispose | **accept** (core: dominant composition) |
| Y3 | Low | Ground colour | color-taste beige-ground invariant | one-line confirmation from Alex | **defer**, waiting on Alex's confirmation of the ground (not core: the concept survives either answer) |
| J1 | Judgment | Scroll budget | peak 1.7 vh vs brands 2.65 vh; 278 px void Brands→Land | rows to content + `--s-9`; give the room to the passage | **accept** |
| J2 | Judgment | Footer join | ground (235,222,212) vs loop sand ≈(218,201,183) | resample or regenerate the dry band | **accept** |
| J3 | Judgment | Contact→footer | about 430 px undifferentiated sand; "Contact Us" missing from the footer | rule or earlier gradient; add the link | **accept** |
| P1 | Low | Assets | about 2.4 MB unreferenced; no AVIF/WebM; first screen about 1.8 MB; one 404 | prune; add AVIF poster and WebM | **accept** |
| P2 | Low | Preview server | no Range support, so Safari shows posters only | serve with `gates/lib/server.mjs` | **accept** |
| C1 | Low | "View all 8 boats", simulated hours | undated count; simulated facts unmarked | date the count; hours under §0.6 | **accept** (count) / **reject-with-reason** (marking hours: Alex's §0.6 ruling governs the mock-up) |
| G1 | Process | Gate chain | no `.gates/declare.json`; Gates 1–4 NOT RUN | builder writes the declaration, runs `npm run gates`, then `gate5` | **accept** |
| K1 | Contrarian | Act III as a second overhead passage of stills | above | prototype it in v2 against D6's re-cut | **accept** as the comparison D6 is resolved against (core: cannot be deferred) |

## What I could not check

- **Real devices:** no iOS Safari or physical iPad. Mobile was emulated in Chrome. Safari video playback could not be checked on this server (P2).
- **DPR 2:** the 1.86× softness is computed from dimensions, not inspected on a retina render.
- **Generated loops (GI9):** I measured only the seams. I did not scrub frame by frame for morphing foam (the sidecar notes a mobile surf jump to watch).
- **LCP and frame rate:** no Lighthouse run and no performance trace. LCP under 1.8 s and 60 fps are unverified.
- **Screen reader:** no pass with a screen reader. Keyboard paths were tested: menu, film dialog (opens, focuses Close, Escape returns focus) and form errors (focus goes to the first invalid field).
- **Gates:** not run, because there is no declaration (G1).
