import { API_URL } from '@env';
import { CotizacionRequest, CotizacionResponse, RespuestaCotizacionRequest, RespuestaCotizacionResponse, RechazoCotizacionRequest, RechazoCotizacionResponse } from '../types/cotizacion';


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
            console.log('Error response:', errorData);
            throw new Error(`Error ${response.status}: ${response.statusText} - ${errorData}`);
        }

        const result = await response.json();
        console.log('Respuesta del API:', result);
        return result;
    } catch (error) {
        console.log('Error al crear cotización:', error);
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
            console.log('Error response:', errorData);
            throw new Error(`Error ${response.status}: ${response.statusText} - ${errorData}`);
        }

        const result = await response.json();
        console.log('Respuesta del API:', result);
        return result;
    } catch (error) {
        console.log('Error al crear respuesta de cotización:', error);
        throw error;
    }
};

export const createRechazoCot = async (data: RechazoCotizacionRequest): Promise<RechazoCotizacionResponse> => {
    try {
        const url = `${API_URL.replace(/\/$/, '')}/cotizacion/create-rechazo-cot`;
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
            const errorData = await response.json();
            console.log('Error response:', errorData);
            throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del API:', result);
        return result;
    } catch (error) {
        console.log('Error al crear rechazo de cotización:', error);
        throw error;
    }
};

export const getCotizaciones = async (id_trabajador: number) => {
    try {
        const url = `${API_URL}cotizacion/cliente/${id_trabajador}`;
        console.log('Consultando cotizaciones en:', url);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener cotizaciones');
        }

        return data;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
};

export const getRechazo = async (id_rechazo: number) => {
    try {
        const url = `${API_URL}cotizacion/rechazo/${id_rechazo}`;
        console.log('Consultando rechazo en:', url);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener rechazo');
        }

        return data;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
};

export const getCotizacionesCli = async (id_cliente: number) => {
    try {
        const url = `${API_URL}cotizacion/cliente/${id_cliente}`;
        console.log('Consultando cotizaciones en:', url);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener cotizaciones');
        }

        return data;
    } catch (error) {
        console.log('Error:', error);
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
        console.log('Error:', error);
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
        console.log('Error:', error);
        throw error;
    }
}



///////////////////////////
export const updateRespondido = async (id: number, id_estado: number): Promise<{ message: string; cotizacionId: number; nuevoEstado: number }> => {
    try {
        const url = `${API_URL.replace(/\/$/, '')}/cotizacion/responder/${id}`;
        console.log('URL completa:', url);
        console.log('Actualizando estado a:', id_estado);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_estado })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.log('Error response:', errorData);
            throw new Error(`Error ${response.status}: ${response.statusText} - ${errorData}`);
        }

        const result = await response.json();
        console.log('Respuesta del API:', result);
        return result;
    } catch (error) {
        console.log('Error al actualizar estado de respuesta:', error);
        throw error;
    }
};
