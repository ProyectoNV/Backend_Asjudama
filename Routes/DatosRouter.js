const express = require("express");
const ingreso =require("../Controllers/Ingreso")
const rutaDatos = express.Router();

rutaDatos.post("/ingresar", ingreso.IniciarSesion);

module.exports=rutaDatos;