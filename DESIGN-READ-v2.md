# Prestige Marine — homepage Design Read, v2 (delta on v1)

26 Oct 2026 · art direction only: no markup, CSS, tokens or code. This file is read **with**
`DESIGN-READ.md` (v1). Everything in v1 stands unless it is changed below. Where they
disagree, v2 wins. Hand this to `designer`; `design-critic` reviews against v1 + v2; Gate 5 is Alex's.

Manifest: `/Users/alex/Desktop/WORK/design_dna/TASTE.md` (canonical Mac path); build
standard `.claude/rules/design-dna.md`. The live v1 build (`site/`, :8773) was rendered at
1440×900 and 390×844 before any of this was decided. All four inventory photo sets were looked at frame by frame.

**Alex's later rulings (26 Oct, binding, override anything below):**
- **No beige, cream or sand ground anywhere.** It is gone from the palette entirely: not as the page ground and not as a panel. In his words, it "looks like Claude's base default".
- **The new azure water is approved.** It lives at `site/assets/video/gen-azure-topdown(.mp4|-m.mp4)`, with posters in `site/assets/img/`.
- §2, §3, §4, §5 and §6 below were rewritten after measuring that loop. Every number in them comes from it.

**Alex's v1 verdict: 7/10.** He gave three notes. In short:
1. The inventory reads as a template.
2. The beige arrives too early and covers too much.
3. The water is not azure enough.

---

## 0. What v1 got wrong, measured on the render

- **The sand arrives at 684 px.** The v1 `.tide` dissolve runs from y=684 to y=2298, which is 1,614 px of gradient. The hull leaves the water before its own bow fact is read. From there, five of the seven acts sit on one ground (`#EBDED4`), unbroken from y≈1,000 to the footer, about 6,000 px. That is the "dull beige covering everything".
- **The beige is pink.** `#EBDED4` has a red-orange hue (~25°) at about L\*89. Next to the green-teal water and the camel fill, it reads as flesh or putty. Alex has since ruled the whole beige/cream family out (header rulings); v2 has no warm neutral at all.
- **The inventory is four equal 4:3 photos in a row**, each with a name, a meta line and a price. It is correct, but it says nothing the hull passage did not teach the visitor to expect. It is the one act where the concept stops (v1 §9 already named it "weakest").
- **Something v1 missed is in the listings.** Every boat in stock wears a car's paint:
  - the VanDutch 48 *BRIX* is **Audi Nardo Grey**;
  - the VanDutch 40.2 has a **Pagani Silver** bootstripe;
  - the ME52 is **Lamborghini Grigio Lynx**;
  - the 2022 Tecnomar is **Verde Gea, the Lamborghini Sián launch colour**.

  The concept sentence ("the page reads boats the way the car client already reads cars") is true of the whole stock list, not only of the hero boat. v2 builds the inventory on that.

---

## 1. Design Read (unchanged except mandate scope)

```
Delivery: BUILD — v2 of one direction. No EXPLORE.
Reading this as a dealer homepage for Prestige Imports' exotic-car clients and Miami boat buyers, leaning sunlit-aerial / quiet-luxury.
Mandate: REDESIGN of our own v1 against Alex's three notes. Carries through untouched: concept sentence, peak, signature move, page grammar (continuous world), Acts III, VI, VII structure, header, type family, Lenis, all §0 rulings of v1.
Style mode: HYBRID — anchor refined-elegance / contrast technical-luxury (v1). Technical-luxury now gets its one real stage: the inventory.
Dimensionality: SUPPORT (v1). The one depth idea gains its physical truth: the hull's shadow falls on a sea floor.
```

**The concept is unchanged:**
> A Prestige Marine boat is the car client's next object, so the page reads boats the way that client already reads cars — from straight above, as one figure on a ground — and the only thing that has changed is the ground.

**Concept Gate re-run.** All seven criteria pass. CG7 improves. Act V now carries the sentence twice:
- by the car paints;
- by being read from above, to one scale.

Act VI (Contact) is now the only weak carrier, and it is functional.

---

## 2. Grounds — no beige; which act stands on what (replaces v1 §2 grammar line, §9 ground column, §10 "Ground")

**How the approved azure loop measures.** `gen-azure-topdown.mp4` was sampled at 1 fps across its 8 s, on a 6×9 grid. Values are WCAG relative luminance as 5th / median / 95th percentile:

