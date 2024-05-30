const db = require("../../Model/db_model").promise();

const AgregarAbono = async (req, res)=>{
    try{
        const {numero_factura_abono, valor_abono , fecha_abono} = req.body;
        const valores ={numero_factura_abono, valor_abono , fecha_abono}
        const connection = await db;
        const result = await connection.query("INSERT INTO abono_factura SET ?", valores)
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
};

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


module.exports = {
    AgregarAbono,
    buscarAbonos
};