'user strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
//Se manda a llamar el modelo
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req,res){
	var songId = req.params.id;
	Song.findById(songId).populate({path: 'album'}).exec((err, song)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!song){
				res.status(404).send({message: 'La canción no existe'});
			}else{
				res.status(200).send({song});
			}
		}
	});

}

function getSongs(req, res){
	var albumId = req.params.album;
	//Sacar todas las canciones de la bd y si no, de un albúm en concreto, de la bd.
	var find = !albumId ? Song.find({}).sort('number') : Song.find({album: albumId}).sort('number');

	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec((err, songs)=>{
		if(err)
		{
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!songs){
				res.status(404).send({message: 'No hay canciones'});
			}else{
				return res.status(200).send({
					songs
				});
			}
		}
	});
}

function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) =>{
		if(err)
		{
			res.status(500).send({message: 'Error al guardar la canción'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'La canción no ha sido actualizada'});
			}else{
				return res.status(200).send({
					songs: songUpdated
				});
			}
		}
	});
}

function deleteSong(req, res){
	var songId = req.params.id;
	Song.findByIdAndRemove(songId, (err, songRemoved)=>{
		if(err){
			res.status(500).send({message: 'Error al eliminar la canción'});
		}else{
			if(!songRemoved){
				res.status(404).send({message: 'La canción no ha sido eliminada'});
			}else{
				res.status(200).send({
					song: songRemoved});
			}
		}
	});	
}

function saveSong(req, res){
	var song = new Song();

	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = 'null';
	song.album = params.album ?? 'null';

	song.save((err, songStored) =>{
		if(err){
			res.status(500).send({message: 'Error al guardar la canción'});
		}else{
			if(!songStored){
				res.status(404).send({message: 'La canción no ha sido guardada'});
			}else
			{
				res.status(200).send({song: songStored});
			}
		}
	});
}

function splitLast(conjunto, splitChar){
	var splitted = conjunto.split(splitChar);
	return splitted[splitted.length - 1];
}

function uploadSong(req, res){
	var songId = req.params.id;
	var file_name = 'No subido...';


	if(req.files){ //Files es una variable superglobal
		var file_path = req.files.file.path;
		var file_name = splitLast(file_path, '\\');
		var file_ext = splitLast(file_name, '\.');
		
		var conjunto_ext = ['mp3', 'ogg', 'aac', 'flac', 'alac', 'wav', 'aiff', 'dsd', 'pcm'];

		if(conjunto_ext.indexOf(file_ext) >= 0) //Si la extensión es válida
		{
			Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
				if(!songUpdated){
					res.status(404).send({message: 'No se ha podido actualizar la canción'});
				}else{
					res.status(200).send({song: songUpdated});
				}
			});
		}else
		{
			res.status(200).send({message: 'Extensión del archivo no válida'});
		}

	}else{
		res.status(200).send({message: 'No has subido ninguna canción'});
	}
}

function getSongFile(req, res){
	var songFile = req.params.songFile;
	var pathFile = './uploads/songs/' + songFile;

	fs.exists(pathFile, function(exists){
		if(exists)
		{
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message: 'No existe la canción...'});
		}
	});
}

module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadSong,
	getSongFile
};