import test from 'node:test';
import assert from 'node:assert/strict';
import { scrollMetrics, trackToScroll, sliderPosition, snapSlide, gridStep } from '../src/lib/navigation.js';
test('panorama maps endpoints and handles a fitting image', () => {
  assert.deepEqual(scrollMetrics(800, 3200), { max: 2400, ratio: .25 });
  assert.equal(trackToScroll(0, 400, 100, 2400), 0);
  assert.equal(trackToScroll(150, 400, 100, 2400), 1200);
  assert.equal(trackToScroll(500, 400, 100, 2400), 2400);
  assert.equal(trackToScroll(20, 400, 400, 0), 0);
  assert.equal(scrollMetrics(800, 500).max, 0);
});
test('slider chip centers, rounding and boundaries', () => {
  assert.equal(sliderPosition(50, 600, 6), 0);
  assert.equal(sliderPosition(250, 600, 6), 2);
  assert.equal(sliderPosition(-50, 600, 6), 0);
  assert.equal(sliderPosition(800, 600, 6), 5);
  assert.equal(snapSlide(3.6, 6), 4);
  assert.equal(snapSlide(10, 1), 0);
  assert.equal(sliderPosition(10, 0, 0), 0);
});
test('rectangular grid keyboard reaches first and last items', () => {
  for (const [columns, count] of [[3,36],[3,18],[4,24]]) {
    assert.equal(gridStep(0, 'ArrowUp', columns, count), 0);
    assert.equal(gridStep(count - 1, 'ArrowDown', columns, count), count - 1);
    assert.equal(gridStep(0, 'End', columns, count), count - 1);
    assert.equal(gridStep(count - 1, 'Home', columns, count), 0);
  }
});
