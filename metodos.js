var funcion = require("./funtions.js");
var dialog = require("./interacciones.js");
const {
    Card,
    Image
} = require('dialogflow-fulfillment');

async function Fun_DefauldAgent(agent, req, res) {
    let data_context = await ValidateDataUserContext(agent);
    if (data_context) {
        agent.context.set({
            name: '0-Bienvenida-followup',
            lifespan: 1
        });
        return agent.add(dialog.mensaje('defauld', funcion.conver_name(data_context.name)));
    } else {
        return Fun_WelcomeAgent(agent, req, res);
    }
}


async function Fun_SolicitarDatosAgent(agent, req, res) {
    try {
        const sessionId = req.body.session.split("/").reverse()[0];
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            var megg = null;
            if (data_context != null && data_context != "") {
                let sesion = await funcion.RegistrarSession(sessionId, data_context.cedula);
                if (sesion['ok'] == true && sesion['data']['name'] != null) {
                    console.log('sesion registrada en la bd')
                    agent.context.set({
                        name: 'data_user_context',
                        lifespan: 5,
                        parameters: {
                            cedula: sesion['data']['cedula'],
                            name: sesion['data']['name']
                        }
                    });
                    megg = dialog.mensaje('bienvenida_su', funcion.conver_name(sesion['data']['name'], 3));
                } else {
                    console.log('demoda')
                    agent.context.set({
                        name: 'data_user_context',
                        lifespan: 0
                    });
                    agent.context.set({
                        name: '0-Bienvenida-followup',
                        lifespan: 1
                    });
                    sesion['msg'] != null ? agent.add(sesion['msg']) : null;
                    return agent.add(dialog.mensaje('sol_cedula'));
                }
            }
            return Fun_WelcomeAgent(agent, req, res, megg);
        } else {
            return Fun_WelcomeAgent(agent, req, res);
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }
}

async function Fun_WelcomeAgent(agent, req, res, mensage = null) {
    try {
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            console.log('contexto existe........');
            // agent.add(dialog.mensaje('bienvenida', data_context.name != null ? funcion.conver_name(data_context.name) : data_context.cedula));
            agent.context.set({
                name: '0-Bienvenida-followup',
                lifespan: 1
            });
            var rem_mens = dialog.mensaje('menu_dirigido', funcion.conver_name(data_context.name));
            if(mensage != null){
                rem_mens = mensage;
            }
            return agent.add(rem_mens);
        } else {
            console.log('NO existe contexto.......');
            const sessionId = req.body.session.split("/").reverse()[0];
            let legion = await funcion.ValidarSession(sessionId);
            if (legion['ok'] == true && legion['data']['name'] != null) {
                console.log('sesion existe en la bd')
                agent.context.set({
                    name: '0-Bienvenida-followup',
                    lifespan: 1
                });
                agent.context.set({
                    name: 'data_user_context',
                    lifespan: 5,
                    parameters: {
                        cedula: legion['data']['cedula'],
                        name: legion['data']['name']
                    }
                });
                agent.add(dialog.mensaje('bienvenida', legion['data']['name'] != null ? funcion.conver_name(legion['data']['name']) : d_text.cedula));
                return agent.add(dialog.mensaje('menu_1'));
            } else {
                agent.context.set({
                    name: 'sol_datos_usuario',
                    lifespan: 1
                });
                return agent.add(dialog.mensaje('bienvenida')+'\n'+dialog.mensaje('sol_cedula'));
            }
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }
}


