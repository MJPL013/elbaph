# Elbaph Fantasy Sky-World Asset Prompts

These are future production prompts only. No generated file is currently loaded by
the application. Generate and review source masters before extending the runtime
texture manifest.

## Shared Direction

Use case: stylized-concept
Asset type: WebGL game texture for Elbaph, a handcrafted fantasy sky-world portfolio
Style/medium: hand-painted low-poly anime diorama, broad readable shapes, soft
pastels, restrained painterly variation, compatible with three-band toon shading
and dark ink outlines
Constraints: flat albedo only; no baked light, shadows, ambient occlusion,
reflections, normals, depth, metallic shine, text, logos, trademarks, watermark,
or photorealistic micro-detail

## 1. Fantasy Surface Atlas

Planned source: art-source/fantasy/fantasy-surface-atlas.png
Planned runtime ID: fantasy.surface-atlas

Primary request: a four-quadrant atlas containing cloud-soft ivory grass,
blue-green crystal meadow, coral mushroom garden, and gold-lantern moss terrain
Composition: flat orthographic surfaces with 16-pixel safe gutters; each quadrant
must tile seamlessly on every edge
Palette: warm ivory, sage, teal, coral, lavender, muted gold
Avoid: individual realistic grass blades, obvious focal objects, perspective,
baked highlights, large cracks, or noisy gravel

## 2. Enchanted Pathway Atlas

Planned source: art-source/fantasy/fantasy-path-atlas.png
Planned runtime ID: fantasy.path-atlas

Primary request: four seamless painted path strips for Experience, AI Projects,
Creative, and Contact
Subject: broad rounded stone and magical inlay shapes with blue, teal, coral, and
gold district accents
Composition: top-down orthographic atlas, straight center flow, matching ends,
16-pixel gutters, empty margins for clean UV packing
Avoid: arrows, lettering, tiny runes, perspective, baked glow, shadows, or dirt
that reduces readability at distant camera scale

## 3. Foliage and Crystal Decals

Planned source: art-source/fantasy/fantasy-foliage-decals-source.png
Planned runtime ID: fantasy.foliage-decals

Primary request: an atlas of 16 isolated fantasy foliage and crystal motifs:
rounded leaves, grass tufts, mushrooms, five-sided crystals, tiny flowers, and
moss curls
Scene/backdrop: perfectly flat solid #ff00ff chroma-key background
Composition: orthographic isolated subjects, generous padding, consistent toy
scale, crisp silhouettes
Constraints: background must be one uniform color with no shadows, gradients,
texture, floor, or reflections; do not use #ff00ff in the subjects
Avoid: text, thin hair-like edges, semi-transparent materials, realism, watermark

## 4. Landmark Emblem Atlas

Planned source: art-source/fantasy/landmark-emblems-source.png
Planned runtime ID: fantasy.landmark-emblems

Primary request: 13 bold hand-painted emblems representing energy, thermal
science, learning, civic information, archives, agents, solar design, challenge,
research, personal creativity, identity, skills, and contact
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background
Composition: uniform square cells, centered silhouettes, generous safe gutters
Palette: existing Elbaph teal, coral, sage, gold, blue, graphite, and ivory
Constraints: no words, initials, company marks, numbers, logos, fine data, or
extra symbols; do not use #00ff00 inside an emblem

## 5. Windows and Poster Atlas

Planned source: art-source/fantasy/fantasy-facade-atlas.png
Planned runtime ID: fantasy.facade-atlas

Primary request: an atlas containing warm fantasy windows, research screens,
blank notice boards, celestial posters, and decorative doorway panels
Style: broad shapes readable on small toon buildings; cyan glass, honey frames,
coral and sage poster blocks
Composition: flat front view, consistent scale families, 16-pixel gutters
Constraints: blank sign centers for deterministic HTML or canvas lettering later;
no generated words, fake glyphs, logos, baked glow, perspective, or watermark

## 6. Cloud and Wisp Sprite Atlas

Planned source: art-source/fantasy/cloud-wisp-sprites-source.png
Planned runtime ID: fantasy.atmosphere-sprites

Primary request: isolated soft cloud puffs, rounded wind curls, gold spirit wisps,
and small five-point star motes
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background
Composition: centered sprite cells with generous transparent-safe gutters and
clean silhouettes
Constraints: no cast shadow, reflection, floor plane, text, logos, realistic
smoke, or #00ff00 within sprites

## Future Integration Gate

1. Generate source masters and remove chroma-key backgrounds where required.
2. Review seams, gutters, silhouette clarity, and accidental baked lighting.
3. Produce KTX2 plus WebP fallback and low-quality variants.
4. Add files and IDs to the texture manifest only after outputs exist.
5. Run build, visual verification, mobile/low-quality screenshots, and size report.
