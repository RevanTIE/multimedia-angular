'use strict'
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una acción del controlador de usuarios del api rest con Node y Mongo' 
	});
}
function saveUser(req, res){
	var user = new User();

	var params = req.body; //Para recoger los datos que lleguen por post.
	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.rol = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password)
	{
		//Encriptar contraseña y guardar datos
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if (user.name && 
				user.surname && 
				user.email){
				//Guardar el usuario.
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el usuario'});
					}else{
						if(!userStored)
						{
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{
							res.status(200).send({user: userStored});
						}
					}
				});
			}else{
				res.status(200).send({message: 'Introduce todos los campos'});

			}
		});
	}else{
		res.status(500).send({message: 'Introduce la contraseña'});

	}

}

module.exports = {
	pruebas,
	saveUser

};