function ValidateDataUserContext(agent) {
    try {
        return new Promise((resolve, reject) => {
            try {
                var Contx = null;
                Contx = agent.context.get('data_user_context');
                if (Contx == null || Contx == NaN || Contx == undefined) {
                    Contx = ExistParamtContext(agent, 'data_user_context');
                }
                if (Contx != null && Contx != NaN && Contx != undefined) {
                    if (Contx.parameters.cedula != null && Contx.parameters.cedula != "") {
                        agent.context.set({
                            name: '0-Bienvenida-followup',
                            lifespan: 0
                        });
                        let _cedu = Contx.parameters.cedula;
                        let _nam = Contx.parameters.name;
                        agent.context.set({
                            name: 'data_user_context',
                            lifespan: 5,
                            parameters: {
                                cedula: _cedu,
                                name: _nam
                            }
                        });
                        resolve({
                            cedula: _cedu,
                            name: _nam
                        });
                    } else {
                        agent.context.set({
                            name: '0-Bienvenida-followup',
                            lifespan: 1
                        });
                        resolve(false);
                    }
                } else {
                    agent.context.set({
                        name: '0-Bienvenida-followup',
                        lifespan: 1
                    });
                    resolve(false);
                }
            } catch (error) {
                console.log(error);
                agent.context.set({
                    name: '0-Bienvenida-followup',
                    lifespan: 1
                });
                resolve(false);
            }
        });
    } catch (error) {
        return ResolveDefauld(agent);
    }
}

function ExistParamtContext(agent, pamameter) {
    var data = null;
    agent.contexts.forEach(element => {
        if (element.name == pamameter) {
            data = element;
        }
    });
    return data;
}

async function Fun_CerrarSesionAgent(agent, req, res, accion) {
    try {
        if (accion == 1) {
            console.log('cerrando sesion...');
            const sessionId = req.body.session.split("/").reverse()[0];
            let legion = await funcion.CerrarSession(sessionId);
            if (legion['ok'] == true) {
                agent.context.set({
                    name: '0-Bienvenida-followup',
                    lifespan: 1
                });
                agent.context.set({
                    name: 'sol_datos_usuario',
                    lifespan: 1
                });
                agent.context.set({
                    name: 'data_user_context',
                    lifespan: 0,
                    parameters: {}
                });
                return agent.add(dialog.mensaje('despedida'));
            } else {
                return agent.add(legion['msg']);
            }
        }
        if (accion == 0) {
            agent.context.set({
                name: '0-Bienvenida-followup',
                lifespan: 1
            });
            agent.add(dialog.mensaje('afirmacion'));
            return agent.add(dialog.mensaje('menu_1'));
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }

}

async function Fun_ConfirmarCerrarSesionAgent(agent, req, res) {
    let data_context = await ValidateDataUserContext(agent);
    if (data_context) {
        agent.context.set({
            name: '0-Bienvenida-Cerrarsesion-followup',
            lifespan: 1
        });
        return agent.add('¿Esta de acuerdo en cerrar la sesión? \n1. SI \n2. NO\n\n  -Ingrese el número de la opción que desee.');
    } else {
        return Fun_WelcomeAgent(agent, req, res);
    }
}

async function Func_InformacionTramites(agent, req, res, key_example) {
    try {
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            if (key_example == 0) {
                return Fun_ConsultarCCAtras(agent, req, res);
            }
            let legion = await funcion.OptInfoBot(key_example);
            console.log(legion);
            if (legion['ok'] == true) {
                var msger = '*' + legion['data']['data_key'] + '*\n\n';
                var example = legion['data']['data'];
                if (example.length == 0) {
                    return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
                }
                example.forEach(element => {
                    msger = msger + element + '\n';
                });
                agent.add(msger);
                return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));

            } else {
                agent.add(funcion.conver_name(data_context.name) + ', ' + legion['msg']);
                return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
            }
        } else {
            return Fun_WelcomeAgent(agent, req, res);
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }
}


