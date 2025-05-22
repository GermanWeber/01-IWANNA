import { API_URL } from '@env';
import { CotizacionRequest, CotizacionResponse } from '../types/cotizacion';


export const createCotizacion = async (data: CotizacionRequest): Promise<CotizacionResponse> => {
    try {
        const url = `${API_URL.replace(/\/$/, '')}/cotizacion/create-cotizacion`;
        console.log('URL completa:', url); 
        console.log('Datos enviados:', data); 

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error response:', errorData); 
            throw new Error(`Error ${response.status}: ${response.statusText} - ${errorData}`);
        }

        const result = await response.json();
        console.log('Respuesta exitosa:', result); 
        return result;
    } catch (error) {
        console.error('Error al crear cotización:', error);
        throw error;
    }
};