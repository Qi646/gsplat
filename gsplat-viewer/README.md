# Gaussian Splat Viewer

A scene-focused 3D Gaussian Splat viewer with camera path recording and MP4 export.

## Prerequisites

- Node.js ≥ 18
- FFmpeg installed and on `$PATH`
  ```
  # macOS
  brew install ffmpeg

  # Ubuntu/Debian
  sudo apt install ffmpeg

  # Windows (via Chocolatey)
  choco install ffmpeg
  ```

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> The Vite dev server proxies `/api/*` to the Node server on port 3001.

## One-command production build + serve

```bash
npm run build
npm run start --workspace=server
```

---

## Usage

### 1. Load a Scene

- Paste a `.ply`, `.splat`, or `.ksplat` URL into the URL field, or
- Pick a preset from the **Presets** tab (smaller scenes load faster for testing)
- Click **Load Scene** and watch the progress bar

### 2. Navigate

| Mode | Controls |
|------|----------|
| Orbit (default) | Left drag to orbit, scroll to zoom, right drag to pan |
| Walk mode | Click **Walk Mode**, then WASD to move, mouse to look, ESC to exit |

- **Frame Scene** — fit camera to scene bounds
- **Reset View** — return to initial camera pose

### 3. Record a Camera Path

1. Navigate to a viewpoint
2. Click **Add Keyframe** (or press **K**)
3. Repeat for each position you want in the path
4. Use the **Timeline scrubber** to preview individual frames
5. Click **▶ Preview** (or press **Space**) to animate through the path

**Cinematic Presets** generate keyframes automatically based on the scene bounds:
- **Turntable** — 360° orbit around scene center
- **Dolly In** — push into the scene
- **Crane Up** — rising, surveying move
- **Figure-8** — lemniscate path around scene

### 4. Export MP4

1. Set resolution, FPS, duration, and quality
2. Click **Export MP4**
3. Watch the frame progress bar
4. MP4 downloads automatically when complete

### Save/Load Paths

- **Save** exports a `camera-path.json` for deterministic re-export
- **Load** restores a previously saved path

---

## Project Structure

```
gsplat-viewer/
├── client/
│   ├── src/
│   │   ├── viewer/
│   │   │   └── SceneViewer.ts        # GaussianSplats3D wrapper
│   │   ├── controls/
│   │   │   └── WalkControls.ts       # Pointer Lock WASD fly camera
│   │   ├── path/
│   │   │   ├── KeyframeManager.ts    # Keyframe CRUD + presets + preview
│   │   │   └── PathInterpolator.ts   # CatmullRom + quaternion slerp
│   │   ├── export/
│   │   │   └── ExportManager.ts      # Frame loop + server communication
│   │   ├── ui/
│   │   │   └── UIController.ts       # DOM wiring (no business logic)
│   │   ├── types.ts                  # Shared types + AppEvents bus
│   │   └── main.ts                   # Entry point
│   ├── index.html                    # UI shell + CSS
│   └── vite.config.ts
└── server/
    └── src/
        ├── routes/
        │   └── export.ts             # FFmpeg pipe sessions
        └── index.ts                  # Express app
```

---

## Design Notes

### Camera / Path Representation

Keyframes store `{ time, position: Vector3, quaternion: Quaternion, fov }`. Position is interpolated via Three.js `CatmullRomCurve3` (tension = 0.5) evaluated at the globally normalized `t`, giving smooth S-curves through all positions simultaneously. Rotation uses sequential quaternion slerp between adjacent keyframe pairs with the nearest-arc fix (`if q0·q1 < 0, negate q1`). Per-segment timing uses **smoothstep** (`t² * (3 - 2t)`) to add natural ease-in/ease-out without requiring manual easing controls.

### Export Pipeline

```
Browser renders frame → canvas.toBlob(PNG) → base64 → POST /api/export/frame
                                                         ↓
                                              FFmpeg stdin.write(buffer)
                                                         ↓
                                              POST /finish → stdin.end()
                                                         ↓
                                              FFmpeg encodes → output.mp4
                                                         ↓
                                              GET /download/:id → file stream
```

FFmpeg is spawned with `-f image2pipe -vcodec png` to accept raw PNG frames from stdin, and outputs H.264 with `-pix_fmt yuv420p -movflags +faststart` for universal QuickTime/VLC compatibility.

**Backpressure** is handled: if `stdin.write()` returns false, the server waits for the `drain` event before responding, so the browser naturally throttles frame submission.

### Performance Consideration

The most expensive operation is `canvas.toBlob()` on each frame — at 1920×1080 this blocks the main thread for ~15ms. Two mitigations are in place:

1. The export loop uses one `requestAnimationFrame` delay per frame to let the GaussianSplats3D sorter complete its GPU readback before pixel capture.
2. For high-resolution exports, the renderer is set to the export size only during export; it returns to the window size afterward to keep interactive performance fast.

A future improvement would be to use `OffscreenCanvas` + `transferToImageBitmap()` in a Web Worker to move the encoding off the main thread.

---

## Implemented Extras

- ✅ **Cinematic presets**: Turntable, Dolly In, Crane Up, Figure-8
- ✅ **Deterministic export**: Save/load `path.json` + settings for identical re-export
- ✅ **Progress + cancellation**: Per-frame progress bar + Cancel button (kills FFmpeg, cleans output)
- ✅ **Quality modes**: High (CRF 18) / Medium (CRF 23) / Draft (CRF 30)

---

## Known Limitations

- Very large `.ply` files (>500MB) may run out of browser memory; prefer `.ksplat` for large scenes
- Walk mode requires Pointer Lock API (supported in all modern browsers, must be triggered by user gesture)
- Export frame rate is limited by GPU rendering speed; at 1080p, expect ~2–5 seconds per frame
