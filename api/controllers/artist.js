'user strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
//Se manda a llamar el modelo
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res){
	var artistId = req.params.id;
	Artist.findById(artistId, (err, artist) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!artist){
				res.status(404).send({message: 'El artista no existe'});
			}else{
				res.status(200).send({artist});
			}
		}
	});
}

function getArtists(req, res){
	var page = req.params.page ?? 1;
	var itemsPerPage = 3;

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
		if(err)
		{
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!artists){
				res.status(404).send({message: 'No hay artistas'});
			}else{
				return res.status(200).send({
					total_items: total,
					artists: artists
				});
			}
		}
	});
}

function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) =>{
		if(err)
		{
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message: 'El artista no ha sido actualizado'});
			}else{
				return res.status(200).send({
					artist: artistUpdated
				});
			}
		}
	});
}

function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err)
		{
			res.status(500).send({message: 'Error al eliminar el artista'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado'});
			}else{
				
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
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
											artistRemoved});
									}
								}
							});
						}
					}
				});
			};
		}
	});
}

function saveArtist(req, res){
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStored) =>{
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'El artista no ha sido guardado'});
			}else
			{
				res.status(200).send({artist: artistStored});
			}
		}
	});
}

function splitLast(conjunto, splitChar){
	var splitted = conjunto.split(splitChar);
	return splitted[splitted.length - 1];
}

function uploadImage(req, res){
	var artistId = req.params.id;
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
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
				if(!artistUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el artista'});
				}else{
					res.status(200).send({artist: artistUpdated});
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
	var pathFile = './uploads/artists/' + imageFile;

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
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};