import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookFinder 📚</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar por libro o autor..."
        value={query}
        onChangeText={setQuery}
      />
      <Button 
        title="Buscar" 
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