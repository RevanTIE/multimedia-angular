'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
//var api = user_routes.api;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); //convierte a json los datos que llegan desde http

//Configurar cabeceras http

//rutas base

app.use('/api', user_routes); //middleware
app.use('/api', artist_routes);
/**
app.get('/pruebas', function(req, res){
	res.status(200).send({message: 'Bienvenido a Alphea Studios'});

});**/

module.exports = app;