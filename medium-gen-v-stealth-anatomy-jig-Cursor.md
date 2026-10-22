# A 34-second stealth-fighter cutaway that keeps its own clock

**Suggested Medium subtitle:** Skin panels, a bay trapeze, and flat pitch-vector nozzles, staged by frame index instead of a prompt.

**Suggested tags:** Motion Design, Animation, Aviation, Technical Communication, JavaScript

**Canonical film:** https://mizcausevic-dev.github.io/gen-v-stealth-anatomy-jig/

**Publisher:** Kinetic Gain. **Byline:** Miz Causevic. **Encode date:** 22 October 2026.

---

A technical film is a clock with pictures on it. If the doors are supposed to move for 24 frames and only 24 frames, the file has to be able to prove that. A generated clip cannot. This one can.

The film is a 34-second schematic of a fifth-generation stealth fighter. It runs 1,020 frames at 30 fps, 1920 by 1080. The page is a static site on GitHub Pages. The master is an H.264 file with the index at the front, so a browser can jump to the bay, the trapeze, or the nozzles without downloading the whole picture first. I checked that on the live host: a request for the first 1,024 bytes came back as partial content, `bytes 0-1023/25934172`.

This is a motion study. It is not a measured aircraft, not a loft, and not a procedures document. The missile is an external AIM-120 class form. There is no seeker, no warhead, and no guidance interior in the model. The "4,000 psi" on the actuators is the label from the motion brief, drawn in kinetic gold so the drive reads. It is not a measured system pressure.

## What the reader is looking at

The job of the page is one pass through three mechanisms that are usually hidden:

1. Radar-absorbent skin lifts off titanium structure.
2. Belly doors open, and a trapeze pushes a store into clear air along guide rails.
3. Flat convergent-divergent nozzles pitch, and a plume convention shows shock diamonds.

The grade is small on purpose. Skin is `#121316`. Bulkheads are `#2F323A`. Hydraulic actuators are `#F77F00`. Guide rails are `#2A9D8F`. The plume is `#00B4D8`. The field behind the jet is darker than the skin, because a charcoal airplane on a charcoal ground disappears. Five accents, each tied to a part, beat a palette that changes because a shot got boring.

The type does the same job. Shot titles arrive letter by letter. Callouts dock to the right instead of sitting on the metal. A timecode and a frame index stay in the corner for the whole 34 seconds, so the picture and the clock never disagree.

## The clock is the edit

| Frames | Time | What is allowed to move |
| --- | --- | --- |
| 0–149 | 0.0–5.0 s | High forward three-quarter. Panels lift. |
| 150–299 | 5.0–10.0 s | The camera goes under the belly. Doors move only on frames 151–175. |
| 300–509 | 10.0–17.0 s | The trapeze runs the store out along the rails. |
| 510–749 | 17.0–25.0 s | Orbit on the nozzles. Divergent flaps reach 20 degrees of pitch. |
| 750–1019 | 25.0–34.0 s | Pull back. Surfaces, nozzle pitch, and inlet bypass settle together. |

That table is the product. Everything else is there to keep the table honest.

The door window is the strictest cut. Twenty-four frames is 0.8 seconds. If the doors ease in early, or keep creeping after frame 175, the cut is a suggestion. In this renderer the door parameter is zero before frame 151 and one after frame 175. The camera is allowed to keep moving. The doors are not.

The last shot is the coordination check. Elevons, rudders, stabilators, nozzle pitch, and the inlet bypass door all read the same progress value. If one of them is on a different curve, the telemetry strip at the bottom will say so, because the strip is drawn from the same state the geometry uses. There is no second animation track to drift out of sync.

## Why a prompt was the wrong tool

Generative video is a good way to find a look. It is a bad way to hold a cut. Ask a model for "doors open between 5.0 and 5.8 seconds, then hold" and you will get a door-like event somewhere near the middle. You will not get frame 151. You also will not get a file you can scrub to frame 470 and know the store is partway down the rail, because the model does not have a rail. It has a resemblance.

The renderer here is ordinary HTML canvas. One function, `computeState(frame)`, returns every parameter for that frame: panel lift, door angle, trapeze travel, nozzle pitch, surface deflection, plume amount. The camera is a list of keyframes with the same index. Faces are transformed from that state, projected, and painted back to front. No timeline library. No scene graph that can decide to be helpful. If frame 640 does not show about 17.7 degrees of pitch, the function is wrong, and you can read the bug off the screen because the HUD prints the degrees.

That is the whole argument for a jig instead of a clip. A clip is a picture of a mechanism. A jig is the mechanism, drawn.

## How the master was made

