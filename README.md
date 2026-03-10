# gsplat_1

Root workspace for the Gaussian Splat Viewer take-home app in [ASSIGNMENT.md](./ASSIGNMENT.md).

The active product code lives at the repo root in `client/` and `server/`. The imported `gsplat-viewer/` tree is kept as reference material and should not be treated as the current app.

## Current Status

- MVP requirements in `ASSIGNMENT.md`: 4/4 implemented in the root app.
- Optional extras in `ASSIGNMENT.md`: 4/10 fully implemented, with partial progress on timeline editing and easing.
- Deliverables: the repo + README are present; the demo recording and one-page design note are still pending.

Precise requirement-by-requirement status lives in [ASSIGNMENT_PROGRESS.md](./ASSIGNMENT_PROGRESS.md). Keep that file updated whenever implementation or deliverable status changes relative to `ASSIGNMENT.md`.

## Implemented Optional Extras

- Adaptive FPS / point-budget control: the `Performance` panel can cap live rendered gaussians automatically to stay near a selected target FPS. It is off by default, works in both renderer adapters, and MP4 export temporarily disables it so exported frames stay full quality.
- Deterministic export plans: the export panel can now save a `camera-export-plan.json` file that captures the current camera path plus the selected export profile, FPS, and output base name. Loading that plan restores the path and export settings so the same scene can be re-exported deterministically.
- Export cancellation and batch export: the export panel now supports explicit cancel during active rendering/encoding plus a built-in `720p + 1080p Batch` profile that renders and downloads multiple MP4 targets in one run.

## Repo Layout

```text
.
├── ASSIGNMENT.md           # take-home brief and evaluation criteria
├── ASSIGNMENT_PROGRESS.md  # precise progress tracker against the assignment
├── client/                 # active Vite + TypeScript frontend
├── server/                 # active Express backend
├── gsplat-viewer/          # imported reference implementation, kept for reference only
└── AGENT_MEMORY.md         # durable implementation notes and milestones
```

## Prerequisites

- Node.js 18+
- FFmpeg on `PATH`

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

The Vite dev server proxies API requests to the Express server on `http://localhost:3001`.

If `npm install` fails because of a local npm cache permissions issue, retry with:

```bash
npm install --cache /tmp/npm-cache-gsplat-1
```

## Commands

```bash
npm run dev      # client + server in watch mode
npm test         # client + server unit tests
npm run build    # production client and server builds
npm run playwright:install:firefox  # install the local Playwright Firefox binary
npm run test:e2e:firefox            # Firefox browser regression test against the built app
npm start        # serve the production build from server/dist
```

Useful manual checks:

```bash
curl http://localhost:3001/api/health
curl -I http://localhost:5173/
curl -I http://localhost:3001/
```

Renderer comparison checks:

```bash
http://localhost:5173/?renderer=mkkellogg&viewerMode=default&scene=/test-assets/smoke-grid.ply
http://localhost:5173/?renderer=mkkellogg&viewerMode=compat&scene=/test-assets/smoke-grid.ply
http://localhost:5173/?renderer=spark&scene=/test-assets/smoke-grid.ply
http://localhost:5173/?renderer=mkkellogg&scene=/api/presets/luigi.ply
http://localhost:5173/?renderer=spark&scene=/api/presets/truck.ksplat
```

## Firefox Regression Check

First-time setup:

```bash
npm run playwright:install:firefox
```

Routine rerun:

```bash
npm run test:e2e:firefox
```

Notes:

- The script builds the app, starts the production server on port `3310`, and runs the Playwright Firefox project from `e2e/viewer-render.spec.ts`.
- Failure artifacts are written under `test-results/` as screenshots, videos, and traces.
- If the suite fails before any scene load with `Init error: Error creating WebGL context.`, that demonstrates a real Firefox/WebGL compatibility failure in the current host environment, but it does not by itself prove an app-logic regression. Confirm that headless Firefox on the machine can create a bare `webgl` context before treating that failure as viewer-specific.
- To inspect a trace, run `npx playwright show-trace test-results/<test-output-dir>/trace.zip`.

## Implementation Notes

