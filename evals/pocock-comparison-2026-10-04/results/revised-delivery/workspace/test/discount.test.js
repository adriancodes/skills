import test from 'node:test';
import assert from 'node:assert/strict';
import { discountCents } from '../src/discount.js';

test('the 500-cent discount begins at 10,000 cents', () => {
  for (const [subtotal, expected] of [
    [0, 0],
    [5000, 0],
    [9999, 0],
    [10000, 500],
    [10001, 500],
    [20000, 500],
  ]) {
    assert.equal(discountCents(subtotal), expected, `${subtotal} cents`);
  }
});
