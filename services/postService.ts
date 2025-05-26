import { API_URL } from "@env";




    export const obtenerPostsById = async (id: number) => {
        try {
            const url = `${API_URL}post/${id}`;
            console.log('Consultando posts en:', url);

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener posts');
            }

            return data;
        } catch (error) {
            console.error('Error al obtener posts:', error);
        }
    };