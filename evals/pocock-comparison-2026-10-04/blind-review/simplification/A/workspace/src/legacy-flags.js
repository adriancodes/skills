export function enabledFlagNames(flags) {
  const enabled = [];
  for (const flag of flags) {
    if (flag.enabled === true) {
      enabled.push(flag);
    }
  }

  const names = [];
  for (const flag of enabled) {
    names.push(String(flag.name).trim());
  }
  return names;
}
