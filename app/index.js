import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search) return;

    router.push(`/results?searchQuery=${search}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 BookFinder</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar libros..."
        value={search}
        onChangeText={setSearch}
      />

      <Button title="Buscar" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
});