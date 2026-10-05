import test from 'node:test';
import assert from 'node:assert/strict';
import { qualifiesForFreeShipping } from '../src/shipping.js';

test('free shipping starts at 5,000 cents', () => {
  assert.equal(qualifiesForFreeShipping(0), false);
  assert.equal(qualifiesForFreeShipping(4999), false);
  assert.equal(qualifiesForFreeShipping(5000), true);
  assert.equal(qualifiesForFreeShipping(5001), true);
});
