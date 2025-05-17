import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ComentariosModal from './comentarios';
import { router, useFocusEffect } from 'expo-router';

type Comentario = {
    id_post: number;
    id_comentario: number;
    id_usuario: number;
    tipo_usuario:number;
    usuario: string;
    img_perfil: string;
    comentario: string;
    likes: number;
    fecha: string;
    hora: string;
    respuestas: Comentario[];
};

type Props = {
    datos: {
        id: number,
        id_usuario: number,
        nombre: string,
        tipo_usuario:number,
        profesion: string,
        img_perfil: string,
        img_post: string,
        descripcion: string,
        likes: number,
        cant_comentarios: number,
        comentarios: Comentario[]
    },

};

const Post: React.FC<Props> = ({datos}) => {
    
    //CARGA DE IMAGEN
    const [cargando, setCargando] = useState(true);
    const [liked, setLiked] = useState(false);
    const manejarCargaImagen = () => {
        setCargando(false); 
    };

    //MANEJO DE MODAL
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleLike = () => {
        setLiked(!liked);
    };
    
    useFocusEffect(
        useCallback(() => {
          setModalVisible(false); // Al volver a Home, asegúrate de que el modal esté cerrado
        }, [])
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={() => router.push(`/(tabs)/(inicio)/${datos.id_usuario}`)}>
                    <Image source={{ uri: datos.img_perfil }} style={styles.foto_usuario} />
                    <View>
                        <Text style={styles.nombre}>{datos.nombre}</Text>
                        <Text>{datos.profesion}</Text>
                    </View>
            </TouchableOpacity>
            <View style={styles.content}>
                <Image
                    source={{ uri: datos.img_post }}
                    style={[styles.imagen_post, cargando && { opacity: 0, height:0}]} 
                    resizeMode="cover"
                    onLoad={manejarCargaImagen} 
                />
                <View style={styles.contenedor_datos_post}>
                    <TouchableOpacity style={styles.dato_post} onPress={toggleLike}> 
                        <Ionicons 
                            name={liked ? "heart" : "heart-outline"} 
                            size={24} 
                            color={liked ? "#8BC34A" : "#424242"} 
                        />
                        <Text style={styles.icono}>{datos.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dato_post} onPress={toggleModal}>
                        <Ionicons name="chatbubble-outline" size={24} color="#424242" />
                        <Text style={styles.icono}>{datos.cant_comentarios}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.descripcion}>
                    <Text style={styles.nombre}>{datos.nombre} </Text>
                    {datos.descripcion}
                </Text>
            </View>
            <ComentariosModal
                modalVisible={modalVisible}
                toggleModal={toggleModal}
                datos={datos}
            />
        </View>
    );
}

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

