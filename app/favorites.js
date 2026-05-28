import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#6C63FF";

// 🔥 Agregar o eliminar favorito
export const alternarFavorito = async (libro) => {
  try {
    const favoritosPrevios =
      await AsyncStorage.getItem("@favorites");

    let lista = favoritosPrevios
      ? JSON.parse(favoritosPrevios)
      : [];

    const tituloLibro =
      libro.title || libro.titulo;

    const existe = lista.some(
      (item) =>
        (item.title || item.titulo) ===
        tituloLibro
    );

    if (existe) {
      lista = lista.filter(
        (item) =>
          (item.title || item.titulo) !==
          tituloLibro
      );
    } else {
      lista.push({
        id:
          libro.id ||
          Math.random().toString(),

        titulo: tituloLibro,

        autor:
          libro.author ||
          libro.autor ||
          "Autor desconocido",

        image:
          libro.image ||
          libro.portada ||
          "https://via.placeholder.com/150",
      });
    }

    await AsyncStorage.setItem(
      "@favorites",
      JSON.stringify(lista)
    );

    return !existe;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// 🔥 Verificar favorito
export const esFavorito = async (libro) => {
  try {
    const favoritosPrevios =
      await AsyncStorage.getItem("@favorites");

    if (!favoritosPrevios) return false;

    const lista = JSON.parse(
      favoritosPrevios
    );

    const tituloLibro =
      libro.title || libro.titulo;

    return lista.some(
      (item) =>
        (item.title || item.titulo) ===
        tituloLibro
    );
  } catch (error) {
    return false;
  }
};

export default function FavoritesScreen() {
  const [favoritos, setFavoritos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const isFocused = useIsFocused();

  const cargarFavoritos = async () => {
    try {
      setCargando(true);

      const datosEnStorage =
        await AsyncStorage.getItem(
          "@favorites"
        );

      setFavoritos(
        datosEnStorage
          ? JSON.parse(datosEnStorage)
          : []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      cargarFavoritos();
    }
  }, [isFocused]);

  const eliminarDeFavoritos = async (
    itemEliminar
  ) => {
    try {
      const nuevaLista =
        favoritos.filter(
          (item) =>
            item.titulo !==
            itemEliminar.titulo
        );

      setFavoritos(nuevaLista);

      await AsyncStorage.setItem(
        "@favorites",
        JSON.stringify(nuevaLista)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.image,
        }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text
          style={styles.bookTitle}
          numberOfLines={2}
        >
          {item.titulo}
        </Text>

        <Text
          style={styles.author}
          numberOfLines={1}
        >
          ✍️ {item.autor}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          eliminarDeFavoritos(item)
        }
      >
        <Ionicons
          name="trash-outline"
          size={22}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>
          ❤️
        </Text>

        <Text style={styles.title}>
          Mis Favoritos
        </Text>

        <Text style={styles.subtitle}>
          Tus libros guardados aparecerán aquí
        </Text>
      </View>

      {/* CONTENIDO */}
      {cargando ? (
        <ActivityIndicator
          size="large"
          color={PRIMARY}
          style={{ marginTop: 30 }}
        />
      ) : favoritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="heart-outline"
            size={70}
            color="#C7C7CC"
          />

          <Text style={styles.emptyTitle}>
            No tienes favoritos
          </Text>

          <Text style={styles.emptyText}>
            Guarda libros desde el catálogo
            para verlos aquí ✨
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item, index) =>
            index.toString()
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    padding: 18,
  },

  header: {
    backgroundColor: PRIMARY,
    borderRadius: 24,
    padding: 25,
    marginBottom: 25,
    alignItems: "center",
    elevation: 4,
  },

  headerEmoji: {
    fontSize: 38,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  subtitle: {
    marginTop: 6,
    color: "#EDEBFF",
    fontSize: 14,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: 70,
    height: 100,
    borderRadius: 14,
    backgroundColor: "#eee",
  },

  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },

  author: {
    fontSize: 13,
    color: "#666",
  },

  deleteButton: {
    backgroundColor: "#FF4D67",
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "bold",
    color: "#444",
  },

  emptyText: {
    marginTop: 8,
    textAlign: "center",
    color: "#777",
    lineHeight: 22,
    fontSize: 14,
  },
});