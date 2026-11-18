# Music Tools

Tap a link to open the tool. These are the links to share.

- **All tools:** https://sniggihwerdna.github.io/music-tools/ (tap a folder to see its tools)

### Odd meters
- **Odd Meter Trainer:** https://sniggihwerdna.github.io/music-tools/odd-meters/odd-meter-trainer.html
- **Irrational Meters:** https://sniggihwerdna.github.io/music-tools/odd-meters/irrational-meters.html
- **5/4 Groove:** https://sniggihwerdna.github.io/music-tools/odd-meters/five-four-groove.html
- **Odd Grooves:** https://sniggihwerdna.github.io/music-tools/odd-meters/odd-grooves.html
- **Over the Bar Line:** https://sniggihwerdna.github.io/music-tools/odd-meters/over-the-bar-line.html

### Time trainers
- **Rhythm Trainer:** https://sniggihwerdna.github.io/music-tools/time-trainers/rhythm-trainer.html
- **Advanced Tempo Trainer (Higgins model):** https://sniggihwerdna.github.io/music-tools/time-trainers/advanced-tempo-trainer.html
- **Tempo Drift:** https://sniggihwerdna.github.io/music-tools/time-trainers/tempo-drift.html
- **Off-Grid Rhythm Trainer:** https://sniggihwerdna.github.io/music-tools/time-trainers/off-grid-rhythm-trainer.html

### Vocal exercises
- **Audio Mirror:** https://sniggihwerdna.github.io/music-tools/vocal-exercises/audio-mirror.html
  (Quick Mirror: add `#quick` to the end)
- **Vocal Exercise Patterns:** https://sniggihwerdna.github.io/music-tools/vocal-exercises/vocal-exercise-patterns.html
- **Wide Interval Trainer:** https://sniggihwerdna.github.io/music-tools/vocal-exercises/wide-interval-trainer.html
- **Microtonal Ear Trainer:** https://sniggihwerdna.github.io/music-tools/vocal-exercises/microtonal-ear-trainer.html

### Sound organization
- **Retrograde Trainer:** https://sniggihwerdna.github.io/music-tools/sound-organization/retrograde-trainer.html
- **Inversion Trainer:** https://sniggihwerdna.github.io/music-tools/sound-organization/inversion-trainer.html
- **Chord Player:** https://sniggihwerdna.github.io/music-tools/sound-organization/chord-player.html
- **Call & Response Improv:** https://sniggihwerdna.github.io/music-tools/sound-organization/call-and-response-improv.html

Old links (like `.../music-tools/tempo-drift.html`) still work: each old file is now a small page that forwards to the tool's new address.

## Folders

```
music-tools/
├── index.html              home page: one icon per folder
├── odd-meters/             each folder has its own index.html menu
├── time-trainers/
├── vocal-exercises/
├── sound-organization/
├── sounds.js, sounds/      shared piano and drum sounds
├── sw.js                   offline copy (list of files + version number)
├── manifest.webmanifest    "add to home screen" settings
├── icon-*.png
└── *.html at the top       forwarding pages for the old links
```

## To add a new tool

1. Upload its `.html` file into the right folder.
2. Inside a folder, links to the shared files go up one level: `../sounds.js`, `../manifest.webmanifest`, `../icon-180.png`, `navigator.serviceWorker.register("../sw.js")`. The back link is `href="./"`, which goes to the folder's menu.
3. Add a card for it in that folder's `index.html`, update the tool count on its icon in the main `index.html`, and add a line in the list above.
4. In `sw.js`, add its path (for example `"odd-meters/new-tool.html"`) to `FILES` and bump `VERSION`, so phones pick it up.

Sounds (in the `sounds` folder): piano from the Salamander Grand Piano by Alexander Holm (CC-BY 3.0);
drums from Chris Wilson's web-audio-samples acoustic kit, via the Tone.js audio collection.
