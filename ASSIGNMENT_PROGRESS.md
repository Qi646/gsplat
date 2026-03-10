# Assignment Progress

Last updated: 2026-03-10

This file tracks current progress against [ASSIGNMENT.md](./ASSIGNMENT.md). Update it whenever MVP scope, optional extras, or deliverable status changes.

## Summary

- MVP requirements: 4/4 implemented in the root app.
- Optional extras from `ASSIGNMENT.md`: 4/10 fully implemented, 2/10 partially implemented.
- Deliverables: repo + README are present; demo recording and one-page design note are still pending.
- Latest validation on 2026-03-10: `npm test` and `npm run build` passed at the repo root.

## MVP Requirements

| Assignment item | Status | Current state |
| --- | --- | --- |
| 1. Load and render a scene Gaussian splat | Implemented | The app loads public `.ply`, `.splat`, and `.ksplat` scene URLs, browser-selected local `.ply` / `.splat` / `.ksplat` files, plus same-origin cached presets. It shows loading progress, FPS, and splat count, includes `Frame Scene` and `Reset View`, and now frames both presets and arbitrary URL/local loads with the same deterministic bounds-fitting algorithm rather than preset-specific camera overrides. Caveat: scene loading is still non-progressive, so the scene stays hidden until processing completes and the progress bar resets when download switches to processing. |
| 2. Scene navigation controls | Implemented | Orbit / pan / zoom are available through the shared camera controls, and `Walk Mode` provides fly-style WASD + mouse-look navigation with pointer lock. Press `2` or click `Walk Mode` to capture the cursor immediately, press `1` to return to Inspect mode, and the top bar now shows the current navigation mode. `Z/C` roll the camera around its current view axis in both Inspect and active Walk mode, mouse look preserves arbitrary roll, and `Q/E` follow the camera-local up axis so walk mode stays coherent after inverted views. |
| 3. Camera path recording | Implemented | Users can add keyframes, delete them, reorder them, scrub the path, preview playback, and inspect a toggleable in-view path/frustum overlay. Playback uses Catmull-Rom position interpolation, quaternion slerp, FOV interpolation, and fixed smoothstep ease-in/out timing, while the shared frustum gizmos now clamp their on-screen size when zoomed in and around tightly clustered keyframes to reduce overlap. Saved path JSON now writes the original v1 schema while still accepting older v2 imports that may contain deprecated `sceneRotation`. Caveat: keyframe timing is not directly editable beyond reorder + scrub. |
| 4. Render-to-video export | Implemented | `Export MP4` renders the recorded path into same-origin backend FFmpeg jobs, shows client-driven progress, supports explicit cancel, and now exposes deterministic export settings through built-in `720p`, `1080p`, and `720p + 1080p Batch` profiles plus FPS and file-base controls. |

## Optional Extras

| Optional item | Status | Current state |
| --- | --- | --- |
| Cinematic presets | Not implemented | No one-click turntable, dolly-in, crane-up, or figure-8 path presets exist. |
| Quality modes | Not implemented | No Fast / High render-quality mode switch exists in the product UI. |
| Auto-exposure / tone mapping | Not implemented | No exposure, brightness, contrast, or tone-mapping controls exist. |
| LOD / point budget slider | Implemented | The new `Performance` section adds an `Adaptive FPS` toggle plus target-FPS slider (`15-60`, step `5`). When enabled, live viewing automatically caps the rendered gaussian budget to stay near the selected FPS target, reports the live `rendered / total` count plus budget percentage, and works in both the default `mkkellogg` path and the SparkJS comparison path. MP4 export temporarily disables the cap and renders full quality before restoring the prior live budget. |
| Timeline editor | Partial | The app has a scrubber, explicit move-up / move-down / delete controls, and a toggleable viewer overlay for path and keyframe frustum visuals, but not draggable keyframe times or a full timeline editor. |
| Easing curves | Partial | Playback uses a fixed global smoothstep easing curve, but there is no per-segment or user-selectable easing mode. |
| Path smoothing | Not implemented | Spline interpolation is built into playback, but there is no user-adjustable smoothing control or previewable smoothing strength. |
| Deterministic export | Implemented | The export panel can now save a `camera-export-plan.json` document that stores the current camera path plus the selected export profile, FPS, and output base name. Loading that document restores both path and export settings, so rerunning export on the same scene reproduces the same MP4 target list and timing. |
| Progress + cancellation | Implemented | Export progress remains visible through rendered/uploaded frame counts plus a final encode phase, and the UI now exposes a `Cancel` button that aborts the active request, deletes the live backend FFmpeg job, and returns the viewer to its pre-export state. |
| Batch export | Implemented | The export panel now includes a `720p + 1080p Batch` profile that renders the same recorded path into two sequential MP4 jobs and downloads both files with deterministic suffixed names. |

## Deliverables

| Deliverable | Status | Current state |
| --- | --- | --- |
| Repo + README with one-command run | Implemented | The root workspace is documented in `README.md`, and `npm run dev` is the primary one-command local run path. |
| 30-90s demo recording | Not implemented | No committed demo recording was found in the repo. |
| <= 1 page design note | Not implemented | No committed design note was found in the repo. |
| README extras list | Implemented | `README.md` now includes an `Implemented Optional Extras` section covering adaptive FPS, deterministic export plans, and the new cancelable batch export workflow. |

## Additional Non-MVP Work

These items are beyond the MVP and do not map directly to the assignment's optional-extra checklist, but they are implemented and should still be maintained:

- Same-origin preset caching for mixed-format sample assets, including the lightweight `Luigi` `.ply` preset.
- An opt-in SparkJS renderer path for comparison and diagnostics alongside the default `mkkellogg` renderer.
- Robust sampled scene bounds plus adaptive near/far camera frustum updates for more stable framing and close inspection, including a tighter `5%-95%` framing fallback when `1%-99%` bounds are visibly inflated by outliers.
- A shared deterministic projected-box framing helper used by both renderer adapters instead of preset-specific framing overrides.
- Roll-preserving quaternion walk mode plus backward-compatible camera-path import for older v2 files with deprecated `sceneRotation`.
- A toggleable screen-space overlay for camera path lines, numbered keyframes, and keyframe frustum visuals in the viewer, with adaptive frustum sizing to stay readable during close inspection.
- A deterministic local smoke fixture plus browser-debug hooks used by the Playwright regression harness.
- Browser-selected local scene files now load through explicit-format object URLs in both renderer adapters instead of relying on extension parsing from `blob:` URLs.
