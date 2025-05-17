import AsyncStorage from '@react-native-async-storage/async-storage';

export const guardarStorage = async (clave: string, datos: any) => {
    try {
        await AsyncStorage.setItem(clave, JSON.stringify(datos));
    } catch (error) {
        console.error('Error guardando los datos:', error);
    }
};

export const recuperarStorage = async (clave: string) => {
    try {
        const datos = await AsyncStorage.getItem(clave);
        if (datos) {
            return JSON.parse(datos);
        }
        return null;
    } catch (error) {
        console.error('Error recuperando los datos:', error);
        return null;
    }
};

export const eliminarDatos = async (clave: string) => {
    try {
        await AsyncStorage.removeItem(clave);
    } catch (error) {
        console.error('Error eliminando los datos:', error);
    }
};
