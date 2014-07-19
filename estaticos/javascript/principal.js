//Cambio!!!!git status

var socket = io.connect(location.origin);

socket.on("actualiza-contador",function(datosServidor){
	$("#contador").html(datosServidor.contadorUsuarios);
});

socket.on("mensaje-al-cliente",function(datosServidor){
	console.log("Usuario: "+datosServidor.usuario +" Hola!");
	
	var cajaNombre = "<span>" + datosServidor.usuario + " dice: </span>";
	var caja="<div class='mensaje'>" + cajaNombre + datosServidor.mensaje + "</div>";
	
	//append agrega el html al final del contenido de #mensajes
	$("#mensajes").append(caja);
});

//ESCUCHAMOS EL CLICK DEL BOTON DEL CHAT,
//TAREA CAMBIAR A DELEG. DE EVENTOS
$(document).on("click","#boton",function(){
	
	//VAL OBITENE EL TEXTO QUE HAYA ESCRITO EN EL INPUT
	var mensaje = $("#mensaje-usuario").val();
	var usuario = $("#nombre-usuario").val();
	//emit = genera un evento (primer argumento) que puede escuchar el servidor
	socket.emit("mensaje-al-servidor",{
		mensaje: mensaje,
		usuario: usuario
	});
});

//ME PERMITE ESCUCHAR CUANDO EL USUARIO ESTA USANDO
//LAS FLECHITAS HACIA ATRAS O HACIA ADELANTE
History.Adapter.bind(window, "statechange", function(){
	console.log("el usuario cambio url!!");
	
	//ESTE METOD REGRESA EL ESTADO(OBJETO) ASOCIADO
	//A LA URL QUE SE MUESTRA EN EL NAVEGADOR
	var estado = History.getState();
	var rutaAjax = estado.data.rutaAjax;
	
	$("#contenido-principal").load(rutaAjax);
});

//DELEGACION DE EVENTOS SUPER IMPORTANTE EN AJAX
$(document).on("click","#link-inicio",function(){
	
	History.pushState({
		rutaAjax:"/index-contenido"
	},"MIAU BRR MIAU","/");
	
	//$("#contenido-principal").load("/index-contenido");
	
	//ESTO ES MUY IMPORTANTE
	return false;
});

//TAREA CAMBIAR ESTE LINK A DELEGACION DE EVENTOS
$("#link-blog").click(function(){
	//history = es el nombre original del api del historial de HTML5
	//History= es la libreria history.min.js
	//3° argumento= URL que vamos a mostrar en el navegador
	History.pushState({
		rutaAjax:"/blog-contenido"
	},"El Bloguitos","/blog");

	//$("#contenido-principal").load("/blog-contenido");
	
	//ESTO ES MUY IMPORTANTE
	//PARA EVITAR QUE OCURRA EL COMPORTAMIENTO POR DEFAULT
	return false;
});

$("#link-contacto").click(function(){
	
	History.pushState({
		rutaAjax:"/contacto-contenido"
	},"Contacteishon","/contacto");


	//$("#contenido-principal").load("/contacto-contenido");
	
	//ESTO ES MUY IMPORTANTE
	return false;
});

$(document).on("click","#link-chat",function(){
	
	History.pushState({
		rutaAjax:"/chat-contenido"
	},"Chatsito","/chat");
	
	//$("#contenido-principal").load("/index-contenido");
	
	//ESTO ES MUY IMPORTANTE
	return false;
});

//DELEGACION DE EVENTOS
$(document).on("submit","#contactar-forma",function(){
	var datos = $("#contactar-forma").serialize();
	
	//AJAX OCURRE DE MANERA ASINCRONA
	$.ajax({
		url:"/contactar",
		data:datos,
		type: "POST",
		//callbcack que se ejecuta cuando el servidor ya nos respondio
		success:function(datosDelServidor){
			alert(datosDelServidor);
			$("#respuesta-servidor").html(datosDelServidor);
		}
	});
	
	return false;
});
