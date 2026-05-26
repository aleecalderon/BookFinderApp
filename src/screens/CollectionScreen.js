import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CollectionScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [savedPhotos, setSavedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const cameraRef = useRef(null);

  // 1. Solicitar permisos de la cámara y cargar fotos guardadas al abrir la pantalla
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      // Recuperar las fotos guardadas localmente en AsyncStorage
      try {
        const localData = await AsyncStorage.getItem('@mi_coleccion_libros');
        if (localData !== null) {
          setSavedPhotos(JSON.parse(localData));
        }
      } catch (error) {
        console.error("Error al cargar la colección:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2. Función para tomar la foto y guardarla localmente con AsyncStorage
  const captureAndSavePhoto = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.6, skipProcessing: false };
        const photo = await cameraRef.current.takePictureAsync(options);
        
        // Crear el nuevo objeto de foto para la lista
        const newPhotoItem = {
          id: Date.now().toString(),
          uri: photo.uri,
          date: new Date().toLocaleDateString()
        };

        // Actualizar la lista y guardarla de forma persistente
        const updatedCollection = [...savedPhotos, newPhotoItem];
        setSavedPhotos(updatedCollection);
        await AsyncStorage.setItem('@mi_coleccion_libros', JSON.stringify(updatedCollection));
        
        setIsCameraActive(false); // Cierra la cámara
        Alert.alert("¡Éxito!", "La foto de tu libro físico se guardó en tu colección.");
      } catch (error) {
        Alert.alert("Error", "No se pudo capturar la fotografía.");
      }
    }
  };

  // Manejo visual de los estados de carga y permisos
  if (hasPermission === null || loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.center}><Text style={styles.errorText}>No se otorgaron permisos para usar la cámara.</Text></View>;
  }

  return (
    <View style={styles.container}>
      {isCameraActive ? (
        // --- VISTA DE LA CÁMARA EN VIVO ---
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsCameraActive(false)}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.snapButton} onPress={captureAndSavePhoto}>
              <View style={styles.innerSnapButton} />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        // --- INTERFAZ PRINCIPAL DE "MI COLECCIÓN" ---
        <View style={styles.collectionContainer}>
          <Text style={styles.mainTitle}>📸 Mi Colección de Libros</Text>
          <Text style={styles.subTitle}>Guarda evidencias fotográficas de tus libros físicos</Text>
          
          <TouchableOpacity style={styles.openCameraButton} onPress={() => setIsCameraActive(true)}>
            <Text style={styles.openCameraText}>Tomar Foto a Libro</Text>
          </TouchableOpacity>

          <FlatList
            data={savedPhotos}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.bookCard}>
                <Image source={{ uri: item.uri }} style={styles.bookImage} />
                <Text style={styles.bookDate}>Escaneado: {item.date}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Tu colección está vacía.</Text>
                <Text style={styles.emptySubText}>Presiona el botón de arriba para agregar tu primer libro físico.</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  camera: { flex: 1, justifyContent: 'flex-end' },
  cameraControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30, marginBottom: 40 },
  closeButton: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 20 },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  snapButton: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  innerSnapButton: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#FFF' },
  collectionContainer: { flex: 1, padding: 20, paddingTop: 40 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  subTitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20, marginTop: 5 },
  openCameraButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  openCameraText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  listContainer: { paddingBottom: 20 },
  bookCard: { flex: 1, margin: 8, backgroundColor: '#F8F9FA', borderRadius: 12, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: '#EAEAEA' },
  bookImage: { width: 130, height: 180, borderRadius: 8 },
  bookDate: { fontSize: 11, color: '#888', marginTop: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  emptySubText: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 5, paddingHorizontal: 20 }
});