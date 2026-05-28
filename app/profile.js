import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";

import { useEffect, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#6C63FF";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Cargando ubicación...");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [preference, setPreference] = useState("");

  // 📍 GPS
  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocation("Permiso denegado");
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});

        setLocation(
          `Lat: ${loc.coords.latitude.toFixed(3)} | Lon: ${loc.coords.longitude.toFixed(3)}`
        );

        let geo = await Location.reverseGeocodeAsync(
          loc.coords
        );

        if (geo.length > 0) {
          setCity(geo[0].city || "Desconocida");

          if (geo[0].country === "El Salvador") {
            setLanguage("Español");
          } else {
            setLanguage("Inglés");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    getLocation();
  }, []);

  // 🔐 Guardar datos
  const saveData = async () => {
    try {
      await SecureStore.setItemAsync(
        "username",
        name
      );

      await SecureStore.setItemAsync(
        "email",
        email
      );

      await SecureStore.setItemAsync(
        "preference",
        preference
      );

      await SecureStore.setItemAsync(
        "token",
        "123ABC"
      );

      alert("Datos guardados correctamente ✨");
    } catch (error) {
      console.error(error);
    }
  };

  // 🔐 Cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedName =
          await SecureStore.getItemAsync(
            "username"
          );

        const savedEmail =
          await SecureStore.getItemAsync(
            "email"
          );

        const savedPref =
          await SecureStore.getItemAsync(
            "preference"
          );

        if (savedName) setName(savedName);

        if (savedEmail) setEmail(savedEmail);

        if (savedPref)
          setPreference(savedPref);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.headerCard}>
        <Text style={styles.emoji}>📚</Text>

        <Text style={styles.title}>
          Mi Perfil
        </Text>

        <Text style={styles.subtitle}>
          Configura tu cuenta y preferencias
        </Text>
      </View>

      {/* FORM */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>
          👤 Información personal
        </Text>

        <Text style={styles.label}>
          Nombre
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ingresa tu nombre"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>
          Correo electrónico
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="ejemplo@gmail.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>
          ❤️ Género favorito
        </Text>

        <TextInput
          style={styles.input}
          value={preference}
          onChangeText={setPreference}
          placeholder="Ej: Fantasía, Terror..."
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={saveData}
        >
          <Text style={styles.buttonText}>
            Guardar Información
          </Text>
        </TouchableOpacity>
      </View>

      {/* INFO */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          🌎 Información detectada
        </Text>

        <Text style={styles.info}>
          📍 {location}
        </Text>

        <Text style={styles.info}>
          🏙 Ciudad: {city}
        </Text>

        <Text style={styles.info}>
          🗣 Idioma: {language}
        </Text>
      </View>

      {/* CUENTA */}
      <View style={styles.accountCard}>
        <Text style={styles.infoTitle}>
          🔐 Cuenta guardada
        </Text>

        <Text style={styles.accountText}>
          👤 Usuario: {name || "No registrado"}
        </Text>

        <Text style={styles.accountText}>
          📧 Correo: {email || "No registrado"}
        </Text>

        <Text style={styles.accountText}>
          ❤️ Preferencia:{" "}
          {preference || "No definida"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    padding: 20,
  },

  headerCard: {
    backgroundColor: PRIMARY,
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    marginBottom: 25,
    elevation: 5,
  },

  emoji: {
    fontSize: 42,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },

  subtitle: {
    marginTop: 5,
    color: "#EDEBFF",
    fontSize: 14,
    textAlign: "center",
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    color: "#444",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    backgroundColor: "#FAFAFA",
    fontSize: 15,
    color: "#333",
  },

  button: {
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },

  accountCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    lineHeight: 20,
  },

  accountText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
    lineHeight: 20,
  },
});