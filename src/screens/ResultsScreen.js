import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';

export default function ResultsScreen({ route }) {
  const { searchQuery } = route.params;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        setBooks(data.items || []);
        setLoading(false);
      });
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" /> : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image 
                source={{ uri: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150' }} 
                style={styles.img} 
              />
              <View>
                <Text style={styles.bold}>{item.volumeInfo.title}</Text>
                <Text>{item.volumeInfo.authors?.join(', ')}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  img: { width: 50, height: 75, marginRight: 10 },
  bold: { fontWeight: 'bold' }
});