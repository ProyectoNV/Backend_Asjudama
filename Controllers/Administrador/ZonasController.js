const db = require('../../Model/db_model').promise();


const Registrar_zona = async (req, res) => {
    try {
      const { nombre_zona, descripcion_zona, ubicacion_zona, tipo_zona} = req.body;
     
      const resultado = await db.query('INSERT INTO zona (nombre_zona, descripcion_zona, ubicacion_zona, tipo_zona, estado_zona) VALUES (?, ?, ?, ?, 1)',[nombre_zona, descripcion_zona, ubicacion_zona, tipo_zona]);
      res.json({ message: "Zona registrada exitosamente", data: resultado });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
  
  
  const Actualizar_zona = async (req, res) => {
    const { id_zona } = req.params;
    const consulta="SELECT estado_zona FROM zona WHERE id_zona= ?";
    const [verificarEstado] = await db.query(consulta, id_zona);
    let cambio = 1;
    if(verificarEstado[0].estado_zona === 1){
        cambio = 0;
    }
    else if(verificarEstado[0].estado_zona === 0){
        cambio = 1;
    }
    try {
        const resultado = await db.query("UPDATE zona SET estado_zona = ? WHERE id_zona = ?", [cambio, id_zona]);
        res.json(resultado);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const VerZona = async (req, res) => {
   try{
    const basedatab = await db;
    const [resultado] = await basedatab.query("SELECT * FROM zona WHERE (estado_zona = 1)");
    res.json(resultado)
   } 
   catch (error) {
    res.status(500);
    res.send(error.message);
}
};

const VerZonano = async (req, res) => {
    try{
     const basedatab = await db;
     const [resultado] = await basedatab.query("SELECT * FROM zona WHERE (estado_zona = 0)");
     res.json(resultado)
    } 
    catch (error) {
     res.status(500);
     res.send(error.message);
 }
 };
 


module.exports={
    Registrar_zona,
    Actualizar_zona,
    VerZona,
    VerZonano
}