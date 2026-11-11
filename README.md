# Sandeep Kumar Jha — Portfolio

Responsive, buildless portfolio using HTML, CSS, vanilla JavaScript, and native WebGL.

## Preview

Run `python3 -m http.server 4173 --directory dist` from this directory, then visit http://localhost:4173.

## Content and editing

- `dist/index.html`: introduction, ten projects, six skill groups, experience, education, and contact links.
- `dist/style.css`: responsive editorial layout, dimensional project cards, and reduced-motion styles.
- `dist/script.js`: project details, category filters, and email copy with manual fallback.
- `dist/scene.js`: interactive WebGL sculpture, drag/keyboard rotation, pause, reset, and SVG fallback.
- `dist/Sandeep-Kumar-Jha-Resume.pdf`: original supplied resume, available through download links in the hero and contact section.
- `.openai/hosting.json`: existing Sites identity and static deployment configuration.

Resume content and repository links come from `230910_sandeep_kumar_jha_bs_eco.pdf` supplied in the parent workspace. Existing portfolio projects are retained. Technical project metrics are resume-reported results, not independently benchmarked. Project artwork is conceptual rather than product screenshots.

Contact: sandeepkj23@iitk.ac.in. LinkedIn and GitHub links match the supplied resume. No phone number was supplied.

The site has no JavaScript runtime dependencies. Google Fonts is optional with system fallbacks. Clipboard copying requires a secure origin and provides a manual fallback. Motion respects reduced-motion preferences, and the 3D scene sleeps while hidden.

## Validation

Browser checks passed at widths 1440, 768, 390, and 320 pixels with no horizontal overflow or JavaScript errors. Verified project filtering, all four added technical project dialogs and repository links, six skill groups, PDF download and file signature, email clipboard, WebGL controls, and reduced motion. JavaScript syntax checks passed.

## GitHub Pages deployment

Repository: https://github.com/sandeep14k/portfolio-

`.github/workflows/pages.yml` publishes `dist/` on pushes to `main` or manual workflow dispatch. In repository Settings → Pages, the source must be GitHub Actions. The old `.openai/hosting.json` is retained only as historical configuration and is not used by this deployment.
