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

export default function ResultsScreen() {
  const { searchQuery } = useLocalSearchParams();
  console.log("BUSQUEDA:", searchQuery);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const query = searchQuery || "harry";

  const timeout = setTimeout(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, 500); // ⏱ evita muchas llamadas

  return () => clearTimeout(timeout);
}, [searchQuery]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/detail",
                  params: {
                    libro: JSON.stringify({
                      titulo: item.volumeInfo.title,
                      autor: item.volumeInfo.authors?.join(", "),
                      descripcion: item.volumeInfo.description,
                      portada: item.volumeInfo.imageLinks?.thumbnail,
                    }),
                  },
                })
              }
            >
              <Image
                source={{
                  uri:
                    item.volumeInfo.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/150",
                }}
                style={styles.img}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {item.volumeInfo.title}
                </Text>

                <Text style={styles.author}>
                  {item.volumeInfo.authors?.join(", ") ||
                    "Autor desconocido"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
  },
  img: {
    width: 60,
    height: 90,
    marginRight: 10,
    borderRadius: 5,
  },
  title: {
    color: "#000", 
    fontWeight: "bold",
    fontSize: 14,
  },
  author: {
    color: "#333",
    fontSize: 12,
  },
});