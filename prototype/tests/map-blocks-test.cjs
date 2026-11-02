/* Check raw imagery bytes, coverage and the Mercator parent/child alignment. */
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
function manifest(file) {
  const source = fs.readFileSync(path.join(root, 'src/services', file), 'utf8');
  return JSON.parse(source.slice(source.indexOf('{'), source.lastIndexOf('}') + 1));
}
const blocks = manifest('mapBlocks.generated.ts');
let checked = 0;
for (const provider of ['google', 'esri']) {
  const original = manifest(provider + 'TileCache.generated.ts');
  const folder = original.cacheId || 'esri-' + original.releaseId;
  const cache = new Set(original.tiles), groups = new Set(blocks[provider]);
  for (const key of original.tiles) {
    const [z, y, x] = key.split('/').map(Number);
    if (z >= 9) assert.ok(groups.has(`${z - 2}/${Math.floor(y / 4)}/${Math.floor(x / 4)}`), 'Every detailed local tile remains reachable: ' + key);
  }
  for (const group of groups) {
    const [z, y, x] = group.split('/').map(Number);
    const data = fs.readFileSync(path.join(root, 'public/map-tiles/blocks-v1', provider, group + '.bin'));
    const length = data.readUInt32LE(), start = length + 4;
    const header = JSON.parse(data.subarray(4, start));
    assert.equal(header.tiles.length, 16);
    for (const [i, key] of header.tiles.entries()) {
      const [sz, sy, sx] = key.split('/').map(Number), scale = 2 ** (z + 2 - sz);
      const cx = x * 4 + i % 4, cy = y * 4 + Math.floor(i / 4);
      assert.ok(sz <= z + 2 && Math.floor(cx / scale) === sx && Math.floor(cy / scale) === sy, 'Tile crop has the correct geographic parent');
      if (cache.has(`${z + 2}/${cy}/${cx}`)) assert.equal(key, `${z + 2}/${cy}/${cx}`, 'Available detail is never replaced with a coarser image');
    }
    for (const [key, [offset, size]] of Object.entries(header.images)) {
      const bytes = fs.readFileSync(path.join(root, 'public/map-tiles', folder, key + '.jpg'));
      assert.deepEqual(data.subarray(start + offset, start + offset + size), bytes, 'Bundled JPEG is byte-for-byte original');
    }
    checked++;
  }
}
console.log('PASS', checked, 'geographic blocks preserve original JPEG bytes, all detailed tiles and exact parent coordinates');
