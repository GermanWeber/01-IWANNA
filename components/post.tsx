import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ComentariosModal from './comentarios';
import { router, useFocusEffect, useRouter } from 'expo-router';
import { PostType } from '../types/post';
import { BUCKET_URL } from '@env';
import { Video, ResizeMode } from 'expo-av';
import { guardarStorage } from '../services/asyncStorage';
import { btnFavPost, fetchLikesPosts, fetchEstadoLikePost } from '../services/favService';
import { recuperarStorage } from '../services/asyncStorage';
import {ModalDenunciaPost} from './modalDenunciaPost';
import { List } from 'react-native-paper';

type Props = {
    datos: PostType;
};

const PostComponent: React.FC<Props> = ({ datos }) => {
  const [cargando, setCargando] = useState(true);
  const [liked, setLiked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [likes, setLikes] = useState(0);
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();
  const [modalDots, setModalDots] = useState(false);
  const [modalDenunciar, setModalDenunciar] = useState(false);

  const manejarCargaImagen = useCallback(() => setCargando(false), []);
  const toggleModal = useCallback(() => setModalVisible(prev => !prev), []);


      const mostrarLike = async (id_usuario:any, id_trabajador:any) => {
          console.log('entrar mostrarLike: usuario', id_usuario, typeof id_usuario, 'trabajador', id_trabajador, typeof id_trabajador);
          try {
              const estado = await fetchEstadoLikePost(id_usuario, id_trabajador);
              
              console.log('Estado del like del trabajador:', estado);
              setLiked(estado?.exito || false);
          } catch (error) {
              console.error('Error al cargar el estado del like del trabajador', error);
          }
  
      };

    const cargarDatos = async () => {
        try {
            const usuario = await recuperarStorage('usuario');
            if (!usuario?.id) {
                //console.error('No se pudo obtener la información del usuario');
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
            await mostrarLike(usuario.id, datos.id);
        } catch (error) {
            //console.error('Error al cargar datos:', error);
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

    const handleDotPress = async () => {
        console.log('Datos recibidos en handleDotPress');
        setModalDots(!modalDots);
        
    };

    const handleDenunciarPost = async () => {
        console.log('Datos recibidos en handleDenunciarPost');
    };

    const handleProfilePress = useCallback(async () => {
        console.log('Datos recibidos en handleProfilePress:', datos);
        try {
            await guardarStorage('idUsuarioPerfil', datos?.id_usuario.toString());
            console.log('Navegando a perfil de usuario:', datos?.id_usuario);
            router.push(`/screens/${datos?.id_usuario}`);
        } catch (error) {
            console.error('Error al navegar al perfil:', error);
        }
    }, [datos?.id_usuario, router]); // Añade todas las dependencias necesarias
    

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
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerPerfil}
                    onPress={() => {handleProfilePress(); console.log('Datos recibidos en handleProfilePress:', datos)}}

                >
                    <Image source={{ uri: `${BUCKET_URL}foto-perfil/${datos.foto}` }} style={styles.foto_usuario} />
                    <View>
                        <Text style={styles.nombre}>{datos?.nombre} {datos?.apellido}
                            {/*logo de verificado */}
                            {datos?.id_auth === 2 && (
                                <Ionicons name="checkmark-circle" size={20} color="#1d9bf0" />
                            )}
                        </Text>
                        {/* <Text>{profesion}</Text> */}
                    </View>
                </TouchableOpacity>

                <View style={styles.headerPerfil}>
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
                    


                </View>
            </View>

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
                        resizeMode="cover" //
                        onLoad={manejarCargaImagen}
                    />
                )}

                <View style={styles.contenedor_datos_post}>

                    <TouchableOpacity style={styles.dato_post} 
                        onPress={useCallback(async () => {
                            if (usuario?.id && datos?.id) {

                                await toggleLike(datos.id, usuario.id);
                            }
                        }, [usuario?.id, datos?.id, toggleLike])}>
                        <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#8BC34A' : '#424242'} />
                        <Text style={styles.icono}>{likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dato_post} onPress={toggleModal}>
                        <Ionicons name="chatbubble-outline" size={24} color="#424242" />
                        {<Text style={styles.icono}>{datos.total_comentarios}</Text> }
                    </TouchableOpacity>
                </View>

                <Text style={styles.descripcion}> {datos.detalle} </Text>
            </View>

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
                                    <ModalDenunciaPost datos={datos} usuario={usuario} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
            )}

            {<ComentariosModal
                modalVisible={modalVisible}
                toggleModal={toggleModal}
                postId={datos.id}
            />}
        </View>
    );


};

PostComponent.displayName = 'Post';

export const Post = React.memo(PostComponent);

export default Post;

const styles = StyleSheet.create({
    modalDots: {
        position: 'absolute',
        zIndex: 1,
        top: 40,
        right: 0,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#424242',
        
    },
    headerPerfil: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    imagen_post: {
        width: '100%',
        height: 600,
        marginVertical: 10,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 15,
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
    keyboardAvoiding: {
        flex: 1,
       
    },
    buttonContainer: {
        padding: 15,
    },
    denunciarButton: {
        borderRadius: 10,
        borderColor: 'red',
        borderWidth: 1,
        backgroundColor: '#f0f0f0',
        padding: 15,
        alignItems: 'center',
    },
    denunciarText: {
        color: 'red',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        borderColor: 'blue',
        borderWidth: 1,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
});
