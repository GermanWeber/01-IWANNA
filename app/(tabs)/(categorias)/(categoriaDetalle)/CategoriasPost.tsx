import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetalleCategoriaPosts() {
  return (
    <View style={styles.container}>
      <Text>Lista de card de post de la misma categoria</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});