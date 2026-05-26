import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

// Función exportada para registrar libros en el almacenamiento local
export const guardarEnHistorial = async (libro) => {
  try {
    const historialPrevio = await AsyncStorage.getItem("@historial");
    let lista = historialPrevio ? JSON.parse(historialPrevio) : [];

    const nuevoRegistro = {
      id: libro.id || Math.random().toString(),
      titulo: libro.title || libro.titulo || "Título desconocido",
      autor: libro.author || libro.autor || "Autor desconocido",
      fecha: new Date().toLocaleString(), // Registra la fecha y hora local
    };

    // Evita duplicados en la lista filtrando por título idéntico
    lista = lista.filter(item => item.titulo !== nuevoRegistro.titulo);
    // Agrega el elemento al principio de la lista para mostrar primero lo más reciente
    lista.unshift(nuevoRegistro); 

    await AsyncStorage.setItem("@historial", JSON.stringify(lista));
  } catch (error) {
    console.error("Error al guardar en el historial (AsyncStorage):", error);
  }
};

export default function HistoryScreen() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const isFocused = useIsFocused();

  const cargarHistorial = async () => {
    try {
      setCargando(true);
      const datosEnStorage = await AsyncStorage.getItem("@historial");
      setHistorial(datosEnStorage ? JSON.parse(datosEnStorage) : []);
    } catch (error) {
      console.error("Error al recuperar el historial:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      cargarHistorial();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.infoLibro}>
        <Text style={styles.libroTitulo}>📖 {item.titulo}</Text>
        <Text style={styles.libroAutor}>{item.autor}</Text>
      </View>
      <Text style={styles.fechaText}>{item.fecha}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕒 Historial de Búsquedas</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : historial.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No has consultado ningún libro recientemente.</Text>
        </View>
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  listContent: { paddingBottom: 20 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  infoLibro: { flex: 1 },
  libroTitulo: { fontSize: 16, fontWeight: "600", color: "#333" },
  libroAutor: { fontSize: 14, color: "#666", marginTop: 2 },
  fechaText: { fontSize: 12, color: "#999", fontStyle: "italic" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#777" }
});