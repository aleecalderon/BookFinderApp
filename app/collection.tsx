import React, { useEffect, useRef, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    CameraView,
    useCameraPermissions,
} from "expo-camera";

const PRIMARY = "#6C63FF";

export default function CollectionScreen() {
  const [permission, requestPermission] =
    useCameraPermissions();

  const [isCameraActive, setIsCameraActive] =
    useState(false);

  const [savedPhotos, setSavedPhotos] = useState<any[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const cameraRef = useRef<any>(null);

  // ==========================
  // CARGAR COLECCIÓN
  // ==========================
  useEffect(() => {
    const loadCollection = async () => {
      try {
        const localData =
          await AsyncStorage.getItem(
            "@mi_coleccion_libros"
          );

        if (localData) {
          setSavedPhotos(JSON.parse(localData));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, []);

  // ==========================
  // TOMAR FOTO
  // ==========================
  const captureAndSavePhoto = async () => {
    try {
      if (!cameraRef.current) return;

      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 0.7,
        });

      const newPhotoItem = {
        id: Date.now().toString(),
        uri: photo.uri,
        date: new Date().toLocaleDateString(),
      };

      const updatedCollection = [
        newPhotoItem,
        ...savedPhotos,
      ];

      setSavedPhotos(updatedCollection);

      await AsyncStorage.setItem(
        "@mi_coleccion_libros",
        JSON.stringify(updatedCollection)
      );

      setIsCameraActive(false);

      Alert.alert(
        "✨ Libro agregado",
        "Tu foto fue guardada correctamente."
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Error",
        "No se pudo tomar la fotografía."
      );
    }
  };

  // ==========================
  // ABRIR CÁMARA
  // ==========================
  const handleOpenCamera = async () => {
    try {
      if (!permission?.granted) {
        const response =
          await requestPermission();

        if (!response.granted) {
          Alert.alert(
            "Permiso requerido",
            "Debes permitir acceso a la cámara."
          );

          return;
        }
      }

      setIsCameraActive(true);
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  // ELIMINAR FOTO
  // ==========================
  const deletePhoto = async (id: string) => {
    try {
      const filtered = savedPhotos.filter(
        (item) => item.id !== id
      );

      setSavedPhotos(filtered);

      await AsyncStorage.setItem(
        "@mi_coleccion_libros",
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={PRIMARY}
        />
      </View>
    );
  }

  // ==========================
  // RENDER
  // ==========================
  return (
    <View style={styles.container}>
      {isCameraActive ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
        >
          <View style={styles.cameraOverlay}>
            <Text style={styles.cameraTitle}>
              📸 Escanea tu libro
            </Text>

            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() =>
                  setIsCameraActive(false)
                }
              >
                <Text style={styles.btnText}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.snapButton}
                onPress={captureAndSavePhoto}
              >
                <View style={styles.innerSnapButton} />
              </TouchableOpacity>

              <View style={{ width: 90 }} />
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={styles.collectionContainer}>
          <Text style={styles.mainTitle}>
            📚 Mi Colección
          </Text>

          <Text style={styles.subTitle}>
            Guarda fotos de tus libros físicos
          </Text>

          <TouchableOpacity
            style={styles.openCameraButton}
            onPress={handleOpenCamera}
          >
            <Text style={styles.openCameraText}>
              + Agregar Libro
            </Text>
          </TouchableOpacity>

          <FlatList
            data={savedPhotos}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            renderItem={({ item }) => (
              <View style={styles.bookCard}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.bookImage}
                />

                <Text style={styles.bookDate}>
                  📅 {item.date}
                </Text>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    deletePhoto(item.id)
                  }
                >
                  <Text style={styles.deleteText}>
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>
                  📸
                </Text>

                <Text style={styles.emptyTitle}>
                  Tu colección está vacía
                </Text>

                <Text style={styles.emptySubText}>
                  Agrega fotos de tus libros físicos.
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

// ==========================
// ESTILOS
// ==========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // CAMERA
  camera: {
    flex: 1,
  },

  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 60,
  },

  cameraTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },

  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  closeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  snapButton: {
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  innerSnapButton: {
    width: 68,
    height: 68,
    borderRadius: 40,
    backgroundColor: "#fff",
  },

  // CONTENT
  collectionContainer: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 25,
  },

  mainTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },

  subTitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 22,
  },

  openCameraButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 25,

    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,
    shadowRadius: 6,

    elevation: 5,
  },

  openCameraText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // CARD
  bookCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 22,
    padding: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.06,
    shadowRadius: 5,

    elevation: 4,
  },

  bookImage: {
    width: "100%",
    height: 190,
    borderRadius: 16,
  },

  bookDate: {
    marginTop: 10,
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },

  deleteButton: {
    marginTop: 10,
    backgroundColor: "#FFEBEE",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },

  deleteText: {
    color: "#E53935",
    fontWeight: "bold",
    fontSize: 13,
  },

  // EMPTY
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyEmoji: {
    fontSize: 70,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },

  emptySubText: {
    marginTop: 8,
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
});