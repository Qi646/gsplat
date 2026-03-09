# gsplat_1

Root workspace for the Gaussian Splat Viewer take-home app in [ASSIGNMENT.md](./ASSIGNMENT.md).

The active product code lives at the repo root in `client/` and `server/`. The imported `gsplat-viewer/` tree is kept as reference material and should not be treated as the current app.

## Current Status

The root app currently implements the first vertical slice:

- Load public `.ply`, `.splat`, and `.ksplat` scene URLs
- Load sample presets for quick validation
- Show loading progress, FPS, and splat count
- Provide Frame Scene, Reset View, and Walk Mode navigation
- Serve a simple backend health endpoint and the production client build

Not yet implemented at the repo root:

- Camera-path recording and playback
- MP4 export / FFmpeg pipeline
- Path save/load and timeline editing

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
npm test         # client unit tests
npm run build    # production client and server builds
npm start        # serve the production build from server/dist
```

Useful manual checks:

```bash
curl http://localhost:3001/api/health
curl -I http://localhost:5173/
```

## Implementation Notes

- `client/src/viewer/SceneViewer.ts` wraps `@mkkellogg/gaussian-splats-3d` and owns scene loading, render loop, framing, resizing, and FPS tracking.
- `client/src/controls/WalkControls.ts` adds pointer-lock WASD navigation on top of the viewer camera.
- `client/src/lib/sceneFormat.ts` and `client/src/lib/scenePresets.ts` isolate URL format detection and preset scene configuration.
- `server/src/index.ts` currently exposes `/api/health` and serves the production client build when present.

## Development Guidance

- Treat `ASSIGNMENT.md` as the scope brief and success criteria.
- Build the real app at the repo root.
- Use `gsplat-viewer/` only as a reference source when porting later milestones.

## Next Milestone

The next milestone is camera-path recording at the repo root:

- add keyframe capture from the active camera
- support preview playback with smooth interpolation
- add simple path list management and path JSON save/load

After that, add the FFmpeg-backed export pipeline in `server/`.
