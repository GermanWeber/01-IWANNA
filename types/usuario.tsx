export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    rut?: string;
    edad?: number;
    id_sexo: number;
    descripcion?: string;
    profesion?:string;
    id_profesion?: number;
    id_estado: number;
    id_tipo: number;
    foto?: string;
    direccion: string;
}