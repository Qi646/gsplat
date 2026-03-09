# Design Note

## Camera & Path Representation

Each **keyframe** is a plain JSON object: `{ id, time, position: {x,y,z}, quaternion: {x,y,z,w}, fov }`. Time is in seconds from path start and keyframes are kept sorted. This representation is serializable to `path.json` with zero transformation.

**Position interpolation** uses Three.js `CatmullRomCurve3` with tension 0.5. All keyframe positions are passed as control points, and the curve is evaluated at a globally normalized `t ∈ [0,1]` derived from the current time. This produces smooth S-curves that pass through every keyframe without oscillation artifacts from high tension values.

**Rotation interpolation** uses sequential quaternion slerp: given time `t`, we locate the surrounding keyframe pair `[kf_i, kf_{i+1}]`, compute a local `t'` within that segment, apply smoothstep easing, then slerp between the two quaternions. Before slerping, we check `q0 · q1 < 0` and negate `q1` if true — this ensures the interpolation takes the shortest arc and avoids spin artifacts at ±180° transitions.

**FOV** is linearly interpolated per segment.

**Easing** is global smoothstep (`t² * (3 - 2t)`) per segment, giving natural ease-in/ease-out without per-keyframe easing controls. This was chosen over per-segment cubic Bezier handles to reduce UI complexity while still producing cinematic-feeling motion.

---

## Export Pipeline

```
1. POST /start  →  spawn FFmpeg(-f image2pipe -vcodec png -i pipe:0 ... -vcodec libx264)
2. Frame loop:
     set camera pose → viewer.renderFrame() → one rAF tick → canvas.toBlob(PNG)
     → base64 → POST /frame → server writes buffer to FFmpeg stdin
3. POST /finish →  stdin.end() → await FFmpeg close event → 200 OK
4. GET /download/:id  →  fs.createReadStream → response
```

The key insight is that FFmpeg's `image2pipe` mode accepts an indefinite stream of PNG images via stdin and encodes them in order at the declared framerate. The server never buffers frames — it writes each PNG directly to `stdin` as it arrives. **Backpressure** is respected: if `stdin.write()` returns false, the server withholds the HTTP response until the `drain` event fires, causing the browser to pause naturally. This prevents memory overflow on long exports.

Output flags: `-pix_fmt yuv420p` (required for QuickTime compatibility), `-movflags +faststart` (moov atom at file head for immediate playback), `-preset medium` (good speed/quality balance).

---

## Performance Consideration

**The bottleneck is splat sorting.** GaussianSplats3D performs GPU-based splat sorting on every camera change. During export, the camera jumps to a new position each frame — the sorter needs one rAF cycle to issue the sort and a second to read back results. The export loop therefore inserts a `requestAnimationFrame` pause between setting the camera and capturing the frame. Skipping this produces visible sorting artifacts (splats rendered out of depth order).

The secondary bottleneck is `canvas.toBlob()` on the main thread. At 1920×1080, this serializes ~6MB of pixel data per frame. For a 30fps, 30s export this is 900 blobs = ~5.4GB serialized. The current implementation serializes each frame sequentially to avoid memory spikes. A future optimization would use `canvas.transferToImageBitmap()` to an `OffscreenCanvas` worker, freeing the main thread between frames and potentially doubling throughput.
