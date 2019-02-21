import Player from "./player.js";
import PipePair from "./pipepair.js";
import Ground from "./ground.js";

window.panSpeed = 4;
window.gravity = 0.75;
window.players = [];
window.playerCount = 10;

window.pipePairA;
window.pipePairB;

window.birdSprite;
window.bgSprite;

window.preload = () => {
    window.birdSprite = loadImage("sprites/bird.png");
    window.bgSprite = loadImage("sprites/bg.png");
    window.groundSprite = loadImage("sprites/fg.png");
    window.pipeTopSprite = loadImage("sprites/pipeTop.png");
    window.pipeBottomSprite = loadImage("sprites/pipeBottom.png");
}

window.setup = () => {
    frameRate(30);
    window.canvas = createCanvas(340, 570);
    players = [];
    for (let i = 0; i < playerCount; i++) {
        players.push(new Player(canvas.width / 3, canvas.height / 2));
    }
    window.pipePairA = new PipePair();
    window.pipePairB = new PipePair(canvas.width / 2 + 35);
    window.ground = new Ground();
}

window.draw = () => {

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

window.keyPressed = () => {
    switch (key) {
        case ' ':
            players[1].flap();
            break;
    }
}
