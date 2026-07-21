import { calculateDiscount } from "./discount.js";

export function quoteCheckout({ customer, cart, coupon = null }) {
  const discountCents = calculateDiscount({
    tier: customer.loyaltyTier,
    subtotalCents: cart.subtotalCents,
    coupon,
  });

  return {
    subtotalCents: cart.subtotalCents,
    discountCents,
    totalCents: cart.subtotalCents - discountCents,
  };
}
