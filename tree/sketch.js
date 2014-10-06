// Painting with bugs

// Just have some bugs approximate yo face, lol.
var width = 600;
var height = 400;
var bug_size = 20;
var speed = 5;

var state;
var cam_stream;
var video;
var img;
var needed_bugs;
var moving_bugs;

var retina;

// Welcome To Callback Village
function setupVideo() {
    navigator.webkitGetUserMedia(
        {video:true, audio:false},
        function(stream) {
            cam_stream = stream;
            video = createVideo(window.webkitURL.createObjectURL(stream));
            video.play();
            video.hide();
            var button = createButton("Click to Draw With Bugs",[]);
            button.mousePressed(function (button){
                // I wonder if this is a retina thing...
                if (retina) {
                    img.image(video, 0, 0, width/2, height/2);
                } else {
                    img.image(video, 0, 0, width, height);
                }
                
                video.stop();
                cam_stream.stop();
                setupBugs();
                state = "Draw";
            });
            state = "Webcam";
        },
        function(err) {
            console.log("error, can't get webcam");
        });
}

function drawLoadingScreen() {
    background(200);
    textSize(32);
    textAlign(CENTER);
    text("Requires Chrome and Webcam Support", width/2, height/2);
}

function drawVideo() {
    image(video, 0, 0);
}

function shuffleInPlace(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function setupBugs() {
    needed_bugs = [];
    moving_bugs = [];

    for (i = 0; i < width; i+=bug_size) {
        for (j = 0; j < height; j+=bug_size) {
            var bug = {color: img.get(i, j),
                       target: {x: i, y: j},
                       pos: {x: 0, y: 0}};
            needed_bugs.push(bug);
        }
    }

    shuffleInPlace(needed_bugs);
}

function drawWithBugs() {
    var new_bug = needed_bugs.shift();
    if (new_bug) {
        new_bug.pos = {x: random(width), y: random(height)};
        moving_bugs.push(new_bug);
    }

    moving_bugs.forEach(function(bug) {
        var direction = createVector(bug.target.x - bug.pos.x,
                                     bug.target.y - bug.pos.y);
        if (direction.mag() > 3) {
            // A little randomness;
            var n = createVector(1, 1)
                    .rotate(360 * noise(bug.pos.x, bug.pos.y));
            var movement = direction.normalize().mult(speed).add(n);
            bug.pos.x += movement.x;
            bug.pos.y += movement.y;
        }
    });
    
    background(200);
    moving_bugs.forEach(function(bug) {
        fill(bug.color, 128);
        ellipse(bug.pos.x, bug.pos.y, bug_size, bug_size);
    });

}

function setup() {
    createCanvas(600, 400);
    retina = window.devicePixelRatio > 1;
    once = true;
    state = "Loading";
    img = createGraphics(width, height);
    setupVideo();
}

function draw() {
    switch(state) {
    case "Loading":
        drawLoadingScreen();
        break;
    case "Webcam":
        drawVideo();
        break;
    case "Draw":
        drawWithBugs();
        break;
    }
}
