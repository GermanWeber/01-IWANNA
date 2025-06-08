import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { getCotizacionesId, createRespuestaCot, updateRespondido, getRespuestaId } from '../../../../services/cotizacionService';
import { RespuestaCotizacionRequest } from '../../../../types/cotizacion';

type DetalleCotizacion = {
  id: number;
  id_cliente: number;
  nombre_cliente: string;
  apellido_cliente: string;
  id_trabajador: number;
  asunto: string;
  descripcion: string;
  direccion: string;
  f_creacion: string;
  respondida: number;
};

type RespuestaCotizacion = {
  id: number;
  id_cotizacion: number;
  mensaje: string;
  valor_estimado: number;
  f_respuesta: string;
};

export default function CotizacionInterior() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [cotizacion, setCotizacion] = useState<DetalleCotizacion | null>(null);
  const [respuesta, setRespuesta] = useState('');
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [respuestaCotizacion, setRespuestaCotizacion] = useState<RespuestaCotizacion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDetalleCotizacion = async () => {
    try {
      setLoading(true);
      console.log('ID de la cotización a buscar:', id);
      const resultado = await getCotizacionesId(Number(id));
      console.log('Respuesta del servicio:', resultado);
      setCotizacion(resultado);

      // Si la cotización está respondida, obtener la respuesta
      if (resultado.respondida === 1) {
        const respuestaData = await getRespuestaId(Number(id));
        console.log('Respuesta de la cotización:', respuestaData);
        setRespuestaCotizacion(respuestaData);
      }

      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error al cargar detalles de la cotización:', error);
      setError('No se pudo cargar la cotización. Por favor, intenta más tarde.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalleCotizacion();
  }, [id]);

  const handleEnviarRespuesta = async () => {
    if (!respuesta.trim() || !precio.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setSending(true);
      const data: RespuestaCotizacionRequest = {
        id_cotizacion: Number(id),
        mensaje: respuesta,
        valor_estimado: Number(precio)
      };

      console.log('Enviando respuesta:', data);
      const resultado = await createRespuestaCot(data);
      console.log('Respuesta enviada:', resultado);

      await updateRespondido(Number(id));
      console.log('Estado de respuesta actualizado');

      // // Obtener la respuesta actualizada
      // const respuestaActualizada = await getRespuestaId(Number(id));
      // setRespuestaCotizacion(respuestaActualizada);

      // // Actualizar el estado de la cotización
      // if (cotizacion) {
      //   setCotizacion({
      //     ...cotizacion,
      //     respondida: 1
      //   });
      // }

      Alert.alert(
        'Éxito',
        'Respuesta enviada correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
      Alert.alert('Error', 'No se pudo enviar la respuesta. Por favor intenta nuevamente.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando cotización...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchDetalleCotizacion}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!cotizacion) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>No se encontró la cotización</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Detalles de la Cotización</Text>
      </View>

      <View style={styles.content}>
        {/* Información del Cliente */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>Información del Cliente</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.clientName}>
              {cotizacion?.nombre_cliente} {cotizacion?.apellido_cliente}
            </Text>
          </View>
        </View>

        {/* Detalles de la Cotización */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="description" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>Detalles de la Cotización</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.detailRow}>
              <MaterialIcons name="subject" size={20} color="#666" />
              <Text style={styles.detailLabel}>Asunto:</Text>
              <Text style={styles.detailText}>{cotizacion?.asunto}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="info" size={20} color="#666" />
              <Text style={styles.detailLabel}>Descripción:</Text>
              <Text style={styles.detailText}>{cotizacion?.descripcion}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={20} color="#666" />
              <Text style={styles.detailLabel}>Dirección:</Text>
              <Text style={styles.detailText}>{cotizacion?.direccion}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="event" size={20} color="#666" />
              <Text style={styles.detailLabel}>Fecha de Creación:</Text>
              <Text style={styles.detailText}>
                {new Date(cotizacion?.f_creacion || '').toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {cotizacion?.respondida === 1 && respuestaCotizacion ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="check-circle" size={24} color="#34C759" />
              <Text style={styles.sectionTitle}>Respuesta del Trabajador</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.responseCard}>
                <View style={styles.responseHeader}>
                  <MaterialIcons name="attach-money" size={24} color="#34C759" />
                  <Text style={styles.responsePrice}>
                    ${respuestaCotizacion.valor_estimado}
                  </Text>
                </View>
                <View style={styles.responseMessage}>
                  <MaterialIcons name="message" size={20} color="#666" />
                  <Text style={styles.responseText}>{respuestaCotizacion.mensaje}</Text>
                </View>
                <View style={styles.responseFooter}>
                  <MaterialIcons name="event" size={16} color="#666" />
                  <Text style={styles.responseDate}>
                    Respondida el {new Date(respuestaCotizacion.f_respuesta).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="reply" size={24} color="#FF9500" />
              <Text style={styles.sectionTitle}>Responder Cotización</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Valor Estimado ($)</Text>
                  <TextInput
                    style={styles.input}
                    value={precio}
                    onChangeText={setPrecio}
                    keyboardType="numeric"
                    placeholder="Ingrese el valor estimado"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Mensaje de Respuesta</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={respuesta}
                    onChangeText={setRespuesta}
                    multiline
                    numberOfLines={4}
                    placeholder="Escriba su respuesta..."
                    placeholderTextColor="#999"
                  />
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleEnviarRespuesta}
                >
                  <Text style={styles.submitButtonText}>Enviar Respuesta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  sectionContent: {
    padding: 16,
  },
  clientName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  responseCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  responsePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
    marginLeft: 8,
  },
  responseMessage: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  responseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});