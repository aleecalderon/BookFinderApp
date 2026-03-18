// app/index.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchText.trim().length > 0) {
      router.push({
        pathname: "/results",
        params: { searchQuery: searchText } 
      });
    } else {
      alert("Por favor, escribe el nombre de un libro");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookFinder App 📚</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Escribe un libro o autor..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>BUSCAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15 },
  button: { width: '100%', backgroundColor: '#007AFF', paddingVertical: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
