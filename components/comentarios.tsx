import React, { useEffect, useState } from 'react';
import { Modal, FlatList, View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Comentario, ComentariosModalProps } from '../types/comentarios';
import { crearComentarioPost, crearRespuestasComentario, getComentariosPost } from '../services/comentariosService';
import { recuperarStorage } from '../services/asyncStorage';
import { BUCKET_URL } from '@env';
import RespuestasComentario from './respuestaComentario';
const foto_default = require('../assets/images/perfil.png');

const ComentariosModal: React.FC<ComentariosModalProps> = ({ modalVisible, toggleModal, postId }) => {
    const [comentario, setComentario] = useState('');
    const [comentarioSeleccionado, setComentarioSeleccionado] = useState<{ id: number, usuario: string } | null>(null);
    const [respuestasVisibles, setRespuestasVisibles] = useState<Set<number>>(new Set());
    const [likedComments, setLikedComments] = useState<number[]>([]);
    const [comentariosPost, setComentariosPost] = useState<Comentario[]>([]);
    const [loading, setLoading] = useState(false);
    
    const formatearFecha = (fechaISO: string) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleString('es-CL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const enviarComentario = async () => {
        if (!comentario.trim()) return;

        try {
            const usuario = await recuperarStorage("usuario");
            if (!usuario || !usuario.id) {
                console.error("No se encontró el usuario en el storage");
                return;
            }

            const usuario_id = usuario.id;
            if(comentarioSeleccionado){
                await crearRespuestasComentario(comentarioSeleccionado["id"], usuario_id, comentario);
                setComentario('');
                const nuevosComentarios = await getComentariosPost(postId);
                setComentariosPost(nuevosComentarios);
            } else {
                await crearComentarioPost(postId, usuario_id, comentario);
                setComentario('');
                
                const nuevosComentarios = await getComentariosPost(postId);
                setComentariosPost(nuevosComentarios);
            }
            

        } catch (error) {
            console.error('Error al enviar comentario:', error);
        }
    };

    const handleCerrarModoRespuesta = () => {
        setComentarioSeleccionado(null);
    }

    const toggleRespuestasVisibles = (idComentario: number) => {
        const newSet = new Set(respuestasVisibles);
        if (newSet.has(idComentario)) {
            newSet.delete(idComentario);
        } else {
            newSet.add(idComentario);
        }
        setRespuestasVisibles(newSet);
    };

    const toggleLike = (idComentario: number) => {
        setLikedComments(prev => 
            prev.includes(idComentario) 
                ? prev.filter(id => id !== idComentario)
                : [...prev, idComentario]
        );
    };

    const renderComentario = ({ item }: { item: Comentario }) => (
        <View style={styles.comentario}>
            <Image source={item.foto ? { uri: `${BUCKET_URL}foto-perfil/${item.foto}` } : foto_default} style={styles.foto_perfil}
                        />
            <View style={styles.contenido_comentario}>
                <View>
                    <Text style={styles.nombre_usuario}>{item.nombre_usuario}</Text>
                    <Text style={styles.fecha}> {formatearFecha(item.fecha_creacion)}</Text>
                </View>
                <Text style={styles.texto_comentario}>{item.contenido}</Text>
                <View style={styles.acciones_comentario}>
                    <TouchableOpacity 
                        style={styles.accion} 
                        onPress={() => toggleLike(item.id)}
                    >
                        <Ionicons 
                            name={likedComments.includes(item.id) ? "heart" : "heart-outline"} 
                            size={16} 
                            color={likedComments.includes(item.id) ? "#8BC34A" : "#424242"} 
                        />
                        {/* <Text style={styles.contador}>{item.likes}</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.accion}>
                        <Ionicons name="chatbubble-outline" size={16} color="#424242" />
                        {/* <Text style={styles.contador}>{item.respuestas.length}</Text> */}
                    </TouchableOpacity>
                </View>
                <View style={styles.botones_respuesta}>
                    <TouchableOpacity onPress={() => setComentarioSeleccionado({ id: item.id, usuario: item.nombre_usuario })}>
                        <Text style={styles.boton_respuesta}>Responder</Text>
                    </TouchableOpacity>
                    {item.total_respuestas > 0 && (
                        <TouchableOpacity onPress={() => toggleRespuestasVisibles(item.id)}>
                            <Text style={styles.boton_respuesta}>
                                {respuestasVisibles.has(item.id) ? 'Ocultar respuestas' : 'Ver respuestas'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View>
                    {respuestasVisibles.has(item.id) && (
                        <RespuestasComentario
                            respuestasVisibles={true}
                            toggleRespuestasVisibles={() => toggleRespuestasVisibles(item.id)}
                            comentarioId={item.id}
                        />
                    )}
                </View>
            </View>
        </View>
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
                    </View>
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
        paddingBottom: 20,
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

function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}
function getPostConComentarios(postId: number) {
    throw new Error('Function not implemented.');
}