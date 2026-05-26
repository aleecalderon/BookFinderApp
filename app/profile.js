import { StyleSheet, View } from "react-native";
// Importamos tu pantalla de la cámara subiendo un nivel de carpeta
import CollectionScreen from "../src/screens/CollectionScreen";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Aquí cargamos directamente toda tu interfaz de fotos */}
      <CollectionScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Mantenemos el fondo blanco limpio del grupo
  },
});