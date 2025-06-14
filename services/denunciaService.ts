import { API_URL } from "@env";


export const denunciaPost = async (id_post: number, id_usuario: number, tipo_denuncia: string, detalle_denuncia: string) => {
    try {
        const response = await fetch(`${API_URL}denuncia/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idPost: id_post,
                idUsuario: id_usuario,
                tipo_denuncia,
                detalle_denuncia
            })
        });

        if (!response.ok) {
            console.error('Error al denunciar el post');
            return null;
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error:', err);
        return null;
    }
};

export const denunciaTrabajador = async (id_trabajador:number, id_usuario:number, tipo_denuncia:string, detalle_denuncia:string) => {
    try {
        const response = await fetch(`${API_URL}denuncia/trabajador`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idTrabajador: id_trabajador,
                idUsuario: id_usuario,
                tipo_denuncia,
                detalle_denuncia
            })
        }); 
        
        if (!response.ok) {
            console.error('Error al denunciar el trabajador');
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error:', err);
        return null;
    } 
};
