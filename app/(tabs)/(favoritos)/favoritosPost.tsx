import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import Post from '../../../components/post';
import { fetchPosts } from '../../../services/favService';
import { recuperarStorage } from '../../../services/asyncStorage';


export default function FavoritosPost() {

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const cargarPostsFavoritos = async (userId: number) => {
        try {
            setLoading(true);
            const postsData = await fetchPosts(userId);
            console.log('Posts cargados:', postsData);
            if (postsData && postsData.length > 0) {
                setPosts(postsData);
            } else {
                setPosts([]);
            }
            setError(null);
        } catch (err) {
            console.error('Error al cargar posts favoritos:', err);
            setError('Error al cargar los posts favoritos');
            setPosts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const cargarUsuarioYPosts = async () => {
            try {
                setLoading(true);
                const usuario = await recuperarStorage('usuario');
                console.log('Usuario cargado:', usuario);
                
                if (usuario?.id) {
                    setUsuario(usuario);
                    await cargarPostsFavoritos(Number(usuario.id));
                } else {
                    throw new Error('No se pudo obtener la información del usuario');
                }
            } catch (error) {
                console.error('Error:', error);
                setError(error instanceof Error ? error.message : 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };
        
        cargarUsuarioYPosts();
    }, []);
    
    const onRefresh = async () => {
        if (!usuario?.id) return;
        setRefreshing(true);
        await cargarPostsFavoritos(Number(usuario.id));
    };

    if (loading) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text>Cargando publicaciones...</Text>
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
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <Post datos={item} />}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text>No hay publicaciones disponibles</Text>
                </View>
              }
            />
          </SafeAreaView>
        );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
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
