import test from 'node:test';
import assert from 'node:assert/strict';
import { imageBounds, imageTransform } from '../src/lib/imageGeometry.js';
test('zoom uses the painted image rather than its letterboxed button', () => {
  const image = { matches: () => true, naturalWidth: 1600, naturalHeight: 1000, getBoundingClientRect: () => ({ left: 100, top: 50, width: 800, height: 400 }) };
  assert.deepEqual(imageBounds(image), { left: 180, top: 50, width: 640, height: 400 });
  assert.equal(imageBounds(null), null);
});
test('zoom maps both the center and scale between the thumbnail and detail', () => {
  const from = { left: 100, top: 50, width: 400, height: 250 };
  const to = { left: 0, top: 0, width: 800, height: 500 };
  assert.equal(imageTransform(from, to), 'translate(-100px, -75px) scale(0.5, 0.5)');
});
