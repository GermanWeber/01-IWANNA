import { API_URL } from '@env';
import { Comentario, RespuestaComentario } from '../types/comentarios';
import { Alert } from 'react-native';

export const getComentariosPost = async (idPost: number): Promise<Comentario[]> => {
    try {
        const url = `${API_URL}comentario/post/${idPost}`;

        const response = await fetch(url);

        if (!response.ok) {

            if (response.status === 404) {
                return []; // Retorna un arreglo vacío si no hay comentarios
            }

            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: Comentario[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        throw error;
    }
};

export const crearComentarioPost = async (postId: number,usuario_id: number,contenido: string): Promise<Comentario> => {
    try {
        const url = `${API_URL}comentario/post/${postId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario_id,
                contenido,
            }),
        });

        const data = await response.json();

        if (!response.ok || data.exito === false) {
            Alert.alert("Error", data.error);
        }
        return data.exito;
    } catch (error) {
        console.error('Error al crear comentario:', error);
        throw error;
    }
};

export const getRespuestasComentario = async (idComentario: number): Promise<RespuestaComentario[]> => {
    try {
        const url = `${API_URL}comentario/respuesta/${idComentario}`;

        const response = await fetch(url);

        if (!response.ok) {

            if (response.status === 404) {
                return []; // Retorna un arreglo vacío si no hay comentarios
            }

            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: RespuestaComentario[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        throw error;
    }
};

export const crearRespuestasComentario = async (idComentario: number,usuario_id: number,contenido: string): Promise<RespuestaComentario> => {
    try {
        const url = `${API_URL}comentario/respuesta/${idComentario}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario_id,
                contenido,
            }),
        });

        const data = await response.json();

        if (!response.ok || data.exito === false) {
            Alert.alert("Error", data.error);
        }

        return data.exito;
    } catch (error) {
        console.error('Error al crear comentario:', error);
        throw error;
    }
};

export const getCantidadComentarios = async (idPost: number): Promise<number> => {
    try {
        const url = `${API_URL}comentario/post/conteo/${idPost}`;

        const response = await fetch(url);

        if (!response.ok) {

            if (response.status === 404) {
                return 0;
            }
        }

        const data = await response.json();

        const cantidad = data[0]["cantidad_comentarios"];
        return cantidad;
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        throw error;
    }
};

export const getCantidadRespuestasComentarios = async (idComentario: number): Promise<number> => {
    try {
        const url = `${API_URL}comentario/respuesta/conteo/${idComentario}`;
        const response = await fetch(url);

        if (!response.ok) {

            if (response.status === 404) {
                return 0;
            }
        }

        const data = await response.json();

        const cantidad = data[0]["cantidad_respuestas"];
        return cantidad;
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        throw error;
    }
};
