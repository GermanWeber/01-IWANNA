import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, Image, ActivityIndicator, Alert} from 'react-native'
import { API_URL,BUCKET_URL } from '@env';
import { PostType } from '../../../../types/post';
import { recuperarStorage } from '../../../../services/asyncStorage';
import { Video, ResizeMode } from 'expo-av';
import { obtenerPostsByUser, obtenerContadorPosts } from '../../../../services/postService';

export default function Post() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<any>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [yaPublicoHoy, setYaPublicoHoy] = useState<boolean>(false);
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
    
    const verPost = (post:PostType) =>{   
        router.push(`/ver-post/${post.id}`)
    }


    const verificarPublicacionDiaria = async (userId: number) => {
        try {
            const contador = await obtenerContadorPosts(userId);
            setYaPublicoHoy(contador > 0);
            return contador;
        } catch (error) {
            console.error('Error al verificar publicación diaria:', error);
            return 0;
        }
    };

    const handleAgregarPost = async () => {
        if (!usuario) return;
        
        // Si ya publicó hoy y no es usuario premium
        if (yaPublicoHoy && usuario.id_estado !== 2) {
            Alert.alert(
                'Límite de publicaciones',
                'Has alcanzado el límite de 1 publicación por día. Vuelve mañana para publicar de nuevo o actualiza tu cuenta para publicar sin límites.',
                [
                    { 
                        text: 'Entendido',
                        style: 'cancel' 
                    },
                    {
                        text: 'Actualizar cuenta',
                        onPress: () => router.push('../(mas)/(mi-plan)/planes')
                    }
                ]
            );
            return;
        }
        
        // Si es usuario premium o no ha publicado hoy
        router.push('/(posts)/crear-post');
    };

    useFocusEffect(
        useCallback(() => {
            const cargarUsuarioYPosts = async () => {
                const datosUsuario = await recuperarStorage('usuario');
                if (datosUsuario) {
                    setUsuario(datosUsuario);
                    const [posts] = await Promise.all([
                        obtenerPostsByUser(datosUsuario.id),
                        verificarPublicacionDiaria(datosUsuario.id)
                    ]);
                    setPosts(posts);
                }
            };
            cargarUsuarioYPosts();
        }, [])
    );
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View>
                    <TouchableOpacity 
                        style={[
                            styles.editButton, 
                            yaPublicoHoy && usuario?.id_estado !== 2 && styles.disabledButton
                        ]} 
                        onPress={handleAgregarPost}
                        
                    >
                        <Ionicons 
                            name={yaPublicoHoy ? 'time-outline' : 'add'} 
                            size={20} 
                            color="#fff" 
                        />
                        {/* cambiar texto segun estado */}
                        {yaPublicoHoy && usuario?.id_estado == 1 && (
                            <Text style={styles.editButtonText}>Ya publicaste hoy</Text>
                        )}
                        {yaPublicoHoy == false && usuario?.id_estado == 1 && (
                            <Text style={styles.editButtonText}>Agregar Publicación</Text>
                        )}
                        {usuario?.id_estado == 2 && (
                            <Text style={styles.editButtonText}>Agregar Publicación</Text>
                        )}
                    </TouchableOpacity>

                    {yaPublicoHoy && usuario?.id_estado !== 2 && (
                        <View style={styles.infoBox}>
                            <Ionicons name="information-circle" size={20} color="#2196F3" />
                            <Text style={styles.infoText}>
                                El plan gratuito te permite publicar 1 vez por dia, suscríbete a IWANNA y publica todo lo que quieras
                            </Text>
                        </View>
                    )}
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
                            onPress = {() => verPost(post)}
                        >
                            {isVideo ? (
                                <>
                                    {videoCargando[post.id] && (
                                        <View style={[styles.postArchivo, { justifyContent: 'center', alignItems: 'center' }]}>
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
    infoBox: {
        backgroundColor: '#f0f7ff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        color: '#2980b9',
        fontSize: 14,
        lineHeight: 20,
    },
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
        opacity: 1,
    },
    disabledButton: {
        backgroundColor: '#A5D6A7',
        opacity: 0.8,
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

