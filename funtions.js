const { error } = require('actions-on-google/dist/common');
const axios= require('axios');
const URLIC = 'https://sistemasic.manta.gob.ec/';
const URLPC = 'http://mantaentusmanos.test/';
// const URLPC = 'https://portalciudadano.manta.gob.ec/';
const { WebhookClient } = require("dialogflow-fulfillment");

function conver_base64(data) {
    return Buffer.from(data).toString('base64')
}

function conver_utf8(data) {
    return Buffer.from(data, 'base64').toString('ascii');
}

function conver_name(data, recep = null) {
    try {
        var porciones = data.split(' ');
        if(porciones.length >= 2 && porciones.length <= 4){
            var cadena = new String(data);
            var accion = Math.floor(Math.random() * (1 - 4)) + 4;
            console.log('publico'+recep);
            if(recep != null){ accion = recep; }
            if(accion == 1){
                cadena = porciones[(porciones.length -2)];
            }else if(accion == 2){
                cadena = porciones[(porciones.length -1)];
            }else{
                cadena = porciones[(porciones.length -2)]+ ' ' +porciones[(porciones.length -1)];
            }
            cadena = cadena.toLowerCase();
            return cadena.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        }else{
            var cadena = new String(data);
            cadena = cadena.toLowerCase();
            return cadena.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        }
    }catch (error) {
        return data;
    }
}

function conver_capitalice(data) {
    var cadena = new String(data);
    cadena = cadena.toLowerCase();
    return cadena.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}


function AxiosPOST(url, params){
    return new Promise((resolve, reject) => {
        axios.post(URLPC+url, params).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            resolve({'estado':false, 'data':[], 'msg':error});
        }).then(function () {
            resolve({'estado':false, 'data':[], 'msg':'Lo siento, no logre terminar de procesar la solicitúd'});
        });
    });
}
function AxiosGET(url, params, nweurl = null){
    if(nweurl == 'sistemasic'){
        url = URLIC + url;
    }else{
        url = URLPC + url;
    }
    return new Promise((resolve, reject) => {
        axios.get(url, params).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            resolve({'estado':false, 'data':[], 'msg':error});
        }).then(function () {
            resolve({'estado':false, 'data':[], 'msg':'Lo siento, no logre terminar de procesar la solicitúd'});
        });
    });
}

async function ValidarSession(session){
    return new Promise((resolve, reject) => {
        var array = {'ok': false, 'data':[], 'msg':null};
        AxiosPOST('apidf_ValidarSessionDialog', {'session_id':session}).then(function (result) {
            if(result['estado']){
                if(result['data']['session_id'] != undefined && result['data']['session_id'] != null){
                    array['ok'] = true; array['data'] = result['data'];  array['msg'] =  result['msg']; 
                }else{ array['msg'] = result['msg'] }
            }else{ array['msg'] = result['msg'] }
            resolve(array);
        }).catch(function (error) {
            array['msg'] = error;
            resolve(array);
        });
    });
}

async function CerrarSession(session){
    return new Promise((resolve, reject) => {
        var array = {'ok': false, 'data':[], 'msg':null};
        AxiosPOST('apidf_CerrarSessionDialog', {'session_id':session}).then(function (result) {
            if(result['estado']){
                array['ok'] = true; array['msg'] = result['msg']; 
            }else{ array['msg'] = result['msg'] }
            resolve(array);
        }).catch(function (error) {
            array['msg'] = error;
            resolve(array);
        });
    });
}

async function RegistrarSession(session_id, cedula){
    return new Promise((resolve, reject) => {
        var heders = {'cedula': cedula, 'name':cedula, 'session_id':session_id};
        var array = {'ok': false, 'data':[], 'msg':null};
        AxiosPOST('apidf_RegistrarSessionDialog', heders).then(function (result) {
            if(result['estado']){
                array['ok'] = true; array['data'] = result['data'];  array['msg'] =  result['msg']; 
            }else{ array['msg'] = result['msg'] }
            resolve(array);
        }).catch(function (error) {
            array['msg'] = error;
            resolve(array);
        });
    });
}


async function ValidarComprobante(codigo){
    return new Promise((resolve, reject) => {
        var heders = {'codigo': codigo};
        var array = {'ok': false, 'data':[], 'msg':null};
        AxiosPOST('ws_validar_cod_barras', heders).then(function (result) {
            let claves=Object.keys(result);
            claves.forEach(element => {
                if(element == 'api'){
                    if(result['api']['ok']){
                        array['ok'] = true; array['data'] = result['api'];  array['msg'] =  'Busquera exitosa'; 
                    }else{ array['msg'] = result['api']['msg'] != undefined ? result['api']['msg'] : ['Documento no encontrado'];}
                }else{
                    array['msg'] = ['Documento no encontrado'];
                }
            });
            resolve(array);
        }).catch(function (error) {
            array['msg'] = error;
            resolve(array);
        });
    });
}


