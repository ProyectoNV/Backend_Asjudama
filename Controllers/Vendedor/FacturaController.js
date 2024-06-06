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

const ObtenerFacturaCompleta = async (req, res) => {
    const connection = await db;
    const { numero_factura } = req.params;

    try {
        // Consulta para obtener la información completa de la factura, incluyendo productos, cliente y vendedor
        const query = `
            SELECT 
                fv.numero_factura_venta,
                fv.cliente_id,
                CONCAT(uc.Nombres, ' ', uc.Apellidos) AS nombre_cliente,
                uc.celular AS celular_cliente,
                fv.vendedor_id,
                CONCAT(uv.Nombres, ' ', uv.Apellidos) AS nombre_vendedor,
                fv.fecha_factura,
                fv.total_factura,
                fv.estado_factura,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_factura_producto', fp.id_factura_producto,
                        'producto_id', fp.producto_id,
                        'cantidad_producto', fp.cantidad_producto,
                        'nombre_producto', p.nombre_producto,
                        'valor_unitario', p.valor_unitario
                    )
                ) AS productos
            FROM 
                factura_venta fv
            LEFT JOIN 
                factura_productos fp ON fv.numero_factura_venta = fp.id_factura_venta
            LEFT JOIN 
                productos p ON fp.producto_id = p.id_producto
            LEFT JOIN 
                cliente cl ON fv.cliente_id = cl.id_cliente
            LEFT JOIN 
                usuario uc ON cl.id_cliente = uc.id_usuario
            LEFT JOIN 
                vendedor vd ON fv.vendedor_id = vd.id_vendedor
            LEFT JOIN 
                usuario uv ON vd.id_vendedor = uv.id_usuario
            WHERE 
                fv.numero_factura_venta = ?
            GROUP BY 
                fv.numero_factura_venta, fv.cliente_id, nombre_cliente, celular_cliente, fv.vendedor_id, nombre_vendedor, fv.fecha_factura, fv.total_factura, fv.estado_factura;
        `;

        const [result] = await connection.query(query, [numero_factura]);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Factura no encontrada.' });
        }

        res.json({ success: true, factura: result[0] });
    } catch (error) {
        console.error('Error al obtener la factura completa:', error);
        res.status(500).json({ success: false, message: 'Error al obtener la factura completa.' });
    }
};



module.exports = {
    RegistrarFacturaVenta,
    ObtenerFacturaCompleta
};
