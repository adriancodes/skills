const FREE_SHIPPING_CENTS = 5_000;

function copyLine(line) {
  return { priceCents: line.priceCents, quantity: line.quantity };
}

function copyLines(lines) {
  return lines.map((line) => copyLine(line));
}

function validateLine(line) {
  if (!Number.isInteger(line.priceCents) || line.priceCents < 0) {
    throw new TypeError("priceCents must be a non-negative integer");
  }
  if (!Number.isInteger(line.quantity) || line.quantity < 1) {
    throw new TypeError("quantity must be a positive integer");
  }
  return line;
}

function validatedLines(lines) {
  return lines.map((line) => validateLine(line));
}

function lineTotal(line) {
  return line.priceCents * line.quantity;
}

function subtotalFor(lines) {
  return lines.map((line) => lineTotal(line)).reduce((sum, value) => sum + value, 0);
}

class ShippingPolicy {
  constructor(freeShippingCents) {
    this.freeShippingCents = freeShippingCents;
  }

  shippingFor(subtotalCents) {
    if (subtotalCents >= this.freeShippingCents) {
      return 0;
    } else {
      return 499;
    }
  }
}

export function summarizeOrder(lines) {
  if (!Array.isArray(lines)) {
    throw new TypeError("lines must be an array");
  }

  const copied = copyLines(lines);
  const valid = validatedLines(copied);
  const subtotalCents = subtotalFor(valid);
  const policy = new ShippingPolicy(FREE_SHIPPING_CENTS);
  const shippingCents = policy.shippingFor(subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  return { subtotalCents, shippingCents, totalCents };
}
