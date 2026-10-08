import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  checkHealth,
  clearOverride,
  resolveApiConfig,
  saveOverride,
  type ApiConfig,
  type HealthStatus,
} from "@booking/shared/runtime-config";
import { secureKeyValueStore } from "./secureStore";
import { theme } from "../theme";

const buildApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const allowOverride = process.env.EXPO_PUBLIC_ALLOW_API_OVERRIDE !== "false";

const SOURCE_LABEL: Record<ApiConfig["source"], string> = {
  override: "set on this phone",
  build: "from the build",
  default: "default",
};

/**
 * Shows which backend this build talks to and lets a developer point it at a LAN IP
 * or a Cloudflare tunnel without rebuilding. On a phone, localhost is the phone itself,
 * so the default only works in a simulator.
 */
export function BackendPanel() {
  const store = useMemo(secureKeyValueStore, []);
  const [config, setConfig] = useState<ApiConfig>(
    () => resolveApiConfig({ store, buildApiBaseUrl, allowOverride }).config,
  );
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);

  const probe = useCallback(async (url: string) => {
    setHealth(null);
    setHealth(await checkHealth(url));
  }, []);

  useEffect(() => {
    void probe(config.apiBaseUrl);
  }, [config.apiBaseUrl, probe]);

  const apply = () => {
    try {
      setConfig(saveOverride(store, draft));
      setDraft("");
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const reset = () => {
    clearOverride(store);
    setConfig(resolveApiConfig({ store, buildApiBaseUrl, allowOverride }).config);
  };

  const status =
    health === null
      ? { text: "Checking…", color: theme.muted }
      : health.state === "up"
        ? { text: `Reachable · ${health.latencyMs} ms`, color: theme.ok }
        : { text: `Not reachable · ${health.reason}`, color: theme.danger };

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>BACKEND</Text>
      <Text style={styles.url} selectable>
        {config.apiBaseUrl}
      </Text>
      <Text style={styles.meta}>{SOURCE_LABEL[config.source]}</Text>
      <View style={styles.statusRow}>
        <View style={[styles.dot, { backgroundColor: status.color }]} />
        <Text style={[styles.status, { color: status.color }]}>{status.text}</Text>
      </View>

      {allowOverride && (
        <>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="http://192.168.1.20:8080 or https://….trycloudflare.com"
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            onSubmitEditing={apply}
            accessibilityLabel="Backend URL"
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.primary]} onPress={apply} disabled={!draft.trim()}>
              <Text style={styles.primaryText}>Use this backend</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => void probe(config.apiBaseUrl)}>
              <Text style={styles.buttonText}>Recheck</Text>
            </Pressable>
            {config.source === "override" && (
              <Pressable style={styles.button} onPress={reset}>
                <Text style={styles.buttonText}>Reset</Text>
              </Pressable>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.line,
  },
  eyebrow: { color: theme.muted, fontSize: 12, letterSpacing: 2, fontWeight: "700" },
  url: { color: theme.ink, fontSize: 18, fontWeight: "600", fontVariant: ["tabular-nums"] },
  meta: { color: theme.muted, fontSize: 13 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  status: { fontSize: 14, fontWeight: "500", flexShrink: 1 },
  input: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.ink,
    backgroundColor: theme.background,
  },
  error: { color: theme.danger, fontSize: 13 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.line,
    justifyContent: "center",
  },
  buttonText: { color: theme.ink, fontSize: 15, fontWeight: "500" },
  primary: { backgroundColor: theme.accent, borderColor: theme.accent },
  primaryText: { color: theme.onAccent, fontSize: 15, fontWeight: "600" },
});
