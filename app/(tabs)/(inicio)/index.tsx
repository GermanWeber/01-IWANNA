import React, { useCallback, useState, useRef, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ViewToken } from 'react-native';
import { FlatList, View, Text, Image, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import Post from '../../../components/post';
import AdBanner from '../../../components/AdBanner';
import { guardarStorage, recuperarStorage } from '../../../services/asyncStorage';
import { API_URL } from '@env';
import { PostType } from '../../../types/post';
import { useFocusEffect } from 'expo-router'; 

type ListItem = PostType | { type: 'ad', id: string };
const Home = () => {

    const [posts, setPosts] = useState<PostType[]>([]);
    const [usuario, setUsuario] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [visibleItem, setVisibleItem] = useState<number | null>(null);

    // Función para mezclar publicidad con los posts
    const dataWithAds = useMemo(() => {
        if (!posts.length) return [];
        
        const result: ListItem[] = [];
        posts.forEach((post, index) => {
            // Agregar el post
            result.push(post);
            
            // Agregar publicidad cada 5 posts (empezando después del 4to post)
            if ((index + 1) % 5 === 0) {
                result.push({ type: 'ad', id: `ad-${index}` });
            }
        });
        
        return result;
    }, [posts]);
    
    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const visibleId = viewableItems[0]?.item?.id;
            setVisibleItem(visibleId);
        } else {
            setVisibleItem(null);
        }
    }).current; 
    
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
        minimumViewTime: 300,
        waitForInteraction: true,
    }).current; 
    
    const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig, onViewableItemsChanged }
    ]).current;

    const obtenerPosts = async () => {
        try {
            const url = `${API_URL}post/`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener posts');
            }

            setPosts(data);
        } catch (error) {
            console.error('Error al obtener posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const cargarUsuarioYPosts = async () => {
                const datos = await recuperarStorage('usuario');
                
                if (datos) {
                    setUsuario(datos);
                }
                await obtenerPosts();
            };
            cargarUsuarioYPosts();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        obtenerPosts();
        setRefreshing(false);
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Cargando publicaciones...</Text>
            </View>
        );
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <FlatList
                data={dataWithAds}
                keyExtractor={(item, index) => 
                    'type' in item && item.type === 'ad' 
                        ? `ad-${index}` 
                        : `post-${(item as PostType).id}`
                }
                renderItem={({ item, index }) => {
                    if ('type' in item && item.type === 'ad') {
                        return <AdBanner key={`ad-${index}`} />;
                    }
                    return (
                        <Post 
                            datos={item as PostType} 
                            isVisible={visibleItem === (item as PostType).id}
                        />
                    );
                }}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                    waitForInteraction: true,
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
                    <Text>No hay publicaciones disponibles</Text>
                    </View>
                }
            />
        </SafeAreaView>
        </KeyboardAvoidingView>
    );
};


export default Home;

const styles = StyleSheet.create({

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
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
});

