// types/cotizacion.ts
export interface CotizacionRequest {
  asunto: string;
  descripcion: string;
  direccion: string;
  id_cliente: number;
  id_trabajador: string;
}

export interface CotizacionResponse {
  // Ajusta estos tipos según la respuesta real de tu backend
  id?: number;
  asunto: string;
  descripcion: string;
  direccion: string;
  id_cliente: number;
  estado?: string;
  fecha?: string;
  id_trabajador: string;
}
