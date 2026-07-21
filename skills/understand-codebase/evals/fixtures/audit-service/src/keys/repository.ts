const versions = new Map<string, number>();

export async function nextKeyVersion(keyId: string) {
  return (versions.get(keyId) ?? 0) + 1;
}

export async function storeKeyVersion(record: { keyId: string; version: number; secret: string; active: boolean }) {
  versions.set(record.keyId, record.version);
  await globalThis.keyStore.put(record);
}
