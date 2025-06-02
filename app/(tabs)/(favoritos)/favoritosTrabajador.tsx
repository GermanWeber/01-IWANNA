import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native';
import BotonAvatar from '../../../components/botonAvatar';
import { useRouter } from 'expo-router';
import { recuperarStorage } from '../../../services/asyncStorage';
import { fetchTrabajadores } from '../../../services/favService';
import { Ionicons } from '@expo/vector-icons';

interface Trabajador {
  id: number;
  nombre: string;
  foto: string;
  descripcion: string;
}

export default function FavoritosTrabajador() {
  const router = useRouter();
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any>(null);
  

  useEffect(() => {

    const cargarUsuario = async () => {
      try {
        setLoading(true);
        const usuario = await recuperarStorage('usuario');
        setUsuario(usuario);
        
        if (usuario && usuario.id) {
          const data = await fetchTrabajadores(usuario.id);
          if (data) {
            setTrabajadores(data);
          }
        } else {
          throw new Error('No se pudo obtener la información del usuario');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error al cargar el usuario');
      } finally {
        setLoading(false);
      }
    };
        
    cargarUsuario();
    
  }, []);

      if (loading) {
            return (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Cargando publicaciones...</Text>
              </View>
            );
          }

  if (!usuario?.id) {
    return (
        <View style={styles.container}>
          <Ionicons name="sad" size={40} color="#84AE46" />
          <Text style={{fontWeight: '900'}}>No estas regitrado</Text>
          <Text >unete a <Text style={{fontWeight: '900', color: '#84AE46'}}>IWANNA </Text></Text>
          <Text>y obten la experiencia completa</Text>
          <TouchableOpacity onPress={() => router.push('(auth)')}>
            <Text style={{color: '#84AE46'}}>Registrate aqui</Text>
          </TouchableOpacity>
        </View>
      );
}

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {trabajadores.length > 0 ? (
            trabajadores.map((trabajador) => (
              <BotonAvatar
                key={trabajador.id}
                textoBoton={trabajador.nombre}
                textoProfesion={trabajador.descripcion}
                colorTextoProfesion='#424242'      
                avatar={trabajador.foto ? { uri: trabajador.foto } : require('../../../assets/images/perfil.png')}
                colorTexto='#8BC34A'
                bgColor='#F5F5F5'
                iconoDerecha={"chevron-forward"}
                colorIconoDerecha='#00BCD4'
                onPress={() => router.push({
                  pathname: '/',
                  params: { id: trabajador.id }
                })}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text>No tienes Trabajadores en tu lista de favoritos</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scrollContainer: {
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
