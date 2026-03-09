# AGENT_MEMORY

## Current Context
- Repo root `/home/qi/proj/gsplat_1` now has an initial import commit for the `gsplat-viewer` project.
- The imported project lives under `gsplat-viewer/`.
- A local archive copy exists at `gsplat-viewer.zip` and should stay untracked.
- `ASSIGNMENT.md` describes a take-home Gaussian Splat Viewer -> camera path -> MP4 export app.
- The actual app is under `gsplat-viewer/` as a Vite/TypeScript client plus an Express/FFmpeg server.
- Source appears to implement most of the MVP already: scene loading/progress/FPS/splat count, frame/reset view, walk mode, keyframe recording/preview/scrubber/presets, path save/load, and MP4 export routes.
- Current checkout is unverified locally: no `node_modules` or lockfile is present, and there are no test scripts beyond build/dev commands.
- The clearest remaining MVP gap is keyframe reorder in the UI: the data-layer reorder method exists, but the UI currently only exposes add/delete/select.
- README overstates deterministic re-export: current save/load persists the camera path, not export settings.
- There is a stray import artifact directory `gsplat-viewer/{client` that appears accidental.

## Decisions
- Use a root `.gitignore` for repo-wide transient files and the root archive before the initial commit.
- For large or multi-feature tasks, prefer incremental code changes and incremental commits rather than one large end-of-task commit.
- Recommended implementation order is: 1) build/stabilization and dependency validation, 2) keyframe reorder UI, 3) path/settings persistence or README correction, 4) cleanup of repo/UI mismatches.

## Active Plan
- Next milestone should start with dependency install and build verification to turn the current repo assessment into a confirmed baseline.
- First evidence target: within roughly 30-60 minutes of implementation start, expect either a clean build or a concrete blocker list; within roughly 1-2 hours, expect user-visible progress from keyframe reorder if stabilization is not blocked.

## Archived Plans
- 2026-03-08: Created the initial import commit with `AGENTS.md`, `AGENT_MEMORY.md`, the root `.gitignore`, and the `gsplat-viewer/` source tree.
