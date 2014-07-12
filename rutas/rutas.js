/*DEFINIR UN MODULO*/
var modelos = require("../modulos/modulos.js");

module.exports.CONSTANTE1 = "valor1";

module.exports.configurar = function(app) {
	//CUANDO ALGUIEN PONGA http://localhost:8081/
	function mostrarInicio(request, response, nombreVista) {
		response.render(nombreVista, {
			saludo : "SERVIDOR GATO LISTO",
			parametro2 : "otro valor"
		});
	};

	//blog?limite=10&offset=3
	function mostrarBlog(request, response, nombreVista) {
		
		//params = para rutas dinamicas
		//body= para datos que vienen en el post de una forma
		//query = para datos que vienen en el query string
		var criteriosBusqueda ={};
		var limite = request.query.limite;
		var offset = request.query.offset;
		
		if(typeof limite !== "undefined"){
			//si el query string limite trae datos
			//se lo pegamos al criterio de la busqueda
			criteriosBusqueda.limit = limite;
		}
		
		if(typeof offset !== "undefined"){
			//si el query string offset trae datos
			//se lo pegamos al criterio de la busqueda
			criteriosBusqueda.offset = offset;
		}
		
		//con el metodo modelos.Articulo.count().success trae el numero de records
		//que habría de crf5ry6tv y6y
		
		//response.send("bienvenido");
		//OBTENEMOS UN ARREGLO DE RESULTADOS
		modelos.Articulo.findAll(criteriosBusqueda).success(function(articulos) {
			//CUANDO USAN FINDALL, EL METOD REGRESA UN ARREGLO DE JAVASCRIPT

			modelos.Categoria.findAll().success(function(categorias) {
				response.render(nombreVista, {
					blog : "Blog Listo",
					articulos : articulos,
					categorias : categorias
				});
			});
			//articulos=[];
		});

	};

	function mostrarContacto(request, response, nombreVista) {
		//response.send("bienvenido");
		response.render(nombreVista, {
			contacto : "Contacto list"
		});
	};

	function mostrarChat(request, response, nombreVista) {
		response.render(nombreVista, {
			chat : "Chat"
		});
	}


	app.get("/", function(request, response) {
		//response.send("bienvenido");
		mostrarInicio(request, response, "index.html");
	});

	app.get("/index-contenido", function(request, response) {
		//response.send("bienvenido");
		mostrarInicio(request, response, "index-contenido.html");
	});

	app.get("/contacto", function(request, response) {
		mostrarContacto(request, response, "contacto.html");
	});

	app.get("/contacto-contenido", function(request, response) {
		mostrarContacto(request, response, "contacto-contenido.html");
	});

	app.get("/blog", function(request, response) {
		mostrarBlog(request, response, "blog.html");
	});

	app.get("/blog-contenido", function(request, response) {
		mostrarBlog(request, response, "blog-contenido.html");
	});

	app.get("/chat", function(request, response) {
		mostrarChat(request, response, "chat.html");
	});

	app.get("/chat-contenido", function(request, response) {
		mostrarChat(request, response, "chat-contenido.html");
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

	// blog/1
	// blog/2
	app.get("/blog/:articuloId([0-9]+)", function(request, response) {
		var articuloId = request.params.articuloId;
		console.log("Buscando articulo ID:" + articuloId);
		//find RECIBE COMO ARGUMENTO EL ID A BUSCAR USANDO LA LLAVE PRIMARIA TABLA
		//==========LA CONSULTA SE HACE DE MANERA ASINCRONA========
		modelos.Articulo.find({
			where:{
				id:articuloId
			},
			include:[{
				model:modelos.Comentario,
				as:"comentarios"
			},
			//POR MEDIO DEL MAPEO N-N ACCEDO A LAS CATEGORIAS ASOCIADAS A UN ARTICULO EN PARTICULAR
			{
				model:modelos.Categoria,
				as:"categorias"
			}]
		}).success(function(articulo) {
			//AQUI PONEMOS EL CODIGO A EJECUTAR CUANDO YA HIZO LA CONSULTA EN LA BASE
			response.render("articulo.html", {
				articulo : articulo
			});
		});
	});

	app.get("/usuario/:usuarioId([0-9]+)", function(request, response) {
		var usuarioId = request.params.usuarioId;
		console.log("Buscando usuario ID:" + usuarioId);
		modelos.Usuario.find({
			where:{
				id:usuarioId
			},
			include:[{
				model:modelos.Articulo,
				as:"articulos"
			}]
		}).success(function(usuario) {
			
			//con lo anterior
			//usuario.articulos TIENEN UN ARREGLO DE OBJETOS QUE SON LOS ARTICULOS ASOCIADOS A ESE USUARIO
			
			response.render("usuario.html", {
				usuario : usuario
			});
		});
	});

};
