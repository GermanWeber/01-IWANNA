import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { RespuestaComentario, RespuestaComentarioProps } from '../types/comentarios';
import { getRespuestasComentario } from '../services/comentariosService';
import { BUCKET_URL } from '@env';

const RespuestasComentario: React.FC<RespuestaComentarioProps> = ({
    respuestasVisibles,
    toggleRespuestasVisibles,
    comentarioId,
}) => {
    const [respuestas, setRespuestas] = useState<RespuestaComentario[]>([]);
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

    useEffect(() => {
        if (!respuestasVisibles) return;

        const fetchDatos = async () => {
            try {
                setLoading(true);
                const data = await getRespuestasComentario(comentarioId);
                setRespuestas(data);
            } catch (error) {
                console.error('Error al obtener respuestas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDatos();
    }, [respuestasVisibles]);

    if (!respuestasVisibles) return null;

    return (
        <View style={styles.respuestasContainer}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#8BC34A" />
                    <Text style={styles.loadingText}>Cargando respuestas...</Text>
                </View>
            ) : respuestas.length === 0 ? (
                <Text style={styles.noComentariosText}>No hay respuestas todavía.</Text>
            ) : (
                respuestas.map((respuesta) => (
                    <View key={respuesta.id} style={styles.respuesta}>
                        <Image
                            source={{ uri: `${BUCKET_URL}/${respuesta.foto}` }}
                            style={styles.foto_perfil_pequena}
                        />
                        <View style={styles.contenido_comentario}>
                            <Text style={styles.nombre_usuario}>{respuesta.nombre_usuario}</Text>
                            <Text style={styles.texto_comentario}>{respuesta.contenido}</Text>
                            <Text style={styles.fecha}>{formatearFecha(respuesta.fecha_creacion)}</Text>
                        </View>
                    </View>
                ))
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    respuestasContainer: {
        marginTop: 10,
        marginLeft: 50, // indentación para que parezcan respuestas
        paddingBottom: 10,
    },
    respuesta: {
        flexDirection: 'row',
        marginBottom: 10,
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
        marginVertical: 2,
        fontSize: 14,
        color: '#333',
    },
    fecha: {
        fontSize: 12,
        color: '#777',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
    },
    loadingText: {
        fontSize: 14,
        color: '#8BC34A',
    },
    noComentariosText: {
        fontSize: 14,
        color: '#888',
    },
});

export default RespuestasComentario;
