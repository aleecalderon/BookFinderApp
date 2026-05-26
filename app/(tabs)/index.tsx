import React from 'react';
import { StyleSheet, View } from 'react-native';
import CollectionScreen from '../../src/screens/CollectionScreen';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <CollectionScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});