- `client/src/viewer/SceneViewer.ts` wraps `@mkkellogg/gaussian-splats-3d` through the package's `rootElement` + `getSplatMesh()` API surface, disables the package's built-in controls, and owns scene loading, render loop, framing, resizing, and FPS tracking.
- `client/src/viewer/createViewerAdapter.ts` selects the active viewer adapter from the runtime query. The default adapter remains `@mkkellogg/gaussian-splats-3d`, while `client/src/viewer/SparkSceneViewer.ts` provides an opt-in SparkJS comparison path.
- `client/src/viewer/orbitControls.ts` now centralizes the shared app-owned camera-control setup and target/up-vector sync logic used by both renderer adapters so free inspection and walk mode stay aligned.
- `client/src/lib/robustSceneBounds.ts` computes trimmed scene bounds from sampled splats so initial framing is less sensitive to outlier points in dense scenes. It now compares both a wide `1%-99%` box and a tighter `5%-95%` box, and prefers the tighter framing when the wide candidate is materially inflated by outliers.
- `client/src/viewer/sceneFraming.ts` applies one shared deterministic framing algorithm across both renderers: it fits the chosen bounds box exactly against the current camera FOV/aspect by projecting the box corners into a canonical camera basis instead of relying on preset-specific default views.
- `client/src/viewer/viewerRuntime.ts` keeps compatibility mode as the normal startup path, reserves `?viewerMode=default` as the explicit fast shared-memory diagnostic override when cross-origin isolation is available, and keeps the default renderer on the safer floating-point sort settings (`integerBasedSort: false`, `splatSortDistanceMapPrecision: 20`) in both runtime branches.
- `client/src/viewer/adaptiveCameraFrustum.ts` derives scene-aware camera near/far planes from the current robust scene bounds, and both renderer adapters re-apply those planes as the camera moves so close inspection can get materially nearer without relying on fixed `0.1 / 1000` clipping planes.
- `client/src/controls/WalkControls.ts` and `client/src/controls/navigationMode.ts` now run walk mode as an `inactive` -> `armed` -> `active` state machine with direct mode switching: pressing `2` or clicking `Walk [2]` requests pointer lock immediately, pressing `1` returns to Inspect mode, and inspect/walk state is shown by top-bar button highlight (`⬡ Inspect [1]` and `⬡ Walk [2]`). `Z/C` rolls the camera around the current view axis in both Inspect and active Walk mode, mouse look preserves arbitrary camera roll, `W/S` move forward/back along the camera look direction, `A/D` strafe, `Q/E` follow the camera-local up axis, and leaving walk mode hands control back to the default camera controls without changing the live camera pose.
- `client/src/lib/sceneFormat.ts`, `client/src/lib/sceneSource.ts`, `client/src/lib/scenePresets.ts`, and `client/src/main.ts` isolate scene-format detection, explicit-format local/blob scene sources, the preset catalog, and the shared app wiring for scene loading, framing, camera paths, and export controls.
- `client/src/lib/runtimeQuery.ts` and the `window.__GSPLAT_DEBUG__` hook expose test-only startup overrides and viewer diagnostics for browser regression coverage; no `viewerMode` query now means the compatibility default, while `viewerMode=default` explicitly opts into the fast path for diagnostics. The per-renderer debug snapshot now also includes the active camera `near` / `far` planes.
- `renderer=spark` switches the viewer adapter to SparkJS for renderer A/B comparisons. `viewerMode` only affects the default `mkkellogg` path.
- `client/src/path/PathInterpolator.ts`, `client/src/path/KeyframeManager.ts`, `client/src/path/cameraPath.ts`, and `client/src/path/agenticPath.ts` own manual keyframe capture, prompt-driven orbit generation, interpolation, preview playback, and path JSON serialization. Saved paths now write camera-path JSON v1, while the importer still accepts older v2 files and ignores the deprecated `sceneRotation` field.
- `client/src/path/cameraPathVisuals.ts` and `client/src/path/CameraPathOverlay.ts` project the recorded camera path into a shared SVG overlay so both renderer adapters show the same numbered keyframes, movement path, and zoom-aware frustum gizmos.
- `client/src/export/exportPlan.ts` defines the saved export-plan document format plus the available export profiles (`720p`, `1080p`, and `720p + 1080p Batch`) and the deterministic filename/profile resolution used by the UI.
- `client/src/export/ExportManager.ts` now renders the active camera path into PNG frames for one or more export targets, uploads them to the backend export job(s), supports explicit cancellation, and restores the live viewer state after success, cancel, or failure.
- `client/src/performance/AdaptiveRenderBudgetController.ts` owns the optional live-only adaptive FPS controller. `client/src/main.ts` drives it from the shared stats loop, and both renderer adapters expose a shared `setRenderBudget()` seam so the current sorted/visible splat count can be capped consistently.
- `server/src/presetArchive.ts` caches preset assets under `/tmp/gsplat-presets`, mixing archive-backed verified `.ksplat` entries with direct-download `.ply` presets behind the same preset routes exposed by `server/src/app.ts`.
- `server/src/exportService.ts` owns FFmpeg export jobs and powers `/api/export/jobs`, `/api/export/jobs/:jobId/frame`, `/api/export/jobs/:jobId/finalize`, and `/api/export/jobs/:jobId`.

