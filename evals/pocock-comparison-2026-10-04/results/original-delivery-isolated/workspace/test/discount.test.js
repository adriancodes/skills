import test from 'node:test';
import assert from 'node:assert/strict';
import { discountCents } from '../src/discount.js';

test('the 500-cent discount starts at 10,000 cents', () => {
  for (const subtotal of [0, 1, 5000, 9999]) {
    assert.equal(discountCents(subtotal), 0);
  }
  for (const subtotal of [10000, 10001, 20000, Number.MAX_SAFE_INTEGER]) {
    assert.equal(discountCents(subtotal), 500);
  }
});
