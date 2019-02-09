var panSpeed = 5;
var gravity = 0.75;
var player;

var pipePairA;
var pipePairB;

var birdSprite, bgSprite;

function preload() {
    birdSprite = loadImage("sprites/bird.png");
    bgSprite = loadImage("sprites/bg.png");
    groundSprite = loadImage("sprites/fg.png");
    pipeTopSprite = loadImage("sprites/pipeTop.png");
    pipeBottomSprite = loadImage("sprites/pipeBottom.png");
}

function setup() {
    frameRate(30);
    window.canvas = createCanvas(550, 800);
    player = new Player(canvas.width / 3, canvas.height / 2);
    pipePairA = new PipePair();
    pipePairB = new PipePair(canvas.width / 2 + 50);
    ground = new Ground();
}

function draw() {
    // background(135,205,250);
    image(bgSprite, 0, -100);
    bgSprite.resize(canvas.width, 0);

    pipePairA.update();
    pipePairA.show();
    pipePairB.update();
    pipePairB.show();

    ground.show();

    player.update();
    player.show();
}

function keyPressed() {
    switch (key) {
        case ' ':
            player.flap();
            break;
    }
}