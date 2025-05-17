import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FavoritosTrabajador() {
  return (
    <View style={styles.container}>
      <Text>Lista de trabajadores favoritos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});