## Current Expected Behaviour

- Scene loads are single-scene. Loading a preset, URL, or local file replaces the previously loaded scene.
- The scene panel now supports local `.ply`, `.splat`, and `.ksplat` file selection in addition to public/same-origin URLs and cached presets. Local files are loaded through browser object URLs with the file extension carried through explicitly for both renderer adapters.
- Scene loading is currently non-progressive. The scene is not visible until processing completes.
- The progress bar reflects download progress first, then resets to `0%` when the loader switches into processing. The UI does not yet expose granular processing sub-steps.
- Once the UI reaches `loaded`, the viewer is expected to have framed a visible scene. Loads that resolve with zero splats or invalid bounds now fail into the error state instead of reporting a false `loaded` status.
- The preset tab now serves cached same-origin `Luigi` (`.ply`), `Garden` (`.ksplat`), `Stump` (`.ksplat`), and `Truck` (`.ksplat`) scenes from `/api/presets/:presetId.:extension` routes backed by the server cache under `/tmp/gsplat-presets`.
- Initial framing and `Frame Scene` now use robust sampled bounds that ignore low-alpha outliers before falling back to the raw mesh bounding box. Once a bounds box is chosen, both renderers use the same deterministic projected-box fit, so presets and arbitrary URL loads are framed by the same algorithm instead of preset-specific default views.
- Camera near/far planes now adapt from the current robust scene bounds and camera distance in both renderer adapters, so close inspection is no longer limited by the previous fixed `0.1 / 1000` frustum.
- The app serves cross-origin isolation headers in both the Vite dev server and the Express production server so the faster shared-memory worker path remains available for explicit diagnostics.
- Normal startup now uses the compatibility `mkkellogg` runtime by default because the fast path still renders blank in at least some real environments.
- The default `mkkellogg` runtime now keeps the safer floating-point sort configuration (`integerBasedSort: false`, `splatSortDistanceMapPrecision: 20`) in both normal compatibility startup and the explicit `?viewerMode=default` fast-path diagnostic mode.
- Normal startup still uses the `mkkellogg` renderer by default. `?renderer=spark` is an explicit diagnostic path for comparing the same assets against SparkJS.
- Scene loads preserve source orientation. The app no longer applies preset-specific rotation overrides, default views, or manual scene-orientation controls.
- `?viewerMode=default` explicitly requests the faster shared-memory path for diagnostics; if cross-origin isolation is unavailable, the viewer falls back to compatibility mode and reports that state. `?viewerMode=compat` explicitly requests the slower compatibility path.
- SparkJS scene loads currently use Spark's own render path plus local download/progress wiring; the app surfaces the active renderer in the status note and debug snapshot for A/B verification.
- Successful scene changes clear the current camera path so keyframes remain scene-specific.
- Once a scene is loaded and at least one keyframe exists, `Path Visuals` is enabled by default and overlays numbered keyframe markers, frustum gizmos, and the interpolated movement path in the viewer. Frustum gizmos now clamp their on-screen size as you zoom in and shrink around tightly clustered keyframes to reduce overlap. The toggle hides or restores those visuals without changing the underlying keyframes.
- Both renderer adapters now use the app's own unconstrained trackball-style camera controls instead of mixing app-owned walk mode with renderer-owned updates. Walk mode no longer re-aims the camera back toward a stale target on each render tick.
- Walk mode now captures the cursor immediately from the initiating user gesture: pressing `2` or clicking `Walk [2]` requests pointer lock without an extra viewer click, and the top bar uses button highlights (`⬡ Inspect [1]` and `⬡ Walk [2]`) to show whether inspect or walk is currently active. `Z/C` roll the camera around its current view axis in Inspect and active Walk mode, `W/S` move in the current view direction, `A/D` strafe, `Q/E` move along the current camera-local up direction, `Frame Scene` / `Reset View` pause until walk mode exits, and leaving walk mode restores the current camera-control view without shifting the camera pose that was visible in walk mode.
- Walk-mode mouse look is roll-aware, so entering walk mode from an inverted camera pose no longer forces yaw/pitch behavior back through a world-up Euler decomposition.
- Press `K` to capture a keyframe from the active camera pose; this matches the **+ Add Keyframe** action.
- The Camera Path panel now includes prompt-driven orbit generation. It captures the current view plus four scout views, sends them to the server vision planner, triangulates a subject anchor locally, and appends ordinary keyframes back into the existing path. While that flow runs, the UI shows capture/planning progress, blocks viewer interaction so the scout-camera moves are explicit, offers a visible `Cancel` action, and fails closed with a client timeout that restores controls if the flow stalls.
- You can run the app without any AI credentials via `npm run dev` or `npm start`. In that mode, scene loading, manual keyframes, preview, and MP4 export still work, while the prompt-driven orbit controls stay disabled and explain that `OPENAI_API_KEY` is not configured.
- To enable prompt-driven orbit generation in development, start the app with `OPENAI_API_KEY=your_key npm run dev`. To enable it against the production build, use `OPENAI_API_KEY=your_key npm run build` followed by `OPENAI_API_KEY=your_key npm start`.
- To use the prompt flow, load a scene such as `Truck`, enter a request like `Do a cinematic path around this truck, with the camera focused on the truck all the way around.`, click `Generate Path`, then click `Preview` or `Export MP4`.
- Path import and path editing controls remain disabled until a scene has loaded successfully.
- Saved camera paths now write the original v1 schema. The importer accepts both legacy v1 JSON and older v2 files, but deprecated v2 `sceneRotation` metadata is ignored. The same load control also accepts `camera-export-plan.json` documents and restores saved export settings when present.
- Agentic path generation is orbit-only in v1. `OPENAI_BASE_URL` and `OPENAI_MODEL` are optional overrides for OpenAI-compatible endpoints when `OPENAI_API_KEY` is configured.
- MP4 export requires a loaded scene plus at least two keyframes. While export is running, scene/path controls and viewer pointer interaction are locked until the job completes or fails.
- The camera-path overlay is viewer-only guidance. It is hidden during export and is not burned into the captured MP4 frames.
- The `Performance` section exposes an optional `Adaptive FPS` toggle plus target slider. When enabled, live viewing can reduce the rendered gaussian budget to stay near the target FPS, and the note reports the live `rendered / total` count plus the current budget percentage.
- `Adaptive FPS` is a live-view optimization only. MP4 export pauses it, renders all frames at full quality, then restores the previous live budget afterward.
- The export panel now exposes deterministic export settings: a profile selector (`720p`, `1080p`, or `720p + 1080p Batch`), an integer FPS input, a file-base input, and a `Save Export Plan` action that writes those settings alongside the current path.
- Export progress is client-driven from rendered/uploaded frame counts plus a final `Encoding MP4 with FFmpeg…` phase. A dedicated `Cancel` button aborts the active request, tells the backend to kill/clean the FFmpeg job, and leaves no partially downloaded MP4 in the UI.
- Batch export runs one target at a time against the same recorded path and downloads each finished MP4 with deterministic file names (`<base>.mp4` for single-target profiles, `<base>-720p.mp4` / `<base>-1080p.mp4` for the batch profile).
- The committed browser smoke fixture lives at `client/public/test-assets/smoke-grid.ply` and is used by the Firefox Playwright regression test.
- In the current host environment, the Firefox browser regression test fails before any scene load begins in both the `?viewerMode=default` and `?viewerMode=compat` paths with `Init error: Error creating WebGL context.` The same symptom can be caused by Firefox lacking WebGL support in headless mode, so interpret it as an environment compatibility failure first and an app regression only after confirming raw Firefox WebGL works on the host.
- The current client build emits a Vite warning from Spark's packaged WASM data URL during bundling, but the build still completes successfully.

## Development Guidance

- Treat `ASSIGNMENT.md` as the scope brief and success criteria.
- Build the real app at the repo root.
- Use `gsplat-viewer/` only as a reference source when porting later milestones.

## Next Milestone

The next milestone is deliverable polish plus Firefox/renderer follow-up:

- capture/update the demo recording and one-page design note around the now-expanded export workflow
- investigate the Firefox `Init error: Error creating WebGL context.` startup failure now captured by the Playwright regression harness
- decide whether any additional optional extras should be added after the core deliverables are documented
