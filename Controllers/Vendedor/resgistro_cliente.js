const bcrypt = require('bcrypt');
const db = require("../../Model/db_model").promise();


const informacionCliente = async (req, res) => {
    try {
        const query= `SELECT u.pkfk_tdoc, u.numero_id, u.Nombres, u.Apellidos, u.celular FROM usuario u WHERE id_rol="3" AND estado="1"`;
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

            const [usuario] = await db.query ("SELECT id_usuario FROM usuario WHERE numero_id=?", [numero_id]);
            const id_cliente = usuario[0].id_usuario;
            //console.log(usuario)
            //console.log(usuario[0].id_usuario)

            const alumno = await db.query("INSERT INTO cliente (id_cliente,direccion) VALUES (?,?)", [ id_cliente, direccion]);

            res.status(200).json({ message:"Cliente creado" });
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
            const actualizarUsuario = await db.query("UPDATE usuario SET Nombres = ?, Apellidos = ?, pkfk_tdoc=?, numero_id= ?, correo = ?, celular = ?, contrasena = ? WHERE id_usuario = ?", [Nombres, Apellidos, pkfk_tdoc,numero_id, correo, celular, contrasena, id_usuario]);
    
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
        const {numero_id} = req.params;
        const connection = await db;
        const [[resultado]] = await connection.query(`SELECT * FROM usuario INNER JOIN cliente ON id_usuario = id_cliente WHERE numero_id = ? `,[numero_id])
        if(resultado ){
            res.json(resultado)
        }else{
            res.status(404).json({ message: "Cliente no encontrado" });
        }
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}
const actualizarEstado = async (req, res) => {
    try {
        const {numero_id} = req.params;
        const {estado}= req.body
        console.log(estado)
        console.log(numero_id)
        const connection = await db;
        const result = await connection.query("UPDATE usuario SET estado = ? WHERE numero_id = ?", [estado, numero_id]);
        res.json(result)
    }
    catch (error) {
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
    actualizarEstado
};
