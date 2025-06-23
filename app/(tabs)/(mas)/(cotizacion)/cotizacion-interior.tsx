import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { getCotizacionesId, createRespuestaCot, updateRespondido, getRespuestaId, createRechazoCot, getRechazo } from '../../../../services/cotizacionService';
import { RespuestaCotizacionRequest } from '../../../../types/cotizacion';

const capitalizeWords = (str: string | undefined) => {
  if (!str) return '';
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Función para formatear números con separadores de miles
const formatNumber = (num: number | string | undefined): string => {
  if (num === undefined || num === null) return '0';

  const number = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(number)) return '0';

  return number.toLocaleString('es-CL');
};

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
  id_estado: number;
};

type RespuestaCotizacion = {
  id: number;
  id_cotizacion: number;
  mensaje: string;
  valor_estimado: number;
  fecha_respuesta: string;
};

type RechazoCotizacion = {
  id: number;
  id_cotizacion: number;
  motivo: string;
  fecha_rechazo: string;
  rechazado_por: number;
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
  const [rechazo, setRechazo] = useState<RechazoCotizacion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [showRechazoForm, setShowRechazoForm] = useState(false);

  const fetchDetalleCotizacion = async () => {
    try {
      setLoading(true);
      console.log('ID de la cotización a buscar:', id);
      console.log('Tipo de ID:', typeof id);
      const resultado = await getCotizacionesId(Number(id));
      console.log('Respuesta completa del servicio:', JSON.stringify(resultado, null, 2));
      setCotizacion(resultado);

      // Si la cotización está respondida o aceptada, obtener la respuesta
      if (resultado.id_estado === 2 || resultado.id_estado === 4) {
        const respuestaData = await getRespuestaId(Number(id));
        console.log('Respuesta de la cotización:', respuestaData);
        setRespuestaCotizacion(respuestaData);
      }

      // Si la cotización está rechazada, obtener el motivo del rechazo
      if (resultado.id_estado === 3) {
        const rechazoData = await getRechazo(Number(id));
        console.log('Motivo del rechazo:', rechazoData);
        setRechazo(rechazoData);
      }

      setLoading(false);
      setError(null);
    } catch (error: any) {
      console.error('Error detallado:', error);
      console.error('Stack trace:', error?.stack);
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

      console.log('ID a actualizar estado:', id, 'Tipo:', typeof id);
      await updateRespondido(Number(id), 2);
      console.log('Estado de respuesta actualizado');


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

  const handleRechazarCotizacion = async () => {
    if (!motivoRechazo.trim()) {
      Alert.alert('Error', 'Por favor ingrese el motivo del rechazo');
      return;
    }

    if (!cotizacion) return;

    try {
      setSending(true);
      const data = {
        id_cotizacion: Number(id),
        motivo: motivoRechazo,
        rechazado_por: "trabajador"
      };

      await createRechazoCot(data);
      await updateRespondido(Number(id), 3);

      Alert.alert(
        'Éxito',
        'Cotización rechazada correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error al rechazar cotización:', error);
      Alert.alert('Error', 'No se pudo rechazar la cotización. Por favor intenta nuevamente.');
    } finally {
      setSending(false);
      setShowRechazoForm(false);
      setMotivoRechazo('');
    }
  };

  const handleTerminarCotizacion = async () => {
    if (!cotizacion) return;

    try {
      setSending(true);
      await updateRespondido(Number(id), 5);

      // Actualizar el estado local
      setCotizacion({
        ...cotizacion,
        id_estado: 5
      });

      Alert.alert(
        'Éxito',
        'Cotización marcada como terminada',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error al marcar como terminada:', error);
      Alert.alert('Error', 'No se pudo marcar la cotización como terminada. Por favor intenta nuevamente.');
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

      {/* Mensaje de Chat Activo para estado 4 */}
      {cotizacion?.id_estado === 4 && (
        <TouchableOpacity
          style={styles.chatStatusContainer}
          onPress={() => router.push('/(mas)/(mensajes)/mensajes')}
        >
          <MaterialIcons name="chat-bubble" size={16} color="#007AFF" />
          <Text style={styles.chatStatusText}>Chat activo</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#007AFF" />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        {/* Detalles de la Cotización */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="description" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>Detalles de la Cotización</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={20} color="#666" />
              <Text style={styles.detailLabel}>Cliente:</Text>
              <Text style={styles.detailText}>{capitalizeWords(cotizacion?.nombre_cliente)} {cotizacion?.apellido_cliente}</Text>
            </View>
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

        {/* Respuesta del Trabajador (si existe) */}
        {(cotizacion?.id_estado === 2 || cotizacion?.id_estado === 4) && respuestaCotizacion && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name={cotizacion.id_estado === 4 ? "assignment-turned-in" : "check-circle"}
                size={24}
                color={cotizacion.id_estado === 4 ? "#1565C0" : "#34C759"}
              />
              <Text style={styles.sectionTitle}>
                {cotizacion.id_estado === 4 ? "Cotización Aceptada" : "Respuesta del Trabajador"}
              </Text>
            </View>

            <View style={styles.sectionContent}>
              <View style={[
                styles.responseCard,
                cotizacion.id_estado === 4 && styles.acceptedCard
              ]}>
                <View style={styles.responseHeader}>
                  <MaterialIcons
                    size={24}
                    color={cotizacion.id_estado === 4 ? "#1565C0" : "#34C759"}
                  />
                  <Text style={[
                    styles.responsePrice,
                    { color: cotizacion.id_estado === 4 ? "#1565C0" : "#34C759" }
                  ]}>
                    ${formatNumber(respuestaCotizacion.valor_estimado)}
                  </Text>
                </View>
                <View style={styles.responseMessage}>
                  <MaterialIcons name="message" size={20} color="#666" />
                  <Text style={styles.responseText}>{respuestaCotizacion.mensaje}</Text>
                </View>
                <View style={styles.responseFooter}>
                  <MaterialIcons name="event" size={16} color="#666" />
                  <Text style={styles.responseDate}>
                    {cotizacion.id_estado === 4 ? "Aceptada" : "Respondida"} el {new Date(respuestaCotizacion.fecha_respuesta).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Botón para marcar como terminada */}
              {cotizacion.id_estado === 4 && (
                <TouchableOpacity
                  style={styles.terminarButton}
                  onPress={handleTerminarCotizacion}
                  disabled={sending}
                >
                  <MaterialIcons name="check-circle" size={20} color="#fff" />
                  <Text style={styles.terminarButtonText}>
                    {sending ? 'Procesando...' : 'Marcar como Terminada'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Formulario de Respuesta para Cotizaciones Pendientes */}
        {cotizacion?.id_estado === 1 && (
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
                  disabled={sending}
                >
                  <Text style={styles.submitButtonText}>
                    {sending ? 'Enviando...' : 'Enviar Respuesta'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowRechazoForm(true)}
                  disabled={sending}
                >
                  <Text style={styles.cancelButtonText}>Rechazar Cotización</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Sección de Rechazo */}
        {cotizacion?.id_estado === 3 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="cancel" size={24} color="#FF3B30" />
              <Text style={styles.sectionTitle}>Cotización Rechazada</Text>
            </View>
            <View style={styles.sectionContent}>
              {rechazo ? (
                <View style={styles.rechazoCard}>
                  <View style={styles.rechazoMessage}>
                    <MaterialIcons name="message" size={20} color="#666" />
                    <Text style={styles.rechazoText}>{rechazo.motivo}</Text>
                  </View>
                  <View style={styles.rechazoFooter}>
                    <MaterialIcons name="event" size={16} color="#666" />
                    <Text style={styles.rechazoDate}>
                      Rechazado el {new Date(rechazo.fecha_rechazo).toLocaleDateString()} por {rechazo.rechazado_por}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.rejectedCard}>
                  <MaterialIcons name="info" size={24} color="#FF3B30" />
                  <Text style={styles.rejectedText}>Esta cotización ha sido rechazada</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Formulario de Rechazo */}
        {showRechazoForm && (
          <View style={styles.rechazoFormContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Motivo del Rechazo</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={motivoRechazo}
                onChangeText={setMotivoRechazo}
                multiline
                numberOfLines={4}
                placeholder="Ingrese el motivo del rechazo..."
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.rechazoButtonsContainer}>
              <TouchableOpacity
                style={[styles.rechazoButton, styles.confirmRechazoButton]}
                onPress={handleRechazarCotizacion}
                disabled={sending}
              >
                <Text style={styles.rechazoButtonText}>
                  {sending ? 'Enviando...' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rechazoButton, styles.cancelRechazoButton]}
                onPress={() => {
                  setShowRechazoForm(false);
                  setMotivoRechazo('');
                }}
                disabled={sending}
              >
                <Text style={styles.rechazoButtonText}>Cancelar</Text>
              </TouchableOpacity>
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 12,
  },
  sectionContent: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#495057',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 100,
  },
  detailText: {
    fontSize: 15,
    color: '#212529',
    flex: 1,
    lineHeight: 22,
  },
  responseCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  responsePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#28A745',
    marginLeft: 8,
  },
  responseMessage: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  responseText: {
    fontSize: 15,
    color: '#212529',
    marginLeft: 8,
    flex: 1,
    lineHeight: 22,
  },
  responseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  responseDate: {
    fontSize: 13,
    color: '#6C757D',
    marginLeft: 4,
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212529',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
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
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#6C757D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 15,
    color: '#DC3545',
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
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#DC3545',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rejectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8D7DA',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  rejectedText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#721C24',
    fontWeight: '500',
  },
  rechazoFormContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  rechazoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  rechazoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmRechazoButton: {
    backgroundColor: '#DC3545',
  },
  cancelRechazoButton: {
    backgroundColor: '#6C757D',
  },
  rechazoButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  rechazoCard: {
    backgroundColor: '#F8D7DA',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5C6CB',
  },
  rechazoMessage: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  rechazoText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#721C24',
    flex: 1,
    lineHeight: 22,
  },
  rechazoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5C6CB',
  },
  rechazoDate: {
    marginLeft: 8,
    fontSize: 13,
    color: '#721C24',
  },
  acceptedCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#BBDEFB',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  chatStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#E3F2FD',
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  chatStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    flex: 1,
    textAlign: 'center',
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    gap: 8,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  terminarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28A745',
    borderRadius: 8,
    padding: 14,
    gap: 8,
    marginTop: 16,
  },
  terminarButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});