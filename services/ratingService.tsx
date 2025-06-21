import { API_URL } from '@env';
import { RatingData, RatingResponse, RatingCheckResponse, AverageRatingResponse } from '../types/rating';


export const createRating = async (ratingData: RatingData): Promise<RatingResponse> => {
    try {
        const response = await fetch(`${API_URL}rating/create-rating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ratingData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al crear puntuación de trabajador');
        }

        return data;
    } catch (error) {
        console.error('Error en createRating:', error);
        throw error;
    }
};

export const getRating = async (id_cotizacion: number): Promise<RatingCheckResponse> => {
    try {
        const response = await fetch(`${API_URL}rating/check/${id_cotizacion}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al obtener puntuación');
        }

        return data;
    } catch (error) {
        console.error('Error en getRating:', error);
        throw error;
    }
};


export const getAverageRating = async (id_trabajador: number): Promise<AverageRatingResponse> => {
    try {
        const response = await fetch(`${API_URL}rating/average/${id_trabajador}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al obtener promedio de puntuación');
        }

        return data;
    } catch (error) {
        console.error('Error en getAverageRating:', error);
        throw error;
    }
};