//Consultar todos mis trámites solicitados en Portal ciudadano
async function Func_MisTramites(agent, req, res, key_example = null) {
    try {
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            if (key_example == 0) {
                return Fun_ConsultarCCAtras(agent, req, res);
            }
            let legion = await funcion.GetMisTramites(data_context.cedula);
            if (legion['ok'] == true) {
                var msger = '*Listado de trámites solicitados*\n\n';
                var example = legion['data'];
                if (example.length == 0) {
                    agent.add('Lo siento, no encontré ningún trámite solicitado a su nombre.');
                    return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
                }
                example.forEach((element, index) => {
                    msger = msger+'*#'+(index+1) +'* - ' + element['nombresolicitud']+
                    '\nFecha de solicitúd: '+element['fecha_solicitud'];

                    if(element['state_documento'] != null ){
                        msger = msger+'\nFecha de vencimiento: '+element['fecha_vencimiento']
                        +'\nEstado: '+element['state_documento'];
                    }else{
                        msger = msger+'\nEstado: '+element['estado'];
                        if(element['url2'] != null){
                            msger = msger+'\nFecha de vencimiento: '+element['fecha_vencimiento']+
                            '\nVer documento: '+element['url2'];
                        }
                    }
                    msger = msger +'\n\n'
                });
                agent.add(msger);
                agent.context.set({
                    name: '0-Bienvenida-MisTramites-followup',
                    lifespan: 1
                });
                return agent.add(dialog.mensaje('mis_cer92'));
            } else {
                agent.add(funcion.conver_name(data_context.name) + ', ' + legion['msg']);
                return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
            }
        } else {
            return Fun_WelcomeAgent(agent, req, res);
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }
}

//Mis tramites - Defauld
//Historial de mis traites
async function Func_HistorialTramite(agent, req, res, key_example = null) {
    try {
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            if(key_example == 2){
                return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
            }
            if(key_example == 1){
                agent.context.set({ name: '0-Bienvenida-MisTramites-followup', lifespan: 1 });
                return agent.add(dialog.mensaje('mis_cer92'));
            }
            var Contx = agent.context.get('tramite_cer_historial');
            if (Contx == null || Contx == NaN || Contx == undefined) {
                Contx = ExistParamtContext(agent, 'tramite_cer_historial');
            }
            if (Contx != null && Contx != NaN && Contx != undefined) {
                if (Contx.parameters.numero_tramite != null && Contx.parameters.numero_tramite != "") {
                    let legion = await funcion.GetHistorialTramites(data_context.cedula, Contx.parameters.numero_tramite);
                    if (legion['ok'] == true) {
                        var msger = '';
                        if(legion['tramite'] != undefined){
                            msger = msger + '*HISTORIAL - '+legion['tramite']+'*';
                            var example = legion['data'];4
                            if (example.length == 0) {
                                agent.add(msger +'\nLo siento, no encontré ningúna información del trámite solicitado.');
                                return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
                            }
                            example.forEach((element, index) => {
                                msger = msger+'\n\nFecha: '+element['registro']+
                                '\nEstado: '+ element['estado'];
                                if(element['observacion']){
                                    msger = msger+'\nObservación: '+element['observacion'];
                                }
                            });
                        }else{
                            agent.add(legion['msg']);
                            return Func_HistorialTramite(agent, req, res, 1);
                        }
                    }
                    agent.add(msger);
                    return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
                }
            }
            agent.context.set({ name: '0-Bienvenida-MisTramites-followup', lifespan: 1 });
            return agent.add(dialog.mensaje('mis_cer92'));
        } else {
            return Fun_WelcomeAgent(agent, req, res);
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }
}



async function Fun_QueHacesFunction(agent, req, res, vari = null) {
    try {
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            agent.context.set({
                name: '0-Bienvenida-followup',
                lifespan: 1
            });
            let legion = await funcion.ConsultaNoticias();
            if (legion['ok'] == true) {
                var szar = Math.floor(Math.random() * legion['data'].length);
                var mesge = dialog.mensaje('haceres_1', '*'+legion['data'][szar]['titulo']+'*\nQue tal si revisas un poco: 🧐🙃\n'+legion['data'][szar]['link_facebook']);
                if(vari == 1){
                    mesge = dialog.mensaje('haceres_2', funcion.conver_name(data_context.name), '*'+legion['data'][szar]['titulo']+'*\nQue tal si revisas un poco:🧐🙃\n'+legion['data'][szar]['link_facebook']);
                }
                return agent.add(mesge);
            }else{
                return ResolveDefauld(agent);
            }
        } else {
            return Fun_WelcomeAgent(agent, req, res);
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }
}

