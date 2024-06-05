const db = require('../../Model/db_model').promise();

const RegistrarFacturaVenta = async (req, res) => {
    const connection = await db;
    try {
        const { numero_documento_cliente, vendedor_id, productos } = req.body;
        console.log(req.body);

        if (!Array.isArray(productos)) {
            throw new Error('El campo productos debe ser un arreglo.');
        }

        // Verificar si el numero_documento_cliente proporcionado existe en la tabla cliente
        const [clienteResult] = await connection.query(
            'SELECT c.id_cliente FROM cliente c JOIN usuario u ON c.id_cliente = u.id_usuario WHERE u.numero_id = ?',
            [numero_documento_cliente]
        );
        if (clienteResult.length === 0) {
            throw new Error('El cliente con el número de documento proporcionado no existe.');
        }
        
        const cliente_id = clienteResult[0].id_cliente;

        // Verificar si el vendedor_id proporcionado existe en la tabla vendedor
        const [vendedorResult] = await connection.query('SELECT * FROM vendedor WHERE id_vendedor = ?', [vendedor_id]);
        if (vendedorResult.length === 0) {
            throw new Error('El vendedor con el ID proporcionado no existe.');
        }

        let total_factura = 0;

        // Verificar productos y calcular el total de la factura
        for (const producto of productos) {
            const [productoResult] = await connection.query('SELECT valor_unitario FROM productos WHERE id_producto = ?', [producto.id]);
            if (productoResult.length === 0) {
                throw new Error(`El producto con ID ${producto.id} no existe.`);
            }

            const precio = productoResult[0].valor_unitario;
            total_factura += precio * producto.cantidad;
        }

        // Insertar en factura_venta
        const RegisFactura = `
            INSERT INTO factura_venta (cliente_id, vendedor_id, fecha_factura, total_factura, estado_factura)
            VALUES (?, ?, CURDATE(), ?, 0)
        `;
        const [facturaResult] = await connection.query(RegisFactura, [cliente_id, vendedor_id, total_factura]);

        const factura_id = facturaResult.insertId;

        // Insertar en factura_productos
        for (const producto of productos) {
            const insertProductoQuery = `
                INSERT INTO factura_productos (id_factura_venta, producto_id, cantidad_producto)
                VALUES (?, ?, ?)
            `;
            await connection.query(insertProductoQuery, [factura_id, producto.id, producto.cantidad]);
        }

        res.json({ success: true, message: 'Factura registrada exitosamente.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    RegistrarFacturaVenta
};
