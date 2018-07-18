const fs = require('fs');
const express = require('express');
const app = express();
const EOL = require('os').EOL;

#!/usr/bin/env nodejs
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080, 'localhost');


function dateSort(a, b) {
	if (a.timestamp === b.timestamp) {
		return 0;
	}
	return a.timestamp < b.timestamp ? -1 : 1;
}

function getFiles() {
	
	const files = fs.readdirSync('./../models');

	const models = [];
	files.forEach((file, i) => {
		if (file[0] !== '.') {
			const fileJSON = JSON.parse(fs.readFileSync('./../models/'+file));
			models.push(fileJSON);



		}
	});

	models.sort(dateSort);

	return models;
}


app.get('/', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	res.json({ models: getFiles() });
});

app.listen(3000, () => console.log('Example app listening on port 3000!')); 