async function Fun_pruebas(agent, req, res) {

    return agent.add('hola como estras');
    try {
        return Fun_QueHacesFunction(agent, req, req, 1);
    } catch (error) {
        return ResolveDefauld(agent);
    }
}



async function Fun_ConsultarCCAtras(agent, req, res) {
    let data_context = await ValidateDataUserContext(agent);
    if (data_context) {
        agent.context.set({
            name: '0-Bienvenida-followup',
            lifespan: 1
        });
        return agent.add(dialog.mensaje('menu_1'));
    } else {
        return Fun_WelcomeAgent(agent, req, res);
    }
}


async function Fun_ConfirmarConsultarClavesCatastrales(agent, req, res) {
    let data_context = await ValidateDataUserContext(agent);
    if (data_context) {
        agent.context.set({
            name: '0-Bienvenida-Consultar-Predios-followup',
            lifespan: 1
        });
        return agent.add(dialog.mensaje('consulta_clave'));
    } else {
        return Fun_WelcomeAgent(agent, req, res);
    }
}


async function Fun_ConsultaPredios(agent, req, res) {
    let data_context = await ValidateDataUserContext(agent);
    if (data_context) {
        agent.context.set({
            name: 'nuevo_context',
            lifespan: 1
        });
        return agent.add(dialog.mensaje('consulta_clave'));
    } else {
        return Fun_WelcomeAgent(agent, req, res);
    }
}

async function Fun_RetornarAlinicio(agent, req, res, name) {
    agent.context.set({
        name: '0-Bienvenida-followup',
        lifespan: 1
    });
    agent.context.set({
        name: 'inicial_context',
        lifespan: 1
    });
    return agent.add(dialog.mensaje('retorno_inicio'));
}

async function Fun_ListarMenu(agent, req, res, inva = null) {
    try {
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            console.log(data_context);
            if(inva == 1){
                return agent.add(dialog.mensaje('despedida_alt', funcion.conver_name(data_context.name)));
            }
            agent.context.set({
                name: '0-Bienvenida-followup',
                lifespan: 1
            });
            return agent.add(dialog.mensaje('menu_1'));
        } else {
            return Fun_WelcomeAgent(agent, req, res);
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }
}

async function Fun_ConsultarOtrasClavesCatastrales(agent, req, res, tipo) {
    try {
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            if (tipo == 1) {
                return agent.add(dialog.mensaje('sol_data_cedula'));
            } else if (tipo == 2) {
                var Contx = agent.context.get('data_predios');
                if (Contx == null || Contx == NaN || Contx == undefined) {
                    Contx = ExistParamtContext(agent, 'data_predios');
                }
                if (Contx != null && Contx != NaN && Contx != undefined) {
                    if (Contx.parameters.cedula_otro != null && Contx.parameters.cedula_otro != "") {
                        return Fun_ConsultarClavesCatastrales(agent, req, res, Contx.parameters.cedula_otro);
                    }else{
                        return Fun_ConfirmarConsultarClavesCatastrales(agent, req, res);
                    }
                } else {
                    return Fun_ConfirmarConsultarClavesCatastrales(agent, req, res);
                }
            }else if(tipo == 3){
                return agent.add(dialog.mensaje('sol_data_clave_catastral'));
            }else if(tipo == 4){
                console.log('todo bien');
                var Contx = agent.context.get('data_clave');
                if (Contx == null || Contx == NaN || Contx == undefined) {
                    Contx = ExistParamtContext(agent, 'data_clave');
                }
                if (Contx != null && Contx != NaN && Contx != undefined) {
                    if (Contx.parameters.clave_catast != null && Contx.parameters.clave_catast != "") {
                        return Fun_ConsultarClavesCatastrales(agent, req, res, Contx.parameters.clave_catast, 1);
                    }else{
                        return Fun_ConfirmarConsultarClavesCatastrales(agent, req, res);
                    }
                } else {
                    return Fun_ConfirmarConsultarClavesCatastrales(agent, req, res);
                }
            }
        } else {
            return Fun_WelcomeAgent(agent, req, res);
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }
}


