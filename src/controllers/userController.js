const getUsuarioPorEmail = async (req, res) => {
    const email = req.params.email;
    try {
        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'El email es requerido' 
            });
        }

        const sql = `
                    SELECT u.id,
                        CONCAT(u.nombre, ' ', u.apellido) as "nombre",
                        u.email,
                        u.telefono,
                        u.rut,
                        u.edad,
                        u.id_sexo,
                        u.descripcion,
                        p.descripcion as "profesion",
                        u.id_profesion,
                        u.id_estado,
                        u.id_tipo,
                        u.foto,
                        d.descripcion as "direccion"
                    FROM usuario u
                    LEFT JOIN direccion_usuario d ON d.id_usuario = u.id
                    LEFT JOIN profesion p ON p.id = u.id_profesion
                    WHERE u.email = ?`; 
        const usuario = await select(sql, email);
        console.log('Resultado de la consulta:', usuario);

        if (!usuario || usuario.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        res.json({
            success: true,
            data: usuario[0]
        });
    } catch (err) {
        console.error('Error al consultar usuarios:', err);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener usuario',
            error: err.message 
        });
    }
}; 