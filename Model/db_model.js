const mysql = require('mysql2')

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"12345",
    database:"Dulceria"
})

db.connect((error)=>{
    if(error){
        console.error(`Error al conectarse a la base de datos: ${error}`)
        return
    }
    console.log("Conexion exitosa")

})

process.on("SIGINT",()=>{
    db.end();
    process.exit();
})

module.exports=db;