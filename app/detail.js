import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
// Importación directa desde la misma carpeta app/
import { guardarEnHistorial } from "./history";

export default function DetailScreen() {
  const { libro } = useLocalSearchParams(); 

  useEffect(() => {
    try {
      // Realizamos el parseo seguro directo en el hook para eliminar advertencias de ESLint
      const data = libro ? JSON.parse(libro) : {};
      
      if (data && (data.title || data.titulo)) {
        guardarEnHistorial(data);
      }
    } catch (error) {
      console.error("Error al procesar el libro en el historial:", error);
    }
  }, [libro]); 

  // Variable auxiliar para pintar en la UI de forma segura
  let libroObjeto = {};
  try {
    libroObjeto = libro ? JSON.parse(libro) : {};
  } catch (e) {
    libroObjeto = {};
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💡 Detalle del Libro</Text>
      
      <Text style={styles.bookTitle}>
        {libroObjeto.title || libroObjeto.titulo || "Sin título disponible"}
      </Text>
      <Text style={styles.bookAuthor}>
        {libroObjeto.author || libroObjeto.autor || "Autor desconocido"}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  bookTitle: { fontSize: 18, color: "#333", textAlign: "center", fontWeight: "bold" },
  bookAuthor: { fontSize: 16, color: "#666", textAlign: "center", marginTop: 8 }
});