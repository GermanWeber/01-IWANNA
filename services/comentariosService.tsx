import { API_URL } from '@env';
import { Comentario } from '../types/comentarios';

export const getComentariosPost = async (idPost: number): Promise<Comentario[]> => {
    try {
        const url = `${API_URL}post/${idPost}/comentarios`;
        console.log('Llamando a:', url);

        const response = await fetch(url);

        if (!response.ok) {

            if (response.status === 404) {
                return []; // Retorna un arreglo vacío si no hay comentarios
            }

            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: Comentario[] = await response.json();
        console.log('Datos recibidos:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        throw error;
    }
};

export const crearComentarioPost = async (postId: number,usuario_id: number,contenido: string): Promise<Comentario> => {
    try {
        const url = `${API_URL}post/${postId}/comentarios`;
        console.log('Enviando comentario a:', url);

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

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error response:', errorData);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: Comentario = await response.json();
        console.log('Comentario creado:', data);
        return data;
    } catch (error) {
        console.error('Error al crear comentario:', error);
        throw error;
    }
};