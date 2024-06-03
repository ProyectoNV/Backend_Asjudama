const db = require("../../Model/db_model").promise();

const registrarAbono = async (req, res) => {
    const { numero_factura, valor_abono } = req.body;
    const fecha_actual = new Date();

    if (!numero_factura || !valor_abono) {
        return res.status(400).json({ error: "Los campos numero_factura y valor_abono son obligatorios" });
    }

    try {
        // Insertar el abono en la tabla abono_factura
        await db.query(
            "INSERT INTO abono_factura (numero_factura_abono, valor_abono, fecha_abono) VALUES (?, ?, ?)",
            [numero_factura, valor_abono, fecha_actual]
        );

        // Obtener el total de los abonos realizados para esta factura
        const [rows] = await db.query(
            "SELECT SUM(valor_abono) as total_abonos FROM abono_factura WHERE numero_factura_abono = ?",
            [numero_factura]
        );
        const totalAbonos = rows[0].total_abonos;

        // Obtener el total de la factura
        const [facturaRows] = await db.query(
            "SELECT total_factura FROM factura_venta WHERE numero_factura_venta = ?",
            [numero_factura]
        );
        const totalFactura = facturaRows[0].total_factura;

        // Determinar el nuevo estado de la factura
        const nuevoEstado = totalAbonos >= totalFactura ? 1 : 0;

        // Actualizar el estado de la factura
        await db.query(
            "UPDATE factura_venta SET estado_factura = ? WHERE numero_factura_venta = ?",
            [nuevoEstado, numero_factura]
        );

        res.status(200).json({ message: `Abono registrado y factura actualizada correctamente ${totalAbonos} ${nuevoEstado} ${numero_factura}` });
    } catch (error) {
        console.error(`Error al registrar el abono: ${error}`);
        res.status(500).json({ error: "Error al registrar el abono" });
    }
}

const buscarAbonos = async (req, res)=>{
    try{
        const {numero_factura_abono} = req.params;
        const connection = await db;
        const [result] = await connection.query("SELECT * FROM abono_factura WHERE numero_factura_abono = ?", [numero_factura_abono])
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const buscarfactura = async (req, res)=>{
    try{
        const {clienteid,vendedorid} = req.params;
        const connection = await db;
        const [result] = await connection.query("SELECT * FROM factura_venta WHERE (cliente_id = ?) AND (vendedor_id = ?) AND (estado_factura = 0)", [clienteid,vendedorid])
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

module.exports = {
    registrarAbono,
    buscarAbonos,
    buscarfactura
};