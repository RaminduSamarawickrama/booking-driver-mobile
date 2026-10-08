import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BackendPanel } from "./src/backend/BackendPanel";
import { theme } from "./src/theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <StatusBar style={theme.statusBar} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.kicker}>DRIVER</Text>
            <Text style={styles.title}>Ready when you are.</Text>
            <Text style={styles.lead}>
              Going online, job offers, ride steps and earnings arrive in the next increments. For now this build
              confirms it can reach the backend.
            </Text>
          </View>
          <BackendPanel />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, gap: 24 },
  header: { gap: 8, paddingTop: 12 },
  kicker: { color: theme.accent, fontSize: 12, letterSpacing: 2.5, fontWeight: "700" },
  title: { color: theme.ink, fontSize: 32, lineHeight: 38, fontWeight: "700", letterSpacing: -0.5 },
  lead: { color: theme.muted, fontSize: 16, lineHeight: 23 },
});
