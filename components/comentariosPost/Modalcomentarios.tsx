import React, { useEffect, useState } from 'react';
import { Modal, FlatList, View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Comentario, ComentariosModalProps } from '../../types/comentarios';
import { crearComentarioPost, crearRespuestasComentario, getCantidadRespuestasComentarios, getComentariosPost } from '../../services/comentariosService';
import { recuperarStorage } from '../../services/asyncStorage';
import { BUCKET_URL } from '@env';
import RespuestasComentario from './respuestaComentario';
import ComentarioItem from './comentarioItem';

const ComentariosModal: React.FC<ComentariosModalProps> = ({ modalVisible, toggleModal, postId, actualizarCantidadComentarios}) => {
    const [comentario, setComentario] = useState('');
    const [comentarioSeleccionado, setComentarioSeleccionado] = useState<{ id: number, usuario: string } | null>(null);
    const [comentariosPost, setComentariosPost] = useState<Comentario[]>([]);
    const [loading, setLoading] = useState(false);
    const [recargarRespuestasPorComentario, setRecargarRespuestasPorComentario] = useState<{ [comentarioId: number]: boolean }>({});
    const [usuario, setUsuario] = useState<any>(null);


    const enviarComentario = async () => {
        if (!comentario.trim()) return;

        try {
            const usuario = await recuperarStorage("usuario");
            if (!usuario || !usuario.id) {
                console.error("No se encontró el usuario en el storage");
                return;
            }

            const usuario_id = usuario.id;
            
            //pregunta si el comentario es una respuesta a otro comentario
            if(comentarioSeleccionado){
                await crearRespuestasComentario(comentarioSeleccionado["id"], usuario_id, comentario);
                setComentario('');
                const nuevosComentarios = await getComentariosPost(postId);
                setComentariosPost(nuevosComentarios);
                actualizarCantidadComentarios();
                setRecargarRespuestasPorComentario(prev => ({
                    ...prev,
                    [comentarioSeleccionado.id]: !prev[comentarioSeleccionado.id], // Toggle
                }));
            } else {
                await crearComentarioPost(postId, usuario_id, comentario);
                setComentario('');
                
                const nuevosComentarios = await getComentariosPost(postId);
                setComentariosPost(nuevosComentarios);
                actualizarCantidadComentarios();
            }
            

        } catch (error) {
            console.error('Error al enviar comentario:', error);
        }
    };

    const handleCerrarModoRespuesta = () => {
        setComentarioSeleccionado(null);
    }

    const renderComentario = ({ item }: { item: Comentario }) => (
        <ComentarioItem
            comentario={item}
            onResponder={(comentario) => {
                setComentarioSeleccionado({ id: comentario.id, usuario: comentario.nombre_usuario });
            }}
            recargarRespuestas={recargarRespuestasPorComentario[item.id] ?? false}
            recargarRespuestasPorComentario={recargarRespuestasPorComentario}
            setRecargarRespuestasPorComentario={setRecargarRespuestasPorComentario}
        />
    );

    useEffect(() => {
        if (modalVisible) {
            const fetchDatos = async () => {
                try {
                    setLoading(true);
                    const data = await getComentariosPost(postId);
                    setComentariosPost(data);
                } catch (error) {
                    console.error('Error al obtener comentarios:', error);
                } finally {
                    setLoading(false);
                }
                
            };

            const cargarUsuario = async () => {
                const datos = await recuperarStorage('usuario');
                                
                if (datos) {
                    setUsuario(datos);
                }
            }
            
            cargarUsuario();
            fetchDatos();
        }
    }, [modalVisible]);
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Comentarios</Text>
                        <TouchableOpacity onPress={toggleModal}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.comentariosContainer}>
                        {loading ? (
                            <View style={stylesComentarios.loadingContainer}>
                                <ActivityIndicator size="large" color="#8BC34A" />
                                <Text style={stylesComentarios.loadingText}>Cargando comentarios...</Text>
                            </View>
                        ) : comentariosPost.length === 0 ? (
                            <View style={stylesComentarios.noComentariosContainer}>
                                <Text style={stylesComentarios.noComentariosText}>
                                    No hay comentarios aún.
                                </Text>
                                <Text style={stylesComentarios.llamadoAccion}>
                                    ¡Sé el primero en comentar y empieza la conversación!
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={comentariosPost}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderComentario}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.comentariosList}
                            />
                        )}
                    </View>
                    {usuario ? (
                        <View style={styles.inputContainer}>
                        {comentarioSeleccionado && (
                            <View style={styles.modoRespuestaContainer}>
                                <Text style={[{color:"#757575"}]}>responder a {comentarioSeleccionado?.usuario}</Text>
                                <TouchableOpacity onPress={handleCerrarModoRespuesta}>
                                    <Ionicons name="close" size={24} color="#757575" />
                                </TouchableOpacity>
                            </View>
                        )}
                        <View  style={[{flexDirection: "row"}]}>
                            <TextInput
                                style={styles.input}
                                placeholder={comentarioSeleccionado ? "Responde al comentario..." : "Escribe un comentario..."}
                                value={comentario}
                                onChangeText={setComentario}
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={enviarComentario} disabled={loading}>
                                <Ionicons name="send" size={20} color="#8BC34A" />
                            </TouchableOpacity>
                        </View>
                    </View>): 
                    (
                        <View style={styles.inputContainer}>
                            <Text style={{ color: '#666', fontSize: 14, textAlign: 'center' }}>
                                Debe registrarse para comentar
                            </Text>
                        </View>
                    )}
                    
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '80%',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    comentariosContainer: {
        flex: 1,
    },
    comentariosList: {
        paddingBottom: 100,
    },
    comentario: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    foto_perfil: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    foto_perfil_pequena: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    contenido_comentario: {
        flex: 1,
    },
    nombre_usuario: {
        fontWeight: 'bold',
    },
    texto_comentario: {
        marginVertical: 5,
        fontSize: 14,
        color: '#333',
    },
    acciones_comentario: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    accion: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    contador: {
        marginLeft: 5,
        fontSize: 12,
        color: '#666',
    },
    fecha: {
        fontSize: 12,
        color: '#777',
    },
    botones_respuesta: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
    },
    boton_respuesta: {
        color: '#8BC34A',
        fontSize: 12,
    },
    respuestasContainer: {
        marginTop: 10,
        marginLeft: 10,
    },
    respuesta: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        minHeight: 40,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modoRespuestaContainer:{
        width: "100%",
        flexDirection: 'row', 
        justifyContent: "space-between", 
        alignItems: 'stretch', 
        marginBottom: 10,
    }
});

const stylesComentarios = StyleSheet.create({
    noComentariosContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        paddingHorizontal: 30,
    },
    noComentariosText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 10,
    },
    llamadoAccion: {
        fontSize: 18,
        color: '#555555',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#8BC34A',
    },
});

export default ComentariosModal;