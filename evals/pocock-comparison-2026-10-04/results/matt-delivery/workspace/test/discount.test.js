import test from 'node:test';
import assert from 'node:assert/strict';
import { discountCents } from '../src/discount.js';

test('the 500-cent discount starts at 10,000 cents', () => {
  assert.equal(discountCents(0), 0);
  assert.equal(discountCents(9999), 0);
  assert.equal(discountCents(10000), 500);
  assert.equal(discountCents(10001), 500);
  assert.equal(discountCents(20000), 500);
});
