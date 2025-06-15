
import React, { useEffect, useState } from 'react';
import { Modal, FlatList, View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Comentario, ComentarioItemProps, RespuestaComentario } from '../types/comentarios';
import { getCantidadRespuestasComentarios, getRespuestasComentario } from '../services/comentariosService';
import { BUCKET_URL } from '@env';
import RespuestasComentario from './respuestaComentario';
const foto_default = require('../assets/images/perfil.png');

const ComentarioItem: React.FC<ComentarioItemProps> = ({ comentario, onResponder, recargarRespuestas, setRecargarRespuestasPorComentario,recargarRespuestasPorComentario}) => {
    const [cantidadRespuestas, setCantidadRespuestas] = useState<number>(0);
    const [respuestasVisibles, setRespuestasVisibles] = useState<Set<number>>(new Set());

    const mostrarCantidadRespuestaComentarios = async (id_comentario: number) => {
            try {
                const cantidad = await getCantidadRespuestasComentarios(id_comentario);
                setCantidadRespuestas(cantidad);
            } catch (error) {
                setCantidadRespuestas(0);
            }
    };
    
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

    const toggleRespuestasVisibles = (idComentario: number) => {
        const newSet = new Set(respuestasVisibles);
        if (newSet.has(idComentario)) {
            newSet.delete(idComentario);

            // 🔴 Apagar recarga manualmente
            setRecargarRespuestasPorComentario(prev => ({
            ...prev,
            [idComentario]: false,
            }));
        } else {
            newSet.add(idComentario);
        }
        setRespuestasVisibles(newSet);
    };

    useEffect(() => {
        mostrarCantidadRespuestaComentarios(comentario.id);
    }, [comentario]);

    useEffect(() => {
        if (recargarRespuestasPorComentario[comentario.id]) {
            const newSet = new Set(respuestasVisibles);
            newSet.add(comentario.id);
            setRespuestasVisibles(newSet);

            // Apagar la bandera para que no quede activa
            setRecargarRespuestasPorComentario(prev => ({
                ...prev,
                [comentario.id]: false,
            }));
        }
    }, [recargarRespuestasPorComentario[comentario.id]]);

    return (
        <View style={styles.comentario}>
        <Image
            source={comentario.foto ? { uri: `${BUCKET_URL}foto-perfil/${comentario.foto}` } : foto_default}
            style={styles.foto_perfil}
        />
        <View style={styles.contenido_comentario}>
            <View>
            <Text style={styles.nombre_usuario}>{comentario.nombre_usuario}</Text>
            <Text style={styles.fecha}> {formatearFecha(comentario.fecha_creacion)}</Text>
            </View>
            <Text style={styles.texto_comentario}>{comentario.contenido}</Text>
            <View style={styles.botones_respuesta}>
            <TouchableOpacity onPress={() => onResponder(comentario)}>
                <Text style={styles.boton_respuesta}>Responder</Text>
            </TouchableOpacity>
            {cantidadRespuestas > 0 && (
                <TouchableOpacity onPress={() => toggleRespuestasVisibles(comentario.id)}>
                    <Text style={styles.boton_respuesta}>
                        {respuestasVisibles.has(comentario.id)
                        ? 'Ocultar respuestas'
                        : `Ver ${cantidadRespuestas} respuestas`}
                    </Text>
                </TouchableOpacity>
            )}
            </View>
            { (respuestasVisibles.has(comentario.id) || recargarRespuestas) && (
                <RespuestasComentario
                    respuestasVisibles={true}
                    toggleRespuestasVisibles={() => toggleRespuestasVisibles(comentario.id)}
                    comentarioId={comentario.id}
                    recargar={recargarRespuestas}
                />
            )}
        </View>
        </View>
    );
};

export default ComentarioItem;

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
function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}

