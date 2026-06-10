import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL
  ? `${process.env.EXPO_PUBLIC_API_URL}/api/visiteurs`
  : "http://192.168.1.73:3000/api/visiteurs";

type Visitor = {
  id: number;
  nom: string;
  nbrjours: number;
  tarifjournalier: number;
};

type BarItem = {
  key: "min" | "total" | "max";
  label: string;
  value: number;
  color: string;
  active: boolean;
};

export default function Home() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBar, setActiveBar] = useState<"min" | "total" | "max">("total");

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: Visitor[]) => setVisitors(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const tarifsParVisiteur = visitors.map((v) => v.nbrjours * v.tarifjournalier);
  const tarifTotal = tarifsParVisiteur.reduce((s, n) => s + n, 0);
  const tarifMin =
    tarifsParVisiteur.length > 0 ? Math.min(...tarifsParVisiteur) : 0;
  const tarifMax =
    tarifsParVisiteur.length > 0 ? Math.max(...tarifsParVisiteur) : 0;

  const formatMGA = (n: number) =>
    n.toLocaleString("fr-FR").replace(/\u202f|\s/g, ".") + " MGA";

  const shortMGA = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  // Hauteur relative sur 140px, référence = tarifTotal (le plus grand en général)
  const ref = Math.max(tarifTotal, tarifMax, 1);
  const BAR_MAX_H = 140;

  const bars: BarItem[] = [
    {
      key: "min",
      label: "Min",
      value: tarifMin,
      color: "#D32F2F",
      active: activeBar === "min",
    },
    {
      key: "total",
      label: "Total",
      value: tarifTotal,
      color: "#1A237E",
      active: activeBar === "total",
    },
    {
      key: "max",
      label: "Max",
      value: tarifMax,
      color: "#0288D1",
      active: activeBar === "max",
    },
  ];

  const activeValue = bars.find((b) => b.key === activeBar)?.value ?? 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenue</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1A237E" />
          <Text style={styles.loadingText}>Chargement des données...</Text>
        </View>
      ) : (
        <>
          {/* Tarif Total Card */}
          <View style={styles.totalCard}>
            <View style={styles.totalCardHeader}>
              <Text style={styles.totalLabel}>TARIF TOTAL</Text>
              <View style={styles.iconCircle}>
                <Ionicons name="card-outline" size={20} color="#fff" />
              </View>
            </View>
            <Text style={styles.totalAmount}>{formatMGA(tarifTotal)}</Text>
            <Text style={styles.totalSub}>
              {visitors.length} visiteur{visitors.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {/* Min / Max Cards */}
          <View style={styles.rowCards}>
            <View style={styles.halfCard}>
              <Text style={styles.cardLabel}>TARIF MINIMAL</Text>
              <Text style={styles.cardValue}>
                {tarifMin.toLocaleString("fr-FR")}
              </Text>
              <Text style={styles.cardUnit}>MGA</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barLine,
                    {
                      backgroundColor: "#f80606",
                      width:
                        `${Math.round((tarifMin / Math.max(tarifMax, 1)) * 100)}%` as any,
                    },
                  ]}
                />
                <View style={styles.barLineEmpty} />
              </View>
            </View>
            <View style={styles.halfCard}>
              <Text style={styles.cardLabel}>TARIF MAXIMAL</Text>
              <Text style={styles.cardValue}>
                {tarifMax.toLocaleString("fr-FR")}
              </Text>
              <Text style={styles.cardUnit}>MGA</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barLine,
                    { backgroundColor: "#0fbf15", width: "100%" },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* ── HISTOGRAMME ── */}
          <View style={styles.chartCard}>
            {/* Titre + valeur active */}
            <View style={styles.chartHeaderRow}>
              <Text style={styles.chartTitle}>RÉPARTITION TARIFAIRE</Text>
              <View
                style={[
                  styles.activeBadge,
                  {
                    backgroundColor:
                      bars.find((b) => b.key === activeBar)?.color + "18",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.activeBadgeText,
                    { color: bars.find((b) => b.key === activeBar)?.color },
                  ]}
                >
                  {formatMGA(activeValue)}
                </Text>
              </View>
            </View>

            {/* Barres */}
            <View style={styles.chartBody}>
              {/* Grille horizontale */}
              <View style={styles.gridLines}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View key={i} style={styles.gridLine} />
                ))}
              </View>

              {/* Barres + labels */}
              <View style={styles.barsRow}>
                {bars.map((bar) => {
                  const h = Math.max(
                    Math.round((bar.value / ref) * BAR_MAX_H),
                    bar.value > 0 ? 6 : 0,
                  );
                  return (
                    <View key={bar.key} style={styles.barCol}>
                      <Text style={[styles.barTopValue, { color: bar.color }]}>
                        {shortMGA(bar.value)}
                      </Text>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              height: h,
                              backgroundColor: bar.color,
                              opacity: bar.active ? 1 : 0.35,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Footer — tabs Min / Total / Max */}
            <View style={styles.chartFooter}>
              <View style={styles.divider} />
              <View style={styles.tabsRow}>
                {bars.map((bar) => (
                  <View
                    key={bar.key}
                    style={[
                      styles.tab,
                      bar.active && {
                        borderBottomWidth: 2,
                        borderBottomColor: bar.color,
                      },
                    ]}
                  >
                    <View
                      style={[styles.tabDot, { backgroundColor: bar.color }]}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        bar.active
                          ? { color: bar.color, fontWeight: "800" }
                          : { color: "#aaa" },
                      ]}
                    >
                      {bar.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F2EEF0" },
  container: { padding: 20, paddingTop: 60, gap: 16, paddingBottom: 40 },

  loadingWrap: { marginTop: 60, alignItems: "center", gap: 12 },
  loadingText: { fontSize: 14, color: "#888" },

  header: { marginBottom: 4 },
  welcomeText: { fontSize: 32, fontWeight: "800", color: "#111" },

  /* Total Card */
  totalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  totalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1A237E",
    letterSpacing: 1.2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A237E",
    justifyContent: "center",
    alignItems: "center",
  },
  totalAmount: { fontSize: 34, fontWeight: "800", color: "#1A237E" },
  totalSub: { fontSize: 12, color: "#aaa", marginTop: 4, fontWeight: "500" },

  /* Row Cards */
  rowCards: { flexDirection: "row", gap: 12 },
  halfCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 1,
    marginBottom: 6,
  },
  cardValue: { fontSize: 24, fontWeight: "800", color: "#111" },
  cardUnit: {
    fontSize: 11,
    color: "#aaa",
    fontWeight: "600",
    marginBottom: 10,
  },
  barContainer: {
    flexDirection: "row",
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  barLine: { height: 3, borderRadius: 2 },
  barLineEmpty: { flex: 1, height: 3, backgroundColor: "#eee" },

  /* Chart Card */
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  chartHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 18,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  chartTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#bbb",
    letterSpacing: 1.2,
  },
  activeBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  activeBadgeText: { fontSize: 12, fontWeight: "800" },

  chartBody: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 0,
    position: "relative",
  },

  gridLines: {
    position: "absolute",
    top: 8,
    left: 20,
    right: 20,
    bottom: 0,
    justifyContent: "space-between",
    pointerEvents: "none",
  },
  gridLine: { height: 1, backgroundColor: "#F0F0F0" },

  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 180,
    paddingBottom: 0,
  },

  barCol: { flex: 1, alignItems: "center", justifyContent: "flex-end", gap: 6 },
  barTopValue: { fontSize: 11, fontWeight: "700" },
  barTrack: {
    width: 44,
    height: 140,
    justifyContent: "flex-end",
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    overflow: "hidden",
  },
  barFill: { width: "100%", borderRadius: 12 },

  chartFooter: { paddingHorizontal: 20, paddingBottom: 16, marginTop: 12 },
  divider: { height: 1, backgroundColor: "#eee", marginBottom: 12 },
  tabsRow: { flexDirection: "row", justifyContent: "space-around" },
  tab: {
    alignItems: "center",
    paddingBottom: 4,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  tabDot: { width: 8, height: 8, borderRadius: 4 },
  tabLabel: { fontSize: 13, fontWeight: "600" },
});
