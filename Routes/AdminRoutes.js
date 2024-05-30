const express = require('express')
const ProductosController = require('../Controllers/Administrador/ProductosController')
const AdminRutas=express.Router()

AdminRutas.post("/registro_producto", ProductosController.AgregarProducto);
AdminRutas.put("/actualizar_producto/:id_producto", ProductosController.ActualizarProducto);
AdminRutas.get("/ver_productos", ProductosController.MostrarProductos);
AdminRutas.put("/estado_producto/:id_producto", ProductosController.CambiarEProductos);

module.exports=AdminRutas;