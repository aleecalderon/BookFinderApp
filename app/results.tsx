// app/results.tsx

import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import {
  alternarFavorito,
  esFavorito,
} from './favorites';

import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  fetchBooksAdvanced,
  fetchRecommendations,
} from '../services/api';

const PRIMARY = '#6C63FF';

export default function ResultsScreen() {
  const filtros = useLocalSearchParams();

  const router = useRouter();

  const [libros, setLibros] = useState<any[]>([]);
  const [recomendaciones, setRecomendaciones] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  const [favoritos, setFavoritos] =
    useState<any>({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        const resultado =
          await fetchBooksAdvanced(filtros);

        if (resultado.error) {
          setError(resultado.error);
        } else {
          setLibros(resultado.items || []);

          // VERIFICAR FAVORITOS
          const favoritosEstado: any = {};

          for (const libro of resultado.items) {
            favoritosEstado[libro.titulo] =
              await esFavorito(libro);
          }

          setFavoritos(favoritosEstado);

          // RECOMENDACIONES
          if (resultado.items?.length > 0) {
            const primerAutor =
              resultado.items[0].autor?.split(
                ','
              )[0] || '';

            const recomendados =
              await fetchRecommendations(
                primerAutor
              );

            setRecomendaciones(
              recomendados || []
            );
          }
        }
      } catch (err) {
        console.error(err);

        setError(
          'Ocurrió un error al cargar los libros.'
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [
    filtros.titulo,
    filtros.autor,
    filtros.categoria,
    filtros.idioma,
    filtros.orden,
  ]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={PRIMARY}
        />

        <Text style={styles.loadingText}>
          Buscando libros...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.error}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: 'Resultados',
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
      <View style={styles.topSection}>
        <Text style={styles.headerTitle}>
          📚 Resultados encontrados
        </Text>

        <Text style={styles.subTitle}>
          {libros.length} libros disponibles
        </Text>
      </View>

      {/* LIBROS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          styles.horizontalScrollContainer
        }
      >
        {libros.map((libro, index) => (
          <TouchableOpacity
            key={index}
            style={styles.horizontalCard}
            activeOpacity={0.92}
            onPress={() =>
              router.push({
                pathname: '/detail',
                params: {
                  libro: JSON.stringify(libro),
                },
              })
            }
          >
            {/* BOTÓN FAVORITO */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={async () => {
                const nuevoEstado =
                  await alternarFavorito(
                    libro
                  );

                setFavoritos((prev: any) => ({
                  ...prev,
                  [libro.titulo]:
                    nuevoEstado,
                }));
              }}
            >
              <Ionicons
                name={
                  favoritos[libro.titulo]
                    ? 'heart'
                    : 'heart-outline'
                }
                size={28}
                color="#FF4D6D"
              />
            </TouchableOpacity>

            {/* IMAGEN */}
            <View style={styles.imageContainer}>
              {libro.portada ? (
                <Image
                  source={{
                    uri: libro.portada,
                  }}
                  style={styles.bookCover}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.bookCover,
                    styles.placeholderCover,
                  ]}
                >
                  <Text
                    style={
                      styles.placeholderText
                    }
                  >
                    Sin portada
                  </Text>
                </View>
              )}
            </View>

            {/* INFO */}
            <View style={styles.infoContainer}>
              <Text
                style={styles.bookTitle}
                numberOfLines={2}
              >
                {libro.titulo}
              </Text>

              <Text
                style={styles.detailText}
                numberOfLines={1}
              >
                👤 {libro.autor}
              </Text>

              <Text
                style={styles.detailText}
                numberOfLines={1}
              >
                🏢 {libro.editorial}
              </Text>

              <Text
                style={styles.detailText}
              >
                📅{' '}
                {libro.fecha_publicacion}
              </Text>

              {/* BADGES */}
              <View style={styles.badgesRow}>
                <Text
                  style={styles.ratingBadge}
                >
                  ⭐ {libro.rating}
                </Text>

                <Text
                  style={styles.formatBadge}
                >
                  {libro.formato}
                </Text>
              </View>

              <Text style={styles.pagesText}>
                📖 {libro.paginas}
              </Text>

              <Text
                style={styles.categoryBadge}
              >
                {libro.categoria}
              </Text>

              <Text
                style={styles.descText}
                numberOfLines={4}
              >
                {libro.descripcion}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* RECOMENDACIONES */}
      {recomendaciones.length > 0 && (
        <View style={styles.recomSection}>
          <Text style={styles.recomHeader}>
            ✨ Recomendaciones
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.horizontalScrollContainer
            }
          >
            {recomendaciones.map(
              (rec, idx) => (
                <View
                  key={idx}
                  style={styles.recomCard}
                >
                  <Text
                    style={
                      styles.recomTitle
                    }
                    numberOfLines={2}
                  >
                    {rec.titulo}
                  </Text>

                  <Text
                    style={
                      styles.recomYear
                    }
                  >
                    📅 {rec.ano}
                  </Text>
                </View>
              )
            )}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },

  loadingText: {
    marginTop: 15,
    color: '#555',
    fontSize: 15,
  },

  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },

  subTitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },

  horizontalScrollContainer: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 20,
  },

  horizontalCard: {
    width: 280,
    backgroundColor: '#fff',
    marginRight: 18,
    borderRadius: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,

    overflow: 'hidden',
    position: 'relative',
  },

  favoriteButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 999,
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 6,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 5,
  },

  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#E5E7EB',
  },

  bookCover: {
    width: '100%',
    height: '100%',
  },

  placeholderCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },

  infoContainer: {
    padding: 16,
  },

  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    lineHeight: 24,
  },

  detailText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 4,
  },

  badgesRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 8,
  },

  ratingBadge: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    fontWeight: 'bold',
    fontSize: 11,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
  },

  formatBadge: {
    backgroundColor: '#E0E7FF',
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 11,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  pagesText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },

  categoryBadge: {
    backgroundColor: PRIMARY,
    color: '#fff',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  descText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'justify',
  },

  error: {
    color: '#DC2626',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 30,
    fontSize: 15,
  },

  recomSection: {
    marginTop: 10,
    marginBottom: 30,
  },

  recomHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 20,
  },

  recomCard: {
    width: 180,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 3,

    marginRight: 15,
  },

  recomTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },

  recomYear: {
    fontSize: 13,
    color: '#6B7280',
  },
});