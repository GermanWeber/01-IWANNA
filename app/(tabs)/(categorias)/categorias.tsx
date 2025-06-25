import React, { useCallback, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, TextInput, StyleSheet, View, Text, Platform, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BotonCategorias from '../../../components/BotonCategorias';
import { useRouter } from 'expo-router';
import { API_URL } from '@env';



export default function Categorias() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para guardar todas las categorías (sin filtrar)
  const [allCategorias, setAllCategorias] = useState<any[]>([]);

  const handleBuscar = (text: string) => {
    setBusqueda(text);

    if (text.trim() === '') {
      // Si el texto está vacío, mostramos todas las categorías
      setCategorias(allCategorias);
    } else {
      // Filtramos las categorías localmente
      const filtered = allCategorias.filter(categoria =>
        categoria.descripcion.toLowerCase().includes(text.toLowerCase())
      );
      setCategorias(filtered);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}category`);
      const data = await response.json();
      setAllCategorias(data);
      setCategorias(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categorias:', err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.container}>
        <Text style={styles.titulo}>Categorías</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.icono} />
          <TextInput
            placeholder="Buscar categoría..."
            placeholderTextColor="#888"
            value={busqueda}
            onChangeText={handleBuscar}
            style={styles.input}
          />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Cargando categorías...</Text>
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error al cargar las categorías</Text>
              <TouchableOpacity
                style={styles.errorButton}
                onPress={async () => await fetchCategorias()}
              >
                <Text style={styles.errorButtonText}>Intentar de nuevo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            categorias.map((categoria) => (
              <BotonCategorias
                key={`categoria-${categoria.id}`}
                textoBoton={categoria.descripcion}
                colorTexto='#212529'
                bgColor='#FFFFFF'
                iconoDerecha={"chevron-forward"}
                colorIconoDerecha='#6C757D'
                colorIconoIzquierda='#007AFF'
                iconoIzquierda={categoria.icono || 'cube'}
                onPress={() => router.push({
                  pathname: '/(categorias)/[detalleCategoria]',
                  params: { categoria: categoria.descripcion, id: categoria.id }
                })}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  errorButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#6C757D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#DC3545',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  icono: {
    marginRight: 8,
    color: '#6C757D',
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#212529',
  },
});
