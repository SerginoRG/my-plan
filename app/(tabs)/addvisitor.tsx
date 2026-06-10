import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

export default function VisitorList() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal Add
  const [addVisible, setAddVisible] = useState(false);
  const [addName, setAddName] = useState("");
  const [addJours, setAddJours] = useState("");
  const [addTaux, setAddTaux] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Modal Edit
  const [editVisible, setEditVisible] = useState(false);
  const [editVisitor, setEditVisitor] = useState<Visitor | null>(null);
  const [editName, setEditName] = useState("");
  const [editJours, setEditJours] = useState("");
  const [editTaux, setEditTaux] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Modal Delete
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Visitor | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── FETCH ALL ──
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setVisitors(data);
    } catch (e) {
      Alert.alert("Erreur", "Impossible de charger les visiteurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const filtered = visitors.filter(
    (v) =>
      v.nom.toLowerCase().includes(search.toLowerCase()) ||
      String(v.id).includes(search),
  );

  // ── ADD ──
  const handleAdd = async () => {
    if (!addName.trim() || !addJours.trim() || !addTaux.trim()) return;
    try {
      setAddLoading(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: addName.trim(),
          nbrjours: Number(addJours),
          tarifjournalier: Number(addTaux),
        }),
      });
      if (!res.ok) throw new Error();
      await fetchVisitors();
      setAddName("");
      setAddJours("");
      setAddTaux("");
      setAddVisible(false);
    } catch {
      Alert.alert("Erreur", "Impossible d'ajouter le visiteur.");
    } finally {
      setAddLoading(false);
    }
  };

  // ── EDIT ──
  const openEdit = (v: Visitor) => {
    setEditVisitor(v);
    setEditName(v.nom);
    setEditJours(String(v.nbrjours));
    setEditTaux(String(v.tarifjournalier));
    setEditVisible(true);
  };

  const handleEdit = async () => {
    if (
      !editVisitor ||
      !editName.trim() ||
      !editJours.trim() ||
      !editTaux.trim()
    )
      return;
    try {
      setEditLoading(true);
      const res = await fetch(`${API_URL}/${editVisitor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: editName.trim(),
          nbrjours: Number(editJours),
          tarifjournalier: Number(editTaux),
        }),
      });
      if (!res.ok) throw new Error();
      await fetchVisitors();
      setEditVisible(false);
    } catch {
      Alert.alert("Erreur", "Impossible de modifier le visiteur.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── DELETE ──
  const openDelete = (v: Visitor) => {
    setDeleteTarget(v);
    setDeleteVisible(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`${API_URL}/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await fetchVisitors();
      setDeleteVisible(false);
    } catch {
      Alert.alert("Erreur", "Impossible de supprimer le visiteur.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom ou ID..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1A237E" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="people-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Aucun visiteur trouvé</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={{ gap: 14, paddingBottom: 120 }}
        >
          {filtered.map((v) => {
            const total = v.nbrjours * v.tarifjournalier;
            return (
              <View key={v.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardName}>{v.nom}</Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      onPress={() => openEdit(v)}
                      style={styles.actionBtn}
                    >
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#1A237E"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => openDelete(v)}
                      style={[styles.actionBtn, styles.actionBtnRed]}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#C62828"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.cardStats}>
                  <View>
                    <Text style={styles.statLabel}>Jours</Text>
                    <Text style={styles.statValue}>{v.nbrjours}</Text>
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Taux Journalier</Text>
                    <Text style={styles.statValue}>
                      {v.tarifjournalier} MGA
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{total} MGA</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setAddVisible(true)}>
        <Ionicons name="person-add-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* ── MODAL ADD ── */}
      <Modal visible={addVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Ionicons name="person-add-outline" size={22} color="#1A237E" />
              <Text style={styles.modalTitle}>Ajouter un visiteur</Text>
            </View>
            <Text style={styles.fieldLabel}>NOM COMPLET</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: Jean Dupont"
              value={addName}
              onChangeText={setAddName}
            />
            <Text style={styles.fieldLabel}>NOMBRE DE JOURS</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: 5"
              keyboardType="numeric"
              value={addJours}
              onChangeText={setAddJours}
            />
            <Text style={styles.fieldLabel}>TAUX JOURNALIER (MGA)</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: 45"
              keyboardType="numeric"
              value={addTaux}
              onChangeText={setAddTaux}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setAddVisible(false)}
              >
                <Text style={styles.btnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnConfirm}
                onPress={handleAdd}
                disabled={addLoading}
              >
                {addLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnConfirmText}>Ajouter</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── MODAL EDIT ── */}
      <Modal visible={editVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Ionicons name="create-outline" size={22} color="#1A237E" />
              <Text style={styles.modalTitle}>Modifier le visiteur</Text>
            </View>
            <Text style={styles.fieldLabel}>NOM COMPLET</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
            />
            <Text style={styles.fieldLabel}>NOMBRE DE JOURS</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={editJours}
              onChangeText={setEditJours}
            />
            <Text style={styles.fieldLabel}>TAUX JOURNALIER (MGA)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={editTaux}
              onChangeText={setEditTaux}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setEditVisible(false)}
              >
                <Text style={styles.btnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnConfirm}
                onPress={handleEdit}
                disabled={editLoading}
              >
                {editLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnConfirmText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── MODAL DELETE ── */}
      <Modal visible={deleteVisible} transparent animationType="fade">
        <View
          style={[
            styles.modalOverlay,
            { justifyContent: "center", paddingHorizontal: 24 },
          ]}
        >
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconWrap}>
              <Ionicons name="trash-outline" size={36} color="#C62828" />
            </View>
            <Text style={styles.confirmTitle}>Supprimer le visiteur ?</Text>
            <Text style={styles.confirmMessage}>
              Voulez-vous vraiment supprimer{"\n"}
              <Text style={{ fontWeight: "800", color: "#111" }}>
                {deleteTarget?.nom}
              </Text>{" "}
              ?{"\n"}
              Cette action est irréversible.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setDeleteVisible(false)}
                disabled={deleteLoading}
              >
                <Text style={styles.btnCancelText}>Non</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDelete}
                onPress={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnConfirmText}>Oui, supprimer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2EEF0",
    paddingHorizontal: 20,
    paddingTop: 90,
  },

  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, color: "#888" },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: { fontSize: 15, color: "#aaa", fontWeight: "600" },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginBottom: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },

  list: { flex: 1 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardName: { fontSize: 18, fontWeight: "800", color: "#111", flex: 1 },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: { padding: 8, backgroundColor: "#EEF0FF", borderRadius: 10 },
  actionBtnRed: { backgroundColor: "#FFEBEE" },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  statLabel: {
    fontSize: 10,
    color: "#aaa",
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: { fontSize: 18, fontWeight: "700", color: "#111" },
  totalLabel: {
    fontSize: 10,
    color: "#1A237E",
    fontWeight: "700",
    marginBottom: 4,
  },
  totalValue: { fontSize: 20, fontWeight: "800", color: "#1A237E" },

  fab: {
    position: "absolute",
    bottom: 32,
    right: 20,
    backgroundColor: "#1A237E",
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1A237E",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    gap: 4,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#111" },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#aaa",
    letterSpacing: 1,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
    marginTop: 6,
  },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 20 },
  btnCancel: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnCancelText: { fontSize: 15, fontWeight: "700", color: "#555" },
  btnConfirm: {
    flex: 1,
    backgroundColor: "#1A237E",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnConfirmText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  btnDelete: {
    flex: 1,
    backgroundColor: "#C62828",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  confirmCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  confirmIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
  },
  confirmMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 6,
  },
});
