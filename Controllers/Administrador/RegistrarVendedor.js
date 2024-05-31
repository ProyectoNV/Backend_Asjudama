const conn = require("../../Model/db_model").promise();
const RegistrarVendedor = async (req, res) => {
  console.log(req.body);

  const { tipoDocumento, numeroDocumento, rol, nombres, apellido, correo, celular, fechaContratacion } = req.body;

  const consulta = "SELECT id_usuario FROM usuario where numero_id = ? and pkfk_tdoc=?";

  try {
    const [respuesta] = await conn.query(consulta, [numeroDocumento, tipoDocumento]);
    console.log(respuesta);

    if (respuesta.length === 0) {
      const consulta2 = "INSERT INTO usuario(pkfk_tdoc,numero_id,id_rol,Nombres,Apellidos,correo,celular,contrasena,estado) Values(?,?,?,?,?,?,?,?,?)";

      const [solicitud] = await conn.query(consulta2, [tipoDocumento, numeroDocumento, parseInt(rol), nombres, apellido, correo, celular, numeroDocumento, 1]);
      console.log(solicitud);

      if (solicitud.affectedRows > 0) {
        const consulta3 = "INSERT INTO vendedor(id_vendedor,fecha_contratacion) VALUES (?,?)";

        try {
          const [respuesta2] = await conn.query(consulta3, [solicitud.insertId, fechaContratacion]);

          if (respuesta2.affectedRows > 0) {
            res.status(200).send({ message: "Vendedor registrado correctamente",success:true });
          } else {
            res.status(500).send({ message: "Error al registrar el vendedor en la tabla de vendedores",success:false});
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

            res.json({ infoCliente, compras: respu, totalFactura });
        } else {
            res.status(404).json({ message: "Cliente no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = {
  RegistrarVendedor,
  InformeCliente
};