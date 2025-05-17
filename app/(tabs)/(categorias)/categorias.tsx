import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, TextInput, StyleSheet, View, Text, Platform, ActivityIndicator } from 'react-native';
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

  const handleBuscar = (text: string) => {
    setBusqueda(text);
    console.log('Texto buscado:', text);
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_URL}category`); 
        const data = await response.json();
        console.log('Categorias recibidas:', data);
        setCategorias(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categorias:', err);
        setError('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };


    fetchCategorias();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8BC34A" />
              <Text style={styles.loadingText}>Cargando categorías...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            categorias.map((categoria) => (
              <BotonCategorias 
                key={`categoria-${categoria.id}`}
                textoBoton={categoria.descripcion	} 
                colorTexto='#8BC34A'
                bgColor='#F5F5F5' 
                iconoDerecha={"chevron-forward"} 
                colorIconoDerecha='#00BCD4'
                colorIconoIzquierda='#8BC34A'
                iconoIzquierda={categoria.icono	 || 'cube'} 
                onPress={() => router.push({
                  pathname: '/(categorias)/[detalleCategoria]',
                  params: { categoria: categoria.descripcion, id: categoria.id }
                })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  icono: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
});
