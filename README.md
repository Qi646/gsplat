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

Open `http://localhost:5173` locally, or `http://<your-lan-ip>:5173` from another device on the same network.

The frontend uses same-origin relative `/api/*` requests. In development, the Vite dev server proxies those requests to the Express server.

## LAN / Remote Device Notes

If you want the app reachable from other devices on your Wi-Fi during development, expose the Vite dev server on your LAN and keep the frontend on relative `/api/*` routes:

```bash
VITE_HOST=0.0.0.0 npm run dev
```

Optional LAN-related environment variables:

```bash
VITE_API_PROXY_TARGET=http://127.0.0.1:3001  # override the Vite /api proxy target
CORS_ORIGIN=*                                # allow any dev origin, or use a comma-delimited allowlist
HOST=0.0.0.0                                 # optional explicit Express bind host
```

Notes:

- Product code does not hardcode `localhost` or `127.0.0.1` in frontend `fetch` requests; the runtime API calls already use relative `/api/*` paths.
- The backend reflects any origin by default in non-production development, so `http://<your-lan-ip>:5173` can call the API without extra CORS changes. Set `CORS_ORIGIN` if you want to lock that down or keep CORS enabled in production.
- The client no longer depends on secure-context-only `crypto.randomUUID()` for manual keyframes or draft IDs, so plain `http://<your-lan-ip>:5173` access does not lose those controls just because the page is outside a secure context.
- Browsers do not treat `http://<your-lan-ip>` as a secure context. The app already defaults to compatibility mode, but the explicit shared-memory diagnostic path behind `?viewerMode=default` may still be unavailable over plain HTTP unless you serve the app over HTTPS.

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

## License

