import test from 'node:test';
import assert from 'node:assert/strict';
import { qualifiesForFreeShipping } from '../src/shipping.js';

test('free shipping begins at 5,000 cents', () => {
  for (const [subtotal, expected] of [[0, false], [4999, false], [5000, true], [5001, true], [10000, true]]) {
    assert.equal(qualifiesForFreeShipping(subtotal), expected, `subtotal ${subtotal}`);
  }
});
