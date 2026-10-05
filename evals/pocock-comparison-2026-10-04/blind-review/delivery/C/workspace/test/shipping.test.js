import test from 'node:test';
import assert from 'node:assert/strict';
import { qualifiesForFreeShipping } from '../src/shipping.js';

test('free shipping starts at 5,000 cents', () => {
  for (const subtotal of [0, 1, 4999]) {
    assert.equal(qualifiesForFreeShipping(subtotal), false);
  }
  for (const subtotal of [5000, 5001, 10000, Number.MAX_SAFE_INTEGER]) {
    assert.equal(qualifiesForFreeShipping(subtotal), true);
  }
});
