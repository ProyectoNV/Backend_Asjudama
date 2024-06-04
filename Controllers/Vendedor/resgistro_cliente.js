const bcrypt = require('bcrypt');
const db = require("../../Model/db_model").promise();


const informacionCliente = async (req, res) => {
    try {
        const query = `SELECT u.pkfk_tdoc, u.numero_id, u.Nombres, u.Apellidos, u.celular FROM usuario u WHERE id_rol="3" AND estado="1"`;
        const [resultado] = await db.query(query)
        res.json(resultado)
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }

};



const Clientes = async (req, res) => {
    try {
        const query = `SELECT * FROM cliente`
        const [resultado] = await db.query(query)
        res.json(resultado)
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }

};

const registrarCliente = async (req, res) => {
    const { pkfk_tdoc, numero_id, Nombres, Apellidos, correo, celular, contrasena, direccion } = req.body;

    const consulta = "SELECT * FROM usuario WHERE pkfk_tdoc = ? AND numero_id = ?";

    try {
        const [resultado] = await db.query(consulta, [pkfk_tdoc, numero_id]);

        if (resultado.length == 0) {

            const Password = await bcrypt.hash(contrasena, 10);

            const consul = await db.query("INSERT INTO usuario (pkfk_tdoc, numero_id, id_rol, Nombres, Apellidos,correo,celular,contrasena,estado) VALUES (?,?,?,?,?,?,?,?,?)", [pkfk_tdoc, numero_id, 3, Nombres, Apellidos, correo, celular, Password, 1]);

            const [usuario] = await db.query("SELECT id_usuario FROM usuario WHERE numero_id=?", [numero_id]);
            const id_cliente = usuario[0].id_usuario;
            //console.log(usuario)
            //console.log(usuario[0].id_usuario)

            const alumno = await db.query("INSERT INTO cliente (id_cliente,direccion) VALUES (?,?)", [id_cliente, direccion]);

            res.status(200).json({ message: "Cliente creado" });
        } else {
            // No se puede crear el cliente porque ya existe un alumno con el mismo ID

            res.status(500).json({ message: "Cliente Existente" });

        }


    }
    catch (error) {
        console.log(error.message)
        res.status(500);
        res.json(error.message);
    }
}