| Desktop band (height) | Luminance | What it is |
|---|---|---|
| 0–22% | 0.27–0.46 / 0.35–0.53 / 0.41–0.63 | sand bar (top right), light |
| 22–33% | 0.14–0.23 / 0.19–0.34 / 0.33–0.47 | transition: fails both ink and white for small text |
| **33–55%** | **0.12–0.18 / 0.13–0.21 / 0.15–0.22** (glints to 0.51 in the right sixth only) | **the deep channel**, median `#118A8F`, OKLCH 0.58 / 0.095 / 199° |
| 55–77% | 0.13–0.30 / 0.17–0.38 / 0.25–0.57 | transition |
| 77–100% | 0.30–0.53 / 0.38–0.60 / 0.45–0.69 | sand bar (bottom), median `#90DBD7`, OKLCH 0.84 / 0.075 / 192° |

The mobile 9:16 loop has the deep half on top (0–50%, luminance 0.19–0.41, median `#149AA2`) and the shallows below (0.38–0.71, median `#B1DCDA`).

**The consequence.** The approved loop is a light / deep / light sandwich, and its value swings from 0.12 to 0.69. **No single type colour passes over all of it.** No colour reaches even 2:1 against both extremes.
- The H1 can sit in the channel, in white.
- The four facts, which scroll through the whole viewport over a sticky stage, cannot stay on this loop. Hence the second loop in §3.

### The grounds
Water colours still live **only in footage**, never as flat fills (v1 §10 rule, kept). A flat teal band is water without light: the brand-colour band the footage makes unnecessary.

The page's flat grounds come from the two non-water materials in the subject: **the white sand under the lagoon**, and **the asphalt under the car**.

| Act | v1 ground | **v2 ground** |
|---|---|---|
| I Arrival | water → sand at bottom edge | **approved azure loop** (deep channel + sand bars) |
| II Passage, incl. stern plate | water → sand from y≈684 | **`gen-azure-flats` loop**: the same lagoon, sand-bar shallows only (§3). Water for the whole passage, plate included. |
| — shore | (inside II) | **0.5 vh dissolve: flats → shallows-white** |
| III Represent | sand | **shallows-white** |
| IV Land | sand | **asphalt** (from the Revuelto frame) |
| V Inventory | sand | **shallows-white** |
| VI Contact | sand | **shallows-white** |
| VII Surf | sand → sea | **shallows-white → surf → azure** (surf loop regenerated, §5) |

