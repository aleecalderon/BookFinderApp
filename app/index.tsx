// app/index.tsx
import { Picker } from '@react-native-picker/picker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PRIMARY_RED = '#E53935'; 

export default function HomeScreen() {
  const router = useRouter();
  
  // Estados para controlar los componentes de captura de filtros
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [idioma, setIdioma] = useState('todos');
  const [orden, setOrden] = useState('relevance');
  
  // Estado para gestionar los mensajes de alerta en la interfaz
  const [errorValidacion, setErrorValidacion] = useState('');

  const handleSearch = () => {
    const tituloLimpio = titulo.trim();
    const autorLimpio = autor.trim();

    // --- CONTROL DE VALIDACIONES EXHAUSTIVAS ---
    
    // 1. Validar campos completamente vacíos
    if (!tituloLimpio && !autorLimpio) {
      setErrorValidacion('Por favor, ingresa un criterio. No se permiten búsquedas vacías.');
      return;
    }

    // Expresión regular para identificar números puros (positivos, negativos y ceros)
    const numeroPuroRegex = /^-?\d+$/;

    // 2. Filtros de validación para el campo Título
    if (tituloLimpio) {
      if (tituloLimpio.length < 2) {
        setErrorValidacion('El título ingresado es muy corto. Digita al menos 2 caracteres.');
        return;
      }
      if (numeroPuroRegex.test(tituloLimpio)) {
        setErrorValidacion('Búsqueda inválida. El título no puede estar compuesto solo de números.');
        return;
      }
    }

    // 3. Filtros de validación para el campo Autor
    if (autorLimpio) {
      if (autorLimpio.length < 2) {
        setErrorValidacion('El nombre del autor debe tener un mínimo de 2 letras.');
        return;
      }
      if (numeroPuroRegex.test(autorLimpio)) {
        setErrorValidacion('Búsqueda inválida. El autor no puede ser un valor numérico o negativo.');
        return;
      }
    }

    // Si pasa de forma exitosa los controles de seguridad, limpiamos errores y navegamos
    setErrorValidacion('');
    router.push({
      pathname: "/results",
      params: { titulo: tituloLimpio, autor: autorLimpio, categoria, idioma, orden }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen 
        options={{
          title: "Buscador de Libros",
          headerStyle: { backgroundColor: PRIMARY_RED },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />

      <Text style={styles.title}>Búsqueda Avanzada</Text>

      {/* Renderizado dinámico de la caja de errores */}
      {errorValidacion ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {errorValidacion}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Título del libro:</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej. Harry Potter" 
        value={titulo} 
        onChangeText={setTitulo} 
        placeholderTextColor="#999"
      />
      
      <Text style={styles.label}>Autor del libro:</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej. J.K. Rowling" 
        value={autor} 
        onChangeText={setAutor} 
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Categoría Principal:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={categoria} onValueChange={(val) => setCategoria(val)}>
          <Picker.Item label="Todas las categorías" value="todas" />
          <Picker.Item label="Ficción" value="fiction" />
          <Picker.Item label="Computación / Ingeniería" value="computers" />
          <Picker.Item label="Historia" value="history" />
        </Picker>
      </View>

      <Text style={styles.label}>Idioma de Preferencia:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={idioma} onValueChange={(val) => setIdioma(val)}>
          <Picker.Item label="Todos los idiomas" value="todos" />
          <Picker.Item label="Español" value="es" />
          <Picker.Item label="Inglés" value="en" />
        </Picker>
      </View>

      <Text style={styles.label}>Clasificar por:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={orden} onValueChange={(val) => setOrden(val)}>
          <Picker.Item label="Mayor Relevancia" value="relevance" />
          <Picker.Item label="Más recientes primero" value="newest" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>EJECUTAR CONSULTA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: PRIMARY_RED },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#444' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 15, borderRadius: 8, backgroundColor: '#fafafa', color: '#333' },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15, backgroundColor: '#fafafa', overflow: 'hidden' },
  searchButton: { backgroundColor: PRIMARY_RED, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15, marginBottom: 40, elevation: 2 },
  searchButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorBox: { backgroundColor: '#FFEBEE', padding: 12, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#FFCDD2' },
  errorText: { color: '#C62828', fontSize: 13, fontWeight: '600', textAlign: 'center' }
});
