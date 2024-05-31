const express = require('express')
const ProductosController = require('../Controllers/Administrador/ProductosController')
const ZonasController = require ('../Controllers/Administrador/ZonasController')
const AdminRutas=express.Router()

AdminRutas.post("/registro_producto", ProductosController.AgregarProducto);
AdminRutas.put("/actualizar_producto/:id_producto", ProductosController.ActualizarProducto);
AdminRutas.get("/ver_productos", ProductosController.MostrarProductos);
AdminRutas.put("/estado_producto/:id_producto", ProductosController.CambiarEProductos);

/// zonas 

AdminRutas.post('/registrar', ZonasController.Registrar_zona);
AdminRutas.put('/actualizar/:id_zona', ZonasController.Actualizar_zona);
AdminRutas.get('/ver_zona', ZonasController.VerZona);

module.exports=AdminRutas;