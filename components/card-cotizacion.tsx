import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type CotizacionCardProps = {
  id: string;
  nombre: string;
  apellido: string;
  fecha: string;
  motivo: string;
  estado: string;
  onPress: () => void;
};

export default function CotizacionCard({ id, nombre, apellido, fecha, motivo, estado, onPress }: CotizacionCardProps) {
  const getEstadoColor = () => {
    switch (estado) {
      case 'Respondida':
        return '#34C759';
      case 'Aceptada':
        return '#1565C0';
      case 'Terminada':
        return '#28A745';
      case 'Rechazada':
        return '#C62828';
      default:
        return '#FF9500';
    }
  };

  const getEstadoIcon = () => {
    switch (estado) {
      case 'Respondida':
        return 'check-circle';
      case 'Aceptada':
        return 'assignment-turned-in';
      case 'Terminada':
        return 'task-alt';
      case 'Rechazada':
        return 'cancel';
      default:
        return 'pending-actions';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={24} color="#007AFF" />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{nombre} {apellido}</Text>
            <Text style={styles.date}>{formatDate(fecha)}</Text>
          </View>
        </View>
        <View style={[styles.estadoContainer, { backgroundColor: getEstadoColor() + '15' }]}>
          <MaterialIcons name={getEstadoIcon()} size={16} color={getEstadoColor()} />
          <Text style={[styles.estado, { color: getEstadoColor() }]}>{estado}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.motivoContainer}>
          <MaterialIcons name="description" size={20} color="#666" />
          <Text style={styles.motivo} numberOfLines={2}>{motivo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: '#666',
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6,
  },
  estado: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 3,
  },
  content: {
    marginTop: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 8,
  },
  motivoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  motivo: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  }
});