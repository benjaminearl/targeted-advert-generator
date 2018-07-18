const _ = require('underscore')._
const fs = require('fs');

const oceanMap = {
	O: 'openess',
	C: 'conscientiousness',
	E: 'extraversion',
	A: 'agreeablility',
	N: 'neuroticism'
}


const directories = [
	'0-very-agreeable',
	'1-slightly-agreeable',
	'2-slightly-disagreeable',
	'3-very-disagreeable'
];

module.exports = {

	sortScores: function(ocean){
		var scores = _.map(ocean, function(value, key){
			return { name : key, value : value };
		});
		scores = _.sortBy(scores, function(item){
			item.longName = oceanMap[item.name]
			return -Math.abs(item.value);
		});

		return scores;
	},
	
	parseWeight: function(value){

	},

	getBackground: function(typeObject){
		const folderPath = './data/'+typeObject.longName+'/where';
		let folders = fs.readdirSync(folderPath);
		folders = this.removeSystemFiles(folders);
		const index = Math.floor(this.mapRange(typeObject.value, -5, 5, folders.length-1, 0));
		let backgrounds = fs.readdirSync(folderPath+'/'+folders[index]);
		backgrounds = this.removeSystemFiles(backgrounds);
		const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
		return folderPath+'/'+folders[index]+'/'+background;
	},
	getProductText: function(typeObject, product){
		let text = this.getText(typeObject);
		return text.replace(/\[product\]/gi, product);
	},

	getWho: function(typeObject, gender){
		const folderPath = './data/'+typeObject.longName+'/who/'+gender;
		let folders = fs.readdirSync(folderPath);
		folders = this.removeSystemFiles(folders);
		const index = Math.floor(this.mapRange(typeObject.value, -5, 5, folders.length-1, 0));
		let whos = fs.readdirSync(folderPath+'/'+folders[index]);
		whos = this.removeSystemFiles(whos);
		const who = whos[Math.floor(Math.random() * whos.length)];
		return folderPath+'/'+folders[index]+'/'+who;
	},

	getColor: function(typeObject){
		var colors = JSON.parse(fs.readFileSync('./data/colors.json', 'utf-8'));
		var amount = 'high';
		if(typeObject.value < 0){
			amount = 'low';
		}
		var colorRange = colors[typeObject.name][amount];

		var color = colorRange[Math.floor(Math.random() * colorRange.length)];

		return color;

	},
	getFont: function(typeObject){
		const folderPath = './data/'+typeObject.longName+'/typefaces';
		let folders = fs.readdirSync(folderPath);
		folders = this.removeSystemFiles(folders);
		const index = Math.floor(this.mapRange(typeObject.value, -5, 5, folders.length-1, 0));
		let fonts = fs.readdirSync(folderPath+'/'+folders[index]);
		fonts = this.removeSystemFiles(fonts);
		const ridx = Math.floor(Math.random() * fonts.length);
		const font = fonts[ridx];
		console.log(font, ridx);
		return folderPath+'/'+folders[index]+'/'+font;
	},
	getWhat: function(typeObject, gravity, product){

		const productPath = './data/products_'+gravity.replace('South', '')+'/'+product+'.png';
		console.log(fs.existsSync(productPath));
		if (fs.existsSync(productPath)) {
			return {path: productPath, product: false};
		}

		const folderPath = './data/'+typeObject.longName+'/what';
		let folders = fs.readdirSync(folderPath);
		folders = this.removeSystemFiles(folders);
		const index = Math.floor(this.mapRange(typeObject.value, -5, 5, folders.length-1, 0));
		let whats = fs.readdirSync(folderPath+'/'+folders[index]);
		whats = this.removeSystemFiles(whats);
		const what = whats[Math.floor(Math.random() * whats.length)];
		return {path: folderPath+'/'+folders[index]+'/'+what, product: true};
	},
	getText: function(typeObject, product){
		var templateString = fs.readFileSync('./data/'+typeObject.longName+'/text/templates.txt', 'utf-8');
		var templates = templateString.split(/\r?\n/);
		templates = this.removeBlanks(templates);
		templates = this.removeSystemFiles(templates);
		const index = Math.floor(this.mapRange(typeObject.value, -5, 5, templates.length-1, 0));
		let randomTemplate = templates[index];
		return randomTemplate;

	},
	removeBlanks: function(arr){
		for (var i=arr.length-1; i>=0; i--) {
			if(arr[i].length === 0){
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	removeSystemFiles: function(folders){
		for (var i=folders.length-1; i>=0; i--) {
			if (folders[i][0] === '.') {
				folders.splice(i, 1);				
			}
		}
		return folders;
	},
	getProduct: function(){
		var data = fs.readFileSync('./data/products.txt', 'utf-8');
		var products = data.split(/\r?\n/);
		var randomIndex = Math.floor(Math.random() * products.length);
		return products[randomIndex];
	},	
	mapRange: function(value, low1, high1, low2, high2){
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}

} 