async function ConsultaClaves(cedula, chang = null){
    return new Promise((resolve, reject) => {
        var array = {'ok': false, 'data':[], 'msg':null};
        var _ur = 'consulta_predios_detalle/2/'+cedula+'?boot=true';
        if(chang != null){
            var _ur = 'consulta_predios_detalle/1/'+cedula+'?boot=true&cc=1';
        }
        console.log(_ur);
        AxiosGET(_ur, {}).then(function (result) {
            if(result['ok'] && result['data_bot']['data'].length > 0){
                array['ok'] = true; array['data'] = result['data_bot']['data'];  array['msg'] =  'Consulta exitosa'; 
            }else{  
                array['msg'] =  'el número de cédula '+cedula+' no posee predios catastrales registrados en el GAD MANTA';
                if(chang != null){
                    array['msg'] =  'la clave catastral '+cedula+' no existe en los registros del GAD MANTA';
                }
            }
            resolve(array);
        }).catch(function (error) {
            array['msg'] = error;
            resolve(array);
        });
    });
}


async function ConsultaComprobantes(cedula, index){
    return new Promise((resolve, reject) => {
        var array = {'ok': false, 'data':[], 'msg':null};
        AxiosGET('portalciudadano/serviciosdigitales/mis_pagos?index='+index+'&cedula='+cedula+'&keypass=U2lzdGVtYXNJQ1NlcnZpY2VfbXJj', {}).then(function (result) {
            if(result['ok'] && result['data'].length > 0){
                array['ok'] = true; array['data'] = result['data'];  array['msg'] =  'Consulta exitosa'; 
            }else{  array['msg'] =  'No se encontró comprobantes de pago a su nombre'; }
            resolve(array);
        }).catch(function (error) {
            array['msg'] = error;
            resolve(array);
        });
    });
}


async function ConsultaNoticias(){
    return new Promise((resolve, reject) => {
        var array = {'ok': false, 'data':[], 'msg':null};
        AxiosGET('consultarPublicaciones?boot=c', {}, 'sistemasic').then(function (result) {
            console.log(result)
            if(result['data'].length > 0){
                array['ok'] = true; array['data'] = result['data'];  array['msg'] =  'Consulta exitosa'; 
            }else{  array['msg'] =  'No se encontró resultados'; }
            resolve(array);
        }).catch(function (error) {
            array['msg'] = error;
            resolve(array);
        });
    });
}


async function OptInfoBot(key_inf){
    return new Promise((resolve, reject) => {
        var heders = {'info_key': key_inf};
        var array = {'ok': false, 'data':[], 'msg':null};
        AxiosPOST('api/InfoBootService', heders).then(function (result) {
            if(result['ok']){
                array['ok'] = true; array['data'] = result['data'];  array['msg'] =  result['msg']; 
            }else{ array['msg'] = result['msg'] }
            resolve(array);
        }).catch(function (error) {
            array['msg'] = error;
            resolve(array);
        });
    });
}

//Consulta mis tramites solicitados
async function GetMisTramites(key_cedula){
    return new Promise((resolve, reject) => {
        var heders = {};
        var array = {'ok': false, 'data':[], 'msg':null};
        AxiosGET('tramites/web_api_consulta_tramite?tipo=1&code=true&valor='+key_cedula, heders).then(function (result) {
            if(result['estado']){
                array['ok'] = true; array['data'] = result['data'];  array['msg'] =  result['msg']; 
            }else{ array['msg'] = result['msg'] }
            resolve(array);
        }).catch(function (error) {
            array['msg'] = error;
            resolve(array);
        }).finally(function (find) {
            array['msg'] = 'Lo siento, no logre procesar su solicitúd';
            resolve(array);
        });
    });
}

//Consulta historial de tramites solicitados
async function GetHistorialTramites(key_cedula, index){
    return new Promise((resolve, reject) => {
        var heders = {};
        var array = {'ok': false, 'data':[], 'tramite':null, 'msg':null};
        AxiosGET('tramites/resolver_index_tramite?tipo=1&code=true&index='+index+'&valor='+key_cedula, heders).then(function (result) {
            if(result['estado']){
                array['ok'] = true; array['data'] = result['data'];  array['msg'] =  result['msg']; array['tramite'] =  result['tramite']; 
            }else{ array['msg'] = result['msg'] }
            resolve(array);
        }).catch(function (error) {
            array['msg'] = error;
            resolve(array);
        }).finally(function (find) {
            array['msg'] = 'Lo siento, no logre procesar su solicitúd';
            resolve(array);
        });
    });
}









module.exports = {
    "conver_base64": conver_base64,
    "conver_utf8": conver_utf8,
    "AxiosPOST": AxiosPOST,
    "RegistrarSession": RegistrarSession,
    "ValidarSession": ValidarSession,
    "conver_name": conver_name,
    "CerrarSession": CerrarSession,
    "conver_capitalice": conver_capitalice,
    "ValidarComprobante": ValidarComprobante,
    "ConsultaComprobantes": ConsultaComprobantes,
    "OptInfoBot": OptInfoBot,
    "ConsultaNoticias": ConsultaNoticias,
    "GetMisTramites": GetMisTramites,
    "GetHistorialTramites": GetHistorialTramites,
    "ConsultaClaves": ConsultaClaves
}