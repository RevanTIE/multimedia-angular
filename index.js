'use strict'
var mongoose = require('mongoose'); 
var app = require('./app');
var port = process.env.PORT || 3977;
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/curso_angular", (err, res) => {

	if(err){
		throw err;
	}else{
		console.log("La base de datos está funcionando correctamente...");
		app.listen(port, function()
		{
			console.log("Servidor del api rest de música escuchando en http://localhost:"+port);

		})
	}
});

// This is an alternate path
// const { MongoClient } = require('mongodb');

// async function main() {
//    /**
// 	* Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
// 	* See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
// 	*/
// 	const uri = "mongodb://127.0.0.1:27017";       

// 	const client = new MongoClient(uri);

// 	try {
// 	    await client.connect();

// 	    await listDatabases(client);

// 	} catch (e) {
// 	    console.error(e);
// 	}
// 	finally {
//     	await client.close();
// 	}

// }

// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

// main().catch(console.error);