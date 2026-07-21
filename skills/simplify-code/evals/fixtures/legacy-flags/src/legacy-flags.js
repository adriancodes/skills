function isExactlyTrue(value) {
  if (value === true) {
    return true;
  }
  return false;
}

function normalizeName(name) {
  const asString = String(name);
  const trimmed = asString.trim();
  return trimmed;
}

function enabledEntries(flags) {
  const result = [];
  for (const flag of flags) {
    if (isExactlyTrue(flag.enabled)) {
      result.push(flag);
    }
  }
  return result;
}

function namesFor(flags) {
  const result = [];
  for (const flag of flags) {
    result.push(normalizeName(flag.name));
  }
  return result;
}

export function enabledFlagNames(flags) {
  const enabled = enabledEntries(flags);
  const names = namesFor(enabled);
  return names;
}
