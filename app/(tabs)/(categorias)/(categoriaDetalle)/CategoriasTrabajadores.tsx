import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native';
import BotonAvatar from '../../../../components/botonAvatar';
import { useRouter } from 'expo-router';



export default function DetalleCategoriaTrabajadores(){
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <BotonAvatar
            textoBoton='Juan Gana'
            textoProfesion='Maestro parrillero'
            colorTextoProfesion='#424242'      
            avatar={require('../../../../assets/images/perfil.png')}
            colorTexto='#8BC34A'
            bgColor='#F5F5F5'
            iconoDerecha={"chevron-forward"}
            colorIconoDerecha='#00BCD4'
            onPress={() => router.push('/(mas)/(perfil_usuario)/mi-perfil')}
            
            />
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
