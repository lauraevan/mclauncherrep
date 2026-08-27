# Minecraft Launcher — Web Replica

A pixel-matched, browser-based replica of the **Minecraft Launcher** (Java Edition
"Play" screen). Built as static files so it can be hosted directly on
[githack](https://raw.githack.com/).

![Minecraft Launcher replica](assets/placeholders/hero.svg)

## What's inside

| Path | Purpose |
|------|---------|
| `index.html` | The launcher shell (sidebar, tabs, hero, PLAY bar, news row) |
| `css/launcher.css` | Pixel-matched styling |
| `js/launcher.js` | Tabs, sidebar, PLAY → game window. **`GAME_URL` config lives here.** |
| `js/news.js` | Fetches **real Minecraft news & patch notes** from Mojang, live |
| `assets/icons/*` | Recreated block/UI icons (SVG) |
| `assets/placeholders/*` | Placeholder hero / news / realm images (swap for real art later) |
| `game/index.html` | **Drop-in slot for the actual game build** |

## Hosting on githack

githack serves any file in a public GitHub repo with the right content type — no
build step. After you push this branch, the launcher is live at:

```
https://raw.githack.com/lauraevan/mclauncherrep/claude/minecraft-launcher-replica-bakqq2/index.html
```

- Swap the branch segment for `main` (or a tag/commit SHA) once merged.
- Use `rawcdn.githack.com/...` instead of `raw.githack.com/...` for the
  cached/production CDN URL.

## Adding the game (novix core 26.1.2)

The launcher loads the game into an `<iframe>` when **PLAY** is pressed.

1. Take your saved build (`view-source_https___t9os.space_novix.html`).
2. Rename it to `index.html` and put it at **`game/index.html`** (replace the
   placeholder there).
3. Keep any asset folder the build needs next to it (e.g. `game/novix/…`).
4. If the entry file isn't `game/index.html`, set `GAME_URL` at the top of
   `js/launcher.js` to the correct path (a local path or a full `https://` URL).

> Served over HTTPS on githack, so the game it loads must also be reachable over
> HTTPS. A local file committed into this repo works perfectly.

## Real Minecraft "mail" (news & patch notes)

`js/news.js` pulls live content from Mojang's official, CORS-enabled launcher
content API — the same source the real launcher uses:

- News cards → `https://launchercontent.mojang.com/news.json`
- Patch Notes tab → `https://launchercontent.mojang.com/v2/javaPatchNotes.json`

These run in the visitor's browser, so they populate automatically when the page
is opened online. If the network is unavailable, the UI falls back to placeholder
cards so it never looks broken.

## Placeholders

Per the current phase, the **main pictures are placeholders** (hero banner, news
images, realm art) in `assets/placeholders/`. Replace those SVGs (or repoint the
`src`/API image handling) with final art when ready.

## Local preview

Any static file server works, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```
