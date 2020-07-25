const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const router = express.Router();

const path = __dirname + '/views/';
const port = 8080;
const url = 'mongodb://root:123456@mongodb:27017/urls?authSource=admin';
//const url = 'mongodb://localhost:27017/urls';

let db;

app.use(bodyParser.urlencoded({ extended: true }));

//Datenbankabruf, zum Finden eines Eintrags
async function findOne(searchInput){
	const client = await MongoClient.connect(url, {}).catch(err => { console.log(err) });
	if (!client){
		return "error";
	}

	try{
		const db = client.db("urls");
		let collection = db.collection('links');
		let query = { shortLink: searchInput };
		let res = await collection.find(query).toArray();
		console.log(res[0].originalURL);
		return res[0].originalURL;
		
	}catch(err){
		return "not found";
	}finally{
		client.close();
	}
}

//Datenbankabruf, zum Einfügen eines neuen Links
async function insertOne(insertValue){
	const client = await MongoClient.connect(url, {}).catch(err => { console.log(err) });
	if (!client){
		return "error";
	}

	try{
		const db = client.db("urls");
		let collection = db.collection('links');
		let res = await collection.insertOne(insertValue);
		return "inserted";
				
	}catch(err){
		return "error";
	}finally{
		client.close();
	}
}

//Datenbankabruf, zum Prüfen von Dopplungen
async function checkDouble(value){
	const client = await MongoClient.connect(url, {}).catch(err => { console.log(err) });
	if (!client){
		return "error";
	}
	
	try{
		const db = client.db("urls");
		let collection = db.collection('links');
		let res = await collection.find().toArray();
		for(i=0; i<res.length; i++){
			if(res[i].shortLink == value){
				return "double";
			}
		}
		return "unique";
		
	}catch(err){
		return "error";
	}finally{
		client.close();
	}
}

//Weiterleitung der Kurzlinks
// /success, /error, /favicon werden ausgeklammert, weil diese keine Kurzlinks sein können, da sie benötigt werden
router.get(/^\/(?!\bsuccess\b|\berror\b|favicon).+$/ , async function(req, res, next){
	//extrahierung des Kurzlinks aus der URL
	var searchLink = req.url.substr(1,req.url.length)
	var targetURL;
	
	//Ziel-URL des Kurzlinks aus der Datenbank auslesen
	targetURL = await findOne(searchLink);
	
	//Prüfung, ob der Kurzlink existiert
	if(targetURL == "not found"){	
		//Kurzlink existiert nicht
		//Weiterleitung auf Startseite mit Fehlermeldung
		res.redirect("http://localhost/error?q=2"); 
	}else{
		//Weiterleitung zur URL
		res.redirect(targetURL);
	}
	next();
});

//Startseite-html laden für "/", "/success" und "/error"
router.get(/^(\/|\/success|\/error)$/, function(req, res){
	res.sendFile(path + 'index.html');
	
});

//Erzeugen eines Kurzlinks
router.post('/generate', async function(req,res){
	//Input-Felder auslesen
	var originalURL = req.body.originalURL;
	var shortLink = req.body.shortLink;
	
	//Prüfung, ob favorisierter Link angegeben wurde
	if(shortLink.length<1){
		//kein favorisierter Link wurde angegeben
		//Zufallslink generieren
		var unique = "double";
		var link = "";
		while(unique == "double"){
			//7 Zufallszeichen erzeugen und auf Dopplung in der Datenbank überprüfen
			link = Math.random().toString(36).substring(2,9);
			unique = await checkDouble(link);
		}
		if(unique == "error"){
			//Error
			res.redirect("http://localhost/error?q=3");
		}else{
			//Einfügen des Kurzlinks in die Datenbank
			var inserted = await insertOne({originalURL: originalURL, shortLink: link});
			if (inserted == "inserted"){
				//erfolgreich eingefügt
				//Weiterleitung auf Startseite mit Erfolgsmeldung und Link
				res.redirect("http://localhost/success?q="+link);
			}else{
				//Fehler beim einfügen
				res.redirect("http://localhost/error?q=3");
			}
		}
		
	}else{
		//favorisierter Link wurde angegeben
	
		//Dopplung prüfen
		var unique = await checkDouble(shortLink);
		if(unique=="double"){
			//Dopplung vorhanden
			res.redirect("http://localhost/error?q=1");
			
		}else if(unique=="unique"){
			//keine Dopplung vorhanden
			var inserted = await insertOne({originalURL: originalURL, shortLink: shortLink});
			if (inserted == "inserted"){
				//erfolgreich eingefügt
				res.redirect("http://localhost/success?q="+shortLink);
			}else{
				//Fehler beim einfügen
				res.redirect("http://localhost/error?q=3");
				
			}
		}else{
			//Error
			res.redirect("http://localhost/error?q=3");
		}
		
	}

});


app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Listening on port '+port+'!')
});
