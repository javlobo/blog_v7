//IMPORTAMOS LA LIBRERIA DE EXPRESS
var express = require("express");
var nunjucks = require("nunjucks");
var serveIndex = require("serve-index");
var serveStatic = require("serve-static");
var socketIO= require("socket.io");
var sanitizer = require("sanitizer");

//---------LIBRERIA CORE DE NODE JS--------------
var http= require("http");

/*------IMPORTAMOS NUESTROS MODULOS-----------*/
var rutas = require("./rutas/rutas.js");
var modulos = require("./modulos/modulos.js");

console.log("constante 1 valor:" + rutas.CONSTANTE1);

//ESTO HABILITA EL PODER RECIBIR DATOS POR HTTP-POST
//EXPRESS 3 TAMBIEN TIENE EL BODY PARSER
//EN EXPRESS 3 NUNCA NUNCA USEN bodyPrser PORQUE SE INCLUYE EL MANEJO DE MULTI-TRACK
var bodyParser= require("body-parser");
//CREAMOS UN SERVIDOR WEB
var app = express();
//ESTO LO HACEMOS PARA PODER USAR WEBSOCKETS
var servidor= http.createServer(app);

//CONFIGURAMOS NUNJUCKS PARA TRABAJAR CON EXPRESS
//__dirname = RUTA ACTUAL EN LA QUE SE ENCUENTRA ESTE ARCHIVO
nunjucks.configure(__dirname + "/vistas", {
	express : app
});

//MUESTRA LOS RECURSOS DE LA CARPETA /estaticos
//PRIMER ARGUMENTO= NOMBRE LÓGICO (ALIAS)
//SEGUNDO ARGUMENTO =
app.use("/estaticos", serveStatic(__dirname + "/estaticos"));
app.use("/estaticos", serveIndex(__dirname + "/estaticos"));
app.use(bodyParser());

rutas.configurar(app);
modulos.configurar(function(){
	//CUANDO YA ESTA LISTA LA CONEXION,
	//ENTONCES AHORA SI, ESCUCHO PETICIONES DE LOS USUARIOS.
	servidor.listen(8081);
});

//HABILITA WEBSOCKETS EN EL SERVIDOR CON SOCKET.IO
//io= me permite escuchar y responder a mis clientes usando websockets
var io = socketIO.listen(servidor);


console.log("SERVIDOR WEB LISTO"); 

//------------INICIA CHAT--------------
// connection me permite escuchar cuando un cliente se conecta
//cuando un cliente se conecta, socket.io nos pasa un objeto en la función que
//representa al cliente.
var contadorUsuarios=0;
io.sockets.on("connection",function(socket){
	
	contadorUsuarios++;
	console.log("SE CONECTO UN CLIENTE");
	
	socket.emit("actualiza-contador",{
		contadorUsuarios:contadorUsuarios
	});
	//disconnect se produce cuando el cliente se desconecta
	//on = escuchar un evento
	socket.on("disconnect",function(){
		console.log("Se desconecto un cliente");
		contadorUsuarios--;
	});
	
	socket.on("mensaje-al-servidor",function(datosCliente){
		//LIMPIAMOS LOS  DATOS DE UN POSIBLE ATAQUE XSS
		var mensaje = sanitizer.escape(datosCliente.mensaje);
		var usuario= sanitizer.escape(datosCliente.usuario);
		
		//console.log("Usuario: " + datosCliente.usuario + ", Mensaje: " + datosCliente.mensaje);
		//REENVIAMOS DATOS A TODOS LOS CLIENTES
		io.sockets.emit("mensaje-al-cliente",{
			mensaje:mensaje,
			usuario:usuario
		});
	});
});
