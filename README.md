# gsplat_1

Root workspace for the Gaussian Splat Viewer take-home app in [ASSIGNMENT.md](./ASSIGNMENT.md).

The active product code lives at the repo root in `client/` and `server/`. The imported `gsplat-viewer/` tree is kept as reference material and should not be treated as the current app.

## Current Status

The root app currently implements the first vertical slice:

- Load public `.ply`, `.splat`, and `.ksplat` scene URLs
- Load sample presets for quick validation
- Show loading progress, FPS, and splat count
- Provide Frame Scene, Reset View, and Walk Mode navigation
- Capture camera keyframes from the active view
- Reorder/delete keyframes, scrub the path, and preview smooth playback
- Save and reload camera paths as JSON
- Serve a simple backend health endpoint and the production client build

Not yet implemented at the repo root:

- MP4 export / FFmpeg pipeline
- Advanced timeline editing beyond simple reorder + scrub

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
- FFmpeg is not required for the current root milestone, but it will be required once export work starts

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

- `client/src/viewer/SceneViewer.ts` wraps `@mkkellogg/gaussian-splats-3d` through the package's `rootElement` + `getSplatMesh()` API surface and owns scene loading, render loop, framing, resizing, and FPS tracking.
- `client/src/viewer/viewerRuntime.ts` defaults the viewer to the slower compatibility worker path for broader browser coverage, keeps the shared-memory fast path behind `?viewerMode=default`, and forces safer floating-point splat sorting with higher distance-map precision to reduce dense-scene artifacting.
- `client/src/controls/WalkControls.ts` adds pointer-lock WASD navigation on top of the viewer camera.
- `client/src/lib/sceneFormat.ts` and `client/src/lib/scenePresets.ts` isolate URL format detection and preset scene configuration.
- `client/src/lib/runtimeQuery.ts` and the `window.__GSPLAT_DEBUG__` hook expose test-only startup overrides and viewer diagnostics for browser regression coverage; no `viewerMode` query now means compatibility mode, while `viewerMode=default` explicitly opts into the fast path.
- `client/src/path/PathInterpolator.ts` and `client/src/path/KeyframeManager.ts` own keyframe capture, interpolation, preview playback, and path JSON serialization.
- `server/src/app.ts` owns the Express app, including COOP/COEP headers for the production server and `/api/health`.

## Current Expected Behaviour

- Scene loads are single-scene. Loading a preset or URL replaces the previously loaded scene.
- Scene loading is currently non-progressive. The scene is not visible until processing completes.
- The progress bar reflects download progress first, then resets to `0%` when the loader switches into processing. The UI does not yet expose granular processing sub-steps.
- Once the UI reaches `loaded`, the viewer is expected to have framed a visible scene. Loads that resolve with zero splats or invalid bounds now fail into the error state instead of reporting a false `loaded` status.
- The app serves cross-origin isolation headers in both the Vite dev server and the Express production server so the faster shared-memory worker path remains available for explicit diagnostics.
- Normal startup now uses compatibility mode by default for broader browser coverage and surfaces that state in the status note.
- Dense preset scenes now default to floating-point splat sorting with a higher distance-map precision to avoid the package's large-scene color-blob artifacts, at the cost of slower sort performance.
- `?viewerMode=default` explicitly opts into the faster shared-memory worker path; if cross-origin isolation is unavailable, the viewer falls back to compatibility mode and reports that fallback state.
- Successful scene changes clear the current camera path so keyframes remain scene-specific.
- Path import and path editing controls remain disabled until a scene has loaded successfully.
- The committed browser smoke fixture lives at `client/public/test-assets/smoke-grid.ply` and is used by the Firefox Playwright regression test.
- In the current host environment, the Firefox browser regression test fails before any scene load begins: both default and forced compatibility modes fail with `Init error: Error creating WebGL context.` The same symptom can be caused by Firefox lacking WebGL support in headless mode, so interpret it as an environment compatibility failure first and an app regression only after confirming raw Firefox WebGL works on the host.

## Development Guidance

- Treat `ASSIGNMENT.md` as the scope brief and success criteria.
- Build the real app at the repo root.
- Use `gsplat-viewer/` only as a reference source when porting later milestones.

## Next Milestone

The next milestone is the FFmpeg-backed export pipeline:

- add root client export controls that render frames along the recorded path
- add root server routes that stream PNG frames into FFmpeg and return `output.mp4`
- surface export progress and failure states cleanly in the client
