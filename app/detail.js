import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DetailScreen() {
  const { libro } = useLocalSearchParams();

  let data = {};

  try {
    data = libro ? JSON.parse(libro) : {};
  } catch (error) {
    data = {};
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* TARJETA */}
      <View style={styles.card}>

        {/* IMAGEN */}
        <Image
          source={{
            uri:
              data.portada ||
              "https://via.placeholder.com/150",
          }}
          style={styles.image}
        />

        {/* TITULO */}
        <Text style={styles.title}>
          {data.titulo || "Sin título"}
        </Text>

        {/* AUTOR */}
        <Text style={styles.author}>
          ✍️ {data.autor || "Desconocido"}
        </Text>

        {/* LINEA */}
        <View style={styles.divider} />

        {/* DESCRIPCION */}
        <Text style={styles.description}>
          {data.descripcion || "Sin descripción disponible"}
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    elevation: 5,
  },

  image: {
    width: 180,
    height: 260,
    alignSelf: "center",
    borderRadius: 15,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
    marginBottom: 10,
  },

  author: {
    fontSize: 18,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginBottom: 20,
  },

  description: {
    fontSize: 16,
    lineHeight: 28,
    color: "#374151",
    textAlign: "justify",
  },
});