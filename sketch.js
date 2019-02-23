import Ground from './ground.js';
import NEAT from './neat/neat.js';
import PipePair from './pipepair.js';
import Player from './player.js';


window.panSpeed = 4;
window.gravity = 0.75;

window.players = [];
window.playerCount = 200;
window.bestPlayer = {};

window.pipePairA;
window.pipePairB;

window.neat = new NEAT(playerCount, 3, 1);

var game =  p => {

    p.preload = () => {
        p.defaultBirdSprite = p.loadImage("sprites/bird.png");
        p.bgSprite = p.loadImage("sprites/bg.png");
        p.groundSprite = p.loadImage("sprites/fg.png");
        p.pipeTopSprite = p.loadImage("sprites/pipeTop.png");
        p.pipeBottomSprite = p.loadImage("sprites/pipeBottom.png");
        p.speciesSprite = [];
        for(let i = 0; i <= 15; i++) {
            let image = p.loadImage(`sprites/colored-birds/bird-${i}.png`);
            p.speciesSprite.push(image);
        }
    }

    p.setup = () => {
        p.frameRate(30);
        window.canvas = p.createCanvas(340, 570);
        players = [];
        for (let i = 0; i < playerCount; i++) {
            players.push(new Player(window.canvas.width / 3, window.canvas.height / 2));
        }
        window.pipePairA = new PipePair(p);
        window.pipePairB = new PipePair(p, window.canvas.width / 2 + 35);
        window.ground = new Ground();
    }

    var count = 0;
    var highscore = 0;
    var birdsAlive = playerCount;


    p.draw = () => {
        count++;

        p.image(p.bgSprite, 0, -100);
        p.bgSprite.resize(window.canvas.width, 0);

        pipePairA.update(p);
        pipePairA.show(p);
        pipePairB.update(p);
        pipePairB.show(p);

        ground.show(p);

        p.textSize(20);
        p.text(`Generation ${neat.generation} (${Object.keys(neat.speciesDict).length})`, 10, canvas.height - 20);
        p.text('Score ' + count, 10, canvas.height - 50);
        p.text('Highscore ' + highscore, 180, canvas.height - 50);
        p.text('Alive ' + birdsAlive, 180, canvas.height - 20);

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
                players[i].update(p);
                players[i].show(p, p.speciesSprite[neat.population[i].species]);
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
            p.setup();
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
}

var gameSketch = new p5(game, 'game');

var network = n => {

    n.setup = () => {
        n.frameRate(30);
        n.createCanvas(600, 340);
    }

    // TODO: This wörks but should definitly be refactored...
    n.draw = () => {

        n.background(240,240,240);

        let inputOffset = 50;
        n.textSize(20);

        bestPlayer = neat.getOverallChampion();

        // Draw Bias Node
        n.fill(204, 101, 192, 127);
        n.stroke(127, 63, 120);
        n.ellipse(65, 20, 20, 20);
        n.text("Bias", 0, 25);

        // Draw all Input Nodes
        n.fill(100, 1, 192, 127);
        bestPlayer.brain.getInputNodes().map((node, i) => {
            i++;
            n.ellipse(65, 20 + inputOffset * i, 20, 20);
            n.text("Input", 0, 25 + inputOffset * i);
        });

        // Draw all Output Nodes
        n.fill(10, 100, 12, 127);
        bestPlayer.brain.getOutputNodes().map((node, i) => {
            i++;
            if(node.outputValue > 0.5) n.fill(10, 100, 12, 255);
            n.ellipse(350, 40 + inputOffset * i, 20, 20);
            n.text(`Output: ${Number(node.outputValue).toFixed(3)}`, 365, 48 + inputOffset * i);
        });

        // Draw all hidden Notes
        n.fill(50, 150, 55, 127);
        bestPlayer.brain.getHiddenNodes().map((node, i) => {
            i++;
            n.ellipse(140, inputOffset * i, 20, 20);
        });

        bestPlayer.brain.connections.map((connection, i) => {
            if(bestPlayer.brain.nodes[connection.start].type == 'bias') {
                if (bestPlayer.brain.nodes[connection.end].type == 'output') {
                    n.line(65, 20, 350, 40 + inputOffset * (connection.end - bestPlayer.brain.numInputNodes));
                } else {
                    n.line(65, 20, 140, inputOffset * (connection.end - bestPlayer.brain.numInputNodes - bestPlayer.brain.numOutputNodes));
                }
            }
            if (bestPlayer.brain.nodes[connection.start].type == 'input') {
                if (bestPlayer.brain.nodes[connection.end].type == 'output') {
                    n.line(65, 20 + inputOffset * connection.start, 350, 40 + inputOffset * (connection.end - bestPlayer.brain.numInputNodes));
                } else {
                    n.line(65, 20 + inputOffset * connection.start, 140, inputOffset * (connection.end - bestPlayer.brain.numInputNodes - bestPlayer.brain.numOutputNodes));
                }
            }
            if (bestPlayer.brain.nodes[connection.start].type == 'hidden') {
                if (bestPlayer.brain.nodes[connection.end].type == 'output') {
                    n.line(140, inputOffset * (connection.start - bestPlayer.brain.numInputNodes - bestPlayer.brain.numOutputNodes), 350, 40 + inputOffset * (connection.end - bestPlayer.brain.numInputNodes));
                } else {
                    n.line(140, inputOffset * (connection.start - bestPlayer.brain.numInputNodes - bestPlayer.brain.numOutputNodes), 140, inputOffset * (connection.end - bestPlayer.brain.numInputNodes - bestPlayer.brain.numOutputNodes));
                }
            }
        });

    }
}
var network = new p5(network, 'network');