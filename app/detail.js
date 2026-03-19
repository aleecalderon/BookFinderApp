import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text } from "react-native";

export default function DetailScreen() {
  const { libro } = useLocalSearchParams();

  let data = {};

  try {
    data = libro ? JSON.parse(libro) : {};
  } catch (error) {
    data = {};
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: data.portada || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />

      <Text style={styles.title}>
        {data.titulo || "Sin título"}
      </Text>

      <Text style={styles.author}>
        Autor: {data.autor || "Desconocido"}
      </Text>

      <Text style={styles.description}>
        {data.descripcion || "Sin descripción disponible"}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  image: {
    width: 160,
    height: 220,
    alignSelf: "center",
    marginBottom: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  author: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "justify",
    color: "#333",
  },
});