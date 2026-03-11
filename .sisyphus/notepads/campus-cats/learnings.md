# Design Updates

- Redesigned `index.html` to match "Archival/Kinetic Editorial" style from `cat主页5.html`.
- Replaced glassmorphism cards with organic blob containers (`.cat-blob`) and archival info tags (`.cat-info`).
- Updated typography to Inter and Space Mono.
- Added global grain overlay with SVG turbulence filter.
- Mapped all 6 cats to new "Department" roles (e.g., Library Guardian -> LIBRARY DEP.).
- Preserved physics-based interaction while updating the visual container (`.cat-card` is now transparent wrapper).

## P5.js Interaction in React
- When using `react-p5`, interaction events like `mouseClicked` receive the `p5` instance as an argument.
- `p5.mouseX` and `p5.mouseY` in WEBGL mode are relative to the top-left corner of the canvas, but the coordinate system origin (0,0) is at the center of the canvas.
- To convert mouse coordinates to WEBGL world coordinates (at z=0), subtract `width/2` and `height/2`.
- Hit detection in 3D scenes (WEBGL) can be approximated by reversing transformations if the objects are mostly flat or aligned with the screen plane.
- For `rotateX`, the Y coordinate on screen is compressed by `cos(angle)`. To check hit against world Y, divide screen Y by `cos(angle)`.

## Wouter Integration
- `useLocation` hook provides `[location, setLocation]`.
- `setLocation` can be called from within p5 event handlers to trigger navigation.