The page and the film share one renderer. A headless Chrome opens a bare HTML file, waits until the fonts are loaded, and calls `renderFrame` once per index. Three workers split the 1,020 frames. Each frame is a JPEG. FFmpeg assembles them at 30 fps.

The picture encode is H.264 High, `yuv420p`, CRF 18, 1920×1080, 30 fps. The moov atom is moved to the front of the file (`+faststart`). A quiet bed sits under it: two low sines and brown noise, high-passed and faded, encoded as AAC-LC, 48 kHz, mono. ffprobe on this master reads a container duration of 34.01 seconds. That extra hundredth is the AAC pad. The picture is 1,020 frames, which is 34.00 seconds. The file on the live host is 25,934,172 bytes.

Faststart is not a nicety on this page. The chapter buttons seek to 0, 5, 10, 17, and 25 seconds. A server that cannot answer a byte range will fail those seeks even when the file is correct. Python's built-in static server is the usual trap: it returns the whole file and ignores `Range`. GitHub Pages does not. I confirmed the live MP4 with a ranged GET, and the status was 206.

Captions are a WebVTT track with the same cuts. They describe the shot. They do not invent a procedure.

## What the grade is doing

Color in this film is a label, not a light show.

Gold appears on actuators and on the trapeze arms. Emerald appears on the rails the store travels along. Blue appears in the plume and on the shock-diamond marks. If a part is not one of those three jobs, it stays in the charcoal and titanium range. The moment a highlight color shows up on a spar "for interest," the legend at the bottom of the frame becomes a lie.

The diamonds are a drawing convention for a supersonic core, painted in the plume only. They pulse with the frame index, slowly, and they stay inside the exhaust. They are not a flow solution. A large saturated flash across the frame would also be the wrong tool: it fights the cut, and it is a known problem for photosensitive viewers. The pulse here is local and well under three flashes a second.

Kinetic type follows the same rule. Letters ease in. They do not shake. A reduced-motion setting on the page stops the marquee and does not autoplay the film. The film file itself still contains the motion, because that is the work. The page does not force it on someone who asked the browser not to.

## What this refuses to be

A stealth-fighter image collects bad inferences. The page says the boundary in the corner of every frame: schematic, not an engineering drawing. The article should say the same things in prose.

- The planform is a generic fifth-generation silhouette: chine, trapezoidal wing, canted tails, flat nozzles, a belly bay. It is not a traced F-22, F-35, or any other named aircraft.
- Panel gaps, spar spacing, actuator count, rail spacing, and missile diameter are composition. They are not measurements.
- The store is an external shape in the AIM-120 class so a viewer can tell a missile from a fuel tank. Nothing inside it is modeled, and nothing in the film is a release procedure.
- Twenty degrees of nozzle pitch is the end state of the animated flap, reached on the shot's ease. It is not a flight-test number and not a control law.
- Shock diamonds are graphic. They are not schlieren and not CFD.
- There is no lead form, no analytics tag, and no claim that the page is a certified reference.

If a later version adds a real aircraft, a real measurement, or a real procedure, that version has to say where the number came from. This version does not have those numbers, so it does not print them.

## What transfers

The airframe is the subject. The reusable object is the clock.

Any mechanism with a hidden state wants the same treatment. A bay door, a swashplate, a slip ring, a waveguide, a surgical wrist: pick the cuts, bind every moving part to one frame index, paint a legend that uses color as a label, and ship a file whose seek points are the cuts. The page can be the renderer plus a master video. The video is what you hand to someone who will not open a canvas. The renderer is what you open when the video and the claim disagree.

The commercial use is narrower than "a cool jet." It is a way to show an internal mechanism to a buyer, a trainee, or an editor without pretending the model is the machine. The conversion, if there is one, is that the viewer can scrub to the claim. That is a stronger ask than a contact form on a film that does not collect anything.

## What I would change next

The silhouette reads. The bay reads from underneath. The nozzles read in the orbit. Three things are still composition, and I would treat them as composition:

- The final wide shot still carries an open-bay state on the telemetry, because the door parameter does not reverse. If the last shot is supposed to be a clean cruise lock, the doors need their own close window, drawn on the clock, not faded in by eye.
- Callout docking is a screen-space rule. On a short viewport a leader can cross type. The film is 16:9. The page scales the video. The callouts live in the 1920×1080 master, which is the right place for them, and the wrong place to invent a second layout.
- The audio bed is a tone, not a mix. It exists so the file is not silent in a player that unmutes. It is not aircraft audio and it should not be described as a recording.

None of those change the cut that is already on the page.

The film is here: [Gen-V Anatomy Jig](https://mizcausevic-dev.github.io/gen-v-stealth-anatomy-jig/). Chapters at 0:00, 0:05, 0:10, 0:17, and 0:25. The frame under the player is the same function that printed the master.
