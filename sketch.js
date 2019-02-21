var panSpeed = 4;
var gravity = 0.75;
var players = [];
var playerCount = 10;

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
    window.canvas = createCanvas(340, 570);
    players = [];
    for (let i = 0; i < playerCount; i++) {
        players.push(new Player(canvas.width / 3, canvas.height / 2));
    }
    pipePairA = new PipePair();
    pipePairB = new PipePair(canvas.width / 2 + 35);
    ground = new Ground();
}

function draw() {

    image(bgSprite, 0, -100);
    bgSprite.resize(canvas.width, 0);

    pipePairA.update();
    pipePairA.show();
    pipePairB.update();
    pipePairB.show();

    ground.show();

    for (let i = 0; i < playerCount; i++) {
        if(!players[i].isDead) {
            players[i].update();
            players[i].show();
        }
    }

    if (players.every(x => x.isDead)) {
        setup();
    }
}

function keyPressed() {
    switch (key) {
        case ' ':
            players[1].flap();
            break;
    }
}