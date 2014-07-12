var Sequelize= require("sequelize");

//DEFINIMOS LA CONFIGURACION DE LA BASE
//NOMBRE DB, USER, PASS
var sequelize= new Sequelize("database","usuario","password",{
	dialect:"sqlite", //mariadb,mysql,postgres
	//ESTE PARAMETRO ES SOLO PARA SQLITE
	storage:__dirname + "/database.db",
	port:3306,//este puerto sirve tambien para mysql, para postgres 5432
	define:{
		timestamps:false,
		freezeTableName:true
	}
});

//COMO SE HACE EN TODOS LOS LENGUAJES
//    var archivoFinal= obtenerArchivo("ruta");

//EN NODE JS SE HACE:
//		LA SIGUIENTE LINEA SE EJECUTA DE MANERA ASINCRONA
//	fs.obtenerArchivo(function(){});
//      COMO LA CONSULTA DE ARCHIVOS ES ASINCRONA
//   			-PUEDO CONTROLARLO CON CALLBACKS
// 				-O CON PROMESAS


module.exports.configurar = function(callback) {
	//AQUI REALMENTE NOS CONECTAMOS
//CUANDO INVOCAN authenticate (SE EJECUTA DE MANERA ASINCRONA) , ESTO NOS REGRESA UN OBJETO DE JAVASCRIPT
//ES UNA PROMESA
	sequelize.authenticate().complete(callback);
	console.log("MODULOS CONFIGURADOS");
};


//---------MAPEO DE TABLA A OBJETO-----------
var Articulo = sequelize.define("Articulo",{
	id:{
		//LE DECIMOS QUE ESTA COLUMNA ES LA LLAVE PRIMARIA DE LA TABLA
		primaryKey:true,
		type:Sequelize.INTEGER
	},
	titulo:Sequelize.TEXT,
	contenido:Sequelize.TEXT,
	fecha_creacion:Sequelize.DATE
},{
	tableName:"articulos"
});

var Usuario = sequelize.define("Usuario",{
	id:{
		//LE DECIMOS QUE ESTA COLUMNA ES LA LLAVE PRIMARIA DE LA TABLA
		primaryKey:true,
		type:Sequelize.INTEGER
	},
	nombre:Sequelize.TEXT,
	email:Sequelize.TEXT,
	password:Sequelize.TEXT
},{
	tableName:"usuarios"
});

var Categoria = sequelize.define("Categoria",{
	id:{
		//LE DECIMOS QUE ESTA COLUMNA ES LA LLAVE PRIMARIA DE LA TABLA
		primaryKey:true,
		type:Sequelize.INTEGER
	},
	nombre:Sequelize.TEXT
},{
	tableName:"categorias"
});

var Comentario = sequelize.define("Comentario",{
	id:{
		//LE DECIMOS QUE ESTA COLUMNA ES LA LLAVE PRIMARIA DE LA TABLA
		primaryKey:true,
		type:Sequelize.INTEGER
	},
	comentario:Sequelize.TEXT
},{
	tableName:"comentarios"
});

//========MAPEO 1 A N========
//NOTEN QUE USUARIO Y ARTICULO SON MODELOS DE SEQUELIZE
Usuario.hasMany(Articulo,{
	//foreignKey es la columna que me permite relacionar
	//cada articulo con su respectivo dueño (un usuario)
	foreignKey: "usuario_id",
	//as me permite acceder a los aticulos del usuario
	//haciendo usuario.articulos
	as:"articulos"
});

Articulo.hasMany(Comentario,{
	//foreignKey es la columna que me permite relacionar
	//cada articulo con su respectivo dueño (un usuario)
	foreignKey: "articulo_id",
	//as me permite acceder a los aticulos del usuario
	//haciendo usuario.articulos
	as:"comentarios"
});

//=======MAPEOS N-N==============

Articulo.hasMany(Categoria,{
	foreignKey:"articulo_id",
	as:"categorias",
	//ESTO ES SOLO PARA N-N
	through:"categorias_articulos"
});

Categoria.hasMany(Articulo,{
	foreignKey:"categoria_id",
	as:"articulos",
	//ESTO ES SOLO PARA N-N
	through:"categorias_articulos"
});

//HACEMOS VISIBLE EL MODELO ASOCIADO A LA TABLA
module.exports.Articulo = Articulo;
module.exports.Usuario = Usuario;
module.exports.Categoria = Categoria;
module.exports.Comentario = Comentario;