const actualizarCliente = async (req, res) => {
    const { pkfk_tdoc, numero_id, Nombres, Apellidos, correo, celular, contrasena, direccion } = req.body;
    console.log(req.body.id_usuario)

    const consulta = "SELECT * FROM usuario WHERE  id_usuario = ? ";

    try {
        // Consulta a la base de datos para obtener el usuario por su numero de usuario
        const [resultado] = await db.query(consulta, [req.body.id_usuario]);

        console.log(resultado)

        if (resultado.length > 0) {

            const id_usuario = resultado[0].id_usuario;

            // Actualizar datos del usuario en la tabla usuario
            const actualizarUsuario = await db.query("UPDATE usuario SET Nombres = ?, Apellidos = ?, pkfk_tdoc=?, numero_id= ?, correo = ?, celular = ?, contrasena = ? WHERE id_usuario = ?", [Nombres, Apellidos, pkfk_tdoc, numero_id, correo, celular, contrasena, id_usuario]);

            // Actualizar datos del alumno en la tabla cliente
            const actualizarAlumno = await db.query("UPDATE cliente SET direccion = ? WHERE id_cliente = ?", [direccion, id_usuario]);

            // Envía una respuesta JSON con un mensaje de éxito
            res.status(200).json({ message: "Usuario actualizado" });
        } else {
            // Si no se encuentra ningún usuario con el tipo de documento y número de identificación especificados, envía una respuesta con un mensaje de error
            res.status(404).json({ message: "Cliente no encontrado" });
        }

    } catch (error) {
        // Si ocurre algún error durante el proceso, se captura y se envía una respuesta con un mensaje de error
        console.log(error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

// Peticion para actualizar cliente
const Consultaid = async (req, res) => {

    try {
        const { numero_id } = req.params;
        const connection = await db;
        const [[resultado]] = await connection.query(`SELECT * FROM usuario INNER JOIN cliente ON id_usuario = id_cliente WHERE numero_id = ? `, [numero_id])
        if (resultado) {
            res.json(resultado)
        } else {
            res.status(404).json({ message: "Cliente no encontrado" });
        }
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}
const ConsultaNombre = async (req, res) => {

    const { Nombres, Apellidos } = req.query;
    try {
        const cliente = await Cliente.findOne({ Nombres, Apellidos });
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos del cliente', error });
    }
}

const actualizarEstado = async (req, res) => {
    try {
        const { numero_id } = req.params;
        const connection = await db;

        // Obtener el estado actual
        const [rows] = await db.query("SELECT estado FROM usuario WHERE numero_id = ?", [numero_id]);
        if (rows.length === 0) {
            res.status(404).send('Usuario no encontrado');
            return;
        }

        // Alternar el estado
        const estadoActual = rows[0].estado;
        const nuevoEstado = estadoActual === 0 ? 1 : 0;

        // Actualizar el estado
        const result = await db.query("UPDATE usuario SET estado = ? WHERE numero_id = ?", [nuevoEstado, numero_id]);

        res.json({ message: "Estado actualizado", nuevoEstado });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const informeMensual = async (req, res) => {
    try {
        const numeroIdentificacion = req.params.numeroIdentificacion; // Suponiendo que obtienes el número de identificación del vendedor desde la solicitud
        const query = `
            SELECT 
                u.numero_id AS numero_identificacion,
                u.Nombres AS nombres_vendedor,
                u.Apellidos AS apellidos_vendedor,
                fv.vendedor_id,
                MONTH(af.fecha_abono) AS mes,
                SUM(af.valor_abono) AS total_cobrado,
                JSON_ARRAYAGG(JSON_OBJECT('id_abono', af.id_abono, 'valor_abono', af.valor_abono, 'fecha_abono', af.fecha_abono, 'numero_factura', fv.numero_factura_venta)) AS abonos
            FROM 
                abono_factura af
                INNER JOIN factura_venta fv ON af.numero_factura_abono = fv.numero_factura_venta
                INNER JOIN vendedor v ON fv.vendedor_id = v.id_vendedor
                INNER JOIN usuario u ON v.id_vendedor = u.id_usuario
            WHERE 
                MONTH(af.fecha_abono) = MONTH(CURDATE()) AND
                u.numero_id = ?
            GROUP BY 
                u.numero_id, fv.vendedor_id, mes;
        `;
        const [resultado] = await db.query(query, [numeroIdentificacion]); // Pasamos el número de identificación como parámetro
        res.json(resultado);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const informeDiario = async (req, res) => {
    try {
        const numeroIdentificacion = req.params.numeroIdentificacion; // Suponiendo que obtienes el número de identificación del vendedor desde la solicitud
        
        // Desactivar temporalmente el modo only_full_group_by
        await db.query("SET SESSION sql_mode = ''");
        
        const query = `
            SELECT 
                u.numero_id AS numero_identificacion,
                u.Nombres AS nombres_vendedor,
                u.Apellidos AS apellidos_vendedor,
                af.fecha_abono AS fecha,
                SUM(af.valor_abono) AS total_cobrado,
                JSON_ARRAYAGG(JSON_OBJECT('id_abono', af.id_abono, 'valor_abono', af.valor_abono, 'fecha_abono', af.fecha_abono, 'numero_factura', fv.numero_factura_venta)) AS abonos
            FROM 
                abono_factura af
                INNER JOIN factura_venta fv ON af.numero_factura_abono = fv.numero_factura_venta
                INNER JOIN vendedor v ON fv.vendedor_id = v.id_vendedor
                INNER JOIN usuario u ON v.id_vendedor = u.id_usuario
            WHERE 
                DATE(af.fecha_abono) = CURDATE() AND
                u.numero_id = ?  /* Usamos el número de identificación del vendedor como parámetro */
            GROUP BY 
                u.numero_id, af.fecha_abono;
        `;
        const [resultado] = await db.query(query, [numeroIdentificacion]); // Pasamos el número de identificación como parámetro
        
        // Activar nuevamente el modo only_full_group_by
        await db.query("SET SESSION sql_mode = 'ONLY_FULL_GROUP_BY'");
        
        res.json(resultado);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};


module.exports = {
    informacionCliente,
    actualizarCliente,
    Clientes,
    registrarCliente,
    Consultaid,
    ConsultaNombre,
    actualizarEstado,
    informeMensual,
    informeDiario
};
