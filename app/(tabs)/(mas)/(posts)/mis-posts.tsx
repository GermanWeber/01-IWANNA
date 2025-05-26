import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, Image, ActivityIndicator} from 'react-native'
import { API_URL,BUCKET_URL } from '@env';
import { PostType } from '../../../../types/post';
import { recuperarStorage } from '../../../../services/asyncStorage';
import { Video, ResizeMode } from 'expo-av';

export default function Post() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<any>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [videoCargando, setVideoCargando] = useState<{ [id: number]: boolean }>({});
    const esVideo = (archivo: string | null | undefined): boolean => {
        if (!archivo) return false;
        try {
            const extension = archivo.split('.').pop()?.toLowerCase() || '';
            return ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension);
        } catch (error) {
            console.error('Error checking if file is video:', error);
            return false;
        }
    };
    
    const obtenerPosts = async (usuarioId: number) => {
        try {
            const url = `${API_URL}post/usuario/${usuarioId}`;
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) {
            throw new Error(data.message || 'Error al obtener posts');
            }
            setPosts(data);
        } catch (error) {
            console.error('Error al obtener posts:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const cargarUsuarioYPosts = async () => {
            const datosUsuario = await recuperarStorage('usuario');
            if (datosUsuario) {
                setUsuario(datosUsuario);

                setTimeout(() => {
                    obtenerPosts(datosUsuario.id);
                }, 0);
            }
            };
            cargarUsuarioYPosts();
        }, [])
    );
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View>
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(posts)/crear-post')}>
                        <Ionicons name="add" size={20} color="#fff" />
                        <Text style={styles.editButtonText}>Agregar Publicacionsffefsd</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.container}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="document-text-outline" size={24} color="#8BC34A" />
                    <Text style={styles.sectionTitle}>Publicaciones</Text>
                </View>
                <View style={styles.postsContainer}>
                {posts.map(post => {
                    const uri = `${BUCKET_URL}publicaciones/${post.archivo}`;
                    const isVideo = esVideo(post.archivo);

                    return (
                        <TouchableOpacity
                            key={post.id}
                            style={styles.post}
                        >
                            {isVideo ? (
                                <>
                                    {videoCargando[post.id] && (
                                        <View style={[styles.postArchivo]}>
                                            <ActivityIndicator size="large" color="#8BC34A" />
                                        </View>
                                    )}
                                    <Video
                                        source={{ uri }}
                                        style={styles.postArchivo}
                                        resizeMode={ResizeMode.COVER}
                                        isMuted
                                        shouldPlay={false}
                                        useNativeControls={false}
                                        onLoadStart={() => setVideoCargando(prev => ({ ...prev, [post.id]: true }))}
                                        onLoad={() => setVideoCargando(prev => ({ ...prev, [post.id]: false }))}
                                    />
                                </>
                            ) : (
                                <Image
                                    source={{ uri }}
                                    style={styles.postArchivo}
                                    resizeMode="cover"
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        minHeight: "100%",
        backgroundColor: "#fff"
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 20
    },
    editButton: {
        backgroundColor: '#8BC34A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    postsContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 20,
    },
    post: {
        width: '32%',
        height: 150,
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5
    },
    postArchivo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    }
});

