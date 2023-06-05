'use strict'
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');  //Para trabajar con el sistema de archivos
var path = require('path'); //Para trabajar con los path

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
function loginUser(req, res){
	var params = req.body;
	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
			if (err){
				res.status(500).send({message: 'Error en la petición'});
			}else{
				if(!user){
					res.status(404).send({message: 'El usuario no existe'});
				}else{
					//Comprobar la contraseña
					bcrypt.compare(password, user.password, function(err, check){
						if(check){
							//Devolver los datos del usuario logueado
							if(params.gethash){
								//Devolver un token de jwt
								res.status(200).send({
									token: jwt.createToken(user)
								});

							}else{
								res.status(200).send({user});
							}
						}else{
							//devolver 404
							res.status(404).send({message: 'El usuario no ha podido loguearse'});
						}
					});
				}
			}
		
	})
}

function updateUser(req, res)
{
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});

}

function splitLast(conjunto, splitChar){
	var splitted = conjunto.split(splitChar);
	return splitted[splitted.length - 1];
}

function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';


	if(req.files){ //Files es una variable superglobal
		var file_path = req.files.image.path;
		var file_name = splitLast(file_path, '\\');
		var file_ext = splitLast(file_name, '\.');

		//console.log(file_name);
		//console.log(file_ext);
		
		var conjunto_ext = ['png', 'jpg', 'jpeg', 'gif'];

		if(conjunto_ext.indexOf(file_ext) >= 0) //Si la extensión es válida
		{
			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({image: file_name, user: userUpdated});
					//console.log('Usuario actualizado');
				}
			});
		}else
		{
			res.status(200).send({message: 'Extensión del archivo no válida'});
		}

	}else{
		res.status(200).send({message: 'No has subido ninguna imagen'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/users/' + imageFile;

	fs.exists(pathFile, function(exists){
		if(exists)
		{
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};