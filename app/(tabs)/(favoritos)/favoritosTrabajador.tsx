import React, { useCallback, useEffect, useState } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  TouchableOpacity, 
  SafeAreaView,
  RefreshControl,
  TextInput
} from 'react-native';
import BotonAvatar from '../../../components/botonAvatar';
import { useRouter, useFocusEffect } from 'expo-router';
import { recuperarStorage } from '../../../services/asyncStorage';
import { fetchFavTrabajadores } from '../../../services/favService';
import { Ionicons } from '@expo/vector-icons';

interface Trabajador {
  id: number;
  nombre: string;
  apellido: string;
  foto: string;
  profesion: string;
  id_auth: number;
  id_estado_suscripcion: number;
}

interface Usuario {
  id: number;
  

}

export default function FavoritosTrabajador() {
  const router = useRouter();
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [allTrabajadores, setAllTrabajadores] = useState<Trabajador[]>([]);

  const cargarDatos = useCallback(async () => {
    try {
      setError(null);
      const usuarioAlmacenado = await recuperarStorage('usuario');
      setUsuario(usuarioAlmacenado);
      
      if (usuarioAlmacenado?.id) {
        const data = await fetchFavTrabajadores(usuarioAlmacenado.id);
        if (data) {
          console.log('Datos del post en favoritos:', data);
          setTrabajadores(data);
          }
      } else {
        throw new Error('No se pudo obtener la información del usuario');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
      setError(errorMessage);
      console.log('Error en cargarDatos:', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const [busqueda, setBusqueda] = useState('');

  const handleBuscar = (text: string) => {
    setBusqueda(text);
    
    if (text.trim() === '') {
      // Si el texto está vacío, mostramos todas las categorías
      setTrabajadores(allTrabajadores);
    } else {
      // Filtramos las categorías localmente
      const filtered = allTrabajadores.filter(trabajador => 
        trabajador.nombre.toLowerCase().includes(text.toLowerCase()) ||
        trabajador.apellido.toLowerCase().includes(text.toLowerCase()) ||
        trabajador.profesion?.toLowerCase().includes(text.toLowerCase())
      );
      setTrabajadores(filtered);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    cargarDatos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
    setAllTrabajadores(trabajadores);
  }, [cargarDatos]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC34A" />
        <Text style={styles.loadingText}>Cargando trabajadores favoritos...</Text>
      </View>
    );
  }


  if (!usuario?.id) {
    return (
      <View style={styles.authContainer}>
        <Ionicons name="sad" size={50} color="#8BC34A" />
        <Text style={styles.authTitle}>No estás registrado</Text>
        <Text style={styles.authSubtitle}>
          Únete a <Text style={styles.highlight}>IWANNA</Text>
        </Text>
        <Text style={styles.authMessage}>y obtén la experiencia completa</Text>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => router.push('(auth)/index2')}
        >
          <Text style={styles.authButtonText}>Regístrate aquí</Text>
        </TouchableOpacity>
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
        
          {trabajadores.length > 0 ? (
            trabajadores.map((trabajador) => (
              <BotonAvatar
                key={trabajador.id}
                textoBoton={`${trabajador.nombre} ${trabajador.apellido}`}
                textoProfesion={trabajador.profesion}
                colorTextoProfesion='#424242'      
                avatar={trabajador.foto}
                colorTexto='#8BC34A'
                bgColor='#F5F5F5'
                iconoDerecha={"heart"}
                colorIconoDerecha='#00BCD4'
                id_auth={trabajador.id_auth}
                id_estado={trabajador.id_estado_suscripcion}
                onPress={() => router.push(`/screens/${trabajador.id}`)}
              />
            ))
          ) : (
            <Text style={styles.noResults}>No se encontraron trabajadores en tu lista de favoritos</Text>
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
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    marginTop: 16,
  },
  icono: {
    marginRight: 8,
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

  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#757575',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#8BC34A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#212121',
  },
  authSubtitle: {
    fontSize: 18,
    marginTop: 8,
    color: '#424242',
  },
  highlight: {
    color: '#8BC34A',
    fontWeight: 'bold',
  },
  authMessage: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: '#8BC34A',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: '40%',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});
