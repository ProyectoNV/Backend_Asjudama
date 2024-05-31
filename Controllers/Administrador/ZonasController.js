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
    try {
        const resultado = await db.query("UPDATE zona SET estado_zona = 0 WHERE id_zona = ?", id_zona);
        res.json(resultado);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const VerZona = async (req, res) => {
    try {
        const query = "SELECT * FROM zona"
        const [resultado] = await db.query(query)
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
    VerZona
}