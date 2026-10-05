import test from 'node:test';
import assert from 'node:assert/strict';
import { discountCents } from '../src/discount.js';

test('a fixed 500-cent discount starts at 10,000 cents', () => {
  for (const [subtotalCents, expected] of [
    [0, 0],
    [5000, 0],
    [9999, 0],
    [10000, 500],
    [10001, 500],
    [20000, 500],
    [Number.MAX_SAFE_INTEGER, 500],
  ]) {
    assert.equal(discountCents(subtotalCents), expected, `${subtotalCents} cents`);
  }
});