async function Fun_ValidarDocumentos(agent, req, res, tipo) {
    try {
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            if (tipo == 1) {
                return agent.add(dialog.mensaje('sol_data_codigo'));
            } else if (tipo == 2) {
                var Contx = agent.context.get('context_codigo_barras');
                if (Contx == null || Contx == NaN || Contx == undefined) {
                    Contx = ExistParamtContext(agent, 'context_codigo_barras');
                }
                if (Contx != null && Contx != NaN && Contx != undefined) {
                    if (Contx.parameters.codigo_barras != null && Contx.parameters.codigo_barras != "") {
                        let legion = await funcion.ValidarComprobante(Contx.parameters.codigo_barras.toUpperCase());
                        if (legion['ok'] == true) {
                            var send = '';
                            legion['data']['msg'].forEach((element, index) => {
                                send = send + element + '\n';
                            });
                            if (send != '') {
                                agent.add(send);
                            }
                            if (legion['data']['url2'][0] != undefined) {
                                agent.add('Ver documento:\n' + legion['data']['url2'][0]);
                            }
                            return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
                        } else {
                            agent.add(legion['msg']);
                            return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
                        }

                    }
                } else {
                    return Fun_ListarMenu(agent, req, res);
                }
            }
        } else {
            return Fun_WelcomeAgent(agent, req, res);
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }
}


function ResolveDefauld(agent) {
    agent.context.set({
        name: '0-Bienvenida-followup',
        lifespan: 1
    });
    return agent.add('No logre resolver su petición 😢 \n' +
        '¿Que tal si lo volvemos a intentar? \n' +
        dialog.mensaje('menu_hueso'));
}



function Func_FallbackComprobantes(agent, req, res) {
    agent.context.set({
        name: '0-Bienvenida-Miscomprobantesdepago-followup',
        lifespan: 1
    });
    return agent.add('Envíe el número de la opción que desee: \n\n1. Ver todos los comprobantes \n0. Volver al menu principal \n\n  -Ingrese el número de la opción que desee.');
}

function Func_FallbackInfoTramites(agent, req, res) {
    agent.context.set({
        name: '0-Bienvenida-InfTram-followup',
        lifespan: 1
    });
    return agent.add(dialog.mensaje('info_tramites'));
}


async function Func_MisComprobantesPago(agent, req, res, lery) {
    try {
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            if (lery == 3) {
                return Fun_ConsultarCCAtras(agent, req, res);
            }
            if (data_context != null && data_context != "") {
                let legion = await funcion.ConsultaComprobantes(data_context.cedula, lery);
                console.log(legion);
                if (legion['ok'] == true) {
                    var msger = '';
                    let coun = legion['data'].length;
                    if (lery == 1 && coun > 1) {
                        msger = coun == 1 ? '*ÚLTIMOS COMPROBANTES DE PAGO:*\n\n' : '*ÚLTIMOS ' + coun + ' COMPROBANTES DE PAGO:*\n\n';
                    } else {
                        msger = '*TODOS LOS COMPROBANTES DE PAGO:*\n\n';
                    }
                    legion['data'].forEach((element, index) => {
                        msger = msger + '' + element['rubro'] + '\nFecha: ' + element['fecha'] + '\nValor págado: *' + element['valor_pagado'] + '*\nVer documento: ' + element['url'] + '\n\n';
                    });
                    agent.add(msger);
                    if (lery == 1) {
                        return Func_FallbackComprobantes(agent, req, res);
                    } else {
                        return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
                    }
                } else {
                    agent.add(funcion.conver_name(data_context.name) + ', ' + legion['msg']);
                    return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
                }
            }
        } else {
            return Fun_WelcomeAgent(agent, req, res);
        }
    } catch (error) {
        return ResolveDefauld(agent);
    }
}


