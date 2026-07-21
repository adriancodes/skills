import assert from "node:assert/strict";
import test from "node:test";
import { quoteCheckout } from "../src/checkout.js";

const quote = (loyaltyTier, subtotalCents, coupon = null) =>
  quoteCheckout({
    customer: { loyaltyTier },
    cart: { subtotalCents },
    coupon,
  });

test("Gold customer below the threshold receives no discount", () => {
  assert.equal(quote("gold", 9_999).discountCents, 0);
});

test("Gold customer at the threshold receives 10% off", () => {
  assert.equal(quote("gold", 10_000).discountCents, 1_000);
});

test("Gold customer above the threshold receives 10% off", () => {
  assert.equal(quote("gold", 10_001).discountCents, 1_000);
});

test("Non-Gold customer receives no loyalty discount", () => {
  assert.equal(quote("silver", 10_000).discountCents, 0);
});

test("No-discount coupon suppresses the loyalty discount", () => {
  assert.equal(quote("gold", 10_000, "NO_DISCOUNT").discountCents, 0);
});
