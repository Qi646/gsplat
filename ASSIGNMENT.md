# Take-home Assignment: Scene Gaussian Splat Viewer → Camera Path → MP4 Export
Goal: Build a **scene-focused** 3D Gaussian Splat app: load a **public scene splat** (`.ply`), navigate the scene, record a camera path, then render and export a cinematic MP4.
## Public codebase example (you may use as a starting point)
*   Web scene renderer / viewer: https://github.com/mkkellogg/GaussianSplats3D
*   Reference (optional, for `.ply` attribute understanding): https://github.com/graphdeco-inria/gaussian-splatting
*   MP4 encoding: native **FFmpeg** (recommended)
## Public scene splat files (pick 1–2)
*   Pretrained scenes linked in the 3D Gaussian Splatting repo: https://github.com/graphdeco-inria/gaussian-splatting
## Requirements (MVP)
### 1) Load & render a scene Gaussian splat
*   Load a `.ply` splat of a real **scene** (room/object/area).
*   Show:
    *   loading progress
    *   FPS
    *   gaussian/point count (if available)
*   Provide **Frame Scene** (fit camera to bounds) and **Reset View**.
### 2) Scene navigation controls
*   Orbit / pan / zoom
*   "Walk mode" toggle (WASD + mouse look) *or* a simple fly camera
### 3) Camera path recording (scene-first UX)
*   Buttons:
    *   **Add Keyframe** (captures camera pose + FOV)
    *   **Delete / Reorder**
    *   **Preview Play**
*   Playback must be smooth:
    *   position interpolation (spline)
    *   rotation interpolation (slerp or equivalent)
    *   ease-in/out timing
### 4) Render-to-video export
*   Button: **Export MP4**
*   Defaults: 1280×720, 30 FPS
*   Render frames along the recorded path and export `output.mp4`
*   Show export progress; output must play in VLC/QuickTime
**Recommended approach:** Web viewer renders frames → local helper (Node/Python) runs FFmpeg to encode MP4.
## Optional extra features (implement 1–3)
### Scene/Viewer
*   **Cinematic presets:** one-click "turntable orbit", "dolly-in", "crane-up", "figure-8" camera paths.
*   **Quality modes:** Fast vs High (e.g., internal render scale / splat size / sorting strategy toggle).
*   **Auto-exposure / tone mapping:** simple brightness/contrast controls or exposure curve for nicer video.
*   **LOD / point budget slider:** cap gaussians rendered to maintain target FPS.
### Path & Editing
*   **Timeline editor:** draggable keyframe times + scrubber; show camera frustum gizmos.
*   **Easing curves:** per-segment ease-in/out, or global easing selection (linear / smoothstep).
*   **Path smoothing:** adjustable smoothing strength; preview before export.
### Export / Engineering
*   **Deterministic export:** save a `path.json` + render settings; re-run export produces identical MP4.
*   **Progress + cancellation:** visible percent complete + cancel button without corrupting output.
*   **Batch export:** export multiple resolutions (1080p + 720p) or multiple presets in one run.
## Deliverables
*   Repo + `README` with one-command run (e.g., `npm run dev`, `npm run export`).
*   A 30–90s demo recording: load scene → record path → export → play MP4.
*   ≤ 1 page design note: camera/path representation, export pipeline, and one performance consideration.
*   If you implement extras: list them clearly in the README.
## Evaluation
*   **Scene rendering quality + stability**
*   **Camera path smoothness + scene-oriented controls**
*   **MP4 export reliability (valid file + progress)**
*   **Reproducible setup + clean code structure**
*   **Extra features:** thoughtful UX/perf tradeoffs and polish
