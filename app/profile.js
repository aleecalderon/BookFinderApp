import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

// 👇 MANTENEMOS tu pantalla del compañero
import CollectionScreen from "../src/screens/CollectionScreen";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Cargando...");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [preference, setPreference] = useState("");

  // 📍 GPS
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocation("Permiso denegado");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(`Lat: ${loc.coords.latitude}, Lon: ${loc.coords.longitude}`);

      let geo = await Location.reverseGeocodeAsync(loc.coords);

      if (geo.length > 0) {
        setCity(geo[0].city || "Desconocida");

        if (geo[0].country === "El Salvador") {
          setLanguage("Español");
        } else {
          setLanguage("Inglés");
        }
      }
    };

    getLocation();
  }, []);

  // 🔐 Guardar
  const saveData = async () => {
    await SecureStore.setItemAsync("username", name);
    await SecureStore.setItemAsync("preference", preference);
    await SecureStore.setItemAsync("token", "123ABC");

    alert("Guardado!");
  };

  // 🔐 Cargar
  useEffect(() => {
    const loadData = async () => {
      const savedName = await SecureStore.getItemAsync("username");
      const savedPref = await SecureStore.getItemAsync("preference");

      if (savedName) setName(savedName);
      if (savedPref) setPreference(savedPref);
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      
      {/* 🔽 TU PERFIL (ARRIBA) */}
      <Text style={styles.title}>👤 Perfil</Text>

      <Text>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre"
      />

      <Text>Preferencia:</Text>
      <TextInput
        style={styles.input}
        value={preference}
        onChangeText={setPreference}
        placeholder="Ej: Fantasía"
      />

      <Button title="Guardar" onPress={saveData} />

      <Text style={styles.info}>📍 {location}</Text>
      <Text style={styles.info}>🏙 {city}</Text>
      <Text style={styles.info}>🌎 {language}</Text>

      {/* 🔽 LO DEL COMPAÑERO (ABAJO) */}
      <View style={{ flex: 1 }}>
        <CollectionScreen />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
  },
  info: {
    marginTop: 5,
  },
});