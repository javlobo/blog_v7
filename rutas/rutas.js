/*DEFINIR UN MODULO*/
var modelos = require("../modulos/modulos.js");

module.exports.CONSTANTE1 = "valor1";

module.exports.configurar = function(app) {
	//-------DEFINIMOS MIDDLEWARE PARA VALIDAR SESION------------
	function validarSesion(request,response,next){
		
		//CHECAMOS SI LA PROPIEDAD usuarioLogueado
		//EXISTE EN LA SESION ASOCIADA A ESTE USUARIO
		if(typeof request.session.usuarioLogueado ==="undefined"){
			response.redirect("/login");
		}else{
			//si el usuario ya se logueo, lo dejamos pasar
			next();
		}
	};
	
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
	
	//==================LOGICA DE LOGIN DE USUARIO============
	
	app.get("/login",function(request,response){
		response.render("login.html");
	});
	
	app.get("/logout",function(request,response){
		request.session.destroy();
		response.send("HAS CERRADO LA SESION");
	});
	
	app.post("/autentificar",function(request,response){
		var email=request.body.email;
		var password= request.body.password;
		
		//Buscamos usando el email y el password que nos pasaron
		modelos.Usuario.find({
			where:{
				email:email,
				password:password
			}
		}).success(function(usuarioEncontrado){
			
			//SI EL USUARIO NO EXISTE
			if(usuarioEncontrado === null){
				response.render("login.html",{
					error:true
				});
			}else{
				//SI EXISTE
				request.session.usuarioLogueado={
					email:usuarioEncontrado.email,
					id:usuarioEncontrado.id
				};
				response.render("login-correcto.html");
			}
		});
	});
	
	//Agregamos middleware de validar sesion
	app.get("/blog/:articuloId([0-9]+)/editar", validarSesion, function(request, response) {
		var articuloId = request.params.articuloId;
		modelos.Articulo.find({
			where : {
				id : articuloId
			}
		}).success(function(articulo) {
			response.render("editar-articulo.html", {
				articulo : articulo,
				//esta bandera viene si el usuario actualizo algun articulo
				datosActualizados:request.query.datosActualizados
			});
		});
	});
	
	app.get("/blog/crear",function(request,response){
		response.render("editar-articulo.html");
	});

	app.post("/blog/guardar",validarSesion, function(request,response){
		var articuloId= parseInt(request.body.id);
		
		//si no nos pasaron un id de un articulo
		//significa que vamos a crear uno nuevo
		if(isNaN(articuloId)){
			modelos.Articulo.create({
				titulo:request.body.titulo,
				contenido:request.body.contenido,
				fecha_creacion:new Date(),
				usuario_id:request.session.usuarioLogueado.id
			}).success(function(articuloNuevo){
				response.redirect("/blog/"+ articuloNuevo.id+"/editar?datosActualizados=true");
			});
			
		}else{
			//si nos pasan un id, significa que vamos actualizar
			modelos.Articulo.find(articuloId).success(function(articulo){
			articulo.titulo=request.body.titulo;
			articulo.contenido=request.body.contenido;
			
			articulo.save().success(function(){
				//Aqui ya se actualizó una entidad
				//USAMOS EL PATRON POST REDIRECT GET
				//lo redirigimos a /blog/numero/editar
				response.redirect("/blog/"+articulo.id+"/editar?datosActualizados=true");	
			});
		});
		}
		//Buscamos el articulo que queremos actualizar
	});

};
