const fs = require('fs');
const express = require('express');
const app = express();
const EOL = require('os').EOL;

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

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/data', function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.json({ models: getFiles() });
});


app.listen(3000, () => console.log('Example app listening on port 3000!')); 
