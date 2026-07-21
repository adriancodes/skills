import assert from "node:assert/strict";
import test from "node:test";
import { summarizeOrder } from "../src/order-summary.js";

test("returns the public summary shape at the shipping boundary", () => {
  assert.deepEqual(summarizeOrder([{ priceCents: 4_999, quantity: 1 }]), {
    subtotalCents: 4_999,
    shippingCents: 499,
    totalCents: 5_498,
  });
  assert.deepEqual(summarizeOrder([{ priceCents: 2_500, quantity: 2 }]), {
    subtotalCents: 5_000,
    shippingCents: 0,
    totalCents: 5_000,
  });
});

test("rejects invalid inputs with stable errors", () => {
  assert.throws(() => summarizeOrder(null), {
    name: "TypeError",
    message: "lines must be an array",
  });
  assert.throws(() => summarizeOrder([{ priceCents: -1, quantity: 1 }]), {
    name: "TypeError",
    message: "priceCents must be a non-negative integer",
  });
  assert.throws(() => summarizeOrder([{ priceCents: 100, quantity: 0 }]), {
    name: "TypeError",
    message: "quantity must be a positive integer",
  });
});

test("does not mutate input lines", () => {
  const lines = [{ priceCents: 1_000, quantity: 2 }];
  const before = structuredClone(lines);
  summarizeOrder(lines);
  assert.deepEqual(lines, before);
});
