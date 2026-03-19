import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
// 1. Importamos tus colores
import { Colors } from '../../constants/theme';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');

  // 2. Elegimos usar el modo claro (por ahora)
  const theme = Colors.light; 

  return (
    // 3. Aplicamos el color de fondo de tu tema al contenedor principal
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* 4. Aplicamos el color de texto a tu título */}
      <Text style={[styles.title, { color: theme.text }]}>BookFinder 📚</Text>
      
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
        placeholder="Buscar por libro o autor..."
        placeholderTextColor={theme.icon}
        value={query}
        onChangeText={setQuery}
      />
      
      {/* 5. Le damos el color de acento (tint) al botón */}
      <Button 
        title="Buscar" 
        color={theme.tint}
        onPress={() => navigation.navigate('Results', { searchQuery: query })} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 }
});