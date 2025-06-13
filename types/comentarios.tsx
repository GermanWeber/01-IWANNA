export type Comentario = {
    id: number;
    id_post: number;
    contenido: string;
    fecha_creacion: string;
    usuario_id:number;
    nombre_usuario:string;
    foto:string;
};

export interface ComentariosModalProps {
    modalVisible: boolean;
    toggleModal: () => void;
    postId: number;
}
