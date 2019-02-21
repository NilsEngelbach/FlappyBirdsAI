import Player from "./player.js";
import PipePair from "./pipepair.js";
import Ground from "./ground.js";
import NEAT from "./neat/neat.js";

window.panSpeed = 4;
window.gravity = 0.75;
window.players = [];
window.playerCount = 100;

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


window.neat = new NEAT(playerCount, 1, 1);

window.setup = () => {
    frameRate(30);
    window.canvas = createCanvas(340, 570);
    players = [];
    for (let i = 0; i < playerCount; i++) {
        players.push(new Player(canvas.width / 3, canvas.height / 2));
    }
    // window.pipePairA = new PipePair();
    //window.pipePairB = new PipePair(canvas.width / 2 + 35);
    window.ground = new Ground();
}

var count = 0;

window.draw = () => {
    count++;

    image(bgSprite, 0, -100);
    bgSprite.resize(canvas.width, 0);

    // pipePairA.update();
    // pipePairA.show();
    //pipePairB.update();
    //pipePairB.show();

    ground.show();

    text('Generation ' + neat.generation, 10, canvas.height - 18);

    for (let i = 0; i < playerCount; i++) {
        let inputs = [];
        inputs[0] = players[i].y / (canvas.height);
        // inputs[1] = (players[i].x - pipePairA.topPipe.x) / canvas.width;
        // inputs[2] = (players[i].y - pipePairA.getCenterY()) / canvas.height;
        // if (pipePairA.topPipe.x + pipePairA.topPipe.width > players[i].x) {
        //     inputs[1] = (players[i].x - pipePairA.topPipe.x) / canvas.width;
        //     inputs[2] = (players[i].y - pipePairA.getCenterY()) / canvas.height;
        // }else{
        //     inputs[1] = (players[i].x - pipePairB.topPipe.x) / canvas.width;
        //     inputs[2] = (players[i].y - pipePairB.getCenterY()) / canvas.height;
        // }

        neat.population[i].see(inputs);

        if(neat.population[i].think()[0] > 0.5) {
            players[i].flap();
        }



        if(!players[i].isDead) {
            players[i].update();
            players[i].show();
            neat.population[i].setFitness(players[i].score - players[i].flapcount * 2);
        }
    }

    if (players.every(x => x.isDead) || count > 300) {
        console.log(players.filter(p => !p.isDead).length);
        count = 0;
        neat.repopulate();
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
