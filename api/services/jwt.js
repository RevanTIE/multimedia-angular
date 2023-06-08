'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_uso';

exports.createToken = function(user){
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		rol: user.rol,
		image: user.image,
		iat: moment().unix(), //fecha de creación
		exp: moment().add(30, 'days').unix() //fecha de expiración
	};

	return jwt.encode(payload, secret);
};