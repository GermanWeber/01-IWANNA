import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AdBanner = () => {
  return (
    <View style={styles.adContainer}>
      <View style={styles.adContent}>
        <Text style={styles.adText}>Publicidad</Text>
        <View style={styles.adBanner}>
          <Text style={styles.adBannerText}>ESPACIO PUBLICITARIO</Text>
          <Text style={styles.adBannerSubtext}>Anúnciate aquí</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  adContent: {
    width: '100%',
    maxWidth: 320,
  },
  adText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
  },
  adBanner: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  adBannerText: {
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  adBannerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default AdBanner;
