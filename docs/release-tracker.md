# Elbaph Release Tracker

This file records what each published Elbaph version contains. Add new releases
above older entries and describe the shipped behavior, architecture, verification,
and known limitations rather than relying on the Git commit subject alone.

## v0.01.03 - Fantasy Sky-World Visual Upgrade

- Release date: 2026-07-17
- Package SemVer: 0.1.3
- Target branch: main
- Previous published baseline: 165136f
- Release commit subject: v0.01.03 Visual upgrade: add clouds, colour and reliable controls
- Release status: verified release payload; publication target is origin/main

### User-visible changes

- Reworked the plain planet into a pastel fantasy sky-world while preserving the
  toon shader, ink outlines, treadmill movement, portfolio buildings, and Goku/Nimbus.
- Changed the base planet surface to sage and added four district biome patches.
- Added four curved district pathways that follow the spherical planet.
- Added deterministic instanced scenery: trees, crystals, mushrooms, rocks,
  lanterns, grass clusters, and small floating islands.
- Added a curated spawn-area prop ring so the first camera view is populated.
- Added a gradient sky shader, atmospheric fog, orbiting clouds, golden spirit
  wisps, and warm/cool directional lighting.
- Added quality-tier density reductions for medium, mobile, and low-quality devices.
- Added a branded full-screen "Calling the Nimbus" loading gate.

### Goku loading reliability

- Moved GLB preloading before the React application mount.
- Removed the extra lazy-loaded Avatar JavaScript boundary.
- Added explicit loading, retrying, ready, and error states.
- Added one automatic GLB retry after clearing the Drei loader cache.
- Added a manual "Retry Goku" recovery action if the automatic retry also fails.
- Gameplay controls remain disabled until the real model is mounted and sized.
- Cold-load verification confirms the model appears without refreshing.

### Input and movement reliability

- Fixed stuck W/A/S/D and arrow-key movement when the webview loses focus before
  receiving a keyup event.
- Keyboard state now clears on window blur, page hide, and document visibility loss.
- Pointer-drag state follows the same focus-loss cleanup behavior.
- Added a browser regression test covering W, A, S, D, and pointer drag; measured
  post-blur planet-rotation drift is zero for every tested input.
- Preserved fixed-character treadmill movement, collision blocking, camera follow,
  interaction freeze, and viewport-relative controls.

### Modular architecture changes

- Pure movement and spherical math remain under src/game without React or visual imports.
- World placement and landmark visual metadata moved to src/world/landmarkData.ts.
- Avatar asset loading moved to the replaceable visual layer.
- TreadmillPlanet now owns only input, collision decisions, and planet quaternion updates.
- TreadmillPlanet receives world entities and visuals through a typed child contract.
- Landmark and filler entities now compose independent visual and collider children.
- Decorative fantasy scenery is non-collidable and cannot register gameplay colliders.
- The replaceable visual package is under src/components/visuals and is divided into
  planet composition, atmosphere, fantasy prop placement, path generation, and lighting.
- Shared toon material allocation remains centralized; visual modules do not allocate
  duplicate scenery materials.
- Added typed contracts for avatar state, collider registration, world motion,
  visual quality, ambient placement, and quarter paths.
- Added an architecture verifier enforcing layer imports, collider ownership,
  material reuse, renderer independence, and the 200-line source-file limit.

### Art pipeline documentation

- Added docs/art/fantasy-sky-world-prompts.md.
- Prepared production prompts for surface, pathway, foliage/crystal, landmark-emblem,
  facade, and cloud/wisp texture atlases.
- Generated raster textures are intentionally not included or referenced at runtime.
- Future integration remains gated on generation, visual review, KTX2/WebP conversion,
  low-quality variants, runtime manifest registration, and size verification.

### Verification evidence

The release passed:

- npm run build
- npm run verify:architecture
- npm run verify:avatar
- npm run verify:focus-input
- npm run verify:visual
- npm run verify:content
- npm run verify:render
- npm run verify:movement
- npm run verify:relative-movement
- npm run verify:collision
- npm run verify:camera
- npm run verify:state
- npm run verify:layout
- npm run report:size
- git diff --check

Verified visual/runtime measurements:

- Renderer triangles: 79,633
- Renderer calls: 591
- Kazam triangles: 1,328
- Kazam draw calls: 15
- Production JavaScript: approximately 1.34 MB
- Goku/Nimbus GLB: approximately 416.3 KB
- Focus-loss drift for W/A/S/D and pointer drag: 0

### Release inventory

Created:

- Modular entity/collider components.
- Replaceable fantasy visual, atmosphere, lighting, path, prop, and diagnostic modules.
- Avatar error boundary and avatar state store.
- World-layer contracts and relocated landmark placement source.
- Architecture, avatar recovery, and focus-loss verification scripts.
- Fantasy image-generation prompt documentation.
- This release tracker.

Updated:

- Application bootstrap, loading overlay, character loading, world scene composition,
  treadmill controller, planet surface, HUD/debug diagnostics, keyboard/pointer input,
  content/layout/visual verification, README, and package scripts.
- Package version updated from 0.1.0 to npm-compatible 0.1.3.

Removed or relocated:

- src/game/avatarAsset.ts moved into the visual avatar package.
- src/game/landmarkData.ts moved to src/world/landmarkData.ts.
- The separate lazy Avatar JavaScript chunk is no longer required.

### Deliberately excluded

- The existing untracked AGENTS.md is not part of this release.
- dist, node_modules, screenshots, logs, and .agents artifacts are not committed.
- No generated texture atlas, backend, database, physics engine, or new personal
  portfolio facts are included.

## Published history before the tracker

These milestones predate the version tracker and retain their original commit identities:

- 165136f - Build stylized asset pipeline and Kazam hero station
- 849f23a - Add Render deployment config
- 9b40c0b - Initial 3D portfolio planet
