import assert from 'node:assert/strict';
import test from 'node:test';
import { qualifiesForFreeShipping } from '../src/shipping.js';

test('free shipping begins at 5,000 cents', () => {
  assert.equal(qualifiesForFreeShipping(0), false);
  assert.equal(qualifiesForFreeShipping(4_999), false);
  assert.equal(qualifiesForFreeShipping(5_000), true);
  assert.equal(qualifiesForFreeShipping(5_001), true);
});

test('rejects negative and non-integer cents with TypeError', () => {
  for (const subtotal of [-1, 4_999.5, 5_000.5, NaN, Infinity, '5000', null, undefined]) {
    assert.throws(() => qualifiesForFreeShipping(subtotal), TypeError);
  }
});
