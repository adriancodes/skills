export function enabledFlagNames(flags) {
  const enabled = [];
  for (const flag of flags) {
    if (flag.enabled === true) {
      enabled.push(flag);
    }
  }

  // Finish checking enabled values before reading names to preserve error order.
  const names = [];
  for (const flag of enabled) {
    names.push(String(flag.name).trim());
  }
  return names;
}
