
var canvas = null;
var context = null;
var frameRate = 1000/30;
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
var frames = [];

setup = function() {
	var body = document.getElementById('body');

	canvas = document.createElement('canvas');
	canvas.width = 1200; // window.innerWidth
	canvas.height = 720; // window.innerHeight
	body.appendChild(canvas);	
	context = canvas.getContext('2d');

	for (var i = 0; i < assets.length; i++) {
		frames.push(new Image());	
		frames[i].onload = onImageLoad;
		frames[i].src =  assets[i];
	}

	var intervalId = window.setInterval(animate, 30);
}

var onImageLoad = function() {
	console.log("image loaded");
};

var animate = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(frames[frame], 190, 190);
	frame = (frame + 1) % frames.length;	
};

setup();