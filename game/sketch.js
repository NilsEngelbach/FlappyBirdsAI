import Ground from "./ground.js";
import NEAT from "../neat/neat.js";
import PipePair from "./pipepair.js";
import Player from "./player.js";
import Types from "../neat/types.js";
import * as Activation from "../neat/activations.js";

window.panSpeed = 4;
window.gravity = 0.75;

window.players = [];
window.playerCount = 200;
window.bestPlayer = {};

window.pipePairA;
window.pipePairB;

window.neat = new NEAT(playerCount, 3, 1, Activation.sigmoid);

var game = p => {
  p.preload = () => {
    p.defaultBirdSprite = p.loadImage("sprites/bird.png");
    p.bgSprite = p.loadImage("sprites/bg.png");
    p.groundSprite = p.loadImage("sprites/fg.png");
    p.pipeTopSprite = p.loadImage("sprites/pipeTop.png");
    p.pipeBottomSprite = p.loadImage("sprites/pipeBottom.png");
    p.speciesSprite = [];
    for (let i = 0; i <= 15; i++) {
      let image = p.loadImage(`sprites/colored-birds/bird-${i}.png`);
      p.speciesSprite.push(image);
    }
  };

  p.setup = () => {
    p.frameRate(1000);
    window.canvas = p.createCanvas(340, 570);
    players = [];
    for (let i = 0; i < playerCount; i++) {
      players.push(
        new Player(window.canvas.width / 3, window.canvas.height / 2)
      );
    }
    window.pipePairA = new PipePair(p);
    window.pipePairB = new PipePair(p, window.canvas.width / 2 + 35);
    window.ground = new Ground();
  };

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
    p.text(
      `Generation ${neat.generation} (${Object.keys(neat.speciesDict).length})`,
      10,
      canvas.height - 20
    );
    p.text("Score " + count, 10, canvas.height - 50);
    p.text("Highscore " + highscore, 180, canvas.height - 50);
    p.text("Alive " + birdsAlive, 180, canvas.height - 20);

    for (let i = 0; i < playerCount; i++) {
      let nextPipepair = getNextPipepair(players[i].x);
      let heightAboveBottomPipe = nextPipepair.bottomPipe.topY - players[i].y;
      let distanceToCenter = nextPipepair.getCenterY() - players[i].y;
      let distanceToPipes =
        nextPipepair.bottomPipe.x -
        players[i].x +
        nextPipepair.bottomPipe.width;

      let inputs = [];
      //inputs[0] = players[i].y / canvas.height;
      inputs[1] = heightAboveBottomPipe / canvas.height;
      inputs[2] = distanceToPipes / canvas.width;
      inputs[0] = players[i].velY / 10;

      // Debug lines, set population to 1 and disable repopulate to properly debug
      // if(!players[i].isDead) {
      //     p.line(players[i].x, players[i].y, players[i].x, players[i].y + distanceToCenter);
      //     p.line(players[i].x, players[i].y, players[i].x + distanceToPipes, players[i].y);
      // }

      neat.population[i].see(inputs);

      if (neat.population[i].think()[0] > 0.5) {
        players[i].flap();
      }

      if (!players[i].isDead) {
        players[i].update(p);
        players[i].show(p, p.speciesSprite[neat.population[i].species]);
        neat.population[i].setFitness(players[i].score);
      }
    }

    birdsAlive = players.filter(p => !p.isDead).length;

    if (players.every(x => x.isDead)) {
      let highestScore = Math.max.apply(
        Math,
        players.map(p => p.score)
      );
      if (highestScore > highscore) {
        highscore = highestScore;
      }
      count = 0;
      birdsAlive = playerCount;
      neat.repopulate();
      p.setup();
    }
  };

  function getNextPipepair(xpos) {
    if (
      (pipePairA.bottomPipe.x + pipePairA.bottomPipe.width - xpos > 0 &&
        pipePairA.bottomPipe.x + pipePairA.bottomPipe.width - xpos <
          pipePairB.bottomPipe.x + pipePairB.bottomPipe.width - xpos) ||
      pipePairB.bottomPipe.x + pipePairB.bottomPipe.width - xpos < 0
    ) {
      return pipePairA;
    } else {
      return pipePairB;
    }
  }
};

var gameSketch = new p5(game, "game");
