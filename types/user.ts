// src/types/user.ts
export interface UserData {
  nombre: string;
  email: string;
  telefono: string;
  rut: string;
  edad: number;
  id_sexo: number;
  descripcion: string;
  id_profesion: number | null;
  id_estado: number;
  id_tipo: number;
  foto: string;
  id_comuna: number;
}
// Tipos para la respuesta del backend
export interface UsuarioDatos {
  id: number;
  email: string;
  direccion: string;
  descripcion_usuario: string;
  profesion: string;
  estado_usuario: string;
  tipo_usuario: string;
}

export interface BackendResponse {
  usuario: UsuarioDatos;
  mensaje: string;
}
