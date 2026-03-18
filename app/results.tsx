// app/results.tsx
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchBooks } from '../services/api';

export default function ResultsScreen() {
  // Recibimos los datos del formulario
  const params = useLocalSearchParams(); 
  
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDataFromAPI = async () => {
      setLoading(true);
      // Mandamos los datos a la API mediante GET
      const result = await fetchBooks(params);
      setJsonResult(result);
      setLoading(false);
    };

    getDataFromAPI();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <ScrollView style={styles.jsonContainer}>
          <Text style={styles.jsonText}>
            {JSON.stringify(jsonResult, null, 2)}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  loader: { marginTop: 50 },
  jsonContainer: { flex: 1, backgroundColor: '#1e1e1e', padding: 15, borderRadius: 8 },
  jsonText: { color: '#00ff00', fontFamily: 'monospace', fontSize: 14 }
});