This repository is licensed under the GNU General Public License v3.0 only. See [LICENSE](./LICENSE).

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
- `client/src/viewer/orbitControls.ts` now centralizes the shared app-owned camera-control setup and target/up-vector sync logic used by both renderer adapters so free inspection and fly mode stay aligned.
- `client/src/lib/robustSceneBounds.ts` computes trimmed scene bounds from sampled splats so initial framing is less sensitive to outlier points in dense scenes. It now compares both a wide `1%-99%` box and a tighter `5%-95%` box, and prefers the tighter framing when the wide candidate is materially inflated by outliers.
- `client/src/viewer/sceneFraming.ts` applies one shared deterministic framing algorithm across both renderers: it fits the chosen bounds box exactly against the current camera FOV/aspect by projecting the box corners into a canonical camera basis instead of relying on preset-specific default views.
- `client/src/viewer/viewerRuntime.ts` keeps compatibility mode as the normal startup path, reserves `?viewerMode=default` as the explicit fast shared-memory diagnostic override when cross-origin isolation is available, and keeps the default renderer on the safer floating-point sort settings (`integerBasedSort: false`, `splatSortDistanceMapPrecision: 20`) in both runtime branches.
- `client/src/viewer/adaptiveCameraFrustum.ts` derives scene-aware camera near/far planes from the current robust scene bounds, and both renderer adapters re-apply those planes as the camera moves so close inspection can get materially nearer without relying on fixed `0.1 / 1000` clipping planes.
- `client/src/controls/WalkControls.ts` and `client/src/controls/navigationMode.ts` now run the user-facing fly mode as an `inactive` -> `armed` -> `active` state machine with direct mode switching: pressing `2` or clicking `Fly [2]` requests pointer lock immediately, pressing `1` returns to Inspect mode, and inspect/fly state is shown by top-bar button highlight (`⬡ Inspect [1]` and `⬡ Fly [2]`). `Z/C` rolls the camera around the current view axis in both Inspect and active fly mode, mouse look preserves arbitrary camera roll, `W/S` move forward/back along the camera look direction, `A/D` strafe, `Q/E` follow the camera-local up axis, and leaving fly mode hands control back to the default camera controls without changing the live camera pose.
- `client/src/lib/sceneFormat.ts`, `client/src/lib/sceneSource.ts`, `client/src/lib/scenePresets.ts`, and `client/src/main.ts` isolate scene-format detection, explicit-format local/blob scene sources, the preset catalog, and the shared app wiring for scene loading, framing, camera paths, and export controls.
- `client/src/lib/runtimeQuery.ts` and the `window.__GSPLAT_DEBUG__` hook expose test-only startup overrides and viewer diagnostics for browser regression coverage; no `viewerMode` query now means the compatibility default, while `viewerMode=default` explicitly opts into the fast path for diagnostics. The per-renderer debug snapshot now also includes the active camera `near` / `far` planes.
- `renderer=spark` switches the viewer adapter to SparkJS for renderer A/B comparisons. `viewerMode` only affects the default `mkkellogg` path.
- `client/src/path/PathInterpolator.ts`, `client/src/path/KeyframeManager.ts`, `client/src/path/cameraPath.ts`, `client/src/path/agenticPath.ts`, `client/src/path/stepwiseAgent.ts`, and `client/src/path/PathPreviewPlayer.ts` own manual keyframe capture, multistep draft generation, interpolation, live/draft preview playback, and path JSON serialization. Agentic generation now runs as a shared `multistep-v2` pipeline for both subject-centric moves and one continuous route-following traverse: it captures the current view plus 6 nearby, current-view-biased scouts, can spend one bounded 4-view rescan round on either a provisional subject anchor or a provisional route midpoint, calls `/api/path/ground`, `/api/path/compose`, and `/api/path/verify`, synthesizes/validates deterministic draft keyframes locally, and then drives a bounded active verification pass with exact draft samples plus a few risk-focused off-path probe captures before the user can `Apply Draft`. The experimental `stepwise-v1` draft path now applies its deterministic `yaw`, `forward/back`, `strafe`, `rise/lower`, and `pitch` primitives in camera-local axes so rolled and upside-down camera poses behave consistently with Fly mode. Route-following uses sampled scene points from both renderer adapters to back-project grounded route centerlines into a single ordered 3D route polyline and then synthesizes one `traverse` segment plus optional opening/ending hold or pedestal segments. Saved paths still write camera-path JSON v1 and the importer still accepts older v2 files that include deprecated `sceneRotation`.
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
- Both renderer adapters now use the app's own unconstrained trackball-style camera controls instead of mixing app-owned fly mode with renderer-owned updates. Fly mode no longer re-aims the camera back toward a stale target on each render tick.
- Fly mode now captures the cursor immediately from the initiating user gesture: pressing `2` or clicking `Fly [2]` requests pointer lock without an extra viewer click, and the top bar uses button highlights (`⬡ Inspect [1]` and `⬡ Fly [2]`) to show whether inspect or fly is currently active. `Z/C` roll the camera around its current view axis in Inspect and active fly mode, `W/S` move in the current view direction, `A/D` strafe, `Q/E` move along the current camera-local up direction, `Frame Scene` / `Reset View` pause until fly mode exits, and leaving fly mode restores the current camera-control view without shifting the camera pose that was visible in fly mode.
- Fly-mode mouse look is roll-aware, so entering fly mode from an inverted camera pose no longer forces yaw/pitch behavior back through a world-up Euler decomposition.
- Press `K` to capture a keyframe from the active camera pose; this matches the **+ Add Keyframe** action and now works the same on `localhost` and plain HTTP LAN sessions. Clicking a keyframe in the list jumps the camera there, selects it, and makes `Preview` start from that keyframe instead of always restarting at `KF 01`.
- The Camera Path panel now exposes a `Draft Strategy` selector. `Planner Draft` keeps the existing `multistep-v2` flow for one continuous subject-centric move or one continuous route-following traverse: it captures the current view plus 6 nearby scout views that stay centered on the original view ray while using a wider angular spread than the earlier conservative pass, can add one tighter 4-view targeted rescan when grounding is weak, and spends that rescue round on the original view ray, a provisional subject anchor, or a provisional route midpoint depending on the prompt mode and evidence so far. Those captures go through `/api/path/ground` and `/api/path/compose`, then the client builds the draft locally, keeps subject-centric drafts above the scene floor / subject safety radius, keeps route drafts aligned to one grounded route polyline, runs deterministic validation, and sends both exact draft samples and a capped set of risk-focused off-path probe captures through `/api/path/verify` before showing `Preview Draft`, `Apply Draft`, `Discard Draft`, and `Regenerate`. Longer drafts can therefore gather a bit more evidence around risky transitions, hold reads, floor clearance, sharp bends, clearance squeezes, or late-path visibility without turning verification into an open-ended exploration loop. If the live camera starts too close to the grounded subject, the draft builder now first nudges the draft start pose back to a safe distance instead of failing validation immediately.
- `Stepwise Agent (Experimental)` is a second draft strategy behind the same panel. It captures the live view on every step, sends the server a bounded list of legal next-step candidate actions with runtime-authored predicted-outcome summaries, and asks the model to infer a local intent, compare those candidates, and choose one action (`move`, `rotate`, `capture-image`, or `create-keyframe`) instead of reasoning from primitive names alone. It still explicitly biases the model to decide from the current live frame only rather than re-reading historical images. The client applies only deterministic movement primitives with bounded safety checks, remembers only the frames it explicitly chose to keep locally, and still keeps the live keyframes unchanged until `Apply Draft`. Pure in-place rotations are allowed even when a small subject is framed from outside the tight robust scene bounds, so the agent can re-aim without being blocked by an overly conservative camera-position volume check. This mode is intentionally bounded: one draft loop can take at most 24 decisions, keep 12 remembered captures, and create 8 draft keyframes before it either completes or stops.
- The draft controls now expose explicit `Draft Length` and `Ending Hold` options. Those settings bias composition and verification directly, so a requested hold is no longer left entirely to prompt wording.
- Agentic path `multistep-v2` now supports one continuous subject-centric move and one continuous route-following traverse. Route-following is intentionally narrow in this slice: it assumes one unbranched route that is already partly visible from the starting view and recoverable from bounded nearby rescans. Multi-subject prompts and ambiguous prompts still fail early with an inline explanation instead of being coerced into an unrelated result. Local validation can also reject drafts that leave scene bounds, lose the subject, get too close, drift too far from the grounded route, or push FOV outside safe limits.
- You can run the app without any AI credentials via `npm run dev` or `npm start`. In that mode, scene loading, manual keyframes, preview, and MP4 export still work, while the prompt-driven draft controls stay disabled and explain that `OPENAI_API_KEY` is not configured.
- To enable prompt-driven draft generation in development, start the app with `OPENAI_API_KEY=your_key npm run dev`. To enable it against the production build, use `OPENAI_API_KEY=your_key npm run build` followed by `OPENAI_API_KEY=your_key npm start`.
- When prompt planning fails with a terse parser error, start the server with `PATH_PLANNER_DEBUG=1` as well. That enables backend-only debug logging of the failing planner phase, extracted `intent.orientationPreference`/`intent.lookMode` hints when available, and a truncated raw model completion so you can inspect the actual upstream output instead of only the collapsed `/api/path/*` error.
- To use the prompt flow, load a scene such as `Truck`, choose `Planner Draft` or `Stepwise Agent (Experimental)`, enter a request like `Create one continuous cinematic arc around this truck, keep the camera focused on it, then hold for a beat.` or `Follow one continuous route through these trees, keep moving forward cleanly, then hold for a beat at the end.`, optionally set `Draft Length` and `Ending Hold`, click `Generate Draft`, then `Preview Draft` or `Apply Draft`.
- Path import and path editing controls remain disabled until a scene has loaded successfully.
- Saved camera paths now write the original v1 schema. The importer accepts both legacy v1 JSON and older v2 files, but deprecated v2 `sceneRotation` metadata is ignored. The same load control also accepts `camera-export-plan.json` documents and restores saved export settings when present.
- Agentic path generation now reports `multistep-v2` planner capabilities, supports subject-centric and route-following prompts, and still rejects multi-subject / ambiguous prompts. `OPENAI_BASE_URL` and `OPENAI_MODEL` are optional overrides for OpenAI-compatible endpoints when `OPENAI_API_KEY` is configured, and the default planner model is now `gpt-5-mini`. The planner server auto-negotiates common request-shape differences across models and compatible endpoints, including `max_completion_tokens` vs `max_tokens`, GPT-5's default-only temperature handling, a minimal GPT-5 reasoning setting plus larger completion budget so hidden reasoning still leaves room for final JSON, and a fallback path without `response_format` if JSON mode is rejected. The response parser also accepts structured text payloads, loose enum synonyms, numeric `verticalBias` hints, route observations, `traverse` segments, and route verify metadata instead of assuming one rigid completion shape.
- MP4 export requires a loaded scene plus at least two keyframes. While export is running, scene/path controls and viewer pointer interaction are locked until the job completes or fails.
- The camera-path overlay is viewer-only guidance. It is hidden during export and is not burned into the captured MP4 frames.
- The `Performance` section exposes an optional `Adaptive FPS` toggle plus target slider. When enabled, live viewing can reduce the rendered gaussian budget to stay near the target FPS, and the note reports the live `rendered / total` count plus the current budget percentage.
- `Adaptive FPS` is a live-view optimization only. MP4 export pauses it, renders all frames at full quality, then restores the previous live budget afterward.
- The export panel now exposes deterministic export settings: a profile selector (`720p`, `1080p`, or `720p + 1080p Batch`), an integer FPS input, a file-base input, and a `Save Export Plan` action that writes those settings alongside the current path.
- Export progress is client-driven from rendered/uploaded frame counts plus a final `Encoding MP4 with FFmpeg…` phase. A dedicated `Cancel` button aborts the active request, tells the backend to kill/clean the FFmpeg job, and leaves no partially downloaded MP4 in the UI.
- Batch export runs one target at a time against the same recorded path and downloads each finished MP4 with deterministic file names (`<base>.mp4` for single-target profiles, `<base>-720p.mp4` / `<base>-1080p.mp4` for the batch profile).
- For LAN development, the frontend keeps using relative `/api/*` calls, the Vite proxy target can be overridden with `VITE_API_PROXY_TARGET`, and the backend now accepts arbitrary dev origins by default unless `CORS_ORIGIN` narrows or disables that behavior.
- The committed browser smoke fixture lives at `client/public/test-assets/smoke-grid.ply` and is used by the Firefox Playwright regression test.
- In the current host environment, the Firefox browser regression test fails before any scene load begins in both the `?viewerMode=default` and `?viewerMode=compat` paths with `Init error: Error creating WebGL context.` The same symptom can be caused by Firefox lacking WebGL support in headless mode, so interpret it as an environment compatibility failure first and an app regression only after confirming raw Firefox WebGL works on the host.
- The current client build emits a Vite warning from Spark's packaged WASM data URL during bundling, but the build still completes successfully.

## Development Guidance

- Treat `ASSIGNMENT.md` as the scope brief and success criteria.
- Build the real app at the repo root.
- Use `gsplat-viewer/` only as a reference source when porting later milestones.
- If you want Codex browser automation in this repo without re-enabling the host-wide Chrome MCP for every repo, launch Codex here via `./scripts/codex-with-chrome-mcp.sh`.

## Next Milestone

The next milestone is deliverable polish plus Firefox/renderer follow-up:

- capture/update the demo recording and one-page design note around the now-expanded export workflow
- investigate the Firefox `Init error: Error creating WebGL context.` startup failure now captured by the Playwright regression harness
- decide whether any additional optional extras should be added after the core deliverables are documented
