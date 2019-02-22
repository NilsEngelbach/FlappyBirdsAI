import Ground from './ground.js';
import NEAT from './neat/neat.js';
import PipePair from './pipepair.js';
import Player from './player.js';


window.panSpeed = 4;
window.gravity = 0.75;

window.players = [];
window.playerCount = 200;

window.pipePairA;
window.pipePairB;

window.preload = () => {
    window.defaultBirdSprite = loadImage("sprites/bird.png");
    window.bgSprite = loadImage("sprites/bg.png");
    window.groundSprite = loadImage("sprites/fg.png");
    window.pipeTopSprite = loadImage("sprites/pipeTop.png");
    window.pipeBottomSprite = loadImage("sprites/pipeBottom.png");
    window.speciesSprite = [];
    for(let i = 0; i <= 15; i++) {
        let image = loadImage(`sprites/colored-birds/bird-${i}.png`);
        window.speciesSprite.push(image);
    }
}


window.neat = new NEAT(playerCount, 3, 1);

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

var count = 0;
var highscore = 0;
var birdsAlive = playerCount;

window.draw = () => {
    count++;

    image(bgSprite, 0, -100);
    bgSprite.resize(canvas.width, 0);

    pipePairA.update();
    pipePairA.show();
    pipePairB.update();
    pipePairB.show();

    ground.show();

    text(`Generation ${neat.generation} (${Object.keys(neat.speciesDict).length})`, 10, canvas.height - 20);
    text('Score ' + count, 10, canvas.height - 50);
    text('Highscore ' + highscore, 180, canvas.height - 50);
    text('Alive ' + birdsAlive, 180, canvas.height - 20);

    for (let i = 0; i < playerCount; i++) {
        let nextPipepair = getNextPipepair(players[i].x);
        let heightAboveBottomPipe = nextPipepair.bottomPipe.topY - players[i].y;
        let distanceToPipes = nextPipepair.bottomPipe.x - players[i].x + nextPipepair.bottomPipe.width;

        let inputs = [];
        inputs[0] = players[i].y / canvas.height;
        inputs[1] = heightAboveBottomPipe / canvas.height;
        inputs[2] = distanceToPipes / canvas.width;

        // Debug lines, set population to 1 and disable repopulate to properly debug
        // line(players[i].x, players[i].y, players[i].x, players[i].y + heightAboveBottomPipe);
        // line(players[i].x, players[i].y, players[i].x + distanceToPipes, players[i].y);

        neat.population[i].see(inputs);

        if(neat.population[i].think()[0] > 0.5) {
            players[i].flap();
        }

        if(!players[i].isDead) {
            players[i].update();
            players[i].show(window.speciesSprite[neat.population[i].species]);
            neat.population[i].setFitness(players[i].score);
        }
    }

    birdsAlive = players.filter(p => !p.isDead).length;

    if (players.every(x => x.isDead)) {
        let highestScore = Math.max.apply(Math, players.map(p => p.score));
        if (highestScore > highscore) {
            highscore = highestScore;
        }
        count = 0;
        birdsAlive = playerCount;
        neat.repopulate();
        setup();
    }
}

function getNextPipepair(xpos) {
    if ((pipePairA.bottomPipe.x + pipePairA.bottomPipe.width - xpos) > 0 && (pipePairA.bottomPipe.x + pipePairA.bottomPipe.width - xpos) < (pipePairB.bottomPipe.x + pipePairB.bottomPipe.width - xpos) || (pipePairB.bottomPipe.x + pipePairB.bottomPipe.width - xpos) < 0) {
        return pipePairA;
    }else{
        return pipePairB;
    }
}

// window.keyPressed = () => {
//     switch (key) {
//         case ' ':
//             players[1].flap();
//             break;
//     }
// }
