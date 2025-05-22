// types/cotizacion.ts
export interface CotizacionRequest {
    asunto: string;
    descripcion: string;
    direccion: string;
}

export interface CotizacionResponse {
    // Ajusta estos tipos según la respuesta real de tu backend
    id?: number;
    asunto: string;
    descripcion: string;
    direccion: string;
    // ... otros campos que devuelva tu backend
}
