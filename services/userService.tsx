import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guardarStorage } from './asyncStorage';
import { getSubscriptionInfo } from './paymentService';
import { UsuarioDatos, BackendResponse } from '../types/user'



export const createUser = async (userData: any) => {
  try {
    const response = await fetch(`${API_URL}usuarios/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al crear usuario');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const obtenerUsuario = async (email: string) => {
  try {
    const url = `${API_URL}usuarios/${email}`;
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

export const obtenerDatos = async (id: string): Promise<UsuarioDatos | null> => {
  try {
    const url = `${API_URL}usuarios/datos/${id}`;
    console.log('Consultando usuario en:', url);

    const response = await fetch(url);
    const data: BackendResponse = await response.json();

    if (!response.ok) {
      // Si el usuario no tiene datos (404) o hay otro error, retornamos null
      if (response.status === 404) {
        console.log('Usuario no encontrado o sin datos');
        return null;
      }
      throw new Error(data.mensaje || 'Error al obtener usuario');
    }

    // Verificar si el backend devuelve datos válidos
    if (!data.usuario) {
      console.log('Usuario no tiene datos completos');
      return null;
    }

    // El backend devuelve { usuario: {...}, mensaje: "..." }
    // Retornamos solo los datos del usuario
    return data.usuario;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    // En caso de error de red u otros errores, también retornamos null
    return null;
  }
};

export const updateSuscripcion = async (userId: string, email: string) => {
  try {
    const response = await fetch(`${API_URL}usuarios/update-suscripcion`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (data) {
      try {
        //borrar datos anteriores
        await AsyncStorage.removeItem('usuario');
        await AsyncStorage.removeItem('stripeData');
        //obtener datos de usuario
        const usuario = await obtenerUsuario(email);
        console.log('Usuario obtenido luego de la suscripcion:', usuario);
        //obtener datos de stripe
        const stripeData = await getSubscriptionInfo(usuario.id);
        console.log('Datos de Stripe:', stripeData);
        // Guardar datos en AsyncStorage
        await guardarStorage('usuario', usuario);
        await guardarStorage('stripeData', stripeData);
        console.log('Datos guardados en AsyncStorage luego de la suscripcion:', usuario); // Log para verificar datos guardados
      } catch (error) {
        console.error('Error al obtener usuario luego de la suscripcion:', error);
      }
    }

    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar suscripcion');
    }

    return data;
  } catch (error) {
    throw error;
  }
};