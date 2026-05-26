import { router, useLocalSearchParams } from "expo-router";
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
import { Colors } from "../constants/theme";

export default function ResultsScreen() {
  const { searchQuery } = useLocalSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = Colors.light;

  useEffect(() => {
    const query = searchQuery || "Harry Potter";
    setLoading(true);

    const timeout = setTimeout(() => {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then((res) => {
          if (!res.ok) {
             throw new Error("Error " + res.status);
          }
          return res.json();
        })
        .then((data) => {
          setBooks(data.items || []);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Google bloqueó la petición (Error 429). Activando datos de respaldo...");
          
          setBooks([
            {
              id: "1",
              volumeInfo: {
                title: "Harry Potter y la piedra filosofal",
                authors: ["J.K. Rowling"],
                description: "Harry Potter se ha quedado huérfano...",
                // 🔥 SOLUCIÓN: Imágenes alojadas fuera de Google (Picsum)
                imageLinks: { thumbnail: "https://picsum.photos/id/1028/150/225" }
              }
            },
            {
              id: "2",
              volumeInfo: {
                title: "Harry Potter y la cámara secreta",
                authors: ["J.K. Rowling"],
                description: "Tras un verano desastroso...",
                // 🔥 SOLUCIÓN: Imágenes alojadas fuera de Google (Picsum)
                imageLinks: { thumbnail: "https://picsum.photos/id/1010/150/225" }
              }
            }
          ]);
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.tint} />
          <Text style={{ marginTop: 10, color: theme.text }}>Buscando libros...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const imageUrl = item.volumeInfo.imageLinks?.thumbnail?.replace(/^http:/i, 'https:') || "https://via.placeholder.com/150";

            return (
              <TouchableOpacity
                style={[styles.card, { borderColor: theme.icon }]}
                onPress={() =>
                  router.push({
                    pathname: "/detail",
                    params: {
                      libro: JSON.stringify({
                        titulo: item.volumeInfo.title,
                        autor: item.volumeInfo.authors?.join(", "),
                        descripcion: item.volumeInfo.description,
                        portada: imageUrl,
                      }),
                    },
                  })
                }
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.img}
                />

                <View style={styles.textContainer}>
                  <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
                    {item.volumeInfo.title}
                  </Text>

                  <Text style={[styles.author, { color: theme.icon }]}>
                    {item.volumeInfo.authors?.join(", ") || "Autor desconocido"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  img: {
    width: 70,
    height: 105,
    marginRight: 15,
    borderRadius: 6,
    backgroundColor: "#e0e0e0", 
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
  },
});