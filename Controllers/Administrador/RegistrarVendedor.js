const conn = require("../../Model/db_model").promise();
const bcrypt = require('bcrypt');

const RegistrarVendedor = async (req, res) => {
    console.log(req.body);

    const { tipoDocumento, numeroDocumento, nombres, apellido, correo, celular, fechaContratacion } = req.body;

    const consulta = "SELECT id_usuario FROM usuario where numero_id = ? and pkfk_tdoc=?";

    try {
        const [respuesta] = await conn.query(consulta, [numeroDocumento, tipoDocumento]);
        console.log(respuesta);

        if (respuesta.length === 0) {
            const encrip = await bcrypt.hash(numeroDocumento,5);
            const consulta2 = "INSERT INTO usuario(pkfk_tdoc,numero_id,id_rol,Nombres,Apellidos,correo,celular,contrasena,estado) Values(?,?,?,?,?,?,?,?,?)";

            const [solicitud] = await conn.query(consulta2, [tipoDocumento, numeroDocumento, 2, nombres, apellido, correo, celular, encrip, 1]);
            console.log(solicitud);

            if (solicitud.affectedRows > 0) {
                const consulta3 = "INSERT INTO vendedor(id_vendedor,fecha_contratacion) VALUES (?,?)";

                try {
                    const [respuesta2] = await conn.query(consulta3, [solicitud.insertId, fechaContratacion]);

                    if (respuesta2.affectedRows > 0) {
                        res.status(200).send({ message: "Vendedor registrado correctamente", success: true });
                    } else {
                        res.status(500).send({ message: "Error al registrar el vendedor en la tabla de vendedores", success: false });
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).send({ message: "Error al registrar el vendedor en la tabla de vendedores" });
                }
            } else {
                res.status(500).send({ message: "Error al registrar el usuario" });
            }
        } else {
            res.send({ message: "Ya existe un vendedor con ese numero y tipo de documento" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error al consultar el usuario" });
    }
};

const InformeCliente = async (req, res) => {
    try {
        const { numeroDocumento } = req.params;

        console.log(numeroDocumento);

        const consulta = "SELECT * FROM usuario WHERE numero_id = ? AND id_rol = 3";
        const [respuesta] = await conn.query(consulta, [numeroDocumento]);

        if (respuesta.length > 0) {
            const infoCliente = respuesta[0];

            const consultaTotalCompras = "SELECT numero_factura_venta, fecha_factura, total_factura FROM factura_venta WHERE cliente_id = ? AND estado_factura = 0";
            const [respu] = await conn.query(consultaTotalCompras, [infoCliente.id_usuario]);

            // Sumar todos los valores de total_factura
            const totalFactura = respu.reduce((acc, factura) => acc + parseFloat(factura.total_factura), 0);

            console.log(infoCliente, respu);
            console.log('Total Factura:', totalFactura);

            res.json({ infoCliente, compras: respu, totalFactura })
        } else {
            res.status(404).json({ message: "Cliente no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const InformeVendedor = async (req, res) => {

    const { numeroDocumento } = req.params;

    console.log('Número de documento:', numeroDocumento);

    const consulta = "SELECT * FROM usuario WHERE numero_id = ? AND id_rol = 2";
    const [respuesta] = await conn.query(consulta, [numeroDocumento]);

    if(respuesta.length>0){
        const infoVendedor = respuesta[0]
        const consultaventas="SELECT numero_factura_venta,fecha_factura,total_factura from factura_venta where vendedor_id = ? and estado_factura=0"
        const [respu] =await conn.query(consultaventas,[infoVendedor.id_usuario])

        const totalVentas=parseFloat(respu.reduce((acc, factura) => acc + parseFloat(factura.total_factura), 0));

        console.log(infoVendedor,respu,totalVentas)

        res.json({infoVendedor,datosFacturas:respu,totalVentas})
    }else{
        res.status(400).json({message:"Vendedor no encontrado"})
    }
};

const MostrarVendedores = async (req,res)=>{
    try {
        const consulta = "SELECT * FROM usuario WHERE id_rol=2 and estado=1"
    const [resultado]= await conn.query(consulta)

    console.log(resultado)
    res.json(resultado)   
    } catch (error) {
        console.log("Error al mostrar los vendedores",error)
        res.status(400).json({message:"Error al mostrar"})
    }
}

const EditarVendedor = async(req,res)=>{
    const id = req.params.id;
    const { Nombres, Apellidos, pkfk_tdoc, numero_id, correo, celular } = req.body;

    if (!Nombres || !Apellidos || !pkfk_tdoc || !numero_id || !correo || !celular) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const consulta = `
            UPDATE usuario 
            SET Nombres = ?, Apellidos = ?, pkfk_tdoc = ?, numero_id = ?, correo = ?, celular = ? 
            WHERE id_usuario = ?
        `;
        const [resultado] = await conn.query(consulta, [Nombres, Apellidos, pkfk_tdoc, numero_id, correo, celular, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }

        res.json({ message: 'Vendedor actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el vendedor', error);
        res.status(500).json({ message: 'Error al actualizar el vendedor' });
    }
}

const EliminarVendedor=async(req,res)=>{
    console.log(req.params)
    const id  = req.params.id;

    try {
        const consulta = "UPDATE usuario SET estado = 0 WHERE id_usuario = ?";
        const [resultado] = await conn.query(consulta, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Vendedor no encontrado" });
        }

        console.log("Si se pudo")
        res.json({ message: "Vendedor eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el vendedor:", error);
        res.status(500).json({ message: "Error al eliminar el vendedor" });
    }
}

const MostrarClientes = async (req,res)=>{
    try {
        const consulta = "SELECT * FROM usuario WHERE id_rol=3 and estado=1"
    const [resultado]= await conn.query(consulta)

    console.log(resultado)
    res.json(resultado)   
    } catch (error) {
        console.log("Error al mostrar los vendedores",error)
        res.status(400).json({message:"Error al mostrar"})
    }
}

const EditarCliente = async(req,res)=>{
    const id = req.params.id;
    const { Nombres, Apellidos, pkfk_tdoc, numero_id, correo, celular } = req.body;

    if (!Nombres || !Apellidos || !pkfk_tdoc || !numero_id || !correo || !celular) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const consulta = `
            UPDATE usuario 
            SET Nombres = ?, Apellidos = ?, pkfk_tdoc = ?, numero_id = ?, correo = ?, celular = ? 
            WHERE id_usuario = ?
        `;
        const [resultado] = await conn.query(consulta, [Nombres, Apellidos, pkfk_tdoc, numero_id, correo, celular, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el cliente', error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
}

const EliminarCliente=async(req,res)=>{
    console.log(req.params)
    const id  = req.params.id;

    try {
        const consulta = "UPDATE usuario SET estado = 0 WHERE id_usuario = ?";
        const [resultado] = await conn.query(consulta, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "cliente no encontrado" });
        }

        console.log("Si se pudo")
        res.json({ message: "cliente eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).json({ message: "Error al eliminar el cliente" });
    }
}
module.exports = {
    RegistrarVendedor,
    InformeCliente,
    InformeVendedor,
    MostrarVendedores,
    EditarVendedor,
    EliminarVendedor,
    MostrarClientes,
    EditarCliente,
    EliminarCliente
};