import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import Post from '../../../components/post';
import { fetchPosts } from '../../../services/favService';
import { recuperarStorage } from '../../../services/asyncStorage';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


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
                    //throw new Error('No se pudo obtener la información del usuario');
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
              renderItem={({ item }) => <Post datos={item} />}
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
