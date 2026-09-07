export function qualifiesForFreeShipping(subtotalCents) {
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0) {
    throw new TypeError("subtotalCents must be a non-negative integer");
  }
  return subtotalCents >= 5_000;
}
