import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { RatingStars } from "../../components/rating-stars";
import { recuperarStorage } from "../../services/asyncStorage";
import { obtenerPerfil } from "../../services/perfilService";
import { PostType } from '../../types/post';
import { btnFavTrabajador, fetchEstadoLikeTrabajador, fetchFavTrabajadores } from '../../services/favService';
import { BUCKET_URL } from '@env';
import ModalDenunciaTrabajador from "../../components/modalDenunciaTrabajador";
import { ResizeMode, Video } from "expo-av";
import { obtenerPostsByUser } from '../../services/postService';

export default function PerfilUsuario() {
    const { idUsuario } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [perfil, setPerfil] = useState<any>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [liked, setLiked] = useState(false);
    const [modalDots, setModalDots] = useState(false);
    const [modalDenunciar, setModalDenunciar] = useState(false);
  const [videoCargando, setVideoCargando] = useState<{ [id: number]: boolean }>({});
    const [usuario, setUsuario] = useState<any>(null);



    const cargarUsuario = async () => {
        try {
            const usuario = await recuperarStorage('usuario');
            setUsuario(usuario);
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            return null;
        }
    };

    const cargarPosts = async (id_trabajador:any) => {
        try {
            const posts = await obtenerPostsByUser(id_trabajador);
            setPosts(posts);
        } catch (error) {
            console.error('Error al cargar posts:', error);
            return null;
        }
    };


    const mostrarLike = async (id_usuario:any, id_trabajador:any) => {
        console.log('entrar mostrarLike: usuario', id_usuario, typeof id_usuario, 'trabajador', id_trabajador, typeof id_trabajador);
        try {
            const estado = await fetchEstadoLikeTrabajador(id_usuario, id_trabajador);
            
            console.log('Estado del like del trabajador:', estado);
            setLiked(estado?.exito || false);
        } catch (error) {
            console.error('Error al cargar el estado del like del trabajador', error);
        }

    };


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
  

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const respuesta = await obtenerPerfil(Number(idUsuario));
                setPerfil(respuesta);
    
                const user = await recuperarStorage('usuario');
                setUsuario(user);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };
    
        cargarDatos();
        cargarUsuario();
        cargarPosts(idUsuario);
    }, [idUsuario]);
    
    //Este useEffect se ejecuta cuando ambos están definidos
    useEffect(() => {
        if (usuario?.id && perfil?.id) {
            mostrarLike(usuario.id, perfil.id);
        } 
    }, [usuario, perfil]);


    //funcion de like
    const handleLike = async (id_usuario: any, id_trabajador: any) => {
        
        if (usuario && [1, 2].includes(usuario.id_estado)) {
            console.log('Datos recibidos en handleLike: usuario:', id_usuario, 'trabajador:', id_trabajador);
            try {                
                // Hacer la llamada a la API
                await btnFavTrabajador(id_usuario, id_trabajador);
                
                // Opcional: Recargar el estado desde el servidor para asegurar consistencia
                await mostrarLike(id_usuario, id_trabajador);

                
            } catch (error) {
                console.error('Error al actualizar el like:', error);
            }
        }
    };

    const handleDotPress = async () => {
        console.log('Datos recibidos en handleDotPress');
        setModalDots(!modalDots);
        
    };

    const handleVerPost = async (id_trabajador:any) => {
        console.log('Datos recibidos en handleVerPost', id_trabajador);
        router.push(`screens/ver-posts/${id_trabajador}`);
    };
 

    const handleCotizar = async () => {
        try {

            if (!usuario) {
                Alert.alert(
                    "No puedes cotizar :(",
                    "Debes estar registrado para realizar una cotización",
                    [
                        {
                            text: "OK",
                            onPress: () => router.push('/(auth)')
                        }
                    ]
                );
                return;
            }

            // Si el usuario existe, procedemos con la cotización
            router.push('/screens/cotizacion-form');
        } catch (error) {
            console.error('Error al verificar usuario:', error);
            Alert.alert("Error", "Ocurrió un error al verificar tu sesión");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {perfil && (
                <View style={styles.container}>

                    {/* Sección de Perfil */}
                    <View style={styles.profileHeader}>

                        <Image
                            source={{ uri: `${BUCKET_URL}foto-perfil/${perfil.foto}` }}
                            style={styles.profileImage}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{perfil.nombre} {perfil.apellido}
                                {/*logo de verificado */}
                                {perfil?.id_auth === 2 && (
                                    <Ionicons name="checkmark-circle" size={20} color="#1d9bf0" />
                                )}
                            </Text>
                            {perfil?.id_tipo === 2 ? (
                                <Text style={styles.profileProfession}>{perfil.profesion}</Text>
                            ) : (<Text style={styles.profileProfession}>Cliente</Text>)}
                            <View style={styles.ratingContainer}>
                                <RatingStars rating={4.5} showValue />
                            </View>
                        </View>
                        <View style={styles.botonesPerfil}>
                            {/* boton modal de denuncia */}
                            {/* solo puedes comentar si eres usuario */}
                            {usuario ? (
                            <TouchableOpacity           
                            onPress={() => {handleDotPress()}}
                            >
                                <Ionicons name="ellipsis-vertical" size={24} color="#424242" />
                            </TouchableOpacity>
                            ) : (
                                <TouchableOpacity           
                            >
                                <Ionicons name="ellipsis-vertical" size={24} color="#424242" />
                            </TouchableOpacity>
                            )}
                            {modalDots && (
                                <View 
                                style={styles.modalDots}>
                                    <TouchableOpacity 
                                    onPress={() => {setModalDots(false); setModalDenunciar(true)}}>
                                        <Text style={styles.denunciarText}>Denunciar</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <TouchableOpacity 
                                style={styles.dato_post} 
                                onPress={() => handleLike(usuario?.id, perfil?.id)}
                            >
                            <Ionicons 
                                name={liked ? 'heart' : 'heart-outline'} 
                                size={24} 
                                color={liked ? '#8BC34A' : '#424242'} 
                            />                       
                        </TouchableOpacity>
                        </View>
                    </View>


                    {/* Boton de Cotizar */}
                    {(perfil?.id_tipo === 2 && usuario?.id_tipo === 3)&& (
                        <TouchableOpacity
                            style={styles.cotizacionButton}
                            onPress={handleCotizar}
                            disabled={isLoading}
                        >
                            <Text style={styles.cotizacionButtonText}>
                                {isLoading ? 'Verificando...' : 'Cotizar'}
                            </Text>
                        </TouchableOpacity>
                    )}



                    {/* Sección de usuario Personales */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="person-circle-outline" size={24} color="#8BC34A" />
                            <Text style={styles.sectionTitle}>Datos personales</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Edad:</Text>
                            <Text style={styles.infoValue}>{perfil.edad}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Ubicación:</Text>
                            <Text style={styles.infoValue}>{perfil.direccion}</Text>
                        </View>
                    </View>

                    {/* Sección de Descripción */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text-outline" size={24} color="#8BC34A" />
                            <Text style={styles.sectionTitle}>Sobre Mí</Text>
                        </View>
                        <Text style={styles.description}>
                            {perfil.descripcion_usuario}
                        </Text>
                    </View>

                    {/* Sección de Contacto */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="call-outline" size={24} color="#8BC34A" />
                            <Text style={styles.sectionTitle}>Contacto</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="mail-outline" size={20} color="#666" />
                            <Text style={styles.infoValue}>{perfil.email}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="call-outline" size={20} color="#666" />
                            <Text style={styles.infoValue}>{perfil.telefono}</Text>
                        </View>
                    </View>


                    {/* Sección de Estadísticas -------------------------------------*/}
                    {perfil?.id_tipo === 2 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="stats-chart-outline" size={24} color="#8BC34A" />
                                <Text style={styles.sectionTitle}>Estadísticas</Text>
                            </View>
                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>0</Text>
                                    <Text style={styles.statLabel}>Servicios</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>0</Text>
                                    <Text style={styles.statLabel}>Satisfacción</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>0</Text>
                                    <Text style={styles.statLabel}>Años Exp.</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* POSTS ---------------------------- */}
                    {perfil?.id_tipo === 2 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="document-text-outline" size={24} color="#8BC34A" />
                                <Text style={styles.sectionTitle}>Publicaciones</Text>
                            </View>
                            
                            <View style={styles.postsContainer}
                            
                            >
                            {posts.slice(0, 6).map(post => {
                                const uri = `${BUCKET_URL}publicaciones/${post.archivo}`;
                                const isVideo = esVideo(post.archivo);

                                return (
                                    <View
                                        key={post.id}
                                        style={styles.post}
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
                                    </View>
                                );
                            })}
                            </View>
                            <TouchableOpacity
                                style={styles.viewAllButton}
                                onPress={() => handleVerPost(perfil?.id)}
                            >
                                <Ionicons name="add" size={20} color="#fff" />
                                <Text style={styles.viewAllText}>Ver todas las publicaciones <Ionicons name="arrow-forward" size={20} color="#8BC34A" /></Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {modalDenunciar && (
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalDenunciar}
                                onRequestClose={() => setModalDenunciar(false)}
                                presentationStyle="overFullScreen"
                                hardwareAccelerated={true}
                            >
                                <View style={styles.modalOverlay}>
                                    <TouchableWithoutFeedback onPress={() => setModalDenunciar(false)}>
                                        <View style={styles.modalBackground}>
                                            <View style={styles.modalContainer}>
                                                <ModalDenunciaTrabajador 
                                                    datos={perfil} 
                                                    usuario={usuario}
                                                    onClose={() => setModalDenunciar(false)}
                                                />
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </Modal>
                        )}
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
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
    },
    botonesPerfil: {
        gap: 40,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    modalOverlay: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',   
    },
    modalBackground: {
        flex: 1,
       backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        marginHorizontal: 15,
        borderRadius: 10,
        width: '92%',
        bottom: 0,
    },
    denunciarText: {
        color: 'red',
        fontSize: 16,
        fontWeight: '600',
    },
    modalDots: {
        position: 'absolute',
        zIndex: 1,
        width: 100,
        top: 30,
        right: -20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scrollContainer: {
        backgroundColor: '#f8f9fa',
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: '#8BC34A',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    profileProfession: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dato_post: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f1f8e9',
    },
    cotizacionButton: {
        backgroundColor: '#8BC34A',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#8BC34A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    cotizacionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginLeft: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 4,
    },
    infoLabel: {
        fontWeight: '600',
        color: '#7f8c8d',
        width: 100,
    },
    infoValue: {
        flex: 1,
        color: '#34495e',
        fontSize: 15,
    },
    description: {
        color: '#34495e',
        lineHeight: 22,
        fontSize: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginHorizontal: 4,
    },
    statValue: {},
    statLabel: {},
    postsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 20,
        gap: 6,
    },
    postImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    serviceList: {
        gap: 15,
    },
    serviceItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    serviceInfo: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    serviceDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    serviceStatus: {
        fontSize: 14,
        color: '#FFA000',
        fontWeight: '500',
    },
    completedStatus: {
        color: '#4CAF50',
    },
    serviceWorker: {
        alignItems: 'center',
        marginLeft: 15,
    },
    workerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 5,
    },
    workerName: {
        fontSize: 12,
        color: '#666',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    viewAllText: {
        color: '#8BC34A',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 5,
        textDecorationLine: 'underline',
        textAlign: 'right',
        textAlignVertical: 'top',
        
        
    },

});
