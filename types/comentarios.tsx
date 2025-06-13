export type Comentario = {
    id: number;
    id_post: number;
    contenido: string;
    fecha_creacion: string;
    usuario_id:number;
    nombre_usuario:string;
    foto:string;
    total_respuestas:number;
};

export interface ComentariosModalProps {
    modalVisible: boolean;
    toggleModal: () => void;
    postId: number;
}

export type RespuestaComentario = {
    id: number;
    id_comentario: number;
    contenido: string;
    fecha_creacion: string;
    usuario_id:number;
    nombre_usuario:string;
    foto:string;
};

export interface RespuestaComentarioProps {
    respuestasVisibles: boolean;
    toggleRespuestasVisibles: () => void;
    comentarioId: number;
}