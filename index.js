const fs = require('fs');
const gm = require('gm');
const utils = require('./methods');



for(var i = 1; i <= 200; i++){
	var product = utils.getProduct();
	var gender = Math.random() < 0.5 ? 'female' : 'male'
	var score = i % 2 === 0 ? -5 : 5;


		let ocean = {
		O: 4.5,
		C: -4,
		E: -2,
		A: -5,
		N: -1,
	};

	let sorted = utils.sortScores(ocean);
	let meta = {};
	meta.product = product;
	meta.gender = gender;
	createAdvert(sorted, meta);
}

function split(text){
	var tokens = text.split(' ');
	var mid = Math.floor(tokens.length / 2);
	let line1 = [];
	let line2 = [];
	tokens.forEach(function(token, i){
		if(i < mid){
			line1.push(token);
		} else {
			line2.push(token)
		}
	});
	return [line1.join(' '), line2.join(' ')];
}

function createAdvert(typeObjects, meta){
	//console.log(typeObjects);
	const background = utils.getBackground(typeObjects[0]);
	
	const timeStampInMs = Date.now();
	//const what = utils.getWhat(typeObjects[0]);
	const tmpFilename = './tmp/'+timeStampInMs+'.png';
	const directions = ['East', 'West'];
	const gravity = directions[Math.floor(Math.random() * directions.length)];
	const oppositegravity = gravity === 'East' ? 'SouthWest' : 'SouthEast';
	const font = utils.getFont(typeObjects[0]);
	const color = utils.getColor(typeObjects[1]);

	const who = utils.getWho(typeObjects[1], meta.gender);
	const what = utils.getWhat(typeObjects[0], oppositegravity, meta.product);
	//console.log(font);

	gm()
	.command("composite")
	.in('-geometry', '500x400')	
	.in("-gravity", "South"+gravity)
	.in(who)
	.in(background)
	
	.write(tmpFilename, function (err, b, c) {
		if (!err) {
		  	const lines = split(utils.getProductText(typeObjects[0], meta.product));
		  	const tmpFilename2 = './tmp/'+timeStampInMs+'-2.png';

		  	gm(tmpFilename)
		  	.fill(color)
		  	//.stroke('#000000')
			.font(font, 35)
			.drawText(30, 50, lines[0])
			.drawText(30, 90, lines[1])		
			.write(tmpFilename2, function (err) {
				if (!err) console.log('done');
				let json = {
					model: typeObjects,
					meta: meta,
					image: timeStampInMs+'.png'
				};
				fs.writeFileSync('./models/'+timeStampInMs+'.json', JSON.stringify(json, null, 4));
				fs.unlinkSync(tmpFilename);
				if(what.product){
					gm()
					.command('composite')			
					.in('-geometry', '350x250+10+10')	
					.in("-gravity", oppositegravity)
					.in(what.path)
					.in(tmpFilename2)
					.write('./interface/generated/'+timeStampInMs+'.png', function (err, b, c) {
						fs.unlinkSync(tmpFilename2);

					});
				} else {
					gm()
					.command('composite')
					.in(what.path)
					.in(tmpFilename2)
					.write('./interface/generated/'+timeStampInMs+'.png', function (err, b, c) {
						fs.unlinkSync(tmpFilename2);

					});	
				}
				

			});
		}
	});
}

