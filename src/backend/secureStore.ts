import * as SecureStore from "expo-secure-store";
import type { KeyValueStore } from "@booking/shared/runtime-config";

/**
 * Synchronous KeyValueStore over the device keychain / keystore, as runtime-config expects.
 * Removal is async in expo-secure-store, so a local cache answers reads until it finishes.
 */
export function secureKeyValueStore(): KeyValueStore {
  const cache = new Map<string, string | null>();
  return {
    getItem(key) {
      if (cache.has(key)) return cache.get(key) ?? null;
      const value = SecureStore.getItem(key);
      cache.set(key, value);
      return value;
    },
    setItem(key, value) {
      SecureStore.setItem(key, value);
      cache.set(key, value);
    },
    removeItem(key) {
      cache.set(key, null);
      void SecureStore.deleteItemAsync(key);
    },
  };
}
