import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import Post from '../../../components/post';
import { fetchPosts } from '../../../services/favService';
import { recuperarStorage } from '../../../services/asyncStorage';


export default function FavoritosPost() {

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<any>(null);

    useEffect(() => {

        const cargarUsuario = async () => {
            try {
              setLoading(true);
              const usuario = await recuperarStorage('usuario');
              setUsuario(usuario) ;
            } catch (error) {
              alert(error instanceof Error ? error.message : 'Error al cargar el usuario');
            } finally {
              setLoading(false);
            }
          };

        const cargarPosts = async () => {
            try {
                setLoading(true);
                const postsData = await fetchPosts(usuario.id);
                if (postsData) {
                    setPosts(postsData);
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error al cargar los posts');
            } finally {
                setLoading(false);
            }
        };
        
        cargarUsuario();
        cargarPosts();
    }, []);


  return (
    <View style={styles.container}>

        <SafeAreaView style={{ flex: 1 }}>
            {/* CABEZERA */}          
            {/* DATA */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <Post datos={item} />
            )}/>
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
});
