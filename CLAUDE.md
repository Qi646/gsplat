# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**gsplat_1** is a full-stack 3D Gaussian Splat viewer with camera path recording and MP4 export. It uses TypeScript + Vite on the frontend and TypeScript + Express on the backend. FFmpeg handles video encoding; OpenAI Vision API powers optional agentic camera path generation.

## Commands

```bash
npm install              # Install all workspace dependencies
npm run dev              # Dev mode: client on :5173 (Vite), server on :3001 (with watch)
npm run build            # Production build: client → server/public/, server → server/dist/
npm start                # Serve production build

npm test                 # Run all unit tests (client + server via Vitest)
npm run test:e2e         # Playwright e2e (builds first, Chrome)
npm run test:e2e:firefox # Playwright e2e on Firefox
npm run playwright:install:firefox  # One-time Firefox browser install
```

To run a single test file:
```bash
# From repo root:
npx vitest run client/src/__tests__/someFile.test.ts
npx vitest run server/test/someFile.test.ts
```

**Prerequisites:** Node.js 18+, FFmpeg on PATH. Optional: `OPENAI_API_KEY` env var for agentic path generation.

## Architecture

### Frontend (`client/src/`)

**`main.ts`** — App entry point. Bootstraps the viewer, wires all UI event handlers, and orchestrates export. All UI state lives in closure variables here; there is no framework.

**`viewer/`** — Rendering abstraction layer.
- `ViewerAdapter` interface defines the contract both renderers implement.
- `SceneViewer.ts` uses `@mkkellogg/gaussian-splats-3d` (default renderer).
- `SparkSceneViewer.ts` uses SparkJS (`?renderer=spark` URL param to switch).
- **Keep both renderer implementations in sync** when adding viewer features.

**`path/`** — Camera path system.
- `KeyframeManager.ts` — add/remove/reorder keyframes.
- `PathInterpolator.ts` — Catmull-Rom spline positions + quaternion slerp with smoothstep easing.
- `agenticPath.ts` — iterative planner loop: sends captures to server, receives orbit spec.
- `CameraPathOverlay.ts` — screen-space keyframe visualization.

**`export/`** — MP4 export pipeline.
- `ExportManager.ts` — renders frames and streams PNGs to the backend job API.
- `exportPlan.ts` — deterministic export profiles (720p, 1080p, batch).

**`controls/`** — Navigation modes.
- `WalkControls.ts` — WASD + pointer lock, roll-aware mouse look.
- `navigationMode.ts` — state machine switching between inspect (orbit) and walk modes.

**`lib/`** — Utilities: scene format detection, source resolution, preset definitions, robust bounds sampling, URL query parsing.

**`performance/`** — `AdaptiveRenderBudgetController.ts` for live FPS capping (15–60 FPS target, off by default).

**`types.ts`** — Core shared types: `Keyframe`, `CameraPath`, `ViewerDebugSnapshot`.

### Backend (`server/src/`)

**`app.ts`** — Express app factory. Registers all routes and middleware (CORS, JSON, cross-origin isolation headers).

**`exportService.ts`** — `FfmpegExportService`: manages export jobs, receives PNG frames via POST, assembles MP4 with FFmpeg on finalize.

**`pathGeneration.ts`** — `OpenAIVisionPathPlanner`: iterative multi-turn planner using OpenAI Vision. Handles GPT-5 API shape differences (tokens, temperature, reasoning effort, JSON mode fallback).

**`presetArchive.ts`** — Caches preset scene files (`.ksplat`, `.ply`) in `/tmp/gsplat-presets`.

### API Routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Server status |
| GET | `/api/presets/:id.:ext` | Cached scene data |
| POST | `/api/path/generate` | Agentic orbit plan (needs `OPENAI_API_KEY`) |
| GET | `/api/path/status` | Planner availability |
| POST | `/api/export/jobs` | Create export job |
| POST | `/api/export/jobs/:id/frame` | Append PNG frame |
| POST | `/api/export/jobs/:id/finalize` | Run FFmpeg → MP4 |
| DELETE | `/api/export/jobs/:id` | Cancel + cleanup |
| GET | `*` | SPA fallback |

### Key Design Notes

- **Dev proxy:** Vite proxies `/api/*` to `:3001`, so frontend code always uses `/api/` paths.
- **Cross-origin isolation:** Both client (vite.config.ts) and server (app.ts) emit `COEP`/`COOP` headers for SharedArrayBuffer support.
- **No linter/formatter config** — TypeScript `strict: true` is the primary quality gate.
- **`gsplat-viewer/`** is a read-only reference implementation; do not modify it.
- **E2E tests:** Firefox WebGL headless failures are a known environment issue, not a code bug.

## Agent Workflow (from AGENTS.md)

- Keep `AGENT_MEMORY.md` updated with discovered issues, implementation plans, and open items.
- Validate at milestones: unit tests pass + `npm run build` succeeds before committing.
- Treat `gsplat-viewer/` as read-only reference only.
- Always keep `SceneViewer.ts` and `SparkSceneViewer.ts` feature-equivalent.
