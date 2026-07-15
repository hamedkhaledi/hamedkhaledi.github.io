# Hamed Khademi Khaledi — Resume Site

A clean, modern, dark-mode-aware GitHub Pages site presenting two versions of my resume:

- **`index.html`** — Landing page with a version switcher.
- **`cv.html`** — Industry CV (from `main.tex`).
- **`work.html`** — Academic / Work CV (from `main (1).tex`).

## Live site

**https://hamedkhaledi.github.io/**

## Local preview

Open `index.html` in a browser, or run a local server:

```bash
python -m http.server 8000
# visit http://localhost:8000
```

## Publish to GitHub Pages

The repo `hamedkhaledi.github.io` is a GitHub **user** page, so it is served
from the `main` branch at the repository root — no build step or workflow needed.

```bash
git init
git add .
git commit -m "Add resume site"
git branch -M main
git remote add origin https://github.com/hamedkhaledi/hamedkhaledi.github.io.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / root**.
The site goes live at https://hamedkhaledi.github.io/ within a minute or two.

## Structure

```
.
├── index.html
├── cv.html
├── work.html
├── assets/
│   ├── style.css
│   └── theme.js
└── README.md
```

Source LaTeX resumes (`main.tex`, `main (1).tex`) and PDFs remain in the
project folder and are not required by the site.
