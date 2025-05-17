import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

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

    // Aquí podrías construir un FormData y hacer POST
    console.log({ rut, documento, foto });

    Alert.alert('Éxito', 'Datos enviados para verificación');
    router.push('/(mas)/mas');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Verificación</Text>

<View style={styles.bodyContainer}>
      <TextInput
        style={styles.input}
        placeholder="RUT (Ej: 12345678-9)"
        value={rut}
        onChangeText={setRut}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de documento (Ej: B1234567)"
        value={documento}
        onChangeText={setDocumento}
      />

      <View style={styles.buttonRow}>
        <Button title="Seleccionar Foto" onPress={seleccionarFoto} color="#8BC34A" />
        <View style={{ width: 10 }} />
        <Button title="Tomar Foto" onPress={tomarFoto} color="#8BC34A" />
      </View>

      {foto && (
        <Image
          source={{ uri: foto.uri }}
          style={{ width: 200, height: 200, marginTop: 20, alignSelf: 'center' }}
        />
      )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Enviar" onPress={enviarFormulario} color="#8BC34A" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    flex: 1, 
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  bodyContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20
},
  title: { fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  input: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10,
    marginBottom: 15, 
    borderRadius: 5
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20
  }
});
