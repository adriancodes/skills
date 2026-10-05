export function enabledFlagNames(flags) {
  const enabled = [];
  for (const flag of flags) {
    if (flag.enabled === true) {
      enabled.push(flag);
    }
  }
  return enabled.map(flag => String(flag.name).trim());
}
