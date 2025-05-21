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