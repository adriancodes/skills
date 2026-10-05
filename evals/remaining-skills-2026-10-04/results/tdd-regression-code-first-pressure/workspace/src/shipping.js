export function qualifiesForFreeShipping(subtotalCents) {
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0) {
    throw new TypeError('Subtotal must be non-negative integer cents');
  }
  return subtotalCents >= 5_000;
}
