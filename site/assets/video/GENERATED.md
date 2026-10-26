# Generated footage (GI6 sidecar) — Prestige Marine, 26 Oct 2026

All four loops are generated artwork (abstract water and sand, no product, no place, no
person — GI3). The footer carries the line "Water footage on this page is generated artwork."
Never captioned as a real place.

| File | Still | Motion |
|---|---|---|
| gen-water-topdown.mp4 (1600w) | google/nano-banana-2.1, 2K, 16:9 | lightricks/ltx-2.5/image-to-video/pro, 8 s, 1080p, first = last frame, camera static |
| gen-water-topdown-m.mp4 (720w) | same, 9:16 | same, 9:16 |
| gen-surf-topdown.mp4 (1600w) | same, 16:9 | same, 16:9 |
| gen-surf-topdown-m.mp4 (720×900, cropped from 9:16) | same, 4:5 | same, aspect auto → 9:16 |

Prompts (stills): "Photorealistic drone photograph shot straight down (perfect nadir) over clear
shallow tropical water in Florida at midday … calm darker band across the upper-middle third …
nothing in the frame: no boats, no wake, no foam, no land, no people, no text" — and for the
surf: "… top half flat, even, dry pale warm sand … a soft white line of foam washes in from
the bottom edge … no people, no objects, no text". Full prompts and request ids in the session
log (fal request ids 01a179d8-…, 01a179da-…).
Motion prompt: "Locked-off drone shot looking straight down … the camera does not move at all.
Only the water moves …" / "… the dry sand in the top half stays completely still".

GI9 check (26 Oct): frame sheets reviewed. Desktop surf: dry band static, foam only below —
pass. Desktop water: a thin shoreline ripple crosses the lower quarter in the first seconds
(sits under the sand dissolve) — pass. Mobile surf: foam jumps once mid-loop — watch on device.

## v2 azure (26 Oct 2026, Alex: "if azure, then really azure — so it looks edible")
| gen-azure-topdown.mp4 (1600w) | google/nano-banana-2.1 2K 16:9, prompt "… most inviting crystal-clear Caribbean lagoon water … vivid saturated azure turquoise and aquamarine … a broad band across the middle deeper, richer turquoise-blue, calm and even … nothing in the frame" | ltx-2.5 i2v pro, 8 s, first = last, static |
| gen-azure-topdown-m.mp4 (720w) | same, 9:16, deeper band in the upper-middle third | same |
GI9: desktop frame sheet stable (glints only, no morphing) — pass.

## Explore B night (26 Oct 2026, direction "Day to Night")
| gen-night-topdown.mp4 (1600w) + gen-night-topdown-poster.jpg | google/nano-banana-2.1/edit, 2K 16:9, source = the approved azure master `_work/gen/az-16a.png`, prompt "turn this exact drone photograph into the same place at night under a bright full moon … keep the framing, the camera (perfect nadir), every sand bar, ripple and the deeper band … water deep midnight teal and ink blue … sparse silver moonlight sparkles, strongest upper right … no sun, no caustics, no moon disc, no boats, no lights, no text" (request 01a17a23-a858-…) | ltx-2.5 i2v pro, 8 s, 1080p, first = last, camera static, no audio (01a17a24-51b4-…) |
| gen-night-topdown-m.mp4 (720w) + -m-poster.jpg | same edit of the mobile master `_work/gen/hero-m2.png`, 9:16 (01a17a23-a85f-…) | same, 9:16 (01a17a24-51b5-…) |
Same pixel framing as gen-azure-topdown(-m2), so a crossfade reads as the light changing on the same water. The page
grades both further in WebGL (golden hour and the final night darkness are shader grades, not generations). Masters and
raw clips in `_work/night/`. GI9: frame sheets reviewed — sand bars and deep band static, only ripples and glints move — pass.
Disclosed on the page in the footer legal line. 4 paid jobs total.
