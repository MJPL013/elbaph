# Elbaph

Current tracked release: **v0.01.03** (package SemVer 0.1.3). See [docs/release-tracker.md](docs/release-tracker.md) for the detailed shipped-change record.

Elbaph is an interactive 3D portfolio planet for Manoj Pal. Instead of presenting a static resume page, it turns portfolio content into a small explorable world where visitors move around a spherical city, discover districts, and open structured project panels by interacting with landmarks.

The current version focuses on the professional portfolio layer: internships, AI projects, achievements, skills, identity, and contact points. Personal interests, extracurricular stories, games, shows, and more playful world details are intended to be added in later iterations.

## What We Are Building

- A browser-based 3D portfolio website with game-like traversal.
- A small spherical planet divided into portfolio quarters: Experience, AI Projects, Creative, and Contact.
- Toon-style 3D landmark buildings instead of flat resume cards.
- Clickable portfolio panels with structured content: overview, highlights, technology, metrics, and links.
- A fixed Goku/Nimbus avatar placeholder/final model flow, with the planet moving under the character.
- A lightweight architecture that can later support generated decals, richer 3D assets, and more personal storytelling.

## Current World Structure

- Experience: Kazam Energy, ACAD thermal super-resolution, Naxxatra Sciences.
- AI Projects: Rajneeti.help, VakyaSaar, Agentic AI Persona Architect.
- Creative: Solar Decathlon India, Deep Learning Challenge, SURC, future personal area.
- Contact: Home identity pavilion, skills atlas, contact beacon.

## Tech Stack

- React 19
- TypeScript
- Vite
- Three.js
- @react-three/fiber
- @react-three/drei
- @react-three/postprocessing
- Zustand
- Tailwind CSS via @tailwindcss/vite
- Playwright Core and PNGJS for verification scripts

## Architecture

The app is structured as a small game engine rather than a conventional landing page.

- `src/App.tsx` mounts the full-screen WebGL canvas and HTML overlays.
- `src/components/WorldScene.tsx` composes the game controller, world entities, replaceable visual package, avatar, camera, diagnostics, and post-processing.
- `src/components/TreadmillPlanet.tsx` owns only traversal and collision decisions. It receives entities and visuals through a child contract, so rendering can change independently.
- `src/game/treadmillMath.ts` contains the quaternion math for planet rotation.
- `src/components/LandmarkBox.tsx` anchors each landmark while separate entity components render its visual and register its collider.
- `src/components/scenery/HeroLandmark.tsx` maps portfolio landmarks to 3D building archetypes.
- `src/components/scenery/buildings/` contains the reusable toon 3D building kit and district-specific landmark buildings.
- `src/components/scenery/WorldBillboardLabel.tsx` keeps landmark labels facing the camera so text is readable and not mirrored.
- `src/content/` stores structured portfolio content separate from world placement.
- `src/world/landmarkData.ts` stores placement, quarter, building archetype, footprint, and decal-slot metadata.
- `src/components/visuals/` contains the removable fantasy sky-world package: biome patches, paths, instanced props, atmosphere, and lighting.
- `docs/art/fantasy-sky-world-prompts.md` specifies future generated texture assets without claiming they are loaded at runtime.
- `src/store/` stores global game state with Zustand.
- `scripts/verify-*.mjs` contains browser-based regression checks for rendering, movement, collision, camera behavior, content, and layout.

## Game Mechanics

The movement system uses a treadmill-style planet mechanic:

1. The avatar remains near a fixed world position.
2. Keyboard or mobile joystick input is converted into a viewport-relative direction.
3. The planet group receives inverse quaternion rotation to create the feeling of walking around the sphere.
4. Collision uses lightweight predictive raycasting against landmark colliders.
5. Clicking a landmark freezes traversal and opens the portfolio panel.

No heavy physics engine is used.

## Requirements

- Node.js 20 or newer recommended.
- npm 10 or newer recommended.
- A modern browser with WebGL support.
- Chrome or Microsoft Edge installed if you want to run the Playwright verification scripts locally.

## Setup

Install dependencies:

```bash
npm install
```

Start local development:

```bash
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://127.0.0.1:5173/
```

Build production assets:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Verification

Run the main build:

```bash
npm run build
```

Run individual checks:

```bash
npm run verify:architecture
npm run verify:avatar
npm run verify:layout
npm run verify:render
npm run verify:visual
npm run verify:content
npm run verify:movement
npm run verify:focus-input
npm run verify:collision
npm run verify:camera
npm run verify:relative-movement
npm run verify:state
npm run report:size
```

The verification scripts start a local Vite server and use a local Chromium-compatible browser. If the scripts cannot find Chrome or Edge, set one of these environment variables before running them:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/browser
CHROME_PATH=/path/to/browser
```

## Debug Mode

The public view hides debug wireframes by default.

Enable debug rendering with:

```text
?debug=1
```

You can also press `H` while the app is running to toggle debug colliders and grid helpers.

## 3D Model Attribution

This repo includes the avatar model at:

```text
3d_models/son_goku_and_kintoun_nimbus.glb
```

Model credit:

`Son Goku and Kintoun Nimbus` by Antouss, licensed under Creative Commons Attribution.
Original source: https://skfb.ly/6UAFN
License: http://creativecommons.org/licenses/by/4.0/

The model is kept in the repo because the current avatar loading flow imports it directly into the Vite build.

## Deployment Notes

- `dist/` is generated by `npm run build` and is intentionally not committed.
- The app is a static Vite site after build, so it can be deployed to GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any static host.
- Keep future image/decal assets optimized before committing. `npm run report:size` flags large raster assets.

## Roadmap

- Add generated decal artwork to the 3D buildings.
- Add more personal districts: games, shows, extracurriculars, and personal story.
- Replace or optimize the current avatar if needed.
- Add more environmental density inspired by small-planet browser games.
- Improve mobile interaction polish and loading performance.
