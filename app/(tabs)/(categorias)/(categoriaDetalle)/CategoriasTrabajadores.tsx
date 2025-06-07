import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native';
import BotonAvatar from '../../../../components/botonAvatar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchTrabajadoresByCategory } from '../../../../services/categoryService';
import { Usuario } from '../../../../types/usuario';


export default function DetalleCategoriaTrabajadores() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  console.log(id);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrabajadoresByCategory(id.toString()).then((data) => {
      setUsuarios(data);
      setLoading(false);
    }).catch((error) => {
      setError(error.message);
      setLoading(false);
    });
    setRefreshing(false);
  };

  

  useEffect(() => {


    if (id) {
      fetchTrabajadoresByCategory(id.toString()).then((data) => {
        setUsuarios(data);
        setLoading(false);
      }).catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando trabajadores...</Text>
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <BotonAvatar
                key={usuario.id}
                textoBoton={`${usuario.nombre} ${usuario.apellido}`}
                id_auth={usuario.id_auth}
                textoProfesion={usuario.descripcion}
                colorTextoProfesion='#424242'      
                avatar={usuario.foto}
                colorTexto='#8BC34A'
                bgColor='#F5F5F5'
                iconoDerecha={"chevron-forward"}
                colorIconoDerecha='#00BCD4'
                onPress={() => router.push(`/screens/${usuario.id}`)}
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
