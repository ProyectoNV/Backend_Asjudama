const express = require('express')
const AbonosController = require('../Controllers/Vendedor/AbonosController')
const registro_cliente = require('../Controllers/Vendedor/resgistro_cliente')
const VendedorRutas=express.Router()

VendedorRutas.get("/buscar_abono/:numero_factura_abono", AbonosController.buscarAbonos);
VendedorRutas.post("/registro_abono", AbonosController.AgregarAbono);
VendedorRutas.get('/mostrarClientes',registro_cliente.informacionCliente)
VendedorRutas.put('/actualizarClientes',registro_cliente.actualizarCliente)
VendedorRutas.put('/actualizarEstado/:numero_id',registro_cliente.actualizarEstado)
VendedorRutas.get('/infoClientes',registro_cliente.Clientes)
VendedorRutas.get('/consultar_id/:numero_id',registro_cliente.Consultaid)
VendedorRutas.post('/registarClientes',registro_cliente.registrarCliente)

module.exports= VendedorRutas;