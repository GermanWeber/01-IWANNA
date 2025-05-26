import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { obtenerPostsById } from '../../../../services/postService';
import Post from '../../../../components/post';
import { useState } from 'react';
import { PostType } from '../../../../types/post';
import { SafeAreaView, StatusBar, FlatList, ActivityIndicator, RefreshControl } from 'react-native';

export default function DetalleCategoriaPosts() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setError(null);
      const post = await obtenerPostsById(Number(id));
      if (post) {
        setPosts(Array.isArray(post) ? post : [post]);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error al cargar las publicaciones. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

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
  contenedor_post: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  info_usuario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  foto_usuario: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  imagen_post: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
  },
  icono: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descripcion: {
    marginBottom: 4,
  },
  contenedor_datos_post: {
    flexDirection: 'row',
    gap: 10
  },
  dato_post: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    paddingBottom: 5,
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