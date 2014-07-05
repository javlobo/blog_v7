/*DEFINIR UN MODULO*/
module.exports.CONSTANTE1 = "valor1";

module.exports.configurar = function(app) {
	//CUANDO ALGUIEN PONGA http://localhost:8081/
	function mostrarInicio(request, response, nombreVista){
		response.render(nombreVista, {
			saludo : "SERVIDOR GATO LISTO",
			parametro2: "otro valor"
		});
	};
	
	function mostrarBlog(request,response,nombreVista){
		//response.send("bienvenido");
		//AQUI SUPUESTAMENTE YA CONSULTAMOS UNA BASE DE DATOS
		//OBTENEMOS UN ARREGLO DE RESULTADOS
		var articulos = [{
			id : 1,
			titulo : "Articulo 1",
			contenido : "Contenido 1"
		}, {
			id : 2,
			titulo : "Articulo 2",
			contenido : "Contenido 2"
		}, {
			id : 3,
			titulo : "Articulo 3",
			contenido : "Contenido 3"
		}];

		var categorias = [{
			nombre : "categoria 1"
		}, {
			nombre : "categoria 2"
		}, {
			nombre : "categoria 3"
		}];

		//articulos=[];
		response.render(nombreVista, {
			blog : "Blog Listo",
			articulos : articulos,
			categorias : categorias
		});
	};
	
	function mostrarContacto(request, response, nombreVista){
		//response.send("bienvenido");
		response.render(nombreVista, {
			contacto : "Contacto list"
		});
	};
	
	function mostrarChat(request,response,nombreVista){
		response.render(nombreVista, {
			chat : "Chat"
		});
	}
	
	app.get("/", function(request, response) {
		//response.send("bienvenido");
		mostrarInicio(request,response,"index.html");
	});
	
	app.get("/index-contenido", function(request, response) {
		//response.send("bienvenido");
		mostrarInicio(request,response,"index-contenido.html");
	});


    app.get("/contacto", function(request, response) {
		mostrarContacto(request,response,"contacto.html");
	});
	
	app.get("/contacto-contenido", function(request, response) {
		mostrarContacto(request,response,"contacto-contenido.html");
	});

	app.get("/blog", function(request, response) {
		mostrarBlog(request,response,"blog.html");
	});
	
	app.get("/blog-contenido", function(request, response) {
		mostrarBlog(request,response,"blog-contenido.html");
	});
	
	app.get("/chat", function(request, response) {
		mostrarChat(request,response,"chat.html");
	});
	
	app.get("/chat-contenido", function(request, response) {
		mostrarChat(request,response,"chat-contenido.html");
	});

	app.post("/suscribir", function(request, response) {
		//REQUEST = ES PARA RECIBIR DATOS DEL USUARIO
		//RESPONSE = ES PARA ENVIAR UNA RESPUESTA AL USUARIO
		var email = request.body.email;
		response.send("Se suscribio el email:" + email);
	});

	app.post("/contactar", function(request, response) {
		var nombre = request.body.nombre;
		var email = request.body.email;
		var website = request.body.website;
		var email = request.body.edad;
		var comentario = request.body.comentario;
		response.send("Nombre: " + nombre + ", E-mail: " + email + ", Website: " + website);
	});

};
