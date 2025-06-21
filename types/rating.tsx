// Tipo para la estructura de datos de rating
export interface RatingData {
    id_cotizacion: number;
    id_trabajador: number;
    puntuacion: number;
    comentario: string;
}

// Tipo para la respuesta del servidor
export interface RatingResponse {
    message: string;
    respuesta: any;

}

export interface RatingCheckResponse {
    id_cotizacion: number;
    puntuacion: number;
    comentario: string;
    fecha_valoracion: string;
}

// Tipo para la respuesta del promedio de rating
export interface AverageRatingResponse {
    id_trabajador: number;
    promedio_estrellas: number;
    total_valoraciones: number;
}
