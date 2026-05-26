// src/screens/HomeScreen.js
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  // Estados para los filtros interactivos
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [idioma, setIdioma] = useState('todos');
  const [orden, setOrden] = useState('relevance');

  const handleSearch = () => {
    // Enviamos todos los filtros empaquetados a la pantalla de resultados
    navigation.navigate('Results', {
      filtros: { titulo, autor, categoria, idioma, orden }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Búsqueda Avanzada 📚</Text>

      <Text style={styles.label}>Título del libro:</Text>
      <TextInput style={styles.input} placeholder="Ej. Harry Potter" value={titulo} onChangeText={setTitulo} />
      
      <Text style={styles.label}>Autor del libro:</Text>
      <TextInput style={styles.input} placeholder="Ej. J.K. Rowling" value={autor} onChangeText={setAutor} />

      <Text style={styles.label}>Categoría (Dropdown):</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={categoria} onValueChange={(val) => setCategoria(val)}>
          <Picker.Item label="Todas las categorías" value="todas" />
          <Picker.Item label="Ficción" value="fiction" />
          <Picker.Item label="Computación" value="computers" />
          <Picker.Item label="Historia" value="history" />
        </Picker>
      </View>

      <Text style={styles.label}>Idioma (Dropdown):</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={idioma} onValueChange={(val) => setIdioma(val)}>
          <Picker.Item label="Todos los idiomas" value="todos" />
          <Picker.Item label="Español" value="es" />
          <Picker.Item label="Inglés" value="en" />
        </Picker>
      </View>

      <Text style={styles.label}>Ordenar resultados (Dropdown):</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={orden} onValueChange={(val) => setOrden(val)}>
          <Picker.Item label="Mayor Relevancia" value="relevance" />
          <Picker.Item label="Más recientes primero" value="newest" />
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="BUSCAR LIBROS" onPress={handleSearch} color="#007AFF" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 25, textAlign: 'center', color: '#333' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8, backgroundColor: '#f9f9f9' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 15, backgroundColor: '#f9f9f9', overflow: 'hidden' },
  buttonContainer: { marginTop: 10, paddingBottom: 30 }
});