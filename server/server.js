var express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
const path = require("path")
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');

app.use(cors())
const { Pool, Client } = require('pg');
const pool = new Pool({
	host: "10.121.172.33",
	port: 5431,
	user: "admin",
	password: "almawave",
	database: "project_review"
});




server.listen(port, function() {
	console.log(`Listening on port ${port}`);
  });
 
/********************************************/
/*				 roba angular  		    */
/********************************************/

//api da usare per testare la connessione da client a server 

app.get('/testRest', async (req, res) => {

	
	res.send({"prova" : "prova"})
  
  })

//api dizionario 
//servizio dedito ad interrogare il microcontrollore sul db per la struttura della tabella sulle varie schermate del client 
  app.post('/esegui/query/dizionario', async (req, res) => {

    console.log(req.body.query)
	console.log("dizionario")
	var query = req.body.query


	const pool3 = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	
	
	
	pool3.query(query, function (err, res2) {
		if(err) {console.log(err)
		        res.send(err)}
		else {
			
			console.log("esecuzione avvenuta correttamente su api dizionario")
			res.send(res2)
		}
		
	});

	pool3.end(function (err) {
		
	});
  
  })
  

  


 	

//api selezione 
//servizio dedito ad interrogare il microcontrollore sul db per la struttura della tabella sulle varie schermate del client 
app.post('/esegui/query/selezione', async (req, res) => {

    console.log(req.body.query)
	var query = req.body.query

	const pool2 = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	
	
	
	pool2.query(query, function (err, res2) {
		if(err) {
			err["upd"] = "nok"
			console.log(err)
			res.send(err)
		
		}
		else {
			
			res2['upd'] = "ok"
			console.log("esecuzione avvenuta correttamente su api selezione")
		  res.send(res2)
		}
		
	});

	pool2.end(function (err) {
		
	});
  
  })
  

  
