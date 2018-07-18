document.addEventListener('DOMContentLoaded', function(){
	appendControls();
	getModels();
});



function appendControls(){


	Object.keys(oceanMap).forEach(function(value){
		const container = document.createElement('div');
		const slider = document.createElement('input');
		const title = document.createElement('h4');
		title.textContent = oceanMap[value];
		slider.id = oceanMap[value];
		slider.min = -5;
		slider.max = 5;
		slider.classList.add('slider');
		slider.type = 'range';
		slider.step = 0.1;
		container.classList.add('inactive');
		slider.oninput = function(){
			activeValues[oceanMap[value]] = parseFloat(this.value);
			
			applyFilter();
		}	
		slider.addEventListener('mousedown', function(s){
			if(s.target.parentNode.classList.contains('inactive')){
				s.target.parentNode.classList.remove('inactive');
			}
		});

		slider.addEventListener('mouseup', function(s){
			console.log(this.value);
			if(parseInt(this.value) === 0){
				activeValues[oceanMap[value]] = 0;
				s.target.parentNode.classList.add('inactive');
			}

		});
		container.appendChild(slider);
		container.appendChild(title);
		document.querySelector('#controls').appendChild(container);

		// <input type="range" min="-5" max="5" value="0" class="slider" id="conscientiousness">
	});
}

const oceanMap = {
	O: 'openess',
	C: 'conscientiousness',
	E: 'extraversion',
	A: 'agreeablility',
	N: 'neuroticism'
}

let activeValues = {
	'openess': 0,
	'conscientiousness': 0,
	'extraversion': 0,
	'agreeablility': 0,
	'neuroticism': 0,
}

function applyFilter(){
	const ads = document.querySelectorAll('.ad');
	ads.forEach(function(ad){
		ad.style.display = 'block';
	});

	Object.keys(oceanMap).forEach(function(value){
		if(activeValues[oceanMap[value]] !== 0){
			ads.forEach(function(ad){
				const v = parseFloat(ad.dataset[oceanMap[value]]);
				
				const min = activeValues[oceanMap[value]] - 2;
				const max = activeValues[oceanMap[value]] + 2;
				//console.log(v, min, max);
				if(v < min || v > max){
					ad.style.display = 'none';		
				}
			});
		}
	});

}


function filterAds(type, value){
	const ads = document.querySelectorAll('.ad');
	value = parseFloat(value);

	ads.forEach(function(ad){
		ad.style.display = 'block';
		const v = parseFloat(ad.dataset[type]);
		const min = value - 2;
		const max = value + 2;
		if(v < min || v > max){
			ad.style.display = 'none';		
		}
	});

}



function getModels(){
	fetch('http://127.0.0.1:3000/', {
		method: 'get'
	}).then((response) => {
		return response.json();
	}).then((data) => {
		console.log(data);
		appendAds(data.models);
	});
}


function appendAds(ads){
	ads.forEach(function(ad, i){
		//if(i < 10){
		// const model = createModel(ad);
		const image = document.createElement('img');
		image.src = '../generated/'+ad.image;
		const el = document.createElement('div');
		el.classList.add('ad');
		el.appendChild(image);
		// el.appendChild(model);
		
		ad.model.forEach(function(type){
			el.dataset[type.longName] = type.value;
		})
		document.body.querySelector('.container').appendChild(el);
		//}
	});
}

function createModel(ad){
	const el = document.createElement('div');
	// el.classList.add('model');
	let innerHTML = '';
	ad.model.forEach(function(type){
		innerHTML += `
			<span>	
				<span>${type.longName}</span>
				<span>${type.value.toFixed(3)}</span>			
			</span>
		`;
	});
	el.innerHTML = innerHTML;
	return el;
}