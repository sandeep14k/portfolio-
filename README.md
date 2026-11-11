# Sandeep — Portfolio

A responsive, buildless portfolio in `dist/` using HTML, CSS, and vanilla JavaScript.

## Preview

From this directory, run `python3 -m http.server 4173 --directory dist`, then visit http://localhost:4173.

## Edit

- `dist/index.html`: page content and project artwork
- `dist/style.css`: responsive styles, typography, motion
- `dist/script.js`: project details, filters, copy interaction
- `.openai/hosting.json`: Sites deployment configuration

Project artwork is conceptual and not a screenshot of the live applications. Built projects and contributions are distinguished explicitly. Contact uses the verified GitHub account; no email address, employment history, or performance metrics are assumed. Mahavir Fashion has no verified public project URL yet.

## Design research

- https://brittanychiang.com — readable hierarchy, clear project context, accessible interaction
- https://www.adhamdannaway.com — distinct introduction and work-first navigation
- https://www.creativebloq.com/portfolios/examples-712368 — editorial layouts and project-led presentation

## Project references

- https://github.com/sandeep14k
- https://elewin.in
- https://onebrain.app
- https://spo.iitk.ac.in
- https://github.com/sandeep14k/chinar_admin

The site has no JavaScript runtime dependencies. Google Fonts is optional; system fallbacks are configured. Clipboard behavior requires a secure origin and includes a manual-copy fallback. Motion honors prefers-reduced-motion.

## 3D experience

`dist/scene.js` renders a lit ring sculpture with native WebGL, locally generated mesh geometry, perspective, and depth testing. Drag or use arrow keys to rotate; Home and Reset restore the view. Pause stops the automatic rotation. Reduced-motion preferences disable automatic motion, and rendering sleeps when the scene or browser tab is hidden. The original SVG remains the fallback when WebGL is unavailable. No external 3D runtime is required.

Resume details are awaiting a user-provided document and have not been inferred.