**Shallows-white, the page ground:**
- **Derivation.** The hue of the white sand seen through the lagoon is **OKLCH h ≈193°**. It is sampled from the sand bars of both azure posters: desktop bottom bar median `#90DBD7` (h 192°), its bright pixels `#A4E8E6` (h 193°); mobile shallows `#B1DCDA` → `#C4ECEB` (h 193–195°).
- The ground keeps that hue and lifts it to the last centimetre of water over white sand: **OKLCH 0.975 / 0.012 / 193 → `#EEFAF9`** (relative luminance 0.931).
- **It is a cool white with an aqua breath.** It is not cream (v1's hue was ≈25°), not paper-white, and not a flat teal.
- **Second plane** (form fields only; never a section band): **OKLCH 0.950 / 0.020 / 193 → `#E0F3F2`**.
- **AA, computed:**

  | On | ink `#2A2627` | ink-2 `#5A5153` | camel `#E7AF79` |
  |---|---|---|---|
  | ground `#EEFAF9` | 14.0:1 | 7.2:1 | 1.8:1 |
  | field `#E0F3F2` | 13.0:1 | 6.7:1 | — |

  Camel stays a **fill behind ink type only** (ink on camel 7.7:1), never text. Its 1.8:1 against the ground is acceptable because the button is identified by its label. The designer re-checks focus rings: camel-deep on the cool ground must reach 3:1, or the focus ring goes to ink.
- **Camel is now the page's only warm note.** It becomes a real accent instead of one beige among beiges.

**Asphalt (Act IV):**
- Sampled from `land-revuelto.jpg`, the road right of and below the car: median `#1E252B` / `#212A2F`, p10–p90 `#13181B`–`#252D32`.
- The ground is **`#1E252B`**, so the photograph's road runs into the section and its edges nearly dissolve.
- It is a cool blue-black: the same temperature family as the shallows-white, which is why it does not read as a "dark mode" bolted on.
- Type on it: **`#EEFAF9` (the shallows-white) at ≈14:1**. Secondary text uses the ground colour at about 72% opacity over asphalt, and the designer measures it at ≥4.5:1.

**The sequence:** azure deep → bright flats → shallows-white → asphalt → shallows-white → surf → azure. The page begins and ends in the same water, and no warm neutral appears anywhere.

**Why the shallows-white arrives after the plate, and not at Brands or later:**
- Act III's frame is water footage, which would sit as water inside water.
- A moving ground under a moving brand loop puts two motion ideas in one viewport.
- The plate is where the boat is bought, which is its arrival; the shore after it is earned.

**Why Land goes to asphalt:** it is the car's own ground, in one dark interlude, at the exact point where v1 went flat.

---

## 3. Act II rework — two waters, the hull sails the whole way (replaces v1 §5 bullet 2, §6 Act II "Image", §6 Act I words)

**Mechanism: still one sticky stage, now holding two stacked loops.**
1. **Bottom layer:** `gen-azure-flats`, playing from first paint.
2. **Top layer, the "hero layer":** the approved `gen-azure-topdown`, together with the eyebrow, H1 and CTAs.

- **The page's one scroll-linked property is unchanged in kind and extended in reach.** v1 faded the H1 as the bow crossed it. v2 fades the **whole hero layer** (its loop included) on that same input and over that same travel. The water lightens from the deep channel into the flats exactly as the boat runs up into them.
- When the hero layer reaches opacity 0, its video is paused; it resumes when the opacity rises above 0. Two videos decode only during that crossfade window.
- The v1 `.tide` gradient is removed.

**Act I, laid out on the measured loop (desktop 1440×900):**
- **Header, 0–8%:** **ink** type on the top sand bar. The 5th-percentile luminance there is ≥0.32, and ink needs ≥0.27.
- **Eyebrow + H1, inside the deep channel only, 34–58%:** **white**.
  - Over the channel, white reaches 4.1–5.6:1 (the median is 4.15:1 at `#118A8F`).
  - The H1 is large text (3:1 floor), which passes everywhere in the band.
  - The eyebrow is set **as large text**, ≥19 px semibold, so it also falls under the 3:1 floor. At 16 px regular it would fail on the band's lighter right side.
  - The H1 is set on **two lines**, not v1's three, so the block fits the channel ("The boat you deserve / starts here.").
  - **Nothing white crosses 22–33% or 58–77%.**
- **CTAs, 74–82%, on the lower sand bar:** "View inventory" (camel fill, ink label) and the tel button as an **ink outline with no fill**. v1's translucent dark fill was a scrim and is removed.
  - The 5th-percentile luminance in the centre columns there is 0.30–0.38, so ink passes.
  - They sit above the bow tip, which shows at the bottom edge on the sand bar.
- **Accepted mixed colour.** White words in the deep and ink buttons on the sand bar. Each type colour is what its ground demands, measured, never a style choice (color-taste: legibility fixed at the background layer).

**Act I, mobile (390×844).** The approved mobile loop (deep 0–50%, shallows below) has a header zone at luminance 0.21–0.33. That fails both ink (it needs ≥0.27) and white small text (it needs ≤0.18).
- **Decision: regenerate the mobile hero loop** as `gen-azure-topdown-m` v2, re-framed from the **approved desktop still** (same water, same colour; image-to-image to 9:16), with this structure:
  - a light sand-bar strip at 0–12% for the ink header;
  - the deep channel at 18–50% for the white H1 (≥30 px, large text);
  - shallows from 55% for the ink CTAs and the bow tip.
- The colour Alex approved does not change. Only the arrangement of light and deep does.

**Act II over the flats:**
- **The flats loop: `gen-azure-flats`**, desktop 16:9 1600w and mobile 9:16. It is generated **image-to-image from the approved azure still**, so the colour matches. The prompt keeps only the sand-bar shallows: an even, bright lagoon over white rippled sand, soft caustics, no deep channel, no dark patch.
  - **Acceptance:** luminance **≥0.32 at the 5th percentile on every frame, in every cell**, with the median about 0.50–0.62. That is the bottom bar's median `#90DBD7` and its bright pixels at `#A4E8E6`.
  - 10–12 s, seamless, with no feature that betrays the repeat.
  - GI5, GI6 and GI9 as in v1.
- **All type on the flats is ink:** the facts, their labels and the plate. At luminance 0.32, ink is 5.2:1; at the median it is about 8–9:1. Glints only raise contrast.
  - **`ink-2` is barred on water.** At about 0.085 luminance it falls under 3:1 there, so hierarchy on water comes from size and weight.
- **No scrim, no text-shadow, no boxes.** A failing frame is regenerated (GI5).
- **Calm zones.** The outer thirds are the calmest water: no sharp glint clusters where the facts run. The centre lane, where the hull runs, may be the liveliest.
- **The hull's shadow falls on the sea floor:**
  - offset about 4–6% of hull length;
  - softer than on v1's sand;
  - tinted in the deep-channel hue (h ≈199°, pre-tinted in the layer, no blend mode);
  - kept on the side away from the next fact.

  The hull reads at altitude over clear water. Its Grigio Lynx (luminance ≈0.2–0.3) holds figure-ground against the flats (≈0.5).
- **The shore:**
  - It is a block after the stage, overlapping it from below by ≈0.5 vh: transparent at its top, solid **shallows-white `#EEFAF9`** at its bottom.
  - It enters while the stage is still stuck, so the white rises under the plate's CTAs like a sand shelf coming up under an arriving boat.
  - Flats at about 0.55 luminance dissolving to a 0.93 ground is a short, natural shallowing; v1's dissolve was 1,614 px.
  - No foam: the footer owns the shoreline (DNA37).
- **Header:** hidden through the passage (v1). It returns after the shore, on scroll-up, as a shallows-white bar with ink type.

**Reduced motion.** There is no sticky stage and no crossfade.
- The hero is the **approved azure poster** with the same type positions.
- The hull and facts sit in flow on a **tall still of the flats**: `gen-azure-flats-still-tall`, 1440×3200, plus a mobile 780×2600, generated as one image from the flats still, ≤250 KB AVIF, loaded only under reduced motion. It ends in the shore.

---

## 4. Hero water — what is now fixed

- **Approved and kept:** `gen-azure-topdown.mp4` (desktop). Its colour is the page's water.
  - The H1 stays HTML text and the LCP.
  - The 8 s loop is accepted as is: the hero layer is only on screen until the bow crosses the H1, about 1 vh.
- **Regenerated:** the mobile hero loop (§3) and **`gen-azure-flats`** (new, desktop + mobile), which carries the passage.
- **How long the water lasts:** azure for ≈1 vh, flats for ≈2.4 vh, then the shore at 0.5 vh. That is ≈3.9 vh of water before the first flat ground.
- **Does the water continue behind Act III? No** (§2).

---

## 5. The surf footer — the join, re-derived (replaces v1 §6 VII "ground colour")

- **The footer's top ground is shallows-white `#EEFAF9`**, the page ground.
- **The current surf loop must be regenerated.** Its dry band is the warm sand the page has just banned. The flat top of the current poster sits at about v1's `#EBDED4`, hue ≈25°, so the join would show a cream band under a cool page.
- **Regenerate `gen-surf-topdown`** (desktop 16:9, mobile 4:5), from the approved azure still's palette:
  - **Top half:** bleached white coral sand, cool neutral white with the faint aqua cast of reflected lagoon light. **No yellow, no beige, no warm cast.** It is flat and even (the reading zone, held at generation).
  - **Below:** a soft white foam line, then **the approved lagoon azure** in the sand-bar colours (`#81D9D5`–`#A4E8E6`), deepening toward the bottom edge to the channel hue.
  - No people, objects or text. GI9 is checked: the sand stays still and the foam stays below the links.
- **Join acceptance:** the median of the regenerated loop's top quarter must be within **ΔE2000 ≤2** of `#EEFAF9`.
  - If it lands cool and light but not exact (OKLCH L ≥0.96, C ≤0.02, h 185–205°), **the page ground takes the loop's sampled value instead.** The page stands on the beach it ends on (v1's logic, kept).
  - If it lands warm, it is rejected and regenerated, never colour-corrected into place.
