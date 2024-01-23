var funcion = require("./funtions.js");
var metodos = require("./metodos.js");
const express = require("express");
const app = express();
const { WebhookClient } = require("dialogflow-fulfillment");

app.get("/", function (req, res) {
  res.send("Servicio de <b>DialogFlow MANTABOT</b> activo...... ❤️🧡💛💚💜🖤🙈 ");
});

app.post("/webhook", express.json(), function (req, res) {
  const agent = new WebhookClient({ request: req, response: res });

  // console.log("Dialogflow Request headers: " + JSON.stringify(req));
  // console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
  // console.log("Dialogflow Request body: " + JSON.stringify(req.body));
  // console.log("Dialogflow Request body: " + JSON.stringify(agent));


  /*****  Contexto de inicio  *****/
  function DefauldAgent(){
    return metodos.Fun_DefauldAgent(agent, req, res); 
  }
  function WelcomeAgent(){
    return metodos.Fun_WelcomeAgent(agent, req, res); 
  }
  function SolicitarDatosAgent(){
    return metodos.Fun_SolicitarDatosAgent(agent, req, res);
  }
  function ListarMenu(){
    return metodos.Fun_ListarMenu(agent, req, res);
  }
  function FuncGracias(){
    return metodos.Fun_ListarMenu(agent, req, res, 1);
  }
  function QueHacesFunction(){
    return metodos.Fun_QueHacesFunction(agent, req, res);
  }
  function ComoEstasFunction(){
    return metodos.Fun_QueHacesFunction(agent, req, res,1);
  }
  
  /***** Cerrar session  *****/
  function SiCerrarSesionAgent(){
    return metodos.Fun_CerrarSesionAgent(agent, req, res, 1);
  }
  function NoCerrarSesionAgent(){
    return metodos.Fun_CerrarSesionAgent(agent, req, res, 0);
  }
  function ConfirmarCerrarSesionAgent(){
    return metodos.Fun_ConfirmarCerrarSesionAgent(agent, req, res);
  }

  /*****  Consultar Claves Catastrales    *****/
  function ConfirmarConsultarClavesCatastrales(){
    return metodos.Fun_ConfirmarConsultarClavesCatastrales(agent, req, res);
  }
  function ConsultarClavesCatastrales(){
    return metodos.Fun_ConsultarClavesCatastrales(agent, req, res);
  }
  function ConsultarOtrasClavesCatastrales(){
    return metodos.Fun_ConsultarOtrasClavesCatastrales(agent, req, res, 1);
  }
  function ConsultarPorClavesCatastrales(){
    return metodos.Fun_ConsultarOtrasClavesCatastrales(agent, req, res, 3);
  }
  function ConsultarPorClavesCatastrales2(){
    return metodos.Fun_ConsultarOtrasClavesCatastrales(agent, req, res, 4);
  }
  function ConsultarOtrasClavesCatastrales2(){
    return metodos.Fun_ConsultarOtrasClavesCatastrales(agent, req, res, 2);
  }
  function ConsultarCCAtras(){
    return metodos.Fun_ConsultarCCAtras(agent, req, res);
  }

  /*****  Prueba  *****/
  function prueba(){
    return metodos.Fun_pruebas(agent, req, res);
  }
  
  /*****  Validar documentos  *****/
  function ValidarDocumentos(){
    return metodos.Fun_ValidarDocumentos(agent, req, res, 1);
  }
  function ValidarCodigobarras(){
    return metodos.Fun_ValidarDocumentos(agent, req, res, 2);
  }

  /*****  Mis comprobantes  *****/
  function MisComprobantesPago(){
    return metodos.Func_MisComprobantesPago(agent, req, res, 1);
  }
  function TodosMisComprobantesPago(){
    return metodos.Func_MisComprobantesPago(agent, req, res, 2);
  }
  function InicioMisComprobantesPago(){
    return metodos.Func_MisComprobantesPago(agent, req, res, 3);
  }
  function FallbackComprobantes(){
    return metodos.Func_FallbackComprobantes(agent, req, res);
  }


  //*******Mis tramites *******/
  function MistramitesFallback(){
    return metodos.Func_HistorialTramite(agent, req, res, 1);
  }
  function MistramitesPrevious(){
    return metodos.Func_HistorialTramite(agent, req, res, 2);
  }
  function Mistramites(){
    return metodos.Func_MisTramites(agent, req, res);
  }
  function HistorialTramite(){
    return metodos.Func_HistorialTramite(agent, req, res);
  }

  /*****  Info Tramites *****/
  let tramer = ['Certificado_de_solvencia', 'Certificado_de_no_posees_bienes'];
  function FallbackInfoTramites(){
    return metodos.Func_FallbackInfoTramites(agent, req, res);
  }
  function AtrasInfoTramites(){
    return metodos.Func_InformacionTramites(agent, req, res, 0);
  }
  function InformacionTramitesSolv(){
    return metodos.Func_InformacionTramites(agent, req, res, tramer[0]);
  }
  function InformacionTramitesNoBienes(){
    return metodos.Func_InformacionTramites(agent, req, res, tramer[1]);
  }
  
  
  let intentMap = new Map();

  /***** Menu 1 - principal *****/
  intentMap.set('0 - Solicitar datos', SolicitarDatosAgent);
  intentMap.set('0 - Bienvenida', WelcomeAgent);
  intentMap.set('Default Fallback Intent', DefauldAgent);
  intentMap.set('0 - SI', ListarMenu);
  intentMap.set('0 - No', FuncGracias);
  intentMap.set('Contexto 1 - Que hacer', ListarMenu);
  intentMap.set('Contexto 1 - Que haces', QueHacesFunction);
  intentMap.set('Contexto 1 - Como estas', ComoEstasFunction);

  /***** Menu 1 - Claves catastrales *****/
  intentMap.set('0 - Bienvenida - Consultar-Predios', ConfirmarConsultarClavesCatastrales);
  intentMap.set('0 - Bienvenida - Consultar-Predios - Mis predios', ConsultarClavesCatastrales);
  intentMap.set('0 - Bienvenida - Consultar-Predios - Por catastral', ConsultarPorClavesCatastrales);
  intentMap.set('0 - Bienvenida - Consultar-Predios - Por catastral - Clavecatstral', ConsultarPorClavesCatastrales2);
  intentMap.set('0 - Bienvenida - Consultar-Predios - Otros Predios', ConsultarOtrasClavesCatastrales);
  intentMap.set('0 - Bienvenida - Consultar-Predios - Otros Predios - Cedula', ConsultarOtrasClavesCatastrales2);
  intentMap.set('0 - Bienvenida - Consultar-Predios - Atras', ConsultarCCAtras);
  intentMap.set('0 - Bienvenida - Consultar-Predios - fallback', ConfirmarConsultarClavesCatastrales);
  
  /***** Menu 1 - Cerrar sesion *****/
  intentMap.set('0 - Bienvenida - Cerrar sesion', ConfirmarCerrarSesionAgent);
  intentMap.set('0 - Bienvenida - Cerrar sesion - SI', SiCerrarSesionAgent);
  intentMap.set('0 - Bienvenida - Cerrar sesion - NO', NoCerrarSesionAgent);
  intentMap.set('0 - Bienvenida - Cerrar sesion - fallback', ConfirmarCerrarSesionAgent);
  
  /***** Menu 1 - Validar Documentos *****/
  intentMap.set('0 - Bienvenida - Validar Documentos', ValidarDocumentos);
  intentMap.set('0 - Bienvenida - Validar Documentos - codigo', ValidarCodigobarras);
  
  /***** Menu 1 - Mis comprobantes *****/
  intentMap.set('0 - Bienvenida - Mis comprobantes de pago', MisComprobantesPago);
  intentMap.set('0 - Bienvenida - Ver todos los comprobantes', TodosMisComprobantesPago);
  intentMap.set('0 - Bienvenida - Mis comprobantes de pago - Menu Principal', InicioMisComprobantesPago);
  intentMap.set('0 - Bienvenida - Mis comprobantes de pago - fallback', FallbackComprobantes);
  
  
  //******** Menu 1 - Mis tramites **************/
  intentMap.set('0 - Bienvenida - Mis Tramites', Mistramites);
  intentMap.set('0 - Bienvenida - Mis Tramites - Historial', HistorialTramite);
  intentMap.set('0 - Bienvenida - Mis Tramites - fallback', MistramitesFallback);
  intentMap.set('0 - Bienvenida - Mis Tramites - previous', MistramitesPrevious);

  
  /***** Menu 1 - Informacion de tramites *****/
  intentMap.set('0 - Bienvenida - Inf Tram - fallback', FallbackInfoTramites);
  intentMap.set('0 - Bienvenida - Inf Tram - Menu Principal', AtrasInfoTramites);
  intentMap.set('0 - Bienvenida - Inf Tram', FallbackInfoTramites);
  intentMap.set('0 - Bienvenida - Inf Tram - Solvencia', InformacionTramitesSolv);
  intentMap.set('0 - Bienvenida - Inf Tram - NoBienes', InformacionTramitesNoBienes);

  /************ PRUEBAS ************/
  intentMap.set('prueba', prueba);

  agent.handleRequest(intentMap);
});



let port = 3000;
app.listen(port, () => {
  console.log("Estamos ejecutando el servidor en el puerto " + port);
});