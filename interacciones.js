
function mensaje(name, username = null, massager = null) {
    var jsom_interaciones = ['Es un placer poder ayudarle.....'];
    var menu_context  = "\n1. Consultar predios"+
                        "\n2. Validar documentos digitales"+
                        "\n3. Mis comprobantes de pago"+
                        "\n4. Mis trámites"+
                        "\n5. Información sobre trámites"+
                        "\n0. Cerrar sesión"+
                        "\n\n  -Ingrese el número de la opción que desee.";
    switch (name) {
        case 'sol_cedula':
            jsom_interaciones = [
                'Para brindarle un mejor servicio es necesario que ingrese su número de cédula o RUC 🤓',
                'Antes de continuar es necesario que ingrese su número de cédula o RUC 🤓',
                'Ayude con su número de cédula o RUC para poder continuar 🤓',
                'Necesito su número de cédula o RUC para brindarle un mejor servicio 🤓'
            ];
            break;
        case 'sol_data_cedula':
            jsom_interaciones = [
                'Por favor ingrese el número de cédula del propietario(a)',
                'Ayúdeme con el número de cédula del propietario(a)'
            ];
            break;
        case 'sol_data_clave_catastral':
            jsom_interaciones = [
                'Por favor ingrese con el número de la clave catastral',
                'Ayúdeme con la clave catastral del propietario(a).'
            ];
            break;
        case 'sol_data_codigo':
            jsom_interaciones = [
                'Por favor ingrese el código de barras del documento',
                'Ayúdeme con el número el código de barras del documento'
            ];
            break;
        case 'retorno_inicio':
            jsom_interaciones = [
                '¿Hay algo mas en lo que le pueda ayudar?\n'+menu_context,
                '¿Que mas puedo hacer por usted?\n'+menu_context,
                '¿Puedo ayudarle en algo mas?\n'+menu_context
            ];
            break;
        case 'recuerde':
            jsom_interaciones = [
                'Recuerde que puedo ayudarle en cosas como:',
                'En que puedo ayudarle ahora:',
                'Que tal si empezamos con:',
                'Puedo ofrecerle lo siguiente:'
            ];
            break;
        case 'bienvenida':
            if(username){
                jsom_interaciones =  [
                    'Hola '+username,
                    'Hola '+username+', soy MantaBot su asistente virtual 👋🥰',
                    'Qué tal '+username+' 🙂',
                    mostrarSaludo()+' '+username+' 🙂',
                    'Hola '+username+',  soy MantaBot 😎',
                    mostrarSaludo()+ ' soy MantaBot 😎',
                    '¿Qué tal? '+username+' 😎'
                ];
            }else{
                jsom_interaciones =  [
                    'Soy MantaBot su asistente virtual 🤖',
                    mostrarSaludo()+', soy MantaBot su asistente virtual 🤖',
                    'Hola soy MantaBot, su asistente virtual 🤖',
                    '¿Qué tal? soy MantaBot su asistente virtual 🤖'
                ];
            }
            break;
        case 'menu_1':
            jsom_interaciones = [
                'Hola, le invito a conocer nuestro *menú de opciones:*' + menu_context
            ];
            break;
        case 'menu_dirigido':
            jsom_interaciones = [
                'Hola '+username+', que tal si revisamos el *menú de opciones:*' + menu_context
            ];
            break;
        case 'menu_hueso':
            jsom_interaciones = [menu_context];
            break;
        case 'consulta_clave':
            var menu = "\n1. Consultar mis predios \n2. Consultar por número de cédula  \n3. Consultar por clave catastral  \n0. Atras";
            jsom_interaciones = [
                '¿Que acción desea realizar?\n' + menu + "\n\n  -Ingrese el número de la opción que desee.",
            ];
            break;
        case 'info_tramites':
            var menu = "1. Certificado de solvencia \n2. Certificado de no poseer bienes \n0. Ir al menú anterior";
            jsom_interaciones = [
                'Envíe el número de la opción que desee:\n\n' + menu +"\n\n  -Ingrese el número de la opción que desee.",
            ];
            break;
        case 'defauld':
            var username = username != null ? username : '';
            jsom_interaciones = [
                'Disculpa '+username+' no logré entender su pregunta😔 \nAún estoy aprendiendo🎓📚🤓\n\nQue tal si revisamos el *menú de opciones:*' + menu_context,
                'Lo siento '+username+' 💔 no comprendí su pregunta \nAún estoy aprendiendo🎓📚🤓\n\nQue tal si revisamos el *menú de opciones:*' + menu_context,
                'Mil disculpas '+username+' 😓 no logre deducir su pregunta \nAún estoy aprendiendo 🎓📚🤓\n\nLe mostrare el *menú de opciones:*' + menu_context,
                username+' aprendo cada día mas 🎓📚🤓 pero no logre entender su pregunta 😓\n\nLe mostrare el *menú de opciones:*' + menu_context,
            ];
            break;
        case 'afirmacion':
            jsom_interaciones = [
                'De acuerdo...👍',
                'Excelente...💪',
                'Muy bien...🙂',
                'Perfecto...👌',
            ];
            break;
        case 'bienvenida_su':
            jsom_interaciones = [
                mostrarSaludo()+' '+username+
                ', bienvenido(a) a los servicios de asistencia virtual del GAD MANTA 🏣\n'+
                'Soy *MANTABOT*🤖 y seré su asitente virtual.\n\n'+
                'Antes de empezar le invito a descargar nuestra aplicación movil oficial *MANTAPP* dando clic en:\nhttps://portalciudadano.manta.gob.ec/c?mantapp'+
                '\n\nA continuación, le presento nuestro *menú de opciones:*'+menu_context
            ];
            break;
        case 'despedida':
            jsom_interaciones = [
                'Esta bíen que tenga '+mostrarSaludo(1)+', espero vuelva pronto...👋\n'+
                'Si desea volver a iniciar sesión por favor ingrese su número'+
                ' de cédula o RUC 🤓'
            ];
            break;
        case 'despedida_alt':
            jsom_interaciones = [
                'Esta bíen '+username+', fue un placer ayudarle. 😬👏\nQue tenga '+mostrarSaludo(1)+'. 😇',
                'Esta bíen '+username+', es un gusto poder ayudarle, 😬👏 por favor vuelva pronto 👋😇',
                'Okey '+username+', estoy para ayudarle. 😬👏\nQue tenga '+mostrarSaludo(1)+'. 😇',
            ];
            break;
        case 'haceres_1':
            jsom_interaciones = [
                'Estaba revisando Facebook y adivina?📱🤭😬 \n\n'+
                'Me pareció muy interesante una publicación de Municipio de Manta titulada:\n'+username
            ];
            break;
        case 'haceres_2':
            var cont = 'revisando Facebook y adivina?📱🤭😬 \n\n'+
            'Me pareció muy interesante una publicación de Municipio de Manta titulada:\n'+massager;
            jsom_interaciones = [
                'Estoy super bien ' + username + ', gracias por preguntar.\nJusto ahora estaba '+cont,
                username + ' estoy de maravilla, gracias por preguntar.\nPrecisamente ahora estaba '+cont,
                username + ' es '+mostrarSaludo(1)+' asi que estoy super feliz, gracias por preguntar.\nHace un rato estaba '+cont,
            ];
        case 'mis_cer92':
            jsom_interaciones = [' - Ingrese el #número indicado al inicio del nombre del trámite \n- Ingrese 0 para volver al menú principal'];
            break;

    }
    return jsom_interaciones[Math.floor(Math.random() * jsom_interaciones.length)]
}

function mostrarSaludo(vari = null){
    fecha = new Date(); 
    hora = fecha.getHours();
    if(hora >= 0 && hora < 12){
      texto = "Buenos días";
      if(vari == 1){
        texto = 'un buen día';
      }
      if(vari == 2){
        texto = 'día';
      }
    }
    if(hora >= 12 && hora < 18){
      texto = "Buenas tardes";
      if(vari == 1){
        texto = 'una buena tarde';
      }
      if(vari == 2){
        texto = 'tarde';
      }
    }
    if(hora >= 18 && hora < 24){
      texto = "Buenas noches";
      if(vari == 1){
        texto = 'una buena noche';
      }
      if(vari == 2){
        texto = 'noche';
      }
    }
    return texto;
  }





module.exports = {
    "mensaje": mensaje
}

