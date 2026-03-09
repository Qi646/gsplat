# gsplat_1

Root workspace for the Gaussian Splat Viewer take-home app in [ASSIGNMENT.md](./ASSIGNMENT.md).

The active product code lives at the repo root in `client/` and `server/`. The imported `gsplat-viewer/` tree is kept as reference material and should not be treated as the current app.

## Current Status

The root app currently implements the first vertical slice:

- Load public `.ply`, `.splat`, and `.ksplat` scene URLs
- Load verified sample presets through same-origin cached `.ply` and `.ksplat` routes
- Compare the default `mkkellogg` renderer against an opt-in SparkJS renderer via query params
- Show loading progress, FPS, and splat count
- Provide Frame Scene, Reset View, and Walk Mode navigation
- Capture camera keyframes from the active view
- Reorder/delete keyframes, scrub the path, and preview smooth playback
- Save and reload camera paths as JSON
- Export the recorded path to `output.mp4` through the root FFmpeg-backed server pipeline
- Serve a simple backend health endpoint and the production client build

Not yet implemented at the repo root:

- Advanced timeline editing beyond simple reorder + scrub
- A user-facing export cancel button or editable export settings

## Repo Layout

```text
.
├── ASSIGNMENT.md      # take-home brief and evaluation criteria
├── client/            # active Vite + TypeScript frontend
├── server/            # active Express backend
├── gsplat-viewer/     # imported reference implementation, kept for reference only
└── AGENT_MEMORY.md    # durable implementation notes and milestones
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

- `client/src/viewer/SceneViewer.ts` wraps `@mkkellogg/gaussian-splats-3d` through the package's `rootElement` + `getSplatMesh()` API surface, disables the package's built-in orbit controls, and owns scene loading, render loop, framing, resizing, and FPS tracking.
- `client/src/viewer/createViewerAdapter.ts` selects the active viewer adapter from the runtime query. The default adapter remains `@mkkellogg/gaussian-splats-3d`, while `client/src/viewer/SparkSceneViewer.ts` provides an opt-in SparkJS comparison path.
- `client/src/viewer/orbitControls.ts` now centralizes the shared app-owned orbit-control setup and target-sync logic used by both renderer adapters so orbit and walk mode stay aligned.
- `client/src/lib/robustSceneBounds.ts` computes trimmed scene bounds from sampled splats so initial framing is less sensitive to outlier points in dense scenes.
- `client/src/viewer/viewerRuntime.ts` keeps compatibility mode as the normal startup path, reserves `?viewerMode=default` as the explicit fast shared-memory diagnostic override when cross-origin isolation is available, and keeps the default renderer on the safer floating-point sort settings (`integerBasedSort: false`, `splatSortDistanceMapPrecision: 20`) in both runtime branches.
- `client/src/viewer/adaptiveCameraFrustum.ts` derives scene-aware camera near/far planes from the current robust scene bounds, and both renderer adapters re-apply those planes as the camera moves so close inspection can get materially nearer without relying on fixed `0.1 / 1000` clipping planes.
- `client/src/controls/WalkControls.ts` now runs walk mode as an `inactive` -> `armed` -> `active` state machine: clicking `Walk Mode` arms it, the next click in the viewer requests pointer lock, `W/S` move forward/back along the camera look direction, `A/D` strafe, `Q/E` handle vertical motion, and leaving walk mode now hands control back to orbit without changing the live camera pose.
- `client/src/lib/sceneFormat.ts` and `client/src/lib/scenePresets.ts` isolate URL format detection and preset scene configuration.
- `client/src/lib/runtimeQuery.ts` and the `window.__GSPLAT_DEBUG__` hook expose test-only startup overrides and viewer diagnostics for browser regression coverage; no `viewerMode` query now means the compatibility default, while `viewerMode=default` explicitly opts into the fast path for diagnostics. The per-renderer debug snapshot now also includes the active camera `near` / `far` planes.
- `renderer=spark` switches the viewer adapter to SparkJS for renderer A/B comparisons. `viewerMode` only affects the default `mkkellogg` path.
- `client/src/path/PathInterpolator.ts` and `client/src/path/KeyframeManager.ts` own keyframe capture, interpolation, preview playback, and path JSON serialization.
- `client/src/export/ExportManager.ts` renders the active camera path into PNG frames at fixed `1280x720 @ 30 FPS`, uploads them to the backend export job, and restores the live viewer state after success or failure.
- `server/src/presetArchive.ts` caches preset assets under `/tmp/gsplat-presets`, mixing archive-backed verified `.ksplat` entries with direct-download `.ply` presets behind the same preset routes exposed by `server/src/app.ts`.
- `server/src/exportService.ts` owns FFmpeg export jobs and powers `/api/export/jobs`, `/api/export/jobs/:jobId/frame`, `/api/export/jobs/:jobId/finalize`, and `/api/export/jobs/:jobId`.

## Current Expected Behaviour

- Scene loads are single-scene. Loading a preset or URL replaces the previously loaded scene.
- Scene loading is currently non-progressive. The scene is not visible until processing completes.
- The progress bar reflects download progress first, then resets to `0%` when the loader switches into processing. The UI does not yet expose granular processing sub-steps.
- Once the UI reaches `loaded`, the viewer is expected to have framed a visible scene. Loads that resolve with zero splats or invalid bounds now fail into the error state instead of reporting a false `loaded` status.
- The preset tab now serves cached same-origin `Luigi` (`.ply`), `Garden` (`.ksplat`), `Stump` (`.ksplat`), and `Truck` (`.ksplat`) scenes from `/api/presets/:presetId.:extension` routes backed by the server cache under `/tmp/gsplat-presets`.
- Initial framing and `Frame Scene` now use robust sampled bounds that ignore low-alpha outliers before falling back to the raw mesh bounding box.
- Camera near/far planes now adapt from the current robust scene bounds and camera distance in both renderer adapters, so close inspection is no longer limited by the previous fixed `0.1 / 1000` frustum.
- The app serves cross-origin isolation headers in both the Vite dev server and the Express production server so the faster shared-memory worker path remains available for explicit diagnostics.
- Normal startup now uses the compatibility `mkkellogg` runtime by default because the fast path still renders blank in at least some real environments.
- The default `mkkellogg` runtime now keeps the safer floating-point sort configuration (`integerBasedSort: false`, `splatSortDistanceMapPrecision: 20`) in both normal compatibility startup and the explicit `?viewerMode=default` fast-path diagnostic mode.
- Normal startup still uses the `mkkellogg` renderer by default. `?renderer=spark` is an explicit diagnostic path for comparing the same assets against SparkJS.
- Default `mkkellogg` scene loads now apply a 180-degree X-axis rotation so the scene orientation matches Spark on the same assets.
- `?viewerMode=default` explicitly requests the faster shared-memory path for diagnostics; if cross-origin isolation is unavailable, the viewer falls back to compatibility mode and reports that state. `?viewerMode=compat` explicitly requests the slower compatibility path.
- SparkJS scene loads currently use Spark's own render path plus local download/progress wiring; the app surfaces the active renderer in the status note and debug snapshot for A/B verification.
- Successful scene changes clear the current camera path so keyframes remain scene-specific.
- Both renderer adapters now use the app's own orbit controls instead of mixing app-owned walk mode with renderer-owned orbit updates. Walk mode no longer re-aims the camera back toward a stale orbit target on each render tick.
- Walk mode is now an explicit click-to-enter fly-through flow: the button arms it, the next click inside the viewer captures mouse look, `W/S` move in the current view direction, `A/D` strafe, `Q/E` move vertically, `Frame Scene` / `Reset View` pause until walk mode exits, and leaving walk mode restores orbit around the current view direction without shifting the camera pose that was visible in walk mode.
- Path import and path editing controls remain disabled until a scene has loaded successfully.
- MP4 export requires a loaded scene plus at least two keyframes. While export is running, scene/path controls and viewer pointer interaction are locked until the job completes or fails.
- Export currently uses fixed defaults of `1280x720 @ 30 FPS`, streams PNG frames to the same-origin backend, and downloads `output.mp4` when FFmpeg finishes.
- Export progress is client-driven from rendered/uploaded frame counts plus a final `Encoding MP4 with FFmpeg…` phase. There is not yet a user-visible cancel button.
- The committed browser smoke fixture lives at `client/public/test-assets/smoke-grid.ply` and is used by the Firefox Playwright regression test.
- In the current host environment, the Firefox browser regression test fails before any scene load begins in both the `?viewerMode=default` and `?viewerMode=compat` paths with `Init error: Error creating WebGL context.` The same symptom can be caused by Firefox lacking WebGL support in headless mode, so interpret it as an environment compatibility failure first and an app regression only after confirming raw Firefox WebGL works on the host.
- The current client build emits a Vite warning from Spark's packaged WASM data URL during bundling, but the build still completes successfully.

## Development Guidance

- Treat `ASSIGNMENT.md` as the scope brief and success criteria.
- Build the real app at the repo root.
- Use `gsplat-viewer/` only as a reference source when porting later milestones.

## Next Milestone

The next milestone is Firefox/renderer follow-up plus deliverable polish:

- investigate the Firefox `Init error: Error creating WebGL context.` startup failure now captured by the Playwright regression harness
- capture/update the demo recording and one-page design note around the now-implemented export pipeline
- decide whether any optional extras should be added after the core deliverable is fully documented
