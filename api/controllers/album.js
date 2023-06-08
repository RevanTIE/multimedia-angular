'user strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
//Se manda a llamar el modelo
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req,res){
	var albumId = req.params.id;
	Album.findById(albumId).populate({path: 'artist'}).exec((err, album)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!album){
				res.status(404).send({message: 'El album no existe'});
			}else{
				res.status(200).send({album});
			}
		}
	});

}

function getAlbums(req, res){
	var artistId = req.params.artist;
	//Sacar todos los albums de la bd y si no, de un artista en concreto, de la bd.
	var find = !artistId ? Album.find({}).sort('title') : Album.find({artist: artistId}).sort('year');

	find.populate({path: 'artist'}).exec((err, albums)=>{
		if(err)
		{
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!albums){
				res.status(404).send({message: 'No hay albums'});
			}else{
				return res.status(200).send({
					//total_items: total,
					albums
				});
			}
		}
	});
	/*
	var page = req.params.page ?? 1;
	var itemsPerPage = 3;
	Album.find().sort('name').paginate(page, itemsPerPage, function(err, albums, total){
	*/
}

function updateAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{
		if(err)
		{
			res.status(500).send({message: 'Error al guardar el album'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message: 'El album no ha sido actualizado'});
			}else{
				return res.status(200).send({
					albums: albumUpdated
				});
			}
		}
	});
}

function deleteAlbum(req, res){
	var albumId = req.params.id;
	Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
		if(err){
			res.status(500).send({message: 'Error al eliminar el album'});
		}else{
			if(!albumRemoved){
				res.status(404).send({message: 'El album no ha sido eliminado'});
			}else{
				Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
					if(err){
						res.status(500).send({message: 'Error al eliminar la canción'});
					}else{
						if(!songRemoved){
							res.status(404).send({message: 'La canción no ha sido eliminada'});
						}else{
							res.status(200).send({
								album: albumRemoved});
						}
					}
				});
			}
		}
	});
			
}

function saveAlbum(req, res){
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist ?? 'null';

	album.save((err, albumStored) =>{
		if(err){
			res.status(500).send({message: 'Error al guardar el album'});
		}else{
			if(!albumStored){
				res.status(404).send({message: 'El album no ha sido guardado'});
			}else
			{
				res.status(200).send({album: albumStored});
			}
		}
	});
}

function splitLast(conjunto, splitChar){
	var splitted = conjunto.split(splitChar);
	return splitted[splitted.length - 1];
}

function uploadImage(req, res){
	var albumId = req.params.id;
	var file_name = 'No subido...';


	if(req.files){ //Files es una variable superglobal
		var file_path = req.files.image.path;
		var file_name = splitLast(file_path, '\\');
		var file_ext = splitLast(file_name, '\.');
		
		var conjunto_ext = ['png', 'jpg', 'jpeg', 'gif'];

		if(conjunto_ext.indexOf(file_ext) >= 0) //Si la extensión es válida
		{
			Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
				if(!albumUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el album'});
				}else{
					res.status(200).send({album: albumUpdated});
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
	var pathFile = './uploads/albums/' + imageFile;

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
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
};