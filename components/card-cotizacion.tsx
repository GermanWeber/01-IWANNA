
import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';


type CotizacionCardProps = {
  id: string;
  nombre: string;
  apellido: string;
  fecha: string;
  motivo: string;
  imagen: string;
  onPress?: () => void;
};

const CotizacionCard = ({ id, nombre, apellido, fecha, motivo, imagen, onPress }: CotizacionCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardContent}>
      <Image source={{ uri: imagen }} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.nombre}>{nombre} {apellido}</Text>
        <Text style={styles.fecha}>Enviado el {fecha}</Text>
        <Text style={styles.motivo} numberOfLines={1} ellipsizeMode="tail">{motivo}</Text>
      </View>
    </View>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    scrollView: {
      flex: 1,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    nombre: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 4,
    },
    fecha: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
    },
    motivo: {
      fontSize: 14,
      color: '#444',
      fontStyle: 'italic',
    },
  });

export default CotizacionCard;