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

export type RespuestaCotizacionRequest = {
  id_cotizacion: number;
  mensaje: string;
  valor_estimado: number;
};

export type RespuestaCotizacionResponse = {
  message: string;
  respuesta: {
    id: number;
    id_cotizacion: number;
    mensaje: string;
    valor_estimado: number;
    fecha_respuesta: string;
  };
};

export type RechazoCotizacionRequest = {
  id_cotizacion: number;
  motivo: string;
  rechazado_por: string;
};

export type RechazoCotizacionResponse = {
  message: string;
  respuesta: {
    id: number;
    id_cotizacion: number;
    motivo: string;
    fecha_rechazo: string;
    rechazado_por: string;
  };
};

export type RechazoCotizacionError = {
  error: string;
};
