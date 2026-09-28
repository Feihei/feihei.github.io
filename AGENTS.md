# AGENTS.md

Living doc for AI agents working on this repo. Keep it up to date when conventions change.

## What this is

Feihei's personal homepage at **feihei.github.io** — a plain static site: hand-written
HTML/CSS/JS, **no build step, no dependencies, no framework**. Don't introduce tooling
(Vite, npm, bundlers...) unless explicitly discussed — that would be scope creep.

## Structure

- `index.html` — the homepage markup (content only; styles/JS are external)
- `css/style.css` — homepage styles (visual identity lives here)
- `js/main.js` — homepage language switcher
- Everything else at top level (`baobao/`, `detector/`, `micviz/`, `valentine/`,
  `qingju_bike/`, `happy_birthday_*`, `cannon-chess.html`) is a **standalone mini work**,
  self-contained in its own folder/file
- `media/image/` — shared logos and card artwork (SVG)
- `bishop_xiangqi` lives in a **separate repo**; the homepage only links to it

## Deployment

- Branch `master` → GitHub Pages auto-deploys on push (https://feihei.github.io)
- Also mirrored to Gitee (`gitee_page` remote), deploy there is manual
- The human pushes themselves — agents commit, never push

## Homepage conventions (index.html)

Keep the visual identity: dark green `#002a13` background, white borders, rounded
card corners. Don't redesign without asking.

- **Cards**: each work card is `<a class="img_box" href="...">` containing a
  `.mask` (title overlay) and an `<img>`. The whole card is one link — don't nest
  links inside cards, and don't move the link back into the mask (breaks touch devices)
- **Touch support matters**: hover-only interactions are forbidden for essential
  functions. Titles show via `@media (hover: none)`; keep viewport meta in every page
- **Bilingual**: two parallel sections `#en-content` / `#cn-content`, toggled by
  `switchLanguage(lang, persist)`. Preference persists in `localStorage` key
  `preferred-lang`; first visit falls back to browser language. When adding a card,
  add it to **both** sections with matching `-cn` suffixed ids
- **New pages** should stay self-contained single files and follow the same
  mobile-friendly basics (viewport meta, no hover-dependent core functions)
- **Homepage edits by concern**: content/structure → `index.html`, visuals →
  `css/style.css`, behavior → `js/main.js`. Class names and element ids are the
  contract between the three files — rename in all of them or not at all

## Workflow

- Conventional Commits (`fix:`, `docs:`, `chore:` ...), split unrelated changes into
  separate commits
- No build/test gates exist — verify changes by opening pages in a browser
  (desktop + narrow/mobile width) before committing
- CSS/HTML comments in English
