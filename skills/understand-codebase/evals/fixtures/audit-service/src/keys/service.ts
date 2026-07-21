import { evictKey } from "./cache";
import { nextKeyVersion, storeKeyVersion } from "./repository";

export async function rotateApiKey(keyId: string) {
  const version = await nextKeyVersion(keyId);
  const secret = crypto.randomUUID();
  await storeKeyVersion({ keyId, version, secret, active: true });
  await evictKey(keyId);
  return { keyId, version };
}
