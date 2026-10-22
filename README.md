# Gen-V Anatomy Jig

34-second schematic motion study of a fifth-generation stealth fighter. 1,020 frames at 30 fps. Skin separation, belly-bay trapeze deployment, and flat 2D pitch-vector nozzles.

This is not an engineering drawing and not a measured airframe. The missile is an external AIM-120 class form. No seeker, warhead, or guidance interior is shown.

Live page: https://mizcausevic-dev.github.io/gen-v-stealth-anatomy-jig/

Open `index.html`. The master is `media/stealth-anatomy-jig-Cursor.mp4`. The frame jig under the player scrubs the same renderer. `README.md` keeps the name GitHub expects. The film grade is locked, so the page does not carry a theme picker.

## Clock

| Frames | Time | What moves |
| --- | --- | --- |
| 0–149 | 0.0–5.0s | Forward three-quarter. RAM panels lift. |
| 150–299 | 5.0–10.0s | Under the belly. Doors swing on frames 151–175 only. |
| 300–509 | 10.0–17.0s | Trapeze pushes the store out along emerald rails. |
| 510–749 | 17.0–25.0s | Nozzle orbit. Divergent flaps reach 20 degrees pitch. |
| 750–1019 | 25.0–34.0s | Pull back. Surfaces, vector, and bypass lock. |

## Grade

Skin `#121316`, titanium `#2F323A`, hydraulic gold `#F77F00`, rail emerald `#2A9D8F`, afterburner blue `#00B4D8`. The field behind the jet is darker than the skin so the silhouette separates.

## Rebuild the picture

```bash
python3 -m http.server 8741
node scripts/render-film-Cursor.mjs /tmp/jig-frames
ffmpeg -y -framerate 30 -start_number 0 -i /tmp/jig-frames/%04d.jpg \
  -frames:v 1020 -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart \
  media/stealth-anatomy-jig-Cursor.mp4
```

The file in `media/` includes a quiet mechanical bed mixed under the picture. An image-only encode replaces that bed. Use `-movflags +faststart` so browsers can seek. GitHub Pages answers byte ranges. Python's `http.server` does not, so chapter seeks fail on that server.

`puppeteer-core` drives the installed Chrome. It is a capture tool, not a page dependency. The page itself is static HTML, one canvas script, self-hosted OFL fonts, and the video. The renderer is canvas, not a timeline library, because the door move has to start at frame 151 and finish at frame 175.

## Fonts

Inter, copyright 2016 The Inter Project Authors, SIL OFL 1.1. See `fonts/Inter-OFL.txt`.
JetBrains Mono, copyright 2020 The JetBrains Mono Project Authors, SIL OFL 1.1. See `fonts/JetBrainsMono-OFL.txt`.

## GitHub

About: 34-second frame-accurate anatomy jig of a fifth-gen stealth fighter, from bay trapeze to 2D pitch-vector nozzles.

Topics: motion-design, kinetic-typography, canvas, animation, aviation, technical-illustration, github-pages, stealth, html5
