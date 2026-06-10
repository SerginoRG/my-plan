import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Inscription() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordOne, setShowPasswordOne] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  // Fonction pour ouvrir la galerie
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Fonction pour ouvrir la caméra
  //   const takePhoto = async () => {
  //     const permission = await ImagePicker.requestCameraPermissionsAsync();

  //     if (!permission.granted) {
  //       Alert.alert("Permission requise", "L'accès à la caméra a été refusé.");
  //       return;
  //     }

  //     const result = await ImagePicker.launchCameraAsync({
  //       allowsEditing: true,
  //       aspect: [1, 1],
  //       quality: 1,
  //     });

  //     if (!result.canceled) {
  //       setImage(result.assets[0].uri);
  //     }
  //   };

  // Menu d'alerte pour choisir la source de l'image
  const choosePhotoProvider = () => {
    Alert.alert(
      "Photo de profil",
      "Sélectionnez une option pour ajouter votre photo",
      [
        // { text: "Prendre une photo", onPress: takePhoto },
        { text: "Choisir depuis la galerie", onPress: pickImage },
        { text: "Annuler", style: "cancel" },
      ],
    );
  };

  const handleRegister = async () => {
    if (!nom || !email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Erreur", "Veuillez accepter les conditions.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nom,
          email: email,
          password: password,
          image: image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès", "Compte créé avec succès !");
        // console.log(data);

        setNom("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setImage(null);
      } else {
        Alert.alert("Erreur", data.erreur);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
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

      {/* --- CONTENU SCROLLABLE --- */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Bouton Retour & Titre principal */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/")}
            >
              <Ionicons name="arrow-back" size={26} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Inscription</Text>
          </View>

          <Text style={styles.subtitle}>
            Rejoignez Visiteur App et facilitez vos accès.
          </Text>

          {/* --- Zone Photo de Profil dynamique --- */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarDashedCircle}
              activeOpacity={0.7}
              onPress={choosePhotoProvider}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.avatarImage} />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={32} color="#1a1a1a" />
                  <View style={styles.plusIconBadge}>
                    <Ionicons name="add" size={16} color="#fff" />
                  </View>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>Photo de profil</Text>
          </View>

          {/* --- Formulaire --- */}

          {/* Nom complet */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              placeholder="Jean Dupont"
              placeholderTextColor="#a0a0a0"
              value={nom}
              onChangeText={setNom}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="exemple@mail.com"
              placeholderTextColor="#a0a0a0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.iconInputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color="#1a1a1a"
                style={styles.leftIcon}
              />
              <TextInput
                style={styles.iconInput}
                placeholder="••••••••"
                placeholderTextColor="#a0a0a0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPasswordOne}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPasswordOne(!showPasswordOne)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPasswordOne ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#1a1a1a"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmer le mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.iconInputContainer}>
              <Ionicons
                name="refresh-outline"
                size={22}
                color="#1a1a1a"
                style={styles.leftIcon}
              />
              <TextInput
                style={styles.iconInput}
                placeholder="••••••••"
                placeholderTextColor="#a0a0a0"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPasswordTwo}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPasswordTwo(!showPasswordTwo)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPasswordTwo ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#1a1a1a"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* --- Case à cocher : Conditions d'utilisation --- */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            activeOpacity={0.8}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
          >
            <View
              style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}
            >
              {acceptedTerms && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              J'accepte les conditions d'utilisation
            </Text>
          </TouchableOpacity>

          {/* --- Bouton S'inscrire --- */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#546a7b", "#b1b9db"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.registerButtonText}>S'inscrire</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* --- Lien de Connexion --- */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "flex-start",
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    width: "100%",
  },

  // --- HEADER ARROW + TITLE ---
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 25,
    lineHeight: 24,
  },

  // --- PHOTO DE PROFIL COMPONENT ---
  avatarContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  avatarDashedCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: "#a0a0a0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.01)",
    position: "relative",
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  plusIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3a5866",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  avatarLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    fontWeight: "500",
  },

  // --- INPUTS STYLE ---
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#1a1a1a",
  },

  // --- INPUTS STYLE AVEC ICONS ---
  iconInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 20,
  },
  leftIcon: {
    marginRight: 10,
  },
  iconInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#1a1a1a",
  },
  eyeIcon: {
    paddingLeft: 10,
  },

  // --- CHECKBOX ---
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#00a3e0",
    borderColor: "#00a3e0",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#444",
  },

  // --- BOUTON DE CONFIRMATION ---
  registerButton: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 35,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  // --- FOOTER LINK ---
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    color: "#000",
  },
  loginLink: {
    fontSize: 15,
    color: "#00a3e0",
    fontWeight: "600",
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
});
