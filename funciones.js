const Afip = require('@afipsdk/afip.js');
const configuracion = require('./node_modules/@afipsdk/afip.js/src/Afip_res/20323688576/config.json');
const fs = require('fs');
const {Pool} = require('pg');

new Pool({})

baseDeDatos = {
  
}

module.exports = {
  getLastVoucher: async function (req, res) {
    //Lógica de la funcion
    let cuit = req.query.cuit;
    let ptoVenta = req.query.ptoVenta;
    let tipoComprobante = req.query.tipoComprobante;
    try {
      let afip = new Afip({ CUIT:cuit,ta_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit,res_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit});
    const respuesta = await afip.ElectronicBilling.getLastVoucher(ptoVenta, tipoComprobante); //Devuelve el número del último comprobante creado para el punto de venta 1 y el tipo de comprobante 6 (Factura B)


      res.send(respuesta);
    } catch (err) {
      res.send(""+err);
    }
    
  },
  createVoucher: async function (req, res) {
    /*
        Debemos utilizar el método createVoucher pasándole como parámetro un Objeto con los detalles del comprobante y si queremos 
        tener la respuesta completa enviada por el WS debemos pasarle como segundo parámetro true, en caso de no enviarle el segundo 
        parámetro nos devolverá como respuesta { CAE : CAE asignado el comprobante, CAEFchVto : Fecha de vencimiento del CAE (yyyy-mm-dd) }.

        ejemplo de body

        const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];

        const data = {
          'CantReg' 		: 1, // Cantidad de comprobantes a registrar
          'PtoVta' 		: 1, // Punto de venta
          'CbteTipo' 		: 6, // Tipo de comprobante (ver tipos disponibles) 
          'Concepto' 		: 1, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
          'DocTipo' 		: 80, // Tipo de documento del comprador (ver tipos disponibles)
          'DocNro' 		: 20111111112, // Numero de documento del comprador
          'CbteDesde' 	: 2, // Numero de comprobante o numero del primer comprobante en caso de ser mas de uno
          'CbteHasta' 	: 2, // Numero de comprobante o numero del ultimo comprobante en caso de ser mas de uno
          'CbteFch' 		: parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
          'ImpTotal' 		: 184.05, // Importe total del comprobante
          'ImpTotConc' 	: 0, // Importe neto no gravado
          'ImpNeto' 		: 150, // Importe neto gravado
          'ImpOpEx' 		: 0, // Importe exento de IVA
          'ImpIVA' 		: 26.25, //Importe total de IVA
          'ImpTrib' 		: 7.8, //Importe total de tributos
          'FchServDesde' 	: null, // (Opcional) Fecha de inicio del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
          'FchServHasta' 	: null, // (Opcional) Fecha de fin del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
          'FchVtoPago' 	: null, // (Opcional) Fecha de vencimiento del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
          'MonId' 		: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
          'MonCotiz' 		: 1, // Cotización de la moneda usada (1 para pesos argentinos)  
          
          'Tributos' 		: [ // (Opcional) Tributos asociados al comprobante
            {
              'Id' 		:  99, // Id del tipo de tributo (ver tipos disponibles) 
              'Desc' 		: 'Ingresos Brutos', // (Opcional) Descripcion
              'BaseImp' 	: 150, // Base imponible para el tributo
              'Alic' 		: 5.2, // Alícuota
              'Importe' 	: 7.8 // Importe del tributo
            }
          ], 
          'Iva' 			: [ // (Opcional) Alícuotas asociadas al comprobante
            {
              'Id' 		: 5, // Id del tipo de IVA (ver tipos disponibles) 21%
              'BaseImp' 	: 100, // Base imponible
              'Importe' 	: 21 // Importe 
            },
            {
              'Id' 		: 4, // Id del tipo de IVA (ver tipos disponibles)10.5% 
              'BaseImp' 	: 50, // Base imponible
              'Importe' 	: 5.25 // Importe 
            }
          ]
        };
    */
    const payload = req.body;
    const data = payload.data;
    let cuit = payload.nroCUIT;
    let esProduccion = payload.esProduccion;
    //formateo de las fechas.
    data.CbteFch = parseInt(data.CbteFch.replace(/-/g, ''));
    if (data.FchServDesde!= null){
      data.FchServDesde = parseInt(data.FchServDesde.replace(/-/g, ''));
      data.FchServHasta = parseInt(data.FchServHasta.replace(/-/g, ''));
      data.FchVtoPago = parseInt(data.FchVtoPago.replace(/-/g, ''));
    }
    try{
      let afip = new Afip({ CUIT:cuit,production:esProduccion,ta_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit,res_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit});
      const respuesta = await afip.ElectronicBilling.createVoucher(data);

    //respuesta['CAE']; //CAE asignado el comprobante
    //respuesta['CAEFchVto']; //Fecha de vencimiento del CAE (yyyy-mm-dd)
      res.send(respuesta);
    }catch(err){
      res.send({"Error":""+err});
    }
    
  },
  createNextVoucher: async function (req, res) {
    /*
        Crear y asignar CAE a siguiente comprobante

        Debemos utilizar el método createNextVoucher pasándole como parámetro un Objeto con los detalles del comprobante al 
        igual que el método createVoucher, nos devolverá como respuesta 
        { CAE : CAE asignado al comprobante, CAEFchVto : Fecha de vencimiento del CAE (yyyy-mm-dd), 
            voucher_number : Número asignado al comprobante }
        
        */
    const data = req.body;
    const respuesta = await afip.ElectronicBilling.createNextVoucher(data);

    //respuesta['CAE']; //CAE asignado el comprobante
    //respuesta['CAEFchVto']; //Fecha de vencimiento del CAE (yyyy-mm-dd)
    //respuesta['voucher_number']; //Número asignado al comprobante

    res.send(respuesta);
  },getLast: async function (req,res){
    let cuit = req.params.cuit;
    jsonReader('./node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit+'/config.json',(err,data)=>{
      if(err){
        console.log(err)
      }else{
        res.send(data)
      }
    })
    res.send(conf);
    
  },
  setLast: async function (req,res){
    let cuit = req.query.cuit;
    let tipoBoleta = req.query.tipoBoleta;
    
        jsonReader('./node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit+'/config.json',(err,data)=>{
          if(err){
            console.log(err)
          }else{
            if(tipoBoleta==1){
              data.contadorBoletaA+=1
            }
            if(tipoBoleta==6){
              data.contadorBoletaB+=1
            }
            if(tipoBoleta==11){
              data.contadorBoletaC+=1
            }
            fs.writeFile('./node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit+'/config.json',JSON.stringify(data,null,2),err =>{
              if(err){
                console.log(err)
              }
              res.send(data)
            })
          }
        })
      
  },
  getVoucherInfo: async function (req, res) {
    /*

    Con este método podemos obtener toda la información relacionada a un comprobante o simplemente saber si el comprobante existe, 
    debemos ejecutar el método getVoucherInfo pasándole como parámetros el número de comprobante, el punto de venta y el tipo de 
    comprobante, nos devolverá un Objeto con toda la información del comprobante o null si el comprobante no existe.

    */

    const respuesta = await afip.ElectronicBilling.getVoucherInfo(1,1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)

    if(voucherInfo === null){
        res.send('El comprobante no existe');
    }
    else{
        console.log('Esta es la información del comprobante:');
        res.send(respuesta);
    }
    
  },
  salesPoints: async function (req, res) {
    //Obtener puntos de venta disponibles
    try {
      let cuit = req.params.cuit;
    let afip = new Afip({ CUIT:cuit,ta_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit,res_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit});
    const respuesta= await afip.ElectronicBilling.getSalesPoints();
    res.send(respuesta);
    } catch (error) {
      res.send(""+error);
    }
    
  },
  conceptTypes: async function (req, res) {
    //Obtener tipos de comprobantes disponibles
    try {
      let cuit = req.params.cuit;
    let afip = new Afip({ CUIT:cuit,ta_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit,res_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit});
    const respuesta = await afip.ElectronicBilling.getConceptTypes();
    res.send(respuesta);
    } catch (error) {
      res.send(""+error);
    }
    
  },
  documentTypes: async function (req, res) {
    //Obtener tipos de documentos disponibles
    try {
      let cuit = req.params.cuit;
    let afip = new Afip({ CUIT:cuit,ta_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit,res_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit});
    const respuesta = await afip.ElectronicBilling.getDocumentTypes();
    res.send(respuesta);
    } catch (error) {
      res.send(""+error);
    }
    
  },
  aloquotTypes: async function (req, res) {
    //Obtener tipos de alícuotas disponibles
    try {
      let cuit = req.params.cuit;
    let afip = new Afip({ CUIT:cuit,ta_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit,res_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit});
    const respuesta = await afip.ElectronicBilling.getAliquotTypes();
    res.send(respuesta);
    } catch (error) {
      res.send(""+error);
    }
    
  },
  currenciesTypes: async function (req, res) {
    //Obtener tipos de monedas disponibles
    try {
      let cuit = req.params.cuit;
    let afip = new Afip({ CUIT:cuit,ta_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit,res_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit});
    const respuesta = await afip.ElectronicBilling.getCurrenciesTypes();
    res.send(respuesta);
    } catch (error) {
      res.send(""+error);
    }
    
  },
  optionTypes: async function (req, res) {
    //Obtener tipos de opciones disponibles para el comprobante
    try {
      let cuit = req.params.cuit;
      let afip = new Afip({ CUIT:cuit,ta_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit,res_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit});
      const respuesta = await afip.ElectronicBilling.getOptionsTypes();
    res.send(respuesta);
    } catch (error) {
      res.send(""+error);
    }
    
  },
  taxTypes: async function (req, res) {
    //Obtener tipos de tributos disponibles
    let cuit = req.params.cuit;
    try{
      let dir ="node_modules\@afipsdk\afip.js\src\Afip_res/";
      let afip = new Afip({ CUIT:cuit,ta_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit,res_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit});
    const respuesta = await afip.ElectronicBilling.getTaxTypes();
    res.send(respuesta);
    }catch(err){
      res.send(""+err);
    }
    

    
  },
  getServerStatus: async function (req, res) {
    //Obtener estado del servidor
    try {
      let cuit = req.params.cuit;
    let afip = new Afip({ CUIT:cuit,ta_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit,res_folder:'node_modules/@afipsdk/afip.js/src/Afip_res/'+cuit});
    const respuesta = await afip.ElectronicBilling.getServerStatus();
    res.send(respuesta);
    } catch (error) {
      res.send(""+error)
    }
    
  },
};

//funcion usada para leer un archivo Json
function jsonReader(filePath,callback){
  fs.readFile(filePath,'utf-8',(err,fileData)=>{
    if(err){
      return callback && callback(err);
    }
    try {
      const object = JSON.parse(fileData);
      return callback && callback(null,object)
    } catch (err) {
      return callback && callback(err)
    }
  })
}