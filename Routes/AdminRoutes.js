const express = require('express')
const ProductosController = require('../Controllers/Administrador/ProductosController')
const ZonasController = require ('../Controllers/Administrador/ZonasController')
const RegistrarVendedor = require('../Controllers/Administrador/RegistrarVendedor')
const AdminRutas=express.Router()

AdminRutas.post("/registro_producto", ProductosController.AgregarProducto);
AdminRutas.put("/actualizar_producto/:id_producto", ProductosController.ActualizarProducto);
AdminRutas.get("/Buscar_producto/:id_producto", ProductosController.BusquedaProducto);
AdminRutas.get("/ver_productos", ProductosController.MostrarProductos);
AdminRutas.get("/ver_productos_I", ProductosController.MostrarProductosI);
AdminRutas.put("/estado_producto/:id_producto", ProductosController.CambiarEProductos);

/// zonas 

AdminRutas.post('/registrar', ZonasController.Registrar_zona);
AdminRutas.put('/actualizar/:id_zona', ZonasController.Actualizar_zona);
AdminRutas.get('/ver_zona', ZonasController.VerZona);
AdminRutas.get('/ver_zona_I', ZonasController.VerZonano);

//Registrar vendedor 
AdminRutas.post("/registrarvendedor",RegistrarVendedor.RegistrarVendedor)
AdminRutas.get("/informeCliente/:numeroDocumento",RegistrarVendedor.InformeCliente)
AdminRutas.get("/informeVendedor/:numeroDocumento",RegistrarVendedor.InformeVendedor)

AdminRutas.get("/Vendedores",RegistrarVendedor.MostrarVendedores)
AdminRutas.put("/ActuVendedores/:id",RegistrarVendedor.EditarVendedor)
AdminRutas.put("/ElimiVendedor/:id",RegistrarVendedor.EliminarVendedor)

AdminRutas.get("/Clientes",RegistrarVendedor.MostrarClientes)
AdminRutas.put("/ActuClientes/:id",RegistrarVendedor.EditarCliente)
AdminRutas.put("/ElimiCliente/:id",RegistrarVendedor.EliminarCliente)

module.exports=AdminRutas;