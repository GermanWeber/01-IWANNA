import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import BotonAvatar from '../../../../components/botonAvatar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '@env';

interface Trabajador {
  id: number;
  nombre: string;
  foto: string;
  descripcion: string;
}

export default function DetalleCategoriaTrabajadores() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  console.log(id);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const response = await fetch(`${API_URL}category/trabajadores/${id}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los trabajadores');
        }
        
        const data = await response.json();
        setTrabajadores(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar los trabajadores');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrabajadores();
    }
  }, [id]);

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
                avatar={trabajador.foto ? { uri: trabajador.foto } : require('../../../../assets/images/perfil.png')}
                colorTexto='#8BC34A'
                bgColor='#F5F5F5'
                iconoDerecha={"chevron-forward"}
                colorIconoDerecha='#00BCD4'
                onPress={() => router.push({
                  pathname: '/(mas)/(perfil_usuario)/mi-perfil',
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
