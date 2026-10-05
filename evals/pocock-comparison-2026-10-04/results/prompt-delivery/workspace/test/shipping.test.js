import test from 'node:test';
import assert from 'node:assert/strict';
import { qualifiesForFreeShipping } from '../src/shipping.js';

test('free shipping starts at 5000 cents', () => {
  for (const [subtotalCents, expected] of [
    [0, false],
    [4999, false],
    [5000, true],
    [5001, true],
    [20000, true],
  ]) {
    assert.equal(qualifiesForFreeShipping(subtotalCents), expected,
      `subtotal ${subtotalCents} cents`);
  }
});
