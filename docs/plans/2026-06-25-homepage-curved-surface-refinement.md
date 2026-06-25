# Homepage Curved Surface Refinement

## Goal

Remove visible section numbering and make the homepage feel like a restrained, continuous technical surface with clearer chapter separation.

## Direction

- Replace large `01 / 02 / 03` section numbers with semantic section markers used only for structure and tests.
- Use section seams, subtle surface tones, left guide rails, and short lime guide lines to separate chapters.
- Replace the crosshair pointer background with a concave paper-surface background.
- Let scroll update a depth variable so the background feels like it is moving along a curved surface.

## Interaction

- Pointer movement still adds a very soft local highlight through `--cursor-x` and `--cursor-y`.
- Scroll updates `--scroll-progress` and `--surface-y`.
- Reduced-motion users keep the same visual surface without animated transforms.

## Constraints

- Keep the existing paper, ink, grid, and rare-lime identity.
- Avoid obvious 3D, decorative blobs, or heavy visual effects.
- Avoid layout overflow on desktop and mobile.
