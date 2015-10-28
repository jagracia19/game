
var MEDIA_IMG = 'media/img/';

var canvas = null;
var context = null;

// var robotwalkImg = null;
var robotwalkSheet = null;

/*var frameRate = 1000/30;
var frame = 0;
var assets = ['media/img/robowalk00.png',
			  'media/img/robowalk01.png',
			  'media/img/robowalk02.png',
			  'media/img/robowalk03.png',
			  'media/img/robowalk04.png',
			  'media/img/robowalk05.png',
			  'media/img/robowalk06.png',
			  'media/img/robowalk07.png',
			  'media/img/robowalk08.png',
			  'media/img/robowalk09.png',
			  'media/img/robowalk10.png',
			  'media/img/robowalk11.png',
			  'media/img/robowalk12.png',
			  'media/img/robowalk13.png',
			  'media/img/robowalk14.png',
			  'media/img/robowalk15.png',
			  'media/img/robowalk16.png',
			  'media/img/robowalk17.png',
			  'media/img/robowalk18.png'];
var frames = [];*/

// function xhrGet(uri, callback) {
// 	var xhr = new XMLHttpRequest();
// 	xhr.onload = callback;
// 	xhr.open("GET", uri, true);
// 	xhr.send();
// }

function xhrGet(reqUri, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", reqUri, true);
	xhr.onload = callback;
	xhr.send();
}

var loadAssets = function () {
	if (!robotwalkImg || !robotwalkSheet) return;
	context.drawImage(robotwalkImg, 10, 10);
	console.log(robotwalkSheet);
};

/* --- SpriteFrame --- */
function SpriteFrame(name, x, y, width, height) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

/* --- SpriteSheet --- */

function SpriteSheet(name) {
	this.name = name;			// json file name
	this.parsed = null;		// json parsed
	this.image = null;		// Image
	this.frames = []; 		// Sprite frame array
	this.frameIndex = 0;	// frame index
	this.loaded = false;
}

SpriteSheet.prototype.load = function(){
	console.log("load sprite " + MEDIA_IMG + this.name);

	// load json
	var sprSheet = this;
	xhrGet(MEDIA_IMG + this.name, function() {
		sprSheet.parsed = JSON.parse(this.responseText);

		// load image
		sprSheet.image = new Image();
		sprSheet.image.onload = function () {
				console.log(sprSheet.parsed.meta.image);
				sprSheet.loaded = true;
		};
		sprSheet.image.src = MEDIA_IMG + sprSheet.parsed.meta.image;

		// load frames
		for (var frameName in sprSheet.parsed.frames) {
			frame = sprSheet.parsed.frames[frameName];
			spriteFrame = new SpriteFrame(frameName, frame.frame.x, frame.frame.y,
					frame.frame.w, frame.frame.h);
			sprSheet.frames.push(spriteFrame);
		}

	});
}


/* --- --- */

var setup = function() {

	// find canvas parent
	var body = document.getElementById('body');

	// create canvas
	canvas = document.createElement('canvas');
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	body.appendChild(canvas);
	context = canvas.getContext('2d');

	/*for (var i = 0; i < assets.length; i++) {
		frames.push(new Image());
		frames[i].onload = onImageLoad;
		frames[i].src =  assets[i];
	}

	var intervalId = window.setInterval(animate, 30);*/

	// load robotwalk sheet
	// var xhr = new XMLHttpRequest();
	// xhr.onload = function () {
	// 	robotwalkSheet = JSON.parse(xhr.responseText);
	// 	loadAssets();
	// };
	// xhr.open("GET", 'media/img/robotwalksheet.json', true);
	// xhr.send();
	// xhrGet('media/img/robotwalksheet.json', function() {
	// 	robotwalkSheet = JSON.parse(this.responseText);
	//  	loadAssets();
	// });

	// load robotwalk imagen
	// robotwalkImg = new Image();
	// robotwalkImg.onload = onImageLoad;
	// robotwalkImg.src = 'media/img/robotwalksheet.png';

	robotwalkSheet = new SpriteSheet('robotwalksheet.json');
	robotwalkSheet.load();

	setInterval(draw, 150);
};

// var onImageLoad = function() {
// 	console.log("image loaded");
// 	loadAssets();
// };

var draw = function() {

	if (robotwalkSheet && robotwalkSheet.loaded) {
		// context.drawImage(robotwalkSheet.image, 10, 10);
		robotwalkSheet.frameIndex++;
		robotwalkSheet.frameIndex =
				robotwalkSheet.frameIndex % robotwalkSheet.frames.length;
		var frame = robotwalkSheet.frames[robotwalkSheet.frameIndex];
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(robotwalkSheet.image, frame.x, frame.y, frame.width,
				frame.height, 150, 150, frame.width, frame.height);
	}
};

/*var animate = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(frames[frame], 190, 190);
	frame = (frame + 1) % frames.length;
};*/


setup();
