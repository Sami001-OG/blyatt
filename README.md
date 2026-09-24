# Aster — 3D engineering portfolio

Aster is a responsive, single-page portfolio starter built around a time-aware Three.js environment. The interface is designed to keep the written content useful even when the canvas is unavailable, motion is reduced, or a visitor is on a small device.

## Stack

- React 19 and TypeScript
- Vite 6
- Three.js for the modular environment scene
- CSS design tokens and responsive layouts
- Playwright for browser-level validation

## Local development

```bash
npm install
npm run dev
```

The app is intentionally asset-light. It does not require API keys, a database, or a remote image service to run.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

## Content and identity

The supplied specification did not include a real name, employer, project history, metrics, or verified social links. To avoid inventing those details, the app uses the Aster practice name and three clearly labeled concept studies. Replace the data in `src/data/projects.ts`, the contact address in `src/App.tsx`, and the page metadata in `index.html` before publishing.

## Architecture

- `src/App.tsx` owns page composition, navigation state, scroll progress, and the project dialog.
- `src/components/SceneCanvas.tsx` owns the Three.js scene, pointer picking, camera interpolation, and local-time lighting.
- `src/data/projects.ts` keeps project content separate from presentation.
- `src/lib/environment.ts` maps browser-local time to atmospheric tokens.
- `src/hooks/` contains small browser-facing hooks for local time and reduced motion.
- `src/styles/global.css` contains the tokenized visual system and responsive compositions.

## Accessibility and fallback behavior

All primary information is rendered in semantic HTML. The canvas is decorative and hidden from assistive technology, while the project cards and dialog provide equivalent interactions. `prefers-reduced-motion` disables camera drift and simplifies transitions. If WebGL initialization fails, a CSS orbital fallback appears and the content remains interactive.

## Performance notes

The Three.js scene is lazy-loaded, pixel ratio is capped, resize updates are centralized, rendering pauses while the tab is hidden, and no remote textures or fonts are required. The scene uses a small collection of reusable geometries and a capped star field rather than an unbounded particle system.

## Deployment

The `dist` directory produced by `npm run build` is a static deployment artifact suitable for Vercel, Netlify, Cloudflare Pages, or any static host. Configure the final domain and contact details before launch.
