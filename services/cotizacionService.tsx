import { API_URL } from '@env';
import { CotizacionRequest, CotizacionResponse, RespuestaCotizacionRequest, RespuestaCotizacionResponse } from '../types/cotizacion';


export const createCotizacion = async (data: CotizacionRequest): Promise<CotizacionResponse> => {
    try {
        const url = `${API_URL.replace(/\/$/, '')}/cotizacion/create-cotizacion`;
        console.log('URL completa:', url);
        console.log('Datos enviados al API:', JSON.stringify(data, null, 2));

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
        console.log('Respuesta del API:', result);
        return result;
    } catch (error) {
        console.error('Error al crear cotización:', error);
        throw error;
    }
};

export const createRespuestaCot = async (data: RespuestaCotizacionRequest): Promise<RespuestaCotizacionResponse> => {
    try {
        const url = `${API_URL.replace(/\/$/, '')}/cotizacion/create-respuesta-cot`;
        console.log('URL completa:', url);
        console.log('Datos enviados al API:', JSON.stringify(data, null, 2));

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
        console.log('Respuesta del API:', result);
        return result;
    } catch (error) {
        console.error('Error al crear respuesta de cotización:', error);
        throw error;
    }
};

export const getCotizaciones = async (id_trabajador: number) => {
    try {
        const url = `${API_URL}cotizacion/${id_trabajador}`;
        console.log('Consultando cotizaciones en:', url);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener cotizaciones');
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getCotizacionesId = async (id: number) => {
    try {
        const url = `${API_URL}cotizacion/id/${id}`;
        console.log('Consultando cotizacion en:', url);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener cotizaciones');
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getRespuestaId = async (id: number) => {
    try {
        const url = `${API_URL}cotizacion/respuesta/${id}`;
        console.log('Consultando respuesta en:', url);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener la respuesta');
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}




export const updateRespondido = async (id: number): Promise<{ message: string; cotizacionId: number }> => {
    try {
        const url = `${API_URL.replace(/\/$/, '')}/cotizacion/responder/${id}`;
        console.log('URL completa:', url);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error response:', errorData);
            throw new Error(`Error ${response.status}: ${response.statusText} - ${errorData}`);
        }

        const result = await response.json();
        console.log('Respuesta del API:', result);
        return result;
    } catch (error) {
        console.error('Error al actualizar estado de respuesta:', error);
        throw error;
    }
};
