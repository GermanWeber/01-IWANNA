import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const obtenerUsuarioPrueba = async (email: string) => {
    try {
        const url = `${API_URL}usuarios/prueba/${email}`;
        console.log('Consultando usuario en:', url);

        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener usuario');
        }

        // Guardar datos simples en AsyncStorage
        await AsyncStorage.setItem('usuario', JSON.stringify(data));
        console.log('Datos guardados en AsyncStorage:', data); // Log para verificar datos guardados

        // Verificar que los datos se guardaron correctamente
        const storedData = await AsyncStorage.getItem('usuario');
        console.log('Datos recuperados de AsyncStorage:', storedData); // Log para verificar datos recuperados

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};