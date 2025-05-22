import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ComentariosModal from './comentarios';
import { router, useFocusEffect } from 'expo-router';
import { PostType } from '../types/post';
import { BUCKET_URL} from '@env';
import { Video, ResizeMode } from 'expo-av';

type Props = {
  datos: PostType;
};

const Post: React.FC<Props> = ({ datos }) => {
    const [cargando, setCargando] = useState(true);
    const [liked, setLiked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const manejarCargaImagen = () => setCargando(false);
    const toggleModal = () => setModalVisible(!modalVisible);
    const toggleLike = () => setLiked(!liked);

    useFocusEffect(
        useCallback(() => {
        setModalVisible(false);
        }, [])
    );
    const isVideo = datos.archivo?.endsWith('.mp4') ?? false;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={() => router.push(`/(tabs)/(inicio)/${datos.id_usuario}`)}>
                <Image source={{ uri: `${BUCKET_URL}foto-perfil/${datos.foto}` }} style={styles.foto_usuario} />
                <View>
                    <Text style={styles.nombre}>{datos.nombre}</Text>
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
                    <TouchableOpacity style={styles.dato_post} onPress={toggleLike}>
                        <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#8BC34A' : '#424242'} />
                        {/* <Text style={styles.icono}>{likes}</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dato_post} onPress={toggleModal}>
                        <Ionicons name="chatbubble-outline" size={24} color="#424242" />
                        {/* <Text style={styles.icono}>{cant_comentarios}</Text> */}
                    </TouchableOpacity>
                </View>

                
                <Text style={styles.nombre}>{datos.nombre} </Text>
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
