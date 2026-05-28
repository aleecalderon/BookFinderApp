import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
// 1. Importamos tus colores
import * as Location from 'expo-location'; //libreria para usar la ubica
//Importamos almacenamiento seguro
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { TextInput } from 'react-native';
import { Colors } from '../../constants/theme';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Cargando ubicación...'); //par la ubicacion
  
  // 2. Elegimos usar el modo claro (por ahora)
  const theme = Colors.light;
  //Función para guardar datos del usuario 
  const saveUserData = async () => {
  await SecureStore.setItemAsync('username', 'Juan'); // guarda nombre
  await SecureStore.setItemAsync('token', 'abc123'); // guarda token ficticio
 //guarda la ciudad del usuario en el celula
  await SecureStore.setItemAsync('city', city);
};

   //  useEffect se ejecuta UNA VEZ al cargar la pantalla
  useEffect(() => {
    (async () => {
      // Pedimos permiso al usuario para usar la ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();

       // Si el usuario NO acepta el permiso
      if (status !== 'granted') {
        setCity('Permiso denegado');
        return;
      }
          //  Obtenemos la ubicación actual (latitud y longitud)
      let location = await Location.getCurrentPositionAsync({});
      //  Convertimos coordenadas en una dirección (ciudad)
      let geocode = await Location.reverseGeocodeAsync(location.coords);

       // Si encontramos datos, guardamos la ciudad
      if (geocode.length > 0) {
        setCity(geocode[0].city || 'Ciudad desconocida');
      }
    })();
  }, []);  // 🔁 [] = solo se ejecuta una ve


 return (
  <View style={[styles.container, { backgroundColor: theme.background }]}>
    
    <Text style={[styles.title, { color: theme.text }]}>
      BookFinder 📚
    </Text>
     {/* ✅ Mostramos la ciudad obtenida */}
    <Text style={{ color: theme.text, textAlign: 'center', marginBottom: 10 }}>
      📍 {city}
    </Text>

    <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
        placeholder="Buscar por libro o autor..."
        placeholderTextColor={theme.icon}
        value={query}
        onChangeText={setQuery}
      />
<Button 
  title="Buscar" 
  color={theme.tint}
  onPress={async () => {
    await saveUserData(); //  guardamos datos antes de navegar
    navigation.navigate('Results', { // enviamos lo que el usuario escribió
      searchQuery: query,  
      city: city   //enviamos la ciudad obtenida por GPS
        });
  }}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 }
});