- The ground-coloured gradient over the loop (solid for the top ~50%, then transparent) stays as in v1.

---

## 6. Act IV · Land — on asphalt (delta on v1 §6 Act IV)

- **Same image** (`_____LAMBO PRESTIGE/site/assets/img/slide-revuelto-aerial-2560.webp`; portrait `slide-revuelto-aerial-p-1200.webp` for mobile).
- **Same words, same two-column layout** (frame left, words right).
- **Ground `#1E252B`** (§2). The photograph's road runs into it.
- **Words in `#EEFAF9`** at about 14:1. No text over the image itself: the zebra crossing and the wall leave no calm field wide enough for two paragraphs.
- 0.9 → **1.0 vh**: the image grows to cols 1–7 on desktop.

---

## 7. Act V · Inventory — "the berth sheet" (replaces v1 §6 Act V)

**Feeling:** *measured certainty — "I can see exactly what each of these is, and how they compare."*
**Shot:** *survey*. The camera holds still over a plan, the way a harbour master reads a berth sheet. Every boat is read three ways:
- **from above**, the plan frame;
- **from the side**, the elevation frame on hover;
- **as a length to one scale**.

**Carries the sentence by:** the car paint each boat wears, set as its first descriptor, the way a car is specced; and by length drawn to scale, which is the overhead camera turned into a measurement.

