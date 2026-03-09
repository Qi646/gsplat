# AGENT_MEMORY

## Current Context
- Repo root `/home/qi/proj/gsplat_1` now has an initial import commit for the `gsplat-viewer` project.
- The imported project lives under `gsplat-viewer/`.
- A local archive copy exists at `gsplat-viewer.zip` and should stay untracked.
- `ASSIGNMENT.md` is the tracked take-home brief and should be treated as the source of truth for repo scope/evaluation.
- `ASSIGNMENT.md` describes a take-home Gaussian Splat Viewer -> camera path -> MP4 export app.
- `gsplat-viewer/` is reference-only and should not be modified for product work.
- The actual app now starts at the repo root as a workspace split with `client/` and `server/`.
- The root app currently implements the first vertical slice only: scene loading, progress, FPS/splat stats, frame scene, reset view, walk mode, preset scene loading, a health route, and production static serving.
- The root client ports/adapts the viewer baseline from the reference app but intentionally excludes camera-path editing and MP4 export for now.
- Root validation is working: `npm test`, `npm run build`, `npm run dev`, `curl http://localhost:3001/api/health`, and `curl -I http://localhost:5173/` all passed on 2026-03-09.
- The root preset catalog drifted from upstream source layouts; on 2026-03-09 it was repaired to working `.splat` assets for `Truck`, `Garden`, `Room`, and `Train`.
- `client/src/viewer/SceneViewer.ts` now replaces any existing splat scene before loading a new preset or URL so the root app behaves as a single-scene viewer.
- The upstream loader reports download progress as numeric stages `0/1/2` for download/processing/done; it does not export that enum at runtime.
- The root client now formats scene-load progress from the raw loader label instead of rounding to whole percentages, so sub-1% download progress is visible and no longer appears stuck at `0%`.
- A root `README.md` now documents the active root workspace, current implemented slice, validated commands, and the fact that `gsplat-viewer/` is reference-only.
- `npm install` hit an `EACCES` cache issue under `/home/qi/.npm`; using `npm install --cache /tmp/npm-cache-gsplat-1` worked around it cleanly.
- A local declaration file was added for `@mkkellogg/gaussian-splats-3d` because the installed package lacks TypeScript declarations.
- There is a stray import artifact directory `gsplat-viewer/{client` that appears accidental.

## Decisions
- Use a root `.gitignore` for repo-wide transient files and the root archive before the initial commit.
- For large or multi-feature tasks, prefer incremental code changes and incremental commits rather than one large end-of-task commit.
- Build the real app at the repo root and treat `gsplat-viewer/` as read-only reference material.
- Recommended implementation order is now: 1) root viewer baseline, 2) camera path recording and playback, 3) MP4 export pipeline, 4) polish/docs cleanup.
- Prefer referencing live, lighter-weight `.splat` sample assets for presets instead of deep `point_cloud/iteration_*/*.ply` links, since upstream dataset layouts can drift and those links are more brittle.
- When adapting `@mkkellogg/gaussian-splats-3d`, rely on local constants for loader-status codes instead of assuming the package exports its internal `LoaderStatus` symbol.

## Active Plan
- Next milestone should add camera-path recording at the repo root: add keyframes, preview playback, simple list management, and save/load of the path JSON.
- After path recording is stable, add the export manager and FFmpeg-backed server routes at the root.

## Archived Plans
- 2026-03-08: Created the initial import commit with `AGENTS.md`, `AGENT_MEMORY.md`, the root `.gitignore`, and the `gsplat-viewer/` source tree.
- 2026-03-09: Completed the root viewer bootstrap milestone with a new workspace-based root app and validation pass.
- 2026-03-09: Repaired the root preset scene catalog, added preset catalog tests, and changed scene loads to replace the active scene instead of accumulating multiple scenes.
- 2026-03-09: Fixed the root load-progress UI to use the library's real stage codes and raw fractional download progress, with unit coverage for progress formatting.
