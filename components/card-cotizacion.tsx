import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type CotizacionCardProps = {
  id: string;
  nombre: string;
  apellido: string;
  fecha: string;
  motivo: string;
  estado: string;
  onPress?: () => void;
};

const CotizacionCard: React.FC<CotizacionCardProps> = ({
  nombre,
  apellido,
  fecha,
  motivo,
  estado,
  onPress,
}) => {
  const isRespondida = estado === 'Respondida';

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <MaterialIcons
            name="person"
            size={24}
            color={isRespondida ? '#4CAF50' : '#007AFF'}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{`${nombre} ${apellido}`}</Text>
            <Text style={styles.date}>{new Date(fecha).toLocaleDateString()}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, isRespondida ? styles.respondidaBadge : styles.pendienteBadge]}>
          <MaterialIcons
            name={isRespondida ? 'check-circle' : 'pending-actions'}
            size={16}
            color="#fff"
          />
          <Text style={styles.statusText}>{estado}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <MaterialIcons name="description" size={20} color="#666" />
        <Text style={styles.motivo} numberOfLines={2}>{motivo}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Ver Detalles</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  respondidaBadge: {
    backgroundColor: '#4CAF50',
  },
  pendienteBadge: {
    backgroundColor: '#FF6B6B',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  motivo: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});

export default CotizacionCard;