**Why not four equal cards, and why not a "lead + three".**
- DNA9 permits equal cards, so their sameness is not the problem. The problem is that they hold no information beyond the listing tile.
- A lead unit would need an honest reason to promote one boat. There is none: the ME52 already owns the peak.
- So the four are equals in rank and **unequal only where the data is unequal: their length.**

### Order
Ascending by listed length, which also orders them by price:

| # | Boat | Length (listing "Length") | Price | Status (only where listed) |
|---|---|---|---|---|
| 1 | 2021 VanDutch 40.2 | 40′11″ | $698,500 | — |
| 2 | 2023 VanDutch 48 · *BRIX* | 48′ | $1,129,000 | — |
| 3 | 2026 Midnight Express 52 Vitesse | 52′ | $2,500,000 | Available now |
| 4 | 2022 Tecnomar Lamborghini 63 | 63′ | Request price | Available now |

Length and price climb together and end on the Lamborghini boat: a crescendo out of the data, not out of a layout. The VD40.2's "Length Overall: 40 ft" field disagrees with its "Length: 40′11″"; v2 uses the **Length** field for all four, consistently.

### The unit — a "slip" (desktop 1440, the v1 12-column grid, content ≈1,312 px)
One unit per boat, stacked, 64 px between units. **There are no separator hairlines between units.** That would be the ruled-list reflex DNA9 warns about; the only line in a unit is its scale rule, which is data.

```
[ plan photo, cols 1–4, 3:2 ]  [ text block, cols 5–9 ]                 [ price block, cols 10–12, right-aligned ]
                               2021                                      $698,500
                               VanDutch 40.2                             Enquire
                               Super Jet Black hull, Pagani Silver bootstripe
                               Hours            Power                     Length × beam
                               Under 140        2 × Volvo Penta D6, 440 hp  40′11″ × 11′5″
|——+——+——+——+——————— 40′11″                                    ← the scale rule, from col 1, length to one scale
```

**Contents, all listing facts, nothing invented:**

| Boat | Paint line (first descriptor) | Hours | Power | Length × beam |
|---|---|---|---|---|
| VanDutch 40.2 | Super Jet Black hull, Pagani Silver bootstripe | Under 140 (listing copy; the spec says 134 and the copy says 131 "as of July 2026", so "under 140" is true of both) | 2 × Volvo Penta D6, 440 hp | 40′11″ × 11′5″ |
| VanDutch 48 *BRIX* | Custom Audi Nardo Grey | 180 | 2 × Volvo Penta D11, 725 hp | 48′ × 13′2″ |
| Midnight Express 52 Vitesse | Lamborghini Grigio Lynx, camel seating | **field omitted** (not listed) | Mercury Racing 500R outboards (**no count, no hp**: the 3,000 hp spec derives from the disputed count, v1 §0.3) | 52′ × 13′8″ |
| Tecnomar Lamborghini 63 | Verde Gea, the Sián launch colour, with gold accents | 96 | 2 × MAN V12, 2,000 hp each | 63′ × 17′8″ |

- The ME52's missing hours field is **omitted, not dashed and not "on request"**. A blank slot invites the reader to fill it with something worse; three fields read as complete.
- **No Tecnomar top speed** (v1 ruling). The listing's "63-knot" claim stays off.

**Type roles:**
- **Year line:** text voice, 14–16 px, `ink-2`, tabular. It is followed by the status where listed ("2026 · Available now").
- **Model name:** display (Archivo wide ≈118, weight 500), at the `h3` step. The boat name *BRIX* follows after a middot in the text voice, upright: no italic, per v1 type rules.
- **Paint line:** text voice, 18–20 px, ink, regular. The car marque inside it gets no emphasis; the words do the work.
- **Spec trio:** labels in text voice 14 px `ink-2`, sentence case, never caps or mono. Values 16–18 px ink, tabular lining figures. Three columns on one baseline.
- **Price:** display wide, 500, tabular lining, ≈32–40 px, right-aligned to col 12. "Request price" is set in the **same style and size**, so the Tecnomar's slot does not look like an apology.
- **Enquire:** a text button under the price. It prefills the Contact form's interest with this boat, as v1 already does.
- **Rule label:** text voice 14 px tabular, sitting at the rule's end ("40′11″").

**The scale rule:**
- A 1 px ink line from the left edge of col 1. **The 63′ fills the full content width; the others are drawn to the same scale.** At 1,312 px:
  - 40′11″ ≈ 852 px;
  - 48′ ≈ 1,000 px;
  - 52′ ≈ 1,083 px.
