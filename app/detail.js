import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useEffect } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { guardarEnHistorial } from "./history";

const PRIMARY = "#6C63FF";

export default function DetailScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const libro =
    typeof params.libro === "string"
      ? params.libro
      : Array.isArray(params.libro)
      ? params.libro[0]
      : null;

  let libroObjeto = {};

  try {
    libroObjeto = libro
      ? JSON.parse(libro)
      : {};
  } catch (error) {
    console.error(
      "Error al parsear libro:",
      error
    );
  }

  useEffect(() => {
    try {
      if (
        libroObjeto &&
        (libroObjeto.title ||
          libroObjeto.titulo)
      ) {
        guardarEnHistorial(libroObjeto);
      }
    } catch (error) {
      console.error(
        "Error al guardar historial:",
        error
      );
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* BOTÓN VOLVER */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color="#fff"
        />

        <Text style={styles.backText}>
          Volver
        </Text>
      </TouchableOpacity>

      {/* PORTADA */}
      {libroObjeto.portada ? (
        <Image
          source={{
            uri: libroObjeto.portada,
          }}
          style={styles.cover}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Sin portada
          </Text>
        </View>
      )}

      {/* INFO */}
      <View style={styles.card}>
        <Text style={styles.bookTitle}>
          {libroObjeto.title ||
            libroObjeto.titulo ||
            "Sin título"}
        </Text>

        <Text style={styles.bookAuthor}>
          ✍️{" "}
          {libroObjeto.author ||
            libroObjeto.autor ||
            "Autor desconocido"}
        </Text>

        <View style={styles.badgesRow}>
          <Text style={styles.badge}>
            📚{" "}
            {libroObjeto.categoria ||
              "General"}
          </Text>

          <Text style={styles.badge}>
            ⭐{" "}
            {libroObjeto.rating ||
              "4.5"}
          </Text>
        </View>

        <Text style={styles.info}>
          🏢{" "}
          {libroObjeto.editorial ||
            "Editorial desconocida"}
        </Text>

        <Text style={styles.info}>
          📅{" "}
          {libroObjeto.fecha_publicacion ||
            "Fecha desconocida"}
        </Text>

        <Text style={styles.info}>
          📖{" "}
          {libroObjeto.paginas ||
            "N/A"}
        </Text>

        <Text style={styles.descriptionTitle}>
          Descripción
        </Text>

        <Text style={styles.description}>
          {libroObjeto.descripcion ||
            "Sin descripción disponible."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  backButton: {
    marginTop: 60,
    marginHorizontal: 20,
    backgroundColor: PRIMARY,
    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 10,
    paddingHorizontal: 16,

    borderRadius: 16,
  },

  backText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 14,
  },

  cover: {
    width: 220,
    height: 320,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 25,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,

    elevation: 8,
  },

  placeholder: {
    width: 220,
    height: 320,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",

    justifyContent: "center",
    alignItems: "center",

    alignSelf: "center",
    marginTop: 25,
  },

  placeholderText: {
    color: "#6B7280",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    marginTop: 25,
    marginHorizontal: 20,
    marginBottom: 40,

    borderRadius: 24,
    padding: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 4,
  },

  bookTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },

  bookAuthor: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 18,
  },

  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },

  badge: {
    backgroundColor: "#EEF2FF",
    color: PRIMARY,

    paddingVertical: 6,
    paddingHorizontal: 12,

    borderRadius: 999,
    marginRight: 10,
    marginBottom: 10,

    fontSize: 12,
    fontWeight: "600",
  },

  info: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 10,
    lineHeight: 22,
  },

  descriptionTitle: {
    marginTop: 20,
    marginBottom: 10,

    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  description: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 26,
    textAlign: "justify",
  },
});