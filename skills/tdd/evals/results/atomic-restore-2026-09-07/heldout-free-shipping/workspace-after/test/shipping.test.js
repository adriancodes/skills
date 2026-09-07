import assert from "node:assert/strict";
import test from "node:test";
import { qualifiesForFreeShipping } from "../src/shipping.js";

test("free shipping begins at 5,000 cents", () => {
  assert.equal(qualifiesForFreeShipping(4_999), false);
  assert.equal(qualifiesForFreeShipping(5_000), true);
});

test("rejects negative or non-integer input with TypeError", () => {
  assert.throws(() => qualifiesForFreeShipping(-1), TypeError);
  assert.throws(() => qualifiesForFreeShipping(49.99), TypeError);
  assert.throws(() => qualifiesForFreeShipping("5000"), TypeError);
});
