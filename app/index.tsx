// app/index.tsx
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform, 
    Alert,
} from "react-native";

const { width, height } = Dimensions.get("window");



export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    return;
  }

  try {
    const response = await fetch(
      "http://192.168.1.73:3000/api/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Erreur", data.erreur);
      return;
    }

    // Alert.alert("Succès", data.message);

    // console.log("Utilisateur connecté :", data.user);

  router.replace("/home");
  } catch (error) {
    Alert.alert(
      "Erreur de connexion",
      "Impossible de contacter le serveur."
    );
  }
};

  return (
    <KeyboardAvoidingView 
      style={styles.mainContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* --- ARRIÈRE-PLAN AVEC LES BULLES FLOUES --- */}
      <View style={StyleSheet.absoluteFillObject}>
        <View style={[styles.bubble, styles.topLeftBubble]} />
        
        <LinearGradient
          colors={["rgba(0, 163, 224, 0.4)", "rgba(90, 125, 154, 0.1)"]}
          style={[styles.bubble, styles.topRightBubble]}
        />

        <LinearGradient
          colors={["rgba(90, 125, 154, 0.2)", "rgba(255, 255, 255, 0)"]}
          style={[styles.bubble, styles.bottomLeftBubble]}
        />
      </View>

      {/* --- CONTENU DE L'ÉCRAN SCROLLABLE (CHAMPS + BOUTON) --- */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header (M
          onté plus haut grâce au justifyContent et marginTop réduit) */}
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Accédez à votre tableau de bord de gestion des visiteurs.
          </Text>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="nom@exemplegmail.com"
              placeholderTextColor="#a0a0a0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Mot de passe</Text>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Oublié ?</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#a0a0a0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#1a1a1a"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#546a7b", "#7292a6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      
      {/* --- LIEN D'INSCRIPTION FIXÉ STRICTEMENT EN BAS --- */}
      <View style={styles.fixedSignupContainer}>
        <Text style={styles.signupText}>Pas encore de compte ?</Text>
        <TouchableOpacity
          onPress={() => router.push("/inscription/inscription")}
          >
          <Text style={styles.signupLink}>Créer un compte</Text>
        </TouchableOpacity>
      </View>

          </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    // Changement ici : "flex-start" au lieu de "flex-end" pour pousser le contenu vers le haut (zone verte)
    justifyContent: "flex-start", 
    // On laisse de l'espace en bas pour que le contenu ne vienne pas sous le bouton fixe
    paddingBottom: 100, 
  },
  content: {
    paddingHorizontal: 28,
    paddingVertical: 40,
    width: "100%",
  },
  
  // --- STYLES DES BULLES D'ARRIÈRE-PLAN ---
  bubble: {
    position: "absolute",
    borderRadius: 200,
  },
  topLeftBubble: {
    width: width * 0.8,
    height: width * 0.8,
    top: -height * 0.1,
    left: -width * 0.2,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    transform: [{ scaleX: 1.2 }],
  },
  topRightBubble: {
    width: width * 0.9,
    height: width * 0.9,
    top: height * 0.1,
    right: -width * 0.3,
    opacity: 0.8,
  },
  bottomLeftBubble: {
    width: width * 0.8,
    height: width * 0.8,
    bottom: -height * 0.1,
    left: -width * 0.2,
  },

  // --- STYLES DES TEXTES ---
  title: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1a1a1a",
    letterSpacing: -0.5,
    // marginTop réduit pour coller au plus haut de la zone verte
    marginTop: height * 0.05, 
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#999",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#1a1a1a",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 24,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#1a1a1a",
  },
  eyeIcon: {
    paddingLeft: 10,
  },
  
  // --- BOUTON DE CONNEXION ---
  loginButton: {
    marginTop: 15,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  
  // --- NOUVEAU STYLE POUR RENDRE LE BLOC COMPTE FIXE EN BAS ---
  fixedSignupContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "transparent", // Permet de voir les bulles derrière
  },
  signupText: {
    fontSize: 15,
    color: "#333",
  },
  signupLink: {
    fontSize: 15,
    color: "#00a3e0",
    fontWeight: "600",
    marginLeft: 4,
  },
});