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
npm start        # serve the production build from server/dist
```

Useful manual checks:

```bash
curl http://localhost:3001/api/health
curl -I http://localhost:5173/
curl -I http://localhost:3001/
```

## Implementation Notes

- `client/src/viewer/SceneViewer.ts` wraps `@mkkellogg/gaussian-splats-3d` through the package's `rootElement` + `getSplatMesh()` API surface and owns scene loading, render loop, framing, resizing, and FPS tracking.
- `client/src/viewer/viewerRuntime.ts` selects the viewer's shared-memory worker path when cross-origin isolation is available and falls back to a slower compatibility path otherwise.
- `client/src/controls/WalkControls.ts` adds pointer-lock WASD navigation on top of the viewer camera.
- `client/src/lib/sceneFormat.ts` and `client/src/lib/scenePresets.ts` isolate URL format detection and preset scene configuration.
- `client/src/path/PathInterpolator.ts` and `client/src/path/KeyframeManager.ts` own keyframe capture, interpolation, preview playback, and path JSON serialization.
- `server/src/app.ts` owns the Express app, including COOP/COEP headers for the production server and `/api/health`.

## Current Expected Behaviour

- Scene loads are single-scene. Loading a preset or URL replaces the previously loaded scene.
- Scene loading is currently non-progressive. The scene is not visible until processing completes.
- The progress bar reflects download progress first, then resets to `0%` when the loader switches into processing. The UI does not yet expose granular processing sub-steps.
- Once the UI reaches `loaded`, the viewer is expected to have framed a visible scene. Loads that resolve with zero splats or invalid bounds now fail into the error state instead of reporting a false `loaded` status.
- The app serves cross-origin isolation headers in both the Vite dev server and the Express production server so the viewer can use the faster shared-memory worker path.
- If cross-origin isolation is unavailable in a runtime, the viewer automatically falls back to a slower compatibility worker path and surfaces that state in the status note instead of hanging in processing.
- Successful scene changes clear the current camera path so keyframes remain scene-specific.
- Path import and path editing controls remain disabled until a scene has loaded successfully.

## Development Guidance

- Treat `ASSIGNMENT.md` as the scope brief and success criteria.
- Build the real app at the repo root.
- Use `gsplat-viewer/` only as a reference source when porting later milestones.

## Next Milestone

The next milestone is the FFmpeg-backed export pipeline:

- add root client export controls that render frames along the recorded path
- add root server routes that stream PNG frames into FFmpeg and return `output.mp4`
- surface export progress and failure states cleanly in the client
