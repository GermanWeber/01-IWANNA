import { API_URL } from '@env';

export const createUser = async (userData) => {
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