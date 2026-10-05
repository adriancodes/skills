export function discountCents(subtotalCents) {
  return subtotalCents >= 10000 ? 500 : 0;
}