- Ticks every 10 ft, 6 px tall. End tick 12 px. No "0" label and no unit key.
- The section lede says "to one scale", and the ticks do the rest.
- Each shorter rule stops visibly short of the price column above it. **The empty run under each price is the difference.**
- It is static: no draw-on animation. Act V has no band-1 motion (v1 §8).

**Interaction:**
- The whole text-and-photo area links to the listing.
- **Hover and focus-visible:** the photo crossfades from the **plan** frame to the **elevation** frame, ≈300 ms opacity, with no scale and no travel. This replaces v1's 1.02 image lift.
- **Touch:** no swap. The elevation is a pleasure, not a task, and the listing has every photo.
- **Reduced motion:** the swap is instant, without the fade.
- Elevation frames load when the section is within 1 vh, never on first paint.

**Photo per boat (`research/inventory/<listing>/`):**

| Boat | **Plan** (default; the highest-angle frame) | **Elevation** (hover) | Note |
|---|---|---|---|
| VanDutch 40.2 `…10308760/` | **08.jpg**: near straight-down, bow right, whole hull on green water | **01.jpg**: running profile, bow right, 4000 px | 08 is only 1024 px. That is enough for 421 css px at DPR2 and 358 at DPR2 on mobile, and never larger. |
| VanDutch 48 `…9561670/` | **09.jpg**: the highest aerial of the set, the whole hull, BRIX on the transom | **01.jpg**: profile at rest, bow right | 3240 px set, the best quality of the four |
| ME52 `…10173015/` | **04.jpg**: high aerial head-on, wake behind, the camel cockpit open to the camera | **12.jpg**: running profile, Miami skyline | **Not 14**: the straight-down frame stays spent on the peak (DNA37). 04 is a running aerial, not the plan view, so it is not a second instance. |
| Tecnomar 63 (2022) `…10360903/` | **02.jpg**: stern three-quarter at the dock, lit stern, green water (crop 4:3 → 3:2 on the boat) | **07.jpg**: hard top and cockpit | **No aerial exists in this set.** This is the weakest unit, and it is declared, not hidden (§10). |

**No colour grade on the listing photos.** The paint names sit beside them, and a grade would misstate a real Nardo Grey or Verde Gea. Exposure-only correction is allowed. This overrides v1's one-grade rule for this act only; the listing must stay the client's truth.

**Section head (desktop):**
- H2 "In stock now" in cols 1–8.
- Under it, the lede. Copy is the copywriter's, but it must carry two facts: "drawn to one scale" and the four paints. Example: *"Four boats in stock, drawn to one scale. Super Jet Black, Nardo Grey, Grigio Lynx, Verde Gea."*
- Cols 9–12, bottom-aligned: "Prices as listed 26 Oct 2026" (CP: the dated figure carries its date in the render, once per section) and the "View all 8 boats" line button.

**Ground:** shallows-white `#EEFAF9` (§2). The listing photos' blue-green water and the camel Enquire focus are the only saturated colour on the act; ink on the ground 14.0:1, ink-2 7.2:1.

### Recently sold — the record (replaces v1's 3-column list)
- **Set as one run-in paragraph, not a list:** "2024 VanDutch 56 · 2022 Pardo Yachts 50 · 2023 Midnight Express 43 Solstice · …". Use the v1 names verbatim from the Sold page.
  - Text voice, 20 px, `ink-2`.
  - Desktop: in **cols 5–12**, so it starts on the same column as the stock units' names. The "Recently sold" heading sits in cols 1–4, beside it.
  - Then "All sold boats" as a link.
- It reads as a roll call, the dealer's record, and takes a third of v1's height. No count is printed and no lengths are given (none are sourced; CP).
- No rule above it. The space between the last unit's scale rule and this paragraph is 128 px.

### Mobile (390×844)
- Units stack in one column, 48 px apart.
- **Photo** full content width (358 × 239, 3:2).
- **Year/status**, then **name** at the display `h3` mobile size, then **paint line**.
- **Spec trio** as three label/value rows (label left 40%, value right). This holds the 14 px floor.
- **Price** at ≈28 px, left-aligned, with **Enquire** beside it.
- **Scale rule:** 63′ = full content width (358 px); 40′11″ ≈ 232 px, 48′ ≈ 273, 52′ ≈ 296.
- No hover swap. No rail: the brands rail stays the only horizontal scroller on the page (v1 §11).
- Sold: the heading, then the run-in paragraph, full width.

### Budget for the act
- Desktop ≈2.2 vh (v1 1.5); mobile ≈2.9 vh.
- Images: 4 plan frames (960w WebP ≤110 KB each) plus 4 elevation frames (lazy, ≤90 KB each). **≤0.8 MB for the act.**

