export async function evictKey(keyId: string) {
  await globalThis.keyCache.delete(keyId);
}
