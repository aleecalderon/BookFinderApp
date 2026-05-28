import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ===============================
// GUARDAR HISTORIAL
// ===============================
export const guardarEnHistorial = async (libro) => {
  try {
    const historialPrevio = await AsyncStorage.getItem("@historial");

    let lista = historialPrevio
      ? JSON.parse(historialPrevio)
      : [];

    const nuevoRegistro = {
      id: libro.id || Math.random().toString(),

      titulo:
        libro.title ||
        libro.titulo ||
        "Título desconocido",

      autor:
        libro.author ||
        libro.autor ||
        "Autor desconocido",

      fecha: new Date().toLocaleString(),
    };

    // evitar duplicados
    lista = lista.filter(
      (item) => item.titulo !== nuevoRegistro.titulo
    );

    lista.unshift(nuevoRegistro);

    await AsyncStorage.setItem(
      "@historial",
      JSON.stringify(lista)
    );
  } catch (error) {
    console.error(
      "Error al guardar historial:",
      error
    );
  }
};

// ===============================
// PANTALLA
// ===============================
export default function HistoryScreen() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  const isFocused = useIsFocused();

  const cargarHistorial = async () => {
    try {
      setCargando(true);

      const datos =
        await AsyncStorage.getItem("@historial");

      setHistorial(datos ? JSON.parse(datos) : []);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      cargarHistorial();
    }
  }, [isFocused]);

  // ===============================
  // LIMPIAR HISTORIAL
  // ===============================
  const limpiarHistorial = async () => {
    try {
      await AsyncStorage.removeItem("@historial");
      setHistorial([]);
    } catch (error) {
      console.error(error);
    }
  };

  // ===============================
  // ITEM
  // ===============================
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📖</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.bookTitle}>
          {item.titulo}
        </Text>

        <Text style={styles.bookAuthor}>
          ✍️ {item.autor}
        </Text>

        <Text style={styles.dateText}>
          🕒 {item.fecha}
        </Text>
      </View>
    </View>
  );

  // ===============================
  // RENDER
  // ===============================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🕒 Historial
      </Text>

      <Text style={styles.subtitle}>
        Tus libros consultados recientemente
      </Text>

      {historial.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={limpiarHistorial}
        >
          <Text style={styles.clearButtonText}>
            Limpiar historial
          </Text>
        </TouchableOpacity>
      )}

      {cargando ? (
        <ActivityIndicator
          size="large"
          color="#6C63FF"
          style={{ marginTop: 40 }}
        />
      ) : historial.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>
            📚
          </Text>

          <Text style={styles.emptyTitle}>
            Aún no hay historial
          </Text>

          <Text style={styles.emptyText}>
            Cuando abras libros aparecerán aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item, index) =>
            index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// ===============================
// ESTILOS
// ===============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
    paddingTop: 25,
    paddingHorizontal: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginTop: 5,
    marginBottom: 20,
    fontSize: 14,
  },

  clearButton: {
    alignSelf: "center",
    backgroundColor: "#FFEBEE",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 20,
  },

  clearButtonText: {
    color: "#E53935",
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.06,
    shadowRadius: 5,

    elevation: 4,
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: "#EEEAFE",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  icon: {
    fontSize: 24,
  },

  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },

  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },

  bookAuthor: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  dateText: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },

  emptyEmoji: {
    fontSize: 70,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },

  emptyText: {
    marginTop: 8,
    color: "#888",
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 40,
  },
});