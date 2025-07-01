import { API_URL } from "@env";

export const guardarDireccion = async (id_usuario:number, direccion:InterfaceDireccion) => {
        if (!id_usuario) {
            console.error("Usuario sin ID. No se puede guardar dirección.");
            return;
        }
        if (!direccion || !direccion.descripcion || !direccion.latitud || !direccion.longitud) {
            console.error("Dirección incompleta:", direccion);
            return;
        }

        const urlApi = `${API_URL}direccion/${id_usuario}`;

        try {
            const res = await fetch(urlApi, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(direccion),
            });
            console.log("res: ", res);

            if (!res.ok) {
                throw new Error(`Error al enviar datos de dirección. Status: ${res.status}`);
            }

            const data = await res.json();
            return data.exito;
        } catch (error) {
            console.error('Error al actualizar dirección:', error);
        }
    };