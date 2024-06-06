const express = require('express')
const AbonosController = require('../Controllers/Vendedor/AbonosController')
const registro_cliente = require('../Controllers/Vendedor/resgistro_cliente')
const facturacontrol = require('../Controllers/Vendedor/FacturaController')
const VendedorRutas=express.Router()

VendedorRutas.get("/buscar_factura_cliente_vendedor/:vendedorid/:tdoc/:numeroid", AbonosController.buscarfactura);
VendedorRutas.get("/buscar_facturapaga_cliente_vendedor/:vendedorid/:tdoc/:numeroid", AbonosController.buscarfacturapaga);
VendedorRutas.get("/buscar_abono/:numero_factura_abono", AbonosController.buscarAbonos);
VendedorRutas.post("/registro_abono", AbonosController.registrarAbono);
VendedorRutas.get('/mostrarClientes',registro_cliente.informacionCliente)
VendedorRutas.put('/actualizarClientes',registro_cliente.actualizarCliente)
VendedorRutas.put('/actualizarEstado/:numero_id',registro_cliente.actualizarEstado)
VendedorRutas.get('/infoClientes',registro_cliente.Clientes)
VendedorRutas.get('/datosCliente/:numero_documento',registro_cliente.ObtenerCliente)
VendedorRutas.get('/consultar_id/:numero_id',registro_cliente.Consultaid)
VendedorRutas.get('/informemensual/:numeroIdentificacion',registro_cliente.informeMensual)
VendedorRutas.get('/informediario/:numeroIdentificacion',registro_cliente.informeDiario)
VendedorRutas.post('/registarClientes',registro_cliente.registrarCliente)
VendedorRutas.post('/regisFactura', facturacontrol.RegistrarFacturaVenta)
VendedorRutas.get('/ObtenerdataFactura/:numero_factura', facturacontrol.ObtenerFacturaCompleta)

module.exports= VendedorRutas;