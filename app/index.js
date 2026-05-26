import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// Importamos las funciones utilitarias que creamos en src/utils/storage.js
import { alternarFavorito, esFavorito } from "./favorites";

// ==========================================
// COMPONENTE: TARJETA DE CADA LIBRO (LibroCard)
// ==========================================
function LibroCard({ libro }) {
  const router = useRouter();
  const [marcadoFavorito, setMarcadoFavorito] = useState(false);
  const isFocused = useIsFocused();

  // Verificar si el libro es favorito cada vez que la pantalla tenga foco
  useEffect(() => {
    const verificar = async () => {
      if (libro) {
        const status = await esFavorito(libro);
        setMarcadoFavorito(status);
      }
    };
    if (isFocused) {
      verificar();
    }
  }, [libro, isFocused]);

  if (!libro) return null;

  const handlePressLibro = () => {
    router.push({
      pathname: "/detail",
      params: { libro: JSON.stringify(libro) } // ✅ CORREGIDO: Ahora coincide con detail.js
    });
  };

  const handleFavoritoClick = async () => {
    const resultado = await alternarFavorito(libro);
    setMarcadoFavorito(resultado);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePressLibro}>
      <Image 
        source={{ uri: libro.image || 'https://via.placeholder.com/150' }} 
        style={styles.coverImage} 
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {libro.title || "Título desconocido"}
        </Text>
        <Text style={styles.bookAuthor}>
          {libro.author || "Autor desconocido"}
        </Text>
      </View>

      <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritoClick}>
        <Ionicons 
          name={marcadoFavorito ? "heart" : "heart-outline"} 
          size={26} 
          color={marcadoFavorito ? "#ff3b30" : "#8e8e93"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL: PANTALLA DE INICIO (HomeScreen)
// ==========================================
export default function HomeScreen() {
  const [search, setSearch] = useState("");
  
  // Lista de libros quemada/mock para la prueba (Como la de Harry Potter de tu API o estado)
  const [libros, setLibros] = useState([
    { id: "1", title: "Harry Potter y la piedra filosofal", author: "J.K. Rowling", image: "https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg" },
    { id: "2", title: "Harry Potter y la cámara secreta", author: "J.K. Rowling", image: "https://images-na.ssl-images-amazon.com/images/I/81gC79Y96AL.jpg" },
    { id: "3", title: "Harry Potter y el prisionero de Azkaban", author: "J.K. Rowling", image: "https://images-na.ssl-images-amazon.com/images/I/81t3Wdfu3rL.jpg" }
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📚 Buscador de Libros</Text>
      
      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar libros..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Lista de libros usando el componente corregido */}
      <FlatList
        data={libros.filter(libro => libro.title.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LibroCard libro={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// ==========================================
// ESTILOS DE LA INTERFAZ
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 15,
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "#e5e5ea",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  coverImage: {
    width: 50,
    height: 75,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 4,
  },
  favoriteButton: {
    padding: 10,
  },
});