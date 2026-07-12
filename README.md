# Blocks Game

A small falling-block puzzle game built with plain JavaScript, HTML Canvas, and CSS.

This was my first JavaScript project. It uses Canvas for rendering, keyboard events for player input, and plain JavaScript classes to handle the game state, pieces, movement, rotation, and row clearing.

The project does not use a framework, bundler, or package manager. It is intentionally simple and runs directly in the browser.

[Live Demo](https://mrcodecx.github.io/blocks_game_js/)

![Blocks Game gameplay](docs/screenshots/gameplay.png)

## Features

- Canvas-based rendering.
- Keyboard-controlled block movement and rotation.
- Row detection and score updates.
- Lightweight arcade-style interface.
- No build step or external runtime required.

## Controls

| Key | Action |
| --- | --- |
| `W` `A` `S` `D` | Move the active piece |
| `Space` | Rotate |
| `Q` / `E` | Rotate left / right |
| `Esc` | Toggle music |

## Running Locally

Open `index.html` directly in your browser.

For a local HTTP server, from this folder you can run:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Project Structure

```text
.
|-- index.html
|-- src
|   |-- css
|   |   `-- style.css
|   `-- js
|       |-- blocks-data.js
|       |-- data.js
|       |-- graphics.js
|       |-- logics.js
|       `-- script.js
|-- assets
|   |-- audio
|   |   `-- sound.mp3
|   `-- icons
|       `-- logo.ico
|-- docs
|   `-- screenshots
`-- LICENSE
```

## Technical Notes

The block definitions live in `src/js/blocks-data.js` as a JavaScript object instead of an external JSON file. This keeps the game usable when opened through `file://`, where browser restrictions can block `fetch()` requests to local JSON files.

The code is intentionally not rewritten into a modern architecture. The goal of this version is to preserve the original JavaScript logic while making the project easier to view, run, and understand.

## License

MIT License. See [LICENSE](LICENSE).
