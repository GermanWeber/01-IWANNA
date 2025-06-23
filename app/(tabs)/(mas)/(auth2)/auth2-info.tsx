import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { recuperarStorage } from '../../../../services/asyncStorage';
import { API_URL } from '@env';
import { updateVerificacion } from '../../../../services/userService';
import { obtenerDatos } from '../../../../services/userService';
import { guardarStorage } from '../../../../services/asyncStorage';

export default function VerificacionInfoScreen() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<any>(null);

  const loadUsuario = async () => {
    try {
      console.log('Iniciando carga de usuario...');
      const usuarioData = await recuperarStorage('usuario');
      
      if (usuarioData) {
        console.log('Usuario recuperado:', usuarioData);
        setUsuario(usuarioData);
      }
    } catch (error) {
      console.log('Error al recuperar el usuario:', error);
    }
  };

  const handleAceptar = async () => {

  const update = await updateVerificacion(usuario.id);

    if (update) {
    usuario.id_auth = 3;
    await guardarStorage('usuario', usuario);
    
    router.back();
    }
  };

  useEffect(() => {
    loadUsuario();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="shield-checkmark" size={32} color="#8BC34A" />
          </View>
          <Text style={styles.title}>Solicitud de verificación</Text>
          <Text style={styles.subtitle}>Completa tu perfil para mayor confianza</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle" size={24} color="#8BC34A" />
              <Text style={styles.cardTitle}>¿Por qué verificarse?</Text>
            </View>
            <Text style={styles.description}>
              Para una mayor transparencia y seguridad en la plataforma, <Text style={styles.bold}>IWANNA</Text> requiere que verifiques tu identidad.
            </Text>
          </View>

          <View style={styles.securityCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="lock-closed" size={24} color="#4CAF50" />
              <Text style={styles.cardTitle}>Seguridad y privacidad</Text>
            </View>
            <Text style={styles.description}>
              Todos los datos que te pediremos son confidenciales y son utilizados únicamente para verificar tu identidad. Tu informacion no sera compartida con terceros.
            </Text>
          </View>

          <View style={styles.benefitsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.cardTitle}>Beneficios de la verificación</Text>
            </View>
            <Text style={styles.description}>
              Una vez enviada la solicitud, nuestro equipo se pondra en contacto contigo para solicitar los documentos necesarios para verificar tu identidad. Tu cuenta quedará marcada como <Text style={styles.bold}>"Verificada"</Text>. Con tu cuenta verificada tendrás una visibilidad mayor en la plataforma.
            </Text>
          </View>

          <View style={styles.requirementsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text" size={24} color="#FF6B35" />
              <Text style={styles.cardTitle}>Documentos requeridos</Text>
            </View>

            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                <View style={styles.requirementIcon}>
                  <Ionicons name="document" size={16} color="#8BC34A" />
                </View>
                <Text style={styles.requirementText}>Número de documento (serie del carnet)</Text>
              </View>

              <View style={styles.requirementItem}>
                <View style={styles.requirementIcon}>
                  <Ionicons name="camera" size={16} color="#8BC34A" />
                </View>
                <Text style={styles.requirementText}>Foto clara de tu cédula de identidad (ambas caras)</Text>
              </View>
            </View>
          </View>

          <View style={styles.termsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
              <Text style={styles.cardTitle}>Términos y condiciones</Text>
            </View>
            <Text style={styles.description}>
              Al aceptar y continuar, estás de acuerdo con los términos y condiciones de <Text style={styles.bold}>IWANNA</Text>.
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleAceptar()}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Aceptar y enviar solicitud</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10
  },
  listItem: {
    fontSize: 16,
    marginLeft: 10
  },
  bodyContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  headerIcon: {
    backgroundColor: 'rgba(139, 195, 74, 0.1)',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  requirementsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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
  requirementsList: {
    marginTop: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requirementIcon: {
    backgroundColor: 'rgba(139, 195, 74, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  requirementText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  securityCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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
  benefitsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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
  termsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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
  primaryButton: {
    backgroundColor: '#8BC34A',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
