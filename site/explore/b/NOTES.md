# Explore B: Day to Night

**Concept.** The scroll is the clock. The same water, seen from above, runs from saturated midday azure through golden hour and a violet dusk into a moonlit night. The yellow Tecnomar for Lamborghini 63 crosses it, and the words arrive in the hours between. The page ends at first light, at the shore.

## Mechanic
- **One fixed sea under the whole page.** It is a WebGL canvas that samples two generated loops of the *same* water at the *same* framing: the approved `gen-azure-topdown(-m2)` and the new `gen-night-topdown(-m)`. One key table, written against the page's own chapters (hero, 14:00, 16:30, 18:40, 20:15, night head, last marque, dawn card), maps the scroll centre to `tod` (time of day), `dawn`, the clock minutes and the boat's pose. Between keys it uses smootherstep, so the light holds while a card is being read.
- **Grades in the shader, not extra generations.** Golden hour warms the light and the glints and adds a west-side sheen on open water only. The sand bars stay cool, so no ground turns beige. Dusk is a violet multiply. Night is the moonlit loop graded to ink blue, with a vignette and twinkling moon glints in the upper right. First light is the day loop, desaturated and cooled.
- **The boat.** The cut-out sits in a sticky stage and moves only through four custom properties (`--x --y --r --s`). From the first screen to dusk it turns and pushes up the frame, then the stage releases and it sails off the top.
  - **Shadow.** A black silhouette at 62–66 % opacity, world-fixed to the sun. It lengthens toward golden hour and is gone by dusk.
  - **Night.** The hull darkens. Its own deck Y-strips light up through a screen-blended mask derived from the generated master (`img/tec-lights.webp`). Port (red), starboard (green), masthead and stern lamps switch on. The shader lights the water under and behind the hull in cyan, as underwater lights would, so the ripples and sand show through the light.
  - **Stern wash.** It scales with the visitor's own scroll speed: when you stop scrolling, the boat stops.
- **Ripple.** Pointer moves spawn analytic rings in a 16-slot buffer. They displace the water texture's UVs and catch a highlight, by day and by night. The 21st.dev water-ripple-image component was the reference; this version is written against video textures. There are no ripples under reduced motion.
- **Text in steps.** The chapter cards are in the normal flow, so they rise from below on their own and are complete without scripts. On arrival the frosted card rises first, then its lines follow (hour, title, text, link), 120 ms apart, with a 36 px rise and blur clearing.
  - **Ice by day:** shallows-white at 70 % with graphite ink.
  - **Smoke by night:** the night band at 62 % with moonlit type.
  - The scheme is re-solved for night, not inverted. Every measured text sits at 8.8:1 or better on the composited render, except the first-screen white display type on the deep band, which is large text at 4.0:1 minimum.
- **Header** is always on: a frosted bar, re-toned to smoke at night. The **HUD clock** (time · track · phase) lives in the header centre, so there is one persistent layer, not two. On a phone it shows the time only.
- **Act III at night:** the four marques as smoke-ice plates descending in steps (one 64 px stair each). **Act IV:** the night passes in one scroll, and the visit card arrives at 06:20 with first light. Then the water dissolves into shallows-white and the surf footer.
- **Lenis** 1.3.26 is driven from the page's single rAF (`autoRaf: false`), with `anchors` offset for the header. It is not constructed under reduced motion.

## Different from v2
v2 is one static column: a hull cut-out rising over water with facts bolted beside it. B is chaptered by time:
- the water itself changes state;
- the boat moves and is lit;
- the text is detached from the hull in cards that alternate either side of its track;
- the brands live in a night act;
- the page closes the loop at dawn.

## Paths
- **Reduced motion.** No Lenis, both loops paused on a frame, no ripple and no wash. The boat holds its first-screen pose, and every desktop card moves to the free left side. The clock still turns the colour, which is not movement, so the night act still reads as night.
- **No JS / no WebGL.** The day loop plays under everything. The night act carries its own night still under a smoke wash. All copy and links are present.

## Judgment calls
- **Golden hour is subtle.** Top-down there is no sky to carry it, and warming the sand would have produced a beige ground (I8). The warmth is in the glints, the west sheen and the long shadow instead.
- **Shadow is black, not tinted.** The page's sea is a separate stacking context, so multiply would not reach it. A black silhouette at ~0.62 over turquoise gives the darker shadow Alex asked for.
- **Night lights are invented as light, not as product.** The deck strips are the generated master's own yellow pinstripes. The nav lights sit at plausible positions, and they are tiny.
- **Card 4 and the night act use "smoke ice".** By then the water is below 1.3:1 against ink, so frost with ink would have been the wrong solve.
- **The footer surf is daylight footage,** so the page goes to first light before it, rather than grading the surf to night.
- **Simulated facts (from `research/SIMULATED.md`):** the hours and "Marina Palms by appointment". Everything else is from v2 or `DESIGN-READ.md`, with no Tecnomar top speed and no outboard count.

## Assets
New: `assets/video/gen-night-topdown(.mp4|-m.mp4)` + posters (4 paid fal jobs: 2 stills, 2 i2v loops; see `assets/video/GENERATED.md`), `explore/b/img/tec-lights.(png|webp)` (local derivative).
