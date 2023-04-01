var canvas = document.getElementById("walkingWin");
var ctx = canvas.getContext('2d');

fitToContainer(canvas);

function fitToContainer(canvas){
  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

var width = canvas.width;
var height = canvas.height;

var lastRender = 0;
var fps = 10;
var currentTime = 0;
var lastMovement;
var movement = 0;
var movementSpeed = 30;
var groundProgress = 0;

var imageLoaded = false;
var playerImage = new Image();
playerImage.onload = function() {
  imageLoaded = true;
  console.log("Image loaded");
};
playerImage.src = "img/win.png";

var groundLoaded = false;
var groundImage = new Image();
groundImage.onload = function() {
	groundLoaded = true;
	ptrn = ctx.createPattern(groundImage, 'repeat');
};
groundImage.src = "img/ground.png";

var treeImage = new Image();
treeImage.src = "img/pixel_tree.png";

var currentFrame = 0;
var totalFrames = 8;

var pos_x = canvas.width/4;
var pos_y = 0;

var treesXPositions = [];

function loop(timestamp) {
	var duration = timestamp - lastRender;
	
	ctx.clearRect(0, 0, width, height);
	
    // if (Math.random() > 0.999) {
    //     // Create a tree
    //     treesXPositions.push([width, Math.random()]);
    // }
    
    // treesXPositions.forEach(function(treeX, index) {
    //     var treeHeight = 100*treeX[1];
    //     ctx.drawImage(treeImage, treeX[0], height-treeHeight, 180*treeX[1], treeHeight);
        
    //     // Subtract the movement since last frame
    //     treesXPositions[index][0] -= (movement - lastMovement);
    // });
    
	if (imageLoaded) {
		ctx.drawImage(playerImage, 32*(currentFrame%totalFrames+1), 0, 32, 64, pos_x, pos_y, (height-5)/2, height-5);
	}
    
    if (groundLoaded) {
		for(var i = groundProgress; i < groundProgress + (width/groundImage.width + 1); i++) {
			ctx.drawImage(groundImage, i*groundImage.width-movement, height-18);
			if (movement/groundImage.width > groundProgress+1) {
				groundProgress++;
			}
		}
	}
	
	lastRender = timestamp;
	currentTime += duration;	
		
	if (currentTime > (1000 / fps)) {
		currentFrame++;
		
		currentTime = 0;
	}
	
    lastMovement = movement;
	movement += movementSpeed*duration/1000;
	
	window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);