---

## 8. Updated tables

**Feeling curve (only changed acts):**

| Act | Feeling | Caused by |
|---|---|---|
| I | cool suspension → *"I want to be in that water"* | the approved azure: white H1 in the deep channel, the bow tip on the sand bar |
| II | recognition turning into want | the channel lifts into bright flats as the bow crosses the H1; the hull crosses them whole, its shadow on the sea floor |
| shore | arrival | the flats shallowing into shallows-white under the plate |
| IV | trust, continuity | the car on its own asphalt, full ground change |
| V | measured certainty | four car paints, four lengths to one scale |

The adjacency check holds:
- II (desire) → shore (arrival) → III (breadth);
- IV (belief, on a dark ground) → V (comparison, on a light ground).

**Motion bands (deltas only):**
- I→II: the hero layer (azure loop + H1) fades on the existing H1 scroll input, revealing the flats loop. It is still the one scroll-linked property.
- II: the flats loop is band 4 for the **whole** passage.
- V: the plan→elevation crossfade is band 3, which replaces the image lift.

**Scroll budget (vh at 1440×900):**

| I | II | shore | III | IV | V | VI | VII | **Page** |
|---|---|---|---|---|---|---|---|---|
| 1.0 | 2.4 | 0.5 | 2.6 | 1.0 | 2.2 | 0.9 | 0.9 | **≈11.5 vh ≈ 10,300 px** |

**Performance (deltas):**
- Hero azure loop: as approved (2.06 MB desktop; mobile regenerated, ≤1.6 MB).
- Flats loop 10–12 s: ≤2.4 MB desktop (1600w), ≤1.5 MB mobile. Preload with the hero; it is on screen from the first scroll.
- Only two videos decode at once, and only during the I→II crossfade.
- Tall reduced-motion stills ≤250 KB each (AVIF), never loaded unless reduced motion is set.
- Full scroll, desktop: **≤13 MB**.
- LCP is unchanged: the H1 as HTML text.

**Section-language ledger (changed cells):**
- **I ground:** azure footage. **II ground:** flats footage throughout. **III, V, VI ground:** shallows-white `#EEFAF9`.
- **IV ground:** asphalt.
- **V:** containers are "4 slips, no separators"; image "plan + elevation"; carries the sentence by "car paints + length from above, to one scale". It is **no longer the weakest**.

---

## 9. Killed in v2

- **One loop under both the H1 and the facts.** The approved loop swings from 0.12 to 0.69 luminance, and no type colour reaches even 2:1 against both ends. The facts move, so they need their own uniform water.
- **White facts on a deep-water passage loop.** The deep channel only passes white at 4.1–5.6:1 and goes over it on glints. It would also make the passage the dark water note 3 asked us to leave; the bright flats carry ink at ≥5.2:1.
- **Any flat teal or aqua fill as a section ground.** Water lives only in footage (v1 §10). A flat teal is water without light, a brand-colour band.
- **Paper-white or a neutral grey ground.** It is the other generic default, and it has no derivation. The ground's 193° hue is the sand seen through the lagoon.
- **Any cream, beige, sand or warm-neutral ground or panel** (Alex's ruling). That includes `sand-deep` and the current surf's dry band.
- **Any scrim, text-shadow or box behind the facts.** These are boxes-for-boxes, and they darken the edible water. A failing frame is regenerated instead.
- **Water continuing behind Act III.** It puts water footage on a water ground and two moving waters in one viewport.
- **The light ground arriving at Brands, Land or later.** Act III needs a still ground (§2).
- **A foam shoreline at the II→III shore.** The surf footer owns the shoreline (DNA37).
- **v1's 1,614 px tide gradient.** It is the cause of note 2.
- **The pink beige `#EBDED4`.** Its hue is wrong, not only its value.
- **Four equal 4:3 cards, and the v1 hover lift.**
- **Lead + three.** There is no honest reason to promote one boat, and the ME52 already owns the peak.
- **Card widths, or photo sizes, proportional to length.** The frame would be to scale but the boat inside it would not, so it is a false drawing. It also squeezes the 40.2 to ~250 px.
- **The price column stepping right with length.** Ragged prices are harder to compare, and the text block for the 40.2 collapses.
- **Length × beam footprint rectangles filled with paint.** At any scale where the 63′ fits the width, the beams make the diagram ~1,100 px tall. They would also be colour chips sampled from mixed lighting, presented as real paints.
- **Paint swatch chips.** A sampled value would misstate a real paint, and the chip reads as a configurator UI.
- **Colour-grading the listing photos.** It falsifies the paints the section is built on.
- **Using 14.jpg in the ME52 unit.** It is spent on the peak.
- **Printing the ME52's power or hours.** The power derives from a disputed count, and the hours are not listed.
- **Hairline separators between units.** That is the DNA9 reflex.
- **Lengths in the sold record** (not sourced). **A count of sold boats** (CP).
- **A draw-on animation for the scale rules.** It adds motion to a still act, and the data needs no performance.
- **Overlaying text directly on the Revuelto frame.** There is no calm field wide enough.

---

## 10. Critique panel on the delta

1. **Composition.** The page now alternates its grounds (azure, bright flats, shallows-white, dark asphalt, shallows-white, surf, azure), so the reduced full-page read finally shows rhythm, not one long beige slab. It is one cool family, with camel as the only warm note. The risk is in Act V: four stacked units at ~330 px pitch can read as a list. The scale rules are what make it a diagram, and they must stay visibly different lengths. Do not shorten the 63′ to "make room".
2. **Craft.**
   - White on the channel has thin margins (4.1:1 median). The hero type must stay inside 34–58%, set as large text, and be re-measured at 1280, 1440 and 1920 widths, because `cover` shifts the band.
   - Ink on the flats must be measured per frame under each fact. The flats loop is the generator's job, and it is the most likely thing to fail.
   - `ink-2` is barred on water.
   - The VD40.2 plan frame is 1,024 px; it must never render above 512 css px wide at DPR2.
3. **User advocate.** Inventory is still reached in one tap (hero CTA, header). Each unit now answers what a car buyer asks first (colour, hours, power, size), and the price is on the same line. Enquire is per boat.
4. **Brief advocate.** All three notes are answered directly:
   - the inventory is the most information-dense, most authored act after the peak;
   - the hull never leaves the water;
   - the water is Alex's approved azure, and the beige is gone entirely.
5. **Contrarian.** The Tecnomar unit closes the crescendo with the weakest photographs: phone shots at a dock at dusk, with no aerial. The alternative is to order by price descending, so the ME52 or the Tecnomar opens. It is rejected:
   - the ascending scale is the section's legibility;
   - the Tecnomar's lit stern at dusk is the most distinctive frame of the four, even if it is the least sharp;
   - when a better set arrives, it replaces 02/07 and nothing else moves (C17: the dependency is declared, and the survival path is a file swap).

| Point | Disposition |
|---|---|
| Stacked units may read as a list | **accept**: no separators; the rules carry the comparison; the 64 px unit gap is never reduced |
| Per-frame AA on the lagoon | **accept**: measured under the H1 and every fact; a failing loop is regenerated |
| `ink-2` on water | **accept**: barred |
| Tecnomar photos weakest, and last | **reject-with-reason**: the ascending scale is the section's logic; declared under C17; swap path named |
| Inventory now 2.2 vh, page +1.3 vh | **reject-with-reason**: the act was the weakest carrier and Alex named it; the time is spent on evidence, not on scenery |
| Mixed type colour in the hero (white H1, ink header and CTAs) | **accept**: each is what its measured ground demands; the alternative is a scrim |
| A second water loop | **accept the cost**: about 2 MB, and the measured loop cannot carry the facts. The handover rides the existing scroll input, so no new device is added |
| Shallows-white could read as "just white" | **reject-with-reason**: its 193° hue is visible beside the asphalt and the photos, and it is derived. If Alex reads it as generic, the next step is chroma 0.016 (`#EAF9F8`, ink still 13.8:1), not a warm tint |

---

## 11. Builder checklist (order matters)

1. Generate `gen-azure-flats` (16:9 + 9:16) image-to-image from the approved azure still (§3), and re-frame the mobile hero loop (§3).
2. Regenerate `gen-surf-topdown` (16:9 + 4:5) with cool white coral sand and the approved azure (§5).
3. Generate the two tall reduced-motion flats stills (§3).
4. Sample the surf's dry band. Set the ground to `#EEFAF9`, or to the sample if it passes §5's test.
5. Set the asphalt ground to `#1E252B` (§2).
5b. Remove `--sand`, `--sand-deep` and every warm neutral from the tokens. The header's scroll-up bar becomes shallows-white.
6. Re-measure every type colour on every ground.
7. Remove `.tide`; build the shore block after the plate (§3). Then re-tune the hull shadow for water.
8. Rebuild Act V as the berth sheet (§7) from the frames named there, at the listing's resolutions, ungraded.
9. Render at 1440×900 and 390×844, three-chapter context (II → shore → III, IV → V → VI). Then take the reduced full-page read and hand it to `design-critic`.
