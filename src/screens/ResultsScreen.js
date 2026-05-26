import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchBooksAdvanced, fetchRecommendations } from '../services/api';

export default function ResultsScreen() {
  const filtros = useLocalSearchParams(); 
  
  const [libros, setLibros] = useState<any[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ¡Aquí está la función nueva correcta!
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      
      const resultado = await fetchBooksAdvanced(filtros);
      
      if (resultado.error) {
        setError(resultado.error);
      } else {
        setLibros(resultado.items);
        
        if (resultado.items.length > 0) {
          const primerAutor = resultado.items[0].autor.split(',')[0];
          const recomendados = await fetchRecommendations(primerAutor);
          setRecomendaciones(recomendados);
        }
      }
      setLoading(false);
    };

    cargarDatos();
  }, [filtros]);

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Resultados Encontrados ({libros.length})</Text>
      
      {libros.map((libro, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.bookTitle}>{libro.titulo}</Text>
          <Text style={styles.detail}>👤 Autor: {libro.autor}</Text>
          <Text style={styles.detail}>🏷️ Categoría: {libro.categoria}</Text>
          <Text style={styles.detail}>🏢 Editorial: {libro.editorial}</Text>
          <Text style={styles.detail}>📅 Publicación: {libro.fecha_publicacion}</Text>
          <Text style={styles.detail}>⭐ Rating: {libro.rating}</Text>
          <Text style={styles.desc}>{libro.descripcion}</Text>
        </View>
      ))}

      {recomendaciones.length > 0 && (
        <View style={styles.recomContainer}>
          <Text style={styles.recomHeader}>💡 Recomendaciones (Open Library):</Text>
          <Text style={styles.recomSub}>Más libros de este autor que podrían interesarte:</Text>
          {recomendaciones.map((rec, idx) => (
            <Text key={idx} style={styles.recItem}>📚 {rec.titulo} ({rec.ano})</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#f4f4f4' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 15, color: '#333' },
  card: { backgroundColor: '#fff', padding: 18, marginBottom: 15, borderRadius: 10, elevation: 3 },
  bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginBottom: 8 },
  detail: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 3 },
  desc: { fontSize: 13, marginTop: 10, fontStyle: 'italic', color: '#777', lineHeight: 20 },
  error: { color: '#D8000C', fontSize: 16, textAlign: 'center', marginTop: 30, fontWeight: 'bold' },
  recomContainer: { marginTop: 10, padding: 20, backgroundColor: '#E3F2FD', borderRadius: 10, marginBottom: 40 },
  recomHeader: { fontSize: 18, fontWeight: 'bold', color: '#0277BD', marginBottom: 5 },
  recomSub: { fontSize: 13, color: '#555', marginBottom: 10 },
  recItem: { fontSize: 15, color: '#01579B', marginBottom: 6, fontWeight: '500' }
});