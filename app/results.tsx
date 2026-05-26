// app/results.tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchBooksAdvanced, fetchRecommendations } from '../services/api';

const PRIMARY_RED = '#E53935'; 

export default function ResultsScreen() {
  const filtros = useLocalSearchParams(); 
  
  const [libros, setLibros] = useState<any[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [filtros.titulo, filtros.autor, filtros.categoria, filtros.idioma, filtros.orden]);

  if (loading) return <ActivityIndicator size="large" color={PRIMARY_RED} style={{ marginTop: 50 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Catálogo Disponible",
          headerStyle: { backgroundColor: PRIMARY_RED },
          headerTintColor: '#fff',
        }} 
      />

      <Text style={styles.headerTitle}>Catálogo Principal ({libros.length} libros)</Text>
      
      <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.horizontalScrollContainer}
      >
        {libros.map((libro, index) => (
          <View key={index} style={styles.horizontalCard}>
            
            <View style={styles.imageContainer}>
              {libro.portada ? (
                <Image source={{ uri: libro.portada }} style={styles.bookCover} resizeMode="cover" />
              ) : (
                <View style={[styles.bookCover, styles.placeholderCover]}>
                  <Text style={styles.placeholderText}>Sin Portada</Text>
                </View>
              )}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.bookTitle} numberOfLines={2}>{libro.titulo}</Text>
              <Text style={styles.detailText} numberOfLines={1}>👤 {libro.autor}</Text>
              <Text style={styles.detailText} numberOfLines={1}>🏢 {libro.editorial}</Text>
              <Text style={styles.detailText}>📅 Publicación: {libro.fecha_publicacion}</Text>
              
              <View style={styles.badgesRow}>
                <Text style={styles.ratingBadge}>{libro.rating}</Text>
                <Text style={styles.formatBadge}>{libro.formato}</Text>
              </View>
              
              <Text style={styles.pagesText}>📖 Extensión: {libro.paginas}</Text>
              <Text style={styles.categoryBadge}>{libro.categoria}</Text>
              
              <Text style={styles.descText} numberOfLines={4}>{libro.descripcion}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* TEXTO LIMPIO: Ya no menciona el nombre de la API */}
      {recomendaciones.length > 0 && (
        <View style={styles.recomSection}>
          <Text style={styles.headerTitle}>💡 Recomendaciones del autor:</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
            {recomendaciones.map((rec, idx) => (
              <View key={idx} style={styles.recomCard}>
                <Text style={styles.recomTitle} numberOfLines={2}>{rec.titulo}</Text>
                <Text style={styles.recomYear}>📅 Año: {rec.ano}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 15, marginHorizontal: 15, color: '#333' },
  horizontalScrollContainer: { paddingLeft: 15, paddingRight: 5, paddingBottom: 20 },
  horizontalCard: { width: 250, backgroundColor: '#fff', marginRight: 16, borderRadius: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, borderWidth: 1, borderColor: '#eee', overflow: 'hidden' },
  imageContainer: { width: '100%', height: 180, backgroundColor: '#f5f5f5' },
  bookCover: { width: '100%', height: '100%' },
  placeholderCover: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 13, color: '#aaa', fontWeight: 'bold' },
  infoContainer: { padding: 12 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 5, lineHeight: 20 },
  detailText: { fontSize: 12, color: '#555', marginBottom: 2 },
  badgesRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 4 },
  ratingBadge: { fontSize: 11, fontWeight: 'bold', color: '#E65100', backgroundColor: '#FFF3E0', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, marginRight: 6 },
  formatBadge: { fontSize: 11, color: '#0288D1', backgroundColor: '#E1F5FE', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, fontWeight: '600' },
  pagesText: { fontSize: 11, color: '#666', fontStyle: 'italic', marginTop: 2, marginBottom: 6 },
  categoryBadge: { fontSize: 10, color: '#fff', backgroundColor: PRIMARY_RED, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 10, fontWeight: 'bold' },
  descText: { fontSize: 12, color: '#666', fontStyle: 'italic', lineHeight: 16, textAlign: 'justify' },
  error: { color: PRIMARY_RED, fontSize: 15, textAlign: 'center', marginTop: 40, fontWeight: 'bold', paddingHorizontal: 20 },
  recomSection: { marginTop: 10, paddingBottom: 30, backgroundColor: '#FFEBEE' },
  recomCard: { width: 160, backgroundColor: '#fff', padding: 12, marginRight: 15, borderRadius: 8, elevation: 2, borderLeftWidth: 4, borderLeftColor: PRIMARY_RED },
  recomTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  recomYear: { fontSize: 12, color: '#777' }
});