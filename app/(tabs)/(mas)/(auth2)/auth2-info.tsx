import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function VerificacionInfoScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
    
      <Text style={styles.title}>Verificación de Identidad</Text>
      <View style={styles.bodyContainer}>
      <Text style={styles.text}>
            Para una mayor transparencia y seguridad en la plataforma, <Text style={{ fontWeight: 'bold' }}>IWANNA</Text> requiere que verifiques tu identidad.  
        </Text>
        <Text style={styles.text}>
            Para esto te pedimos los siguientes datos:
        </Text>
        <Text style={styles.listItem}>• RUT</Text>
        <Text style={styles.listItem}>• Número de documento (serie del carnet)</Text>
        <Text style={styles.listItem}>• Foto clara de tu cédula de identidad</Text>
        <View style={{ marginTop: 10 }} />

        <Text style={styles.text}>
            Todos los datos que ingreses son confidenciales y son utilizados únicamente para verificar tu identidad. Toda la información sera encriptada y almacenada de manera segura.
        </Text>
        <Text style={styles.text}>
            Una vez enviados, revisaremos tu información y tu cuenta quedará marcada como <Text style={{ fontWeight: 'bold' }}>"Verificada"</Text>.
        </Text>
        <Text style={styles.text}>
            Con tu cuenta verificada tendras una visibilidad mayor en la plataforma.
        </Text>
        <Text style={styles.text}>
            Al aceptar y continuar, estás de acuerdo con los términos y condiciones de <Text style={{ fontWeight: 'bold' }}>IWANNA</Text>. 
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Aceptar y continuar" onPress={() => router.push('/(mas)/(auth2)/auth2-form')} color="#8BC34A"/>
        <View style={{ marginTop: 10 }} />
        <Button title="Cancelar" onPress={() => router.back()} color="gray" />
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
  title: { fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 15 
},
  text: { fontSize: 16, 
    marginBottom: 10 
},
  listItem: { fontSize: 16, 
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
}
});
