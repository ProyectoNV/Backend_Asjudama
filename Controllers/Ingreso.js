const bcrypt = require("bcrypt");
const db =require('../Model/db_model')

function IniciarSesion(req,res){
    //recuperar datos
    const{correo ,contrasena}=req.body;

    
    //validar usuario
    db.query('SELECT * FROM usuario WHERE correo= ? ',[correo],
    async(error,results)=>{
        console.log(results)

        if(results.length>0){
            console.log('Usuario en DB');
            // validar contraseña
            const contraseña_DB =results[0].contrasena;
            console.log(contraseña_DB);
            const validacion_contraseñas = await bcrypt.compare(contrasena, contraseña_DB) 
            if (validacion_contraseñas){
                    
                req.session.usuario = {
                    id: results[0].id_usuario,
                    rol: results[0].id_rol,
                    nombre: results[0].Nombres,
                    apellido: results[0].Apellidos   
                }
                const usuario = req.session.usuario;
                res.json({
                    success: true,
                    message:'Autenticacion exitosa',
                    usuario: usuario
                })
            }else{
                res.json({
                    success: false,
                    message:'Autenticacion errada'
                })
            }

        }
        else{
            res.json({
                success: false,
                message: "No se encontro el usuario"
            })
        }
    })
}

module.exports={
    IniciarSesion
}