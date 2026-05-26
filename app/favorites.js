import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Función exportada para alternar el estado de favoritos (Toggle)
export const alternarFavorito = async (libro) => {
  try {
    const favoritosPrevios = await AsyncStorage.getItem("@favorites");
    let lista = favoritosPrevios ? JSON.parse(favoritosPrevios) : [];

    const tituloLibro = libro.title || libro.titulo;
    const existe = lista.some(item => (item.title || item.titulo) === tituloLibro);

    if (existe) {
      lista = lista.filter(item => (item.title || item.titulo) !== tituloLibro);
    } else {
      lista.push({
        id: libro.id || Math.random().toString(),
        titulo: tituloLibro,
        autor: libro.author || libro.autor || "Autor desconocido",
        image: libro.image || "https://via.placeholder.com/150"
      });
    }

    await AsyncStorage.setItem("@favorites", JSON.stringify(lista));
    return !existe; // Retorna true si se añadió, false si se eliminó
  } catch (error) {
    console.error("Error al gestionar favoritos en AsyncStorage:", error);
    return false;
  }
};

// Función exportada para comprobar si un libro ya está marcado como favorito
export const esFavorito = async (libro) => {
  try {
    const favoritosPrevios = await AsyncStorage.getItem("@favorites");
    if (!favoritosPrevios) return false;
    
    const lista = JSON.parse(favoritosPrevios);
    const tituloLibro = libro.title || libro.titulo;
    return lista.some(item => (item.title || item.titulo) === tituloLibro);
  } catch (error) {
    return false;
  }
};

export default function FavoritesScreen() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const isFocused = useIsFocused();

  const cargarFavoritos = async () => {
    try {
      setCargando(true);
      const datosEnStorage = await AsyncStorage.getItem("@favorites");
      setFavoritos(datosEnStorage ? JSON.parse(datosEnStorage) : []);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      cargarFavoritos();
    }
  }, [isFocused]);

  const eliminarDeFavoritos = async (itemEliminar) => {
    try {
      const nuevaLista = favoritos.filter(item => item.titulo !== itemEliminar.titulo);
      setFavoritos(nuevaLista);
      await AsyncStorage.setItem("@favorites", JSON.stringify(nuevaLista));
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.infoLibro}>
        <Text style={styles.libroTitulo}>❤️ {item.titulo}</Text>
        <Text style={styles.libroAutor}>{item.autor}</Text>
      </View>
      <TouchableOpacity onPress={() => eliminarDeFavoritos(item)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={22} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Mis Libros Favoritos</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#ff3b30" style={{ marginTop: 20 }} />
      ) : favoritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes libros guardados en favoritos.</Text>
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fdfdfd"
  },
  infoLibro: { flex: 1 },
  libroTitulo: { fontSize: 16, fontWeight: "600", color: "#333" },
  libroAutor: { fontSize: 14, color: "#666", marginTop: 2 },
  deleteButton: { padding: 4 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#777" }
});