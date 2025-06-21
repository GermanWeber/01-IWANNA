import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Platform, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FormularioVerificacion() {
  const [rut, setRut] = useState('');
  const [documento, setDocumento] = useState('');
  const [foto, setFoto] = useState<ImagePicker.ImagePickerAsset | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Necesitamos permiso para usar la cámara y galería');
      }
    })();
  }, []);

  const seleccionarFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setFoto(result.assets[0]);
    }
  };

  const tomarFoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setFoto(result.assets[0]);
    }
  };

  const enviarFormulario = () => {
    if (!rut || !documento || !foto) {
      Alert.alert('Faltan datos', 'Completa todos los campos y sube la foto');
      return;
    }

    Alert.alert('Éxito', 'Datos enviados para verificación');
    router.push('/(mas)/mas');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="document-text" size={32} color="#8BC34A" />
          </View>
          <Text style={styles.title}>Formulario de Verificación</Text>
          <Text style={styles.subtitle}>Completa tus datos para verificar tu identidad</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* RUT Input */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Ionicons name="card" size={20} color="#8BC34A" />
              <Text style={styles.inputLabel}>RUT</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ej: 12345678-9"
              value={rut}
              onChangeText={setRut}
              placeholderTextColor="#999"
            />
          </View>

          {/* Documento Input */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Ionicons name="document" size={20} color="#8BC34A" />
              <Text style={styles.inputLabel}>Número de documento</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ej: B1234567"
              value={documento}
              onChangeText={setDocumento}
              placeholderTextColor="#999"
            />
          </View>

          {/* Foto Section */}
          <View style={styles.photoSection}>
            <View style={styles.photoHeader}>
              <Ionicons name="camera" size={20} color="#8BC34A" />
              <Text style={styles.photoLabel}>Foto de cédula de identidad</Text>
            </View>

            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoButton} onPress={seleccionarFoto}>
                <Ionicons name="images" size={18} color="#8BC34A" />
                <Text style={styles.photoButtonText}>Galería</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.photoButton} onPress={tomarFoto}>
                <Ionicons name="camera" size={18} color="#8BC34A" />
                <Text style={styles.photoButtonText}>Cámara</Text>
              </TouchableOpacity>
            </View>

            {foto && (
              <View style={styles.photoPreview}>
                <Image
                  source={{ uri: foto.uri }}
                  style={styles.previewImage}
                />
                <View style={styles.photoInfo}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.photoInfoText}>Foto seleccionada</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!rut || !documento || !foto) && styles.submitButtonDisabled
            ]}
            onPress={enviarFormulario}
            disabled={!rut || !documento || !foto}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Enviar verificación</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  photoSection: {
    marginBottom: 30,
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#8BC34A',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8BC34A',
    marginLeft: 6,
  },
  photoPreview: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
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
  previewImage: {
    width: 200,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  photoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  photoInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});
