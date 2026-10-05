import test from 'node:test';
import assert from 'node:assert/strict';
import { qualifiesForFreeShipping } from '../src/shipping.js';

test('free shipping starts at 5,000 cents', () => {
  for (const subtotalCents of [0, 1, 4999]) {
    assert.equal(qualifiesForFreeShipping(subtotalCents), false);
  }
  for (const subtotalCents of [5000, 5001, 10000]) {
    assert.equal(qualifiesForFreeShipping(subtotalCents), true);
  }
});
