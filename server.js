const fs = require('fs');
const express = require('express');
const app = express();
const EOL = require('os').EOL;
const path = require('path');

function dateSort(a, b) {
	if (a.timestamp === b.timestamp) {
		return 0;
	}
	return a.timestamp < b.timestamp ? -1 : 1;
}

function getFiles() {
	const modelDirectory = path.resolve(__dirname + '/models')
	const files = fs.readdirSync(modelDirectory);

	const models = [];
	files.forEach((file, i) => {
		if (file[0] !== '.') {
			const fileJSON = JSON.parse(fs.readFileSync(modelDirectory + '/' + file));
			models.push(fileJSON);
		}
	});

	models.sort(dateSort);

	return models;
}

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/data', function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.json({ models: getFiles() });
});

app.listen(8080, () => console.log('Example app listening on port 8080!')); 