async function Fun_ConsultarClavesCatastrales(agent, req, res, _cedula = null, nuevo = null) {
    try {
        let data_context = await ValidateDataUserContext(agent);
        if (data_context) {
            if (data_context != null && data_context != "") {
                if (_cedula == null) {
                    _cedula = data_context.cedula;
                }
                const regex = /^[0-9]*$/;
                _cedula = _cedula.replace(/-/g, "");
                if (regex.test(_cedula) ) {
                    console.log('legion')
                    let legion = await funcion.ConsultaClaves(_cedula, nuevo);
                    console.log(legion)
                    if (legion['ok'] == true) {
                        let coun = legion['data'].length;
                        legion['data'].forEach((element, index) => {
                            console.log(element);
                            var rec = element['valor']['boot']['anteriores'];
                            if (element['valor']['boot']['anteriores'] != 'Recaudación al día') {
                                rec = rec + '\n' + element['valor']['boot']['actual'] + '\n' + element['valor']['boot']['total']
                            }
                            if (index == (coun - 1)) { 
                                console.log("index 11")
                                agent.add(element['text'] + '\n' + element['direccion'] + '\n' + rec);
                                return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
                            } else {
                                console.log("index 12")
                                agent.add(element['text'] + '\n' + funcion.conver_capitalice(element['direccion']) + '\n' + rec);
                            }
                        });
                    } else {
                        agent.add(funcion.conver_name(data_context.name) + ', ' + legion['msg']);
                        return Fun_RetornarAlinicio(agent, req, res, funcion.conver_name(data_context.name));
                    }
                } else {
                    if(nuevo == 1){
                        agent.add('La clave catastral ingresada no es válida');
                    }else{
                        agent.add('El número de cédula ingresado no es válido');
                    }
                    return Fun_ConfirmarConsultarClavesCatastrales(agent, req, res);
                }
            }
        } else {
            return Fun_WelcomeAgent(agent, req, res);
        }
    } catch (error) {
        console.log("error");
        console.log(error);
        return ResolveDefauld(agent);
    }
}


module.exports = {
    "Fun_DefauldAgent": Fun_DefauldAgent,
    "Fun_SolicitarDatosAgent": Fun_SolicitarDatosAgent,
    "Fun_WelcomeAgent": Fun_WelcomeAgent,
    "Fun_CerrarSesionAgent": Fun_CerrarSesionAgent,
    "Fun_ConfirmarCerrarSesionAgent": Fun_ConfirmarCerrarSesionAgent,
    "Fun_ConfirmarConsultarClavesCatastrales": Fun_ConfirmarConsultarClavesCatastrales,
    "Fun_ConsultarOtrasClavesCatastrales": Fun_ConsultarOtrasClavesCatastrales,
    "Fun_ConsultaPredios": Fun_ConsultaPredios,
    "Fun_ConsultarCCAtras": Fun_ConsultarCCAtras,
    "Fun_ListarMenu": Fun_ListarMenu,
    "Fun_pruebas": Fun_pruebas,
    "Func_InformacionTramites": Func_InformacionTramites,
    "Fun_ValidarDocumentos": Fun_ValidarDocumentos,
    "Func_MisComprobantesPago": Func_MisComprobantesPago,
    "Func_FallbackComprobantes": Func_FallbackComprobantes,
    "Func_FallbackInfoTramites": Func_FallbackInfoTramites,
    "Fun_QueHacesFunction": Fun_QueHacesFunction,
    "Fun_ConsultarClavesCatastrales": Fun_ConsultarClavesCatastrales,
    "Func_HistorialTramite": Func_HistorialTramite,
    "Func_MisTramites": Func_MisTramites
}