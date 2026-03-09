# AGENT_MEMORY

## Current Context
- Repo root `/home/qi/proj/gsplat_1` now has an initial import commit for the `gsplat-viewer` project.
- The imported project lives under `gsplat-viewer/`.
- A local archive copy exists at `gsplat-viewer.zip` and should stay untracked.
- `ASSIGNMENT.md` is the tracked take-home brief and should be treated as the source of truth for repo scope/evaluation.
- `ASSIGNMENT.md` describes a take-home Gaussian Splat Viewer -> camera path -> MP4 export app.
- `gsplat-viewer/` is reference-only and should not be modified for product work.
- The actual app now starts at the repo root as a workspace split with `client/` and `server/`.
- The root app now implements the viewer baseline plus the camera-path MVP: keyframe capture, delete/reorder, smooth preview playback, timeline scrubbing, and camera-path JSON save/load.
- The root client ports/adapts the viewer baseline from the reference app and now includes a lightweight root-only path system; MP4 export is still not implemented at the repo root.
- Root validation is working: `npm test`, `npm run build`, `npm run dev`, `curl http://localhost:3001/api/health`, and `curl -I http://localhost:5173/` all passed on 2026-03-09.
- The root preset catalog drifted from upstream source layouts; on 2026-03-09 it was repaired to working `.splat` assets for `Truck`, `Garden`, `Room`, and `Train`.
- `client/src/viewer/SceneViewer.ts` now replaces any existing splat scene before loading a new preset or URL so the root app behaves as a single-scene viewer.
- The upstream loader reports download progress as numeric stages `0/1/2` for download/processing/done; it does not export that enum at runtime.
- The root client now formats scene-load progress from the raw loader label instead of rounding to whole percentages, so sub-1% download progress is visible and no longer appears stuck at `0%`.
- The current root scene load remains non-progressive: the scene is not visible until processing finishes, and the progress bar resets to `0%` when the loader switches from download to processing.
- The installed `@mkkellogg/gaussian-splats-3d` package does not honor the locally stubbed `workerConfig.crossOriginIsolated` option; real worker behavior must be controlled through supported viewer options such as `sharedMemoryForWorkers` and `gpuAcceleratedSort`.
- The root app now serves `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` in both Vite dev and the Express production server so the viewer can use shared-memory workers when available.
- On a real Firefox/WebGL device, the fast shared-memory path could still produce a blank viewer after scene load while forced compatibility mode rendered correctly.
- As of 2026-03-09, the root app defaults to `sharedMemoryForWorkers: false` and `gpuAcceleratedSort: false` for broader browser coverage, and reserves `?viewerMode=default` as an explicit fast-path diagnostic opt-in.
- The root viewer wrapper now aligns with the installed `@mkkellogg/gaussian-splats-3d` package API: it mounts via `rootElement`, uses the package-managed renderer canvas for interaction, computes framing bounds from `getSplatMesh().computeBoundingBox(true)`, and disables the package's built-in loading UI in favor of the app overlay.
- The root viewer now rejects scene loads that resolve with zero splats or invalid bounds instead of emitting a false `scene:loaded` state that can leave the viewer black.
- The root viewer runtime now forces `integerBasedSort: false` and `splatSortDistanceMapPrecision: 20` in both compatibility and fast modes, following the package guidance for dense scenes to reduce preset color-blob artifacts.
- Camera paths at the root use JSON keyframes `{ id, time, position, quaternion, fov }`, Catmull-Rom position interpolation, shortest-arc quaternion slerp, smoothstep timing, and FOV lerp.
- Successful scene reloads now clear the current camera path so saved keyframes remain scene-specific.
- A root `README.md` now documents the active root workspace, current implemented slice, validated commands, and the fact that `gsplat-viewer/` is reference-only.
- `npm install` hit an `EACCES` cache issue under `/home/qi/.npm`; using `npm install --cache /tmp/npm-cache-gsplat-1` worked around it cleanly.
- A local declaration file was added for `@mkkellogg/gaussian-splats-3d` because the installed package lacks TypeScript declarations.
- The root server now has its own `vitest` + `supertest` harness to verify headers and `/api/health`, and the root `npm test` command runs both client and server test suites.
- There is a stray import artifact directory `gsplat-viewer/{client` that appears accidental.
- A 2026-03-09 smoke check showed existing local listeners can occupy ports `3001` and `5173`; Vite auto-shifts to the next port, but the Express dev server still fails fast on `3001` with `EADDRINUSE`.
- After the viewer-wrapper alignment fix on 2026-03-09, `npm test` and `npm run build` both passed again at the repo root.
- After the safe-sort runtime fix on 2026-03-09, `npm test`, `npm run build`, and a built-app Chromium smoke check against the remote `Room` preset passed; the live debug snapshot reported `integerBasedSort: false` and `splatSortDistanceMapPrecision: 20`.
- The repo now includes a deterministic synthetic smoke fixture at `client/public/test-assets/smoke-grid.ply`, generated by `scripts/generate-smoke-grid-ply.mjs` and validated by `client/src/__tests__/smokeFixture.test.ts`.
- The root app now supports test-only startup query params via `client/src/lib/runtimeQuery.ts`: `?e2e=1` enables `window.__GSPLAT_DEBUG__`, no `viewerMode` param means compatibility mode, `?viewerMode=default` explicitly requests the fast shared-memory path, and `?scene=...` can auto-load a fixture URL.
- The root app now exposes an app-level debug snapshot during startup so browser tests can distinguish `booting`, `viewer:initializing`, `viewer:ready`, and `viewer:init-error` phases instead of only observing the UI.
- A new root Playwright Firefox harness (`playwright.config.ts`, `e2e/viewer-render.spec.ts`) runs against the built app on port `3310` and captures trace/video/screenshot artifacts under `test-results/`.
- In this environment on 2026-03-09, the Firefox browser regression test reproduces a startup failure before any scene load in both default and forced compatibility modes: the page shows `Init error: Error creating WebGL context.`
- Running Firefox browser automation inside the default sandbox failed because Playwright's Firefox process could not complete startup (`/proc/self/uid_map: EACCES`); the Firefox e2e run required an escalated command outside the sandbox.
- A bare outside-sandbox Playwright Firefox probe on 2026-03-09 reported both `webgl` and `webgl2` unavailable on `about:blank`, so the Firefox e2e failure currently documents a host Firefox/WebGL compatibility problem rather than proving an app-logic regression by itself.
- `README.md` now includes a Firefox rerun note: `npm run playwright:install:firefox` once, then `npm run test:e2e:firefox`, with failure artifacts under `test-results/` and guidance to confirm raw Firefox WebGL before classifying `Error creating WebGL context.` as a viewer bug.

