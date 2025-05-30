import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ComentariosModal from './comentarios';
import { router, useFocusEffect } from 'expo-router';
import { PostType } from '../types/post';
import { BUCKET_URL } from '@env';
import { Video, ResizeMode } from 'expo-av';
import { guardarStorage } from '../services/asyncStorage';
import { btnFavPost, fetchLikesPosts, fetchEstadoLikePost } from '../services/favService';
import { recuperarStorage } from '../services/asyncStorage';
type Props = {
    datos: PostType;
};

const Post: React.FC<Props> = ({ datos }) => {
    const [cargando, setCargando] = useState(true);
    const [liked, setLiked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [likes, setLikes] = useState(0);
    const [usuario, setUsuario] = useState<any>(null);
    // console.log('Datos recibidos en Post:', datos);

    const manejarCargaImagen = () => setCargando(false);
    const toggleModal = () => setModalVisible(!modalVisible);


    const cargarDatos = async () => {
        try {
            // 1. Cargar usuario primero
            const usuario = await recuperarStorage('usuario');
            if (!usuario?.id) {
                throw new Error('No se pudo obtener la información del usuario');
            }
            setUsuario(usuario);

            // 2. Verificar que tenemos datos del post
            if (!datos?.id) {
                throw new Error('Datos del post no están disponibles');
            }

            // 3. Cargar likes del post
            const likesData = await fetchLikesPosts(Number(datos.id));
            if (likesData) {
                setLikes(likesData.likes || 0);
            }
            
            // 4. Verificar si el usuario dio like al post
            const estado = await fetchEstadoLikePost(Number(usuario.id), Number(datos.id));
            setLiked(estado?.exito || false);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setCargando(false);
        }
    };

    const toggleLike = async (id_post:number, id_usuario:number) => {
        console.log('Datos recibidos en toggleLike:', id_post, id_usuario);
        if (usuario && [1,2].includes(usuario.id_estado)) {
            try {
                console.log('Entro a like: post', id_post, 'usuario:', id_usuario);
                await btnFavPost(id_post, id_usuario);
                // Recargar los datos después de hacer like
                await cargarDatos();
            } catch (error) {
                console.error('Error al actualizar el like:', error);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            setModalVisible(false);
            setCargando(true);
            cargarDatos();
        }, [datos?.id]) // Solo volver a ejecutar si el ID del post cambia
    );


    const isVideo = datos.archivo?.endsWith('.mp4') ?? false;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={async () => {
                    await guardarStorage('idUsuarioPerfil', datos.id_usuario.toString());
                    // console.log('ID del usuario desde post:', datos.id_usuario);
                    router.push(`/(tabs)/(inicio)/${datos.id_usuario}`);
                }}
            >
                <Image source={{ uri: `${BUCKET_URL}foto-perfil/${datos.foto}` }} style={styles.foto_usuario} />
                <View>
                    <Text style={styles.nombre}>{datos.nombre} {datos.apellido}</Text>
                    {/* <Text>{profesion}</Text> */}
                </View>
            </TouchableOpacity>

            <View style={styles.content}>
                {isVideo ? (
                    <Video
                        source={{ uri: `${BUCKET_URL}publicaciones/${datos.archivo}` }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={false}
                        useNativeControls
                        style={styles.imagen_post}
                    />
                ) : (
                    <Image
                        source={{ uri: `${BUCKET_URL}publicaciones/${datos.archivo}` }}
                        style={[styles.imagen_post, cargando && { opacity: 0, height: 0 }]}
                        resizeMode="cover"
                        onLoad={manejarCargaImagen}
                    />
                )}

                <View style={styles.contenedor_datos_post}>

                    <TouchableOpacity style={styles.dato_post} 
                        onPress={() => {
                            toggleLike(datos.id, usuario.id);
                        }}>
                        <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#8BC34A' : '#424242'} />
                        <Text style={styles.icono}>{likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dato_post} onPress={toggleModal}>
                        <Ionicons name="chatbubble-outline" size={24} color="#424242" />
                        {/* <Text style={styles.icono}>{cant_comentarios}</Text> */}
                    </TouchableOpacity>
                </View>


                <Text style={styles.nombre}>{datos.nombre} {datos.apellido}</Text>
                <Text style={styles.descripcion}> {datos.detalle} </Text>
            </View>

            {/* <ComentariosModal modalVisible={modalVisible} toggleModal={toggleModal} datos={{ id, detalle, archivo, fecha_creacion, id_usuario }} /> */}
        </View>
    );
};

export default Post;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: 15,
        overflow: 'hidden',
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
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    content: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    descripcion: {
        marginBottom: 4,
    },
    contenedor_datos_post: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    dato_post: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    icono: {
        marginLeft: 5,
        color: '#666',
        fontSize: 14,
    },
});
