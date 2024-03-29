'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
const whitelist = ['http://localhost:4200'];
app.use(cors({origin: whitelist})); //Todo el mundo.

//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');
//var api = user_routes.api;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); //convierte a json los datos que llegan desde http

//Configurar cabeceras http

app.use((req, res, next)=>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();

});

//rutas base

app.use('/api', user_routes); //middleware
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);
/**
app.get('/pruebas', function(req, res){
	res.status(200).send({message: 'Bienvenido a Alphea Studios'});

});**/

module.exports = app;