# Prestige Marine — EXPLORE brief (26 Oct 2026): three genuinely different directions

Prestige Marine (prestigemarine.co) is a Miami boat dealer, "A Division of the Prestige Imports
Family" (exotic-car dealer, Brett David). It represents **Tecnomar for Lamborghini 63, Midnight
Express, VanDutch, Iguana Yachts**. Homepage only. Phone 305-947-1000, 15050 Biscayne Blvd, North
Miami Beach FL 33181. v1 scored 7/10, v2 6/10 — both are the same page (a hull cut-out rising over
water with facts beside it). Alex wants three directions that differ in MECHANIC and LAYOUT, then he
picks one.

## Read first
- Design DNA: `/Users/alex/Desktop/WORK/design_dna/TASTE.md` (§2d EXPLORE), `.claude/rules/design-dna.md`
  (DNA90 Lenis contract — Lenis ships on every page; DNA96 21st.dev allowed for blocks).
- `DESIGN-READ.md`, `DESIGN-READ-v2.md`, `CRITIQUE-v1.md` in `/Users/alex/Desktop/WORK/PRESTIGE/______MARINE PRESTIGE/`
  for facts, assets and what failed. `research/README.md`, `research/REFERENCES.md` (Omaya, AB Yachts,
  Awwwards survey), `research/SIMULATED.md`.
- Current v2: `site/index_v2.html` + `site/assets/css/marine_v2.css` + `site/assets/js/marine_v2.js`
  (you may reuse its markup, copy, form, footer).

## Alex's binding feedback (verbatim intent)
1. **New hero boat: more chic, brighter, memorable.** Use `site/assets/img/gen-tecnomar63-top.webp/.png`
   — a yellow Tecnomar for Lamborghini 63 from straight above, 750×2499, transparent. It is GENERATED
   art direction: disclose it on the page (one small line, e.g. in the footer legal line or a caption).
   The ME52 (`me52-hull.webp`) may still appear elsewhere (it is real stock, $2.5M).
2. **The boat shown over a water video on top — he likes that. Keep it.**
3. **Texts must NOT be bolted to the boat.** They should float up from below on scroll, one after another,
   soft, staggered ("like steps"). They can sit in cards — he suggested "ice cards / steam cards"
   (frosted, icy glass over the water) — your call how, but legible (AA on the composited render).
4. **Pale shallows kill the impression.** Keep the water saturated azure (the approved
   `gen-azure-topdown.mp4`, `-m2.mp4` for phone). Don't wash it out.
5. **Split everything into elements, more dynamic** — not one static column.
6. **Darker boat shadow.**
7. **Water ripple on mouse move/hover** — e.g. https://21st.dev/?q=water+ripple (the water-ripple-image
   component); a WebGL/canvas displacement ripple over the water video or a still. Respect reduced motion.
8. **He likes the map / navigation idea, with an unobtrusive HUD.**
9. **One direction should do day → night** (the water story turns to night). Generate night water if
   you are that direction.
10. **Header never disappears** (only changes tone). **No beige/cream/camel anywhere** (DNA color I8):
    grounds from the subject (azure water, cool white `#EEFAF9`, asphalt `#1E252B`, graphite ink `#2A2627`,
    lagoon `#0B6A70`). Primary button: graphite with white type.
11. Never print the ME52 outboard count; never a Tecnomar top speed; never link midnightexpressboat.com.

## Assets available (site/assets/)
img: gen-tecnomar63-top.(webp|png), me52-hull.webp, gen-azure-topdown(-m2)-poster.jpg,
gen-flats(-m)-poster.jpg, gen-surf2(-m)-poster.jpg, brand-tecnomar.webp, b2-midnight.webp,
b2-vandutch.webp, b2-iguana.webp, land-revuelto(.webp|-p.webp), slip-*-plan/side.webp (4 boats),
inv-*.webp. video: gen-azure-topdown.mp4 (+ -m2.mp4), gen-flats(-m).mp4, gen-surf2(-m).mp4,
brand-*.mp4 (weak). Raw research photos in `research/brands/*` and `research/inventory/*`.
Generation (fal MCP) is allowed for water/scenes (not for products other than the disclosed Tecnomar):
`gen-` prefix + a line in `site/assets/video/GENERATED.md`. Keep generation spend small (≤4 jobs).

## Deliverable per direction
- Folder `site/explore/<a|b|c>/` with `index.html`, its own css/js; reference shared assets as
  `../../assets/...`. Served already at `http://localhost:8773/explore/<x>/index.html` (don't start servers).
- A scrollable prototype, not a full site: **header + first screen + the signature moment with the
  Tecnomar + the staggered text/cards + one more act (brands or inventory) + the surf footer**.
  Desktop 1440×900 and phone 390×844 both working; reduced-motion path; Lenis on.
- `site/explore/<x>/NOTES.md`: concept sentence, mechanic, what is different from v2, judgment calls.
- Verify in a browser you own: use Playwright from `/Users/alex/Desktop/WORK/design_dna/node_modules`
  (`chromium.launch({channel:'chrome'})` so H.264 plays). **Do not use the shared Playwright MCP browser**
  (the other directions run in parallel). Screenshot 1440 and 390 frames into `site/explore/<x>/shots/`.
- Do not edit files outside your folder except adding new `gen-*` assets + their GENERATED.md line.
