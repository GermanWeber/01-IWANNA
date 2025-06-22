import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import Post from '../../../components/post';
import { fetchPosts } from '../../../services/favService';
import { recuperarStorage } from '../../../services/asyncStorage';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import PostSecundario from '../../../components/post-secundario';


export default function FavoritosPost() {

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [datos, setDatos] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const cargarPostsFavoritos = async (userId: number) => {
      try {
          setRefreshing(true);
          const postsFavoritos = await fetchPosts(userId);
          setPosts(postsFavoritos);
          setError(null);
      } catch (err) {
          console.error('Error al cargar posts favoritos:', err);
          setError('No se pudieron cargar los posts favoritos');
          setPosts([]);
      } finally {
          setRefreshing(false);
      }
  };

    useFocusEffect(
      useCallback(() => {
          let isActive = true;
          
          const cargarUsuarioYPosts = async () => {
              try {
                  setLoading(true);
                  const datosUsuario = await recuperarStorage('usuario');
                  
                  if (!isActive) return;
                  
                  if (datosUsuario) {
                      setDatos(datosUsuario);
                      await cargarPostsFavoritos(Number(datosUsuario.id));
                  } else {
                      setError('No se pudo cargar la información del usuario');
                  }
              } catch (error) {
                  if (isActive) {
                      console.log('Error al cargar datos:', error);
                      setError('Error al cargar los datos');
                  }
              } finally {
                  if (isActive) {
                      setLoading(false);
                  }
              }
          };
  
          cargarUsuarioYPosts();
          
          return () => {
              isActive = false;
          };
      }, [])
  );
    
    const onRefresh = async () => {
        if (!datos?.id) return;
        setRefreshing(true);
        await cargarPostsFavoritos(Number(datos.id));
    };

  if (!datos?.id) {
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
          onPress={() => router.push('(auth)')}
        >
          <Text style={styles.authButtonText}>Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    );
  }

if (loading) {
  return (
      <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text>Cargando publicaciones...</Text>
      </View>
  );
}


        return (
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <FlatList
              data={posts}
              keyExtractor={(item) => `post-${item.id}`}
              renderItem={({ item }) => {
                console.log('Datos del post en favoritos:', item);
                return <PostSecundario datos={item} />;
            }}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={50}
              windowSize={7}
              removeClippedSubviews={true}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text>No tienes Post en tu lista de favoritos</Text>
                </View>
              }
              getItemLayout={(data, index) => ({
                length: 500, // Ajusta esta altura según el tamaño promedio de tus posts
                offset: 500 * index,
                index,
              })}
            />
          </SafeAreaView>
        );
}

const styles = StyleSheet.create({

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
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
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    
  },
});
