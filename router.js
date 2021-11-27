const express = require("express");
const router = express.Router();

//lista de funciones que se van a usar en las rutas
const funciones = require("./funciones");

//contener numeros de la ultima boleta
router.get("/getLast/:cuit",funciones.getLast);

//contener numeros de la ultima boleta//////////TESTING////////////
router.get("/setLast",funciones.setLast);

//Obtener número del último comprobante creado
router.get("/getLastVoucher", funciones.getLastVoucher);

//Crear y asignar CAE a un comprobante
router.post("/createVoucher", funciones.createVoucher);

//Crear y asignar CAE a siguiente comprobante
router.post("/createNextVoucher", funciones.createNextVoucher);

//Obtener información de un comprobante
router.post("/getVoucherInfo", funciones.getVoucherInfo);

//Obtener puntos de venta disponibles
router.get("/salesPoints/:cuit", funciones.salesPoints);

//Obtener tipos de comprobantes disponibles
router.get("/conceptTypes/:cuit", funciones.conceptTypes);

//Obtener tipos de documentos disponibles
router.get("/documentTypes/:cuit", funciones.documentTypes);

//Obtener tipos de alícuotas disponibles
router.get("/aloquotTypes/:cuit", funciones.aloquotTypes);

//Obtener tipos de monedas disponibles
router.get("/currenciesTypes/:cuit", funciones.currenciesTypes);

//Obtener tipos de opciones disponibles para el comprobante
router.get("/optionTypes/:cuit", funciones.optionTypes);

//Obtener tipos de tributos disponibles
router.get("/taxTypes/:cuit", funciones.taxTypes);

//Obtener estado del servidor
router.get("/getServerStatus/:cuit", funciones.getServerStatus);

module.exports = router;