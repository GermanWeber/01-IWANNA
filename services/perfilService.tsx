import { API_URL } from "@env";




export const obtenerPerfil = async (id: number) => {
    try {
        const url = `${API_URL}perfil/${id}`;
        const response = await fetch(url);
        const text = await response.text();

        try {
            const data = JSON.parse(text);
            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener perfil');
            }
            return data;
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            throw new Error('La respuesta del servidor no es un JSON válido');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};