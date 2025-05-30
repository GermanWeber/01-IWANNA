import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import BotonAvatar from '../../../components/botonAvatar';
import { useRouter } from 'expo-router';
import { recuperarStorage } from '../../../services/asyncStorage';
import { fetchTrabajadores } from '../../../services/favService';

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
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
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
            <Text style={styles.noResults}>No se encontraron trabajadores en esta categoría</Text>
          )}
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
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
