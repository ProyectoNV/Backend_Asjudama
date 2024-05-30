const db = require('../../Model/db_model').promise();

const AgregarProducto = async (req, res)=>{
    try{
        const {nombre_producto, valor_unitario, descripcion_producto, estado_producto} = req.body;
        const valores ={nombre_producto, valor_unitario, descripcion_producto, estado_producto}
        const connection = await db;
        const result = await connection.query("INSERT INTO productos SET ?", valores)
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

const ActualizarProducto = async (req, res) => {
    const { id_producto } = req.params;
    const {nombre_producto, valor_unitario, descripcion_producto} = req.body;
    const valores = {nombre_producto, valor_unitario, descripcion_producto};
    try {
    
        const resultado = await db.query("UPDATE productos SET ? WHERE id_producto = ?", [valores, id_producto]);
        res.json(resultado);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const MostrarProductos = async (req, res) => {
    try{
        const basedata = await db;
        const [datosbase] = await basedata.query("SELECT * from productos WHERE (estado_producto = 1)");
        res.json(datosbase)

    }catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const CambiarEProductos = async (req, res) => {
    const { id_producto } = req.params;
    const consulta="SELECT id_producto FROM productos WHERE id_producto = ?";
    const [verificarEstado] = await db.query(consulta, id_producto);
    let cambio = 1;
    if(verificarEstado[0].estado_producto === 1){
        cambio = 0;
    }
    else if(verificarEstado[0].estado_producto === 0){
        cambio = 1;
    }
    try {
        const resultado = await db.query("UPDATE productos SET estado_producto = ? WHERE id_producto = ?", [cambio, id_producto]);
        res.json(resultado);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports={
    AgregarProducto,
    ActualizarProducto,
    MostrarProductos,
    CambiarEProductos
}