## Decisions
- Use a root `.gitignore` for repo-wide transient files and the root archive before the initial commit.
- For large or multi-feature tasks, prefer incremental code changes and incremental commits rather than one large end-of-task commit.
- Build the real app at the repo root and treat `gsplat-viewer/` as read-only reference material.
- Recommended implementation order is now: 1) root viewer baseline, 2) camera path recording and playback, 3) MP4 export pipeline, 4) polish/docs cleanup.
- Prefer referencing live, lighter-weight `.splat` sample assets for presets instead of deep `point_cloud/iteration_*/*.ply` links, since upstream dataset layouts can drift and those links are more brittle.
- When adapting `@mkkellogg/gaussian-splats-3d`, rely on local constants for loader-status codes instead of assuming the package exports its internal `LoaderStatus` symbol.
- When adapting `@mkkellogg/gaussian-splats-3d`, verify the installed package runtime API against its actual docs/runtime surface instead of trusting local declaration shims; the current package uses `rootElement` and `getSplatMesh()` rather than `canvas` and `scene`.
- Prefer compatibility mode as the default runtime for user-facing browser coverage; keep the shared-memory/GPU-sort path as an explicit diagnostic opt-in via `?viewerMode=default`.
- Prefer safer floating-point sort settings for user-facing dense scenes even on the fast-path runtime; keep `integerBasedSort` disabled and raise sort precision to 20 unless there is a measured reason to trade visuals for speed.
- Keep the root camera-path UI lightweight: explicit move-up/move-down reordering, no drag-and-drop timeline editor yet.
- Disable path import until a scene is loaded, and clear the current path on successful scene changes.
- Always document current expected behaviour in repo-facing docs when behavior changes or when user-visible limitations/quirks are clarified.
- For browser-level viewer regressions, prefer the committed local smoke fixture plus the app debug snapshot over remote presets so failures separate browser startup, viewer init, scene load, and visible render phases.

## Active Plan
- Next milestone should add the export manager and FFmpeg-backed server routes at the repo root.
- After the export milestone, the next viewer-specific bug follow-up should investigate the Firefox `Error creating WebGL context.` startup failure now captured by the Playwright regression harness.
- After export is stable, finish deliverable polish: README/demo/design note cleanup and any selected extras.

## Archived Plans
- 2026-03-08: Created the initial import commit with `AGENTS.md`, `AGENT_MEMORY.md`, the root `.gitignore`, and the `gsplat-viewer/` source tree.
- 2026-03-09: Completed the root viewer bootstrap milestone with a new workspace-based root app and validation pass.
- 2026-03-09: Repaired the root preset scene catalog, added preset catalog tests, and changed scene loads to replace the active scene instead of accumulating multiple scenes.
- 2026-03-09: Fixed the root load-progress UI to use the library's real stage codes and raw fractional download progress, with unit coverage for progress formatting.
- 2026-03-09: Completed the root camera-path milestone with keyframe capture, reorder/delete, smooth preview playback, scrubbing, and path JSON save/load.
- 2026-03-09: Fixed the scene-load stall by adding COOP/COEP headers in dev/prod, switching the viewer to supported worker options, and adding a compatibility fallback plus server header tests.
- 2026-03-09: Fixed the false `loaded` + black viewer state by aligning the root wrapper with the installed package API, switching framing to splat-mesh bounds, and adding SceneViewer unit coverage for the success/error paths.
- 2026-03-09: Reduced dense-scene preset artifacting by forcing safer viewer sort settings (`integerBasedSort: false`, `splatSortDistanceMapPrecision: 20`), extending debug/runtime typing, and validating the new settings in unit tests and a built-app remote preset smoke check.
- 2026-03-09: Added a deterministic local smoke fixture, test-only app debug hooks, and a Firefox Playwright regression harness; the harness currently reproduces Firefox startup failure with `Error creating WebGL context.` before scene load.
- 2026-03-09: Changed runtime selection so normal startup defaults to compatibility mode, while `?viewerMode=default` explicitly opts into the fast shared-memory path for diagnostics.
