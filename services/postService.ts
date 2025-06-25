import { API_URL } from "@env";

    export const obtenerPostsByUser = async (usuarioId: number) => {
            try {
                const url = `${API_URL}post/usuario/${usuarioId}`;
                const response = await fetch(url);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error al obtener posts');
                }
                if (!response.ok) {
                    throw new Error(data.message || 'Error al obtener posts');
                }

            return data;
            } catch (error) {
                console.log('Error al obtener posts:', error);
            }
        };


    export const obtenerPostsByIdPost = async (id: number) => {
        try {
            const url = `${API_URL}post/${id}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log("data: ",data);
            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener posts');
            }

            return data;
        } catch (error) {
            console.log('Error al obtener posts:', error);
        }
    };

    export const modificarPost = async (idPost: number, descripcion: string) => {
        try {
            const url = `${API_URL}post/${idPost}`
            const respuesta = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    descripcion: descripcion,
                }),
            });

            const data = await respuesta.json();

            return data.exito;

        } catch (error) {
            console.log('Error al actualizar:', error);
        }
    };

    export const eliminarPost = async (idPost: number) => {
        try {
            const url = `${API_URL}post/${idPost}`
            const respuesta = await fetch(url, {
                method: 'DELETE',
            });

            const data = await respuesta.json();

            return data.exito;

        } catch (error) {
            console.log('Error al actualizar:', error);
        }
    };

    export const obtenerContadorPosts = async (id_usuario: number) => {
        
        const today = new Date().toISOString().split('T')[0];

       // console.log("today: ",today,'usuarioId: ',id_usuario);

        try {
            const url = `${API_URL}post/contador/${id_usuario}`;
            const response = await fetch(url);
            const data = await response.json();
            const contador = data.contador;
            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener contador de posts');
            }
            return contador;
        } catch (error) {
            console.log('Error al obtener contador de posts:', error);
        }
    };
