import test from 'node:test';
import assert from 'node:assert/strict';
import { canvasOverview } from '../src/lib/canvasLayout.js';

test('nine landscape or poster images stay centered and inside the canvas', () => {
  for (const [width, height] of [[1342, 600], [718, 416], [364, 247]]) {
    for (const artwork of [{ width: 1280, height: 800 }, { width: 600, height: 840 }]) {
      const rects = canvasOverview(Array(9).fill(artwork), 3, width, height);
      assert.ok(Math.abs(rects[4].x - width / 2) < .001);
      assert.ok(Math.abs(rects[4].y - height / 2) < .001);
      for (const r of rects) {
        assert.ok(r.x - r.width / 2 >= 0 && r.x + r.width / 2 <= width);
        assert.ok(r.y - r.height / 2 >= 0 && r.y + r.height / 2 <= height);
        assert.ok(Math.abs(r.width / r.height - artwork.width / artwork.height) < .001);
      }
    }
  }
});

test('mixed artwork keeps its aspect ratio without overlapping neighbors', () => {
  const items = Array.from({ length: 9 }, (_, i) => i % 2 ? { width: 600, height: 840 } : { width: 1280, height: 800 });
  const rects = canvasOverview(items, 3, 718, 416);
  rects.forEach((a, i) => {
    assert.ok(Math.abs(a.width / a.height - items[i].width / items[i].height) < .001);
    rects.slice(i + 1).forEach(b => assert.ok(Math.abs(a.x - b.x) >= (a.width + b.width) / 2 || Math.abs(a.y - b.y) >= (a.height + b.height) / 2));
  });
});
