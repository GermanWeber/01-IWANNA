import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native';
import BotonAvatar from '../../../../components/botonAvatar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchTrabajadoresByCategory } from '../../../../services/categoryService';
import { Usuario } from '../../../../types/usuario';
import { Ionicons } from '@expo/vector-icons';


export default function DetalleCategoriaTrabajadores() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  console.log(id);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [allUsuarios, setAllUsuarios] = useState<Usuario[]>([]);

  const handleBuscar = (text: string) => {
    setBusqueda(text);
    
    if (text.trim() === '') {
      // Si el texto está vacío, mostramos todas las categorías
      setUsuarios(allUsuarios);
    } else {
      // Filtramos las categorías localmente
      const filtered = allUsuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(text.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(text.toLowerCase()) ||
        usuario.descripcion?.toLowerCase().includes(text.toLowerCase())
      );
      setUsuarios(filtered);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTrabajadoresByCategory(id.toString()).then((data) => {
      setUsuarios(data);
      setAllUsuarios(data);
      setLoading(false);
    }).catch((error) => {
      setError(error.message);
      setLoading(false);
    });
    setRefreshing(false);
  }, [id]);

  

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

<View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.icono} />
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="#888"
              value={busqueda}
              onChangeText={handleBuscar}
              style={styles.input}
            />
          </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View style={styles.container}>
          
        
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              
              <BotonAvatar
                key={usuario.id}
                textoBoton={`${usuario.nombre} ${usuario.apellido}`}
                id_auth={Number(usuario.id_auth)}
                textoProfesion={usuario.descripcion}
                colorTextoProfesion='#424242'      
                avatar={usuario.foto}
                colorTexto='#8BC34A'
                id_estado={Number(usuario.id_estado)}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 16,

  },
  icono: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#212121',
  },
  container: {
    gap: 8,
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
