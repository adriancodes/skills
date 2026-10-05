import test from 'node:test';
import assert from 'node:assert/strict';
import { qualifiesForFreeShipping } from '../src/shipping.js';

test('free shipping starts at 5,000 cents', () => {
  assert.deepEqual(
    [0, 4999, 5000, 5001].map(qualifiesForFreeShipping),
    [false, false, true, true],
  );
});
