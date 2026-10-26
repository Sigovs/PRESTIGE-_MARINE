# EXPLORE A · "The Chart" (26 Oct 2026)

**Concept.** The homepage is a nautical chart of the water seen from above: the yellow Tecnomar 63
sails one plotted course down the page, and everything the dealer has to say sits on the chart
beside that course, as waypoint notes read through a quiet navigator's HUD.

## Mechanic
- **One function steers everything.** `course(y)` returns the vessel's lane (lateral position) and
  altitude (zoom) for any document y. The same function moves and turns the hull (its heading is the
  path's tangent), draws the course on the chart (dashed ahead, solid track astern, a ring at each
  waypoint), and feeds the HUD (position, heading, distance to the next waypoint, scale bar).
- **The sea is one fixed WebGL surface** that moves 1:1 with the scroll in screen pixels, so the notes
  in the normal document flow read as lying *on* the water. It is the approved `gen-azure-topdown`
  loop, tiled with a three-tap seamless crossfade, domain-warped and mixed with low-frequency noise so
  it reads as one continuous seascape, then pushed through a fixed azure ramp: the pale shallows can
  only come out as light azure, never white (Alex point 4). The graticule is drawn in sea coordinates.
- **Altitude.** Holds per act: hero 1.0 → Tecnomar 0.74 → brands/stock 0.36 → mooring 0.30. Between
  acts the camera climbs first and then crosses (a smaller hull at a gentler angle), always in open
  water, never under a note. The water texture and the hull scale together, so zooming reads as height.
- **Notes float up** (Alex point 3): each card rises 40 px and fades in when its waypoint is reached,
  its lines following 130 ms apart; cards that arrive together are staggered 160 ms. Ice cards
  (frosted, 80 % cool white, blur 22 px).
- **Deep pools.** Every white text on open water (`[data-pool]`: hero copy, act heads) gets a deep pool
  dug into the water under it by the shader, so white type holds AA on the composited render without
  a scrim box.
- **Ripple** under the pointer (rings, 8 live) and a **Kelvin wake** astern that only shows while the
  hull is moving (scroll velocity). Both off under reduced motion.
- **HUD** (desktop): the chart's left margin — waypoint list (doubles as navigation, `aria-current`),
  POS / HDG / NEXT readout, scale bar derived from the hull itself (63 ft = the hull's drawn length,
  rounded to a chart-like 10 / 25 / 50 ft bar). It stays off the first screen and comes on when the
  passage starts; it leaves at the shore. Content never enters the margin, so only the header crosses
  content. Phone: the readout is a line inside the header (one overlay, not two); the waypoints are in
  the menu.
- **The arrival.** The course ends at WP 05 (25°55′N 080°08′W, the showroom); the hull moors there and
  scrolls away with the chart; the surf loop, turned upside down, brings the shore in from below and
  the footer stands on the sand.

## Different from v2
v2 was one static column: a hull cut-out rising over water with facts bolted to it. Here the boat is
a persistent subject travelling through the whole page, the texts are separate notes that arrive
beside it, the layout changes lane act by act (centre lane / left lane with brands stepping down the
right / right lane with berths on the left / mooring), and the page has a real navigation instrument.

## Stack
Static HTML + CSS + vanilla JS, raw WebGL 1 (one full-screen fragment shader, DPR capped 1.5 desktop /
2 phone), Lenis 1.3.26 (`autoRaf`, no GSAP; `anchors` with offset; not constructed under reduced
motion; menu `data-lenis-prevent`). Measured 60 fps at 1440×900 with the video texture updating.

## Fallbacks
- **Reduced motion:** no Lenis, no ripple, no wake, video not played; the sea is the graded poster
  frame redrawn only on scroll; the hull is moored in the hero; notes are visible immediately.
- **No WebGL / no JS:** the poster (saturation lifted) is the sea; white heads get a painted pool and
  a text shadow; the HUD is hidden (live readouts would lie); the hull sits in the hero.

## Judgment calls
- **Bow down.** The chart is north-up and the page scrolls south, so the hull points down the page,
  heading 177–191°. It leads the eye downwards; course-up with the bow up would have made the boat
  sail backwards against the scroll.
- **No drag.** Drag-to-pan was optional; it would fight native scroll and text selection, and the
  scroll already moves the camera. Not built.
- **No depth soundings.** Invented sounding numbers would be fabricated data (content-provenance).
  The chart carries only true or declared marks: the course, waypoints, graticule, the hull-derived
  scale and "Built in Italy / Miami / France" on the brand marks (from the brands' own copy).
- **Coordinates are illustrative**, ending at 25°55′N 080°08′W per the brief; the readout during the
  passage is the chart's own fiction. Declared in the footer line. Verify the showroom position if this
  direction is picked.
- **Header phone link hidden ≤440 px** so brand + Inventory + menu fit on one line; the number is in
  the hero, the menu and the contact card.
- **Disclosure:** the Tecnomar stock card says the yellow 63 is generated and the stock boat is Verde
  Gea; the footer legal line repeats it for the water and the hull.

## Verified (Playwright, Chrome, own browser)
AA on the composited render, text hidden and the pixels under each glyph box sampled (p5 of the box):
white hero H1 7.9, eyebrow 7.7, lede 8.2, act heads 8.2–8.3, act kickers 8.0; ink on ice 11–12.6;
lagoon labels on ice 4.69–5.15 (lowest: "Length × beam" 4.68 on phone); HUD 4.95–12.0; footer 13.5–14.
No failures at 1440×900 across 11 stops or 390×844 across 14 stops (the outline phone button reports
its own white border, not its text: median 8.4). Waypoint link → lands on the act head with
`aria-current="step"`; Enquire preselects the boat; empty submit shows all three errors.
Screens in `shots/` (d-* 1440, m-* 390, rm-* reduced motion, nojs-0, fx-wake, fx-ripple).
