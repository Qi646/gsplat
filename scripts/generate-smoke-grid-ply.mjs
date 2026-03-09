import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../client/public/test-assets/smoke-grid.ply');

const positions = [-0.9, 0, 0.9];
const splats = [];

for (const z of [-0.6, 0, 0.6]) {
  for (const y of positions) {
    for (const x of positions) {
      splats.push({
        position: [x, y, z],
        scale: [-1.25, -1.25, -1.25],
        rotation: [0, 0, 0, 1],
        opacity: 8,
        color: [
          0.2 + ((x + 0.9) / 1.8) * 0.8,
          0.2 + ((y + 0.9) / 1.8) * 0.8,
          0.35 + ((z + 0.6) / 1.2) * 0.65,
        ],
      });
    }
  }
}

const headerLines = [
  'ply',
  'format binary_little_endian 1.0',
  'comment Synthetic smoke-test fixture for browser render regression coverage',
  `element vertex ${splats.length}`,
  'property float scale_0',
  'property float scale_1',
  'property float scale_2',
  'property float rot_0',
  'property float rot_1',
  'property float rot_2',
  'property float rot_3',
  'property float x',
  'property float y',
  'property float z',
  'property float opacity',
  'property float red',
  'property float green',
  'property float blue',
  'end_header',
];

const header = `${headerLines.join('\n')}\n`;
const bytesPerSplat = 14 * 4;
const output = Buffer.alloc(Buffer.byteLength(header) + splats.length * bytesPerSplat);
let offset = output.write(header, 0, 'utf8');

for (const splat of splats) {
  for (const value of [
    ...splat.scale,
    ...splat.rotation,
    ...splat.position,
    splat.opacity,
    ...splat.color,
  ]) {
    output.writeFloatLE(value, offset);
    offset += 4;
  }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output);

console.log(`Wrote ${splats.length} synthetic splats to ${outputPath}`);
