const GOLD_MINIMUM_CENTS = 10_000;

export function calculateDiscount({ tier, subtotalCents, coupon = null }) {
  if (coupon === "NO_DISCOUNT") return 0;
  if (tier !== "gold") return 0;
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0) {
    throw new TypeError("subtotalCents must be a non-negative integer");
  }

  return subtotalCents > GOLD_MINIMUM_CENTS
    ? Math.round(subtotalCents * 0.1)
    : 0;
}
