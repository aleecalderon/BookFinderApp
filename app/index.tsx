// app/index.tsx

import { Picker } from '@react-native-picker/picker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';

import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PRIMARY = '#6C63FF';

export default function HomeScreen() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [idioma, setIdioma] = useState('todos');
  const [orden, setOrden] = useState('relevance');

  const [errorValidacion, setErrorValidacion] =
    useState('');

  const handleSearch = () => {
    const tituloLimpio = titulo.trim();
    const autorLimpio = autor.trim();

    if (!tituloLimpio && !autorLimpio) {
      setErrorValidacion(
        'Ingresa un libro o autor.'
      );
      return;
    }

    setErrorValidacion('');

    router.push({
      pathname: '/results',
      params: {
        titulo: tituloLimpio,
        autor: autorLimpio,
        categoria,
        idioma,
        orden,
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: 'BookFinder',
          headerStyle: {
            backgroundColor: PRIMARY,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          📚
        </Text>

        <Text style={styles.title}>
          BookFinder
        </Text>

        <Text style={styles.subtitle}>
          Descubre miles de libros
          fácilmente.
        </Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>
          Buscar libro
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ej. El Señor de los Anillos"
          placeholderTextColor="#9CA3AF"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>
          Autor
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ej. Tolkien"
          placeholderTextColor="#9CA3AF"
          value={autor}
          onChangeText={setAutor}
        />

        {/* BOTÓN */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <Text style={styles.searchButtonText}>
            🔎 Buscar Libros
          </Text>
        </TouchableOpacity>

        {/* ERROR */}
        {errorValidacion ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              ⚠️ {errorValidacion}
            </Text>
          </View>
        ) : null}

        {/* FILTROS */}
        <Text style={styles.filterTitle}>
          Filtros
        </Text>

        {/* CATEGORÍA */}
        <View style={styles.filterBox}>
          <Text style={styles.filterLabel}>
            📚 Categoría
          </Text>

          <Picker
            selectedValue={categoria}
            onValueChange={(val) =>
              setCategoria(val)
            }
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item
              label="Todas"
              value="todas"
            />
            <Picker.Item
              label="Ficción"
              value="fiction"
            />
            <Picker.Item
              label="Computación"
              value="computers"
            />
            <Picker.Item
              label="Historia"
              value="history"
            />
          </Picker>
        </View>

        {/* IDIOMA */}
        <View style={styles.filterBox}>
          <Text style={styles.filterLabel}>
            🌎 Idioma
          </Text>

          <Picker
            selectedValue={idioma}
            onValueChange={(val) =>
              setIdioma(val)
            }
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item
              label="Todos"
              value="todos"
            />
            <Picker.Item
              label="Español"
              value="es"
            />
            <Picker.Item
              label="Inglés"
              value="en"
            />
          </Picker>
        </View>

        {/* ORDEN */}
        <View style={styles.filterBox}>
          <Text style={styles.filterLabel}>
            ✨ Ordenar
          </Text>

          <Picker
            selectedValue={orden}
            onValueChange={(val) =>
              setOrden(val)
            }
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item
              label="Relevancia"
              value="relevance"
            />
            <Picker.Item
              label="Más recientes"
              value="newest"
            />
          </Picker>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F4F6FB',
  },

  header: {
    backgroundColor: PRIMARY,
    borderRadius: 28,
    padding: 30,
    marginBottom: 20,
  },

  logo: {
    fontSize: 42,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },

  subtitle: {
    color: '#E9E7FF',
    marginTop: 6,
    fontSize: 15,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 15,
    fontSize: 15,
    color: '#111827',
  },

  searchButton: {
    backgroundColor: PRIMARY,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
  },

  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 12,
    color: '#111827',
  },

  filterBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
    overflow: 'hidden',
  },

  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 10,
    marginLeft: 12,
  },

  picker: {
    width: '100%',
    color: '#111827',
    backgroundColor: '#F9FAFB',

    ...(Platform.OS === 'ios' && {
      height: 150,
    }),

    ...(Platform.OS === 'android' && {
      height: 55,
    }),
  },

  pickerItem: {
    color: '#111827',
    fontSize: 16,
  },

  errorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginTop: 14,
  },

  errorText: {
    color: '#B91C1C',
    textAlign: 'center',
    fontWeight: '600',
  },
});