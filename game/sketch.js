import Ground from "./ground.js";
import PipePair from "./pipepair.js";
import Player from "./player.js";

const POPULATION_SIZE = 200;
const NUM_INPUTS = 3;
const NUM_OUTPUTS = 1;

neaterJS.CONFIG.ALLOW_LOOPS = true;
var NEAT = neaterJS.init(POPULATION_SIZE, NUM_INPUTS, NUM_OUTPUTS, neaterJS.Activations.sigmoid);

var game = p => {

  var running = true;

  var players;
  var canvas;
  var pipePairA;
  var pipePairB;
  var ground;

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
    canvas = p.createCanvas(340, 570);
    players = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
      players.push(
        new Player(canvas.width / 3, canvas.height / 2)
      );
    }
    pipePairA = new PipePair(p, 0, canvas);
    pipePairB = new PipePair(p, canvas.width / 2 + 35, canvas);
    ground = new Ground(canvas);
    canvas.mouseClicked(toggleGame);
    addOptions();
  };

  var count = 0;
  var highscore = 0;
  var birdsAlive = POPULATION_SIZE;

  p.draw = () => {
    if (running) {
      count++;

      p.image(p.bgSprite, 0, -100);
      p.bgSprite.resize(canvas.width, 0);

      pipePairA.update(p);
      pipePairA.show(p);
      pipePairB.update(p);
      pipePairB.show(p);

      ground.show(p);
      p.fill(255,255,255);
      p.textSize(20);
      p.text(
        `Generation ${NEAT.generation} (${Object.keys(NEAT.speciesDict).length})`,
        10,
        canvas.height - 20
      );
      p.text("Score " + count, 10, canvas.height - 50);
      p.text("Highscore " + highscore, 180, canvas.height - 50);
      p.text("Alive " + birdsAlive, 180, canvas.height - 20);

      for (let i = 0; i < POPULATION_SIZE; i++) {
        let nextPipepair = getNextPipepair(players[i].x);
        let heightAboveBottomPipe = nextPipepair.bottomPipe.topY - players[i].y;
        let distanceToCenter = nextPipepair.getCenterY() - players[i].y;
        let distanceToPipes =
          nextPipepair.bottomPipe.x -
          players[i].x +
          nextPipepair.bottomPipe.width;

        let inputs = [];
        inputs[1] = heightAboveBottomPipe / canvas.height;
        inputs[2] = distanceToPipes / canvas.width;
        inputs[0] = players[i].velY / 10;

        NEAT.population[i].see(inputs);

        if (NEAT.population[i].think()[0] > 0.5) {
          players[i].flap();
        }

        if (!players[i].isDead) {
          players[i].update(p, pipePairA, pipePairB, ground);
          players[i].show(p, p.speciesSprite[NEAT.population[i].species]);
          NEAT.population[i].setFitness(players[i].score);
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
        birdsAlive = POPULATION_SIZE;
        NEAT.repopulate();
        p.setup();
      }
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

  function toggleGame() {
    running = !running;
    if (!running) {
      p.fill('rgba(0%,0%,0%,0.1)');
      p.rect(0, 0, canvas.width, canvas.height);
      p.fill(255,255,255);
      p.rect(canvas.width / 2 - 7, canvas.height / 2 - 20, 10, 35)
      p.rect(canvas.width / 2 + 7, canvas.height / 2 - 20, 10, 35)

    }
  }

  function addOptions() {

    const container = document.getElementById("species");
    container.innerHTML = "";
    var button = document.createElement("button");
    button.innerHTML = "Champion";
    button.style.padding = 0;
    button.setAttribute("bird", -1);
    button.onclick = setSpecies;
    container.appendChild(button);

    Object.keys(NEAT.speciesDict).forEach(function(key) {
      if (NEAT.speciesDict[key].champion.fitness > 0) {
        var button = document.createElement("button");
        button.innerHTML = "Species: " + key;
        button.style.backgroundImage = "url('./sprites/colored-birds/bird-" + key % 15 +  ".png')";
        button.setAttribute("bird", key);
        button.onclick = setSpecies;
        container.appendChild(button);
      }
    });
  }

  function setSpecies(element) {
    var event = new CustomEvent("species", {
      detail: {
        species: element.target.getAttribute("bird")
      }
    });
    window.dispatchEvent(event);
  }
};

var gameSketch = new p5(game, "game");

var network = n => {
  const width = 340;
  const height = 360;

  let bestPlayer;
  let bestPlayerFitness;

  let species = -1;

  window.addEventListener("species", function(e) { 
    species = e.detail.species;
  });

  n.setup = () => {
    n.frameRate(30);
    n.createCanvas(width, height);
  };

  n.draw = () => {
    if(!bestPlayer) {
      bestPlayer = NEAT.getOverallChampion();
      bestPlayerFitness = NEAT.getOverallChampion().fitness;
    }

    if (bestPlayerFitness < NEAT.getOverallChampion().fitness) {
     bestPlayer = NEAT.getOverallChampion();
     bestPlayerFitness = bestPlayer.fitness;
    }

    if(species > -1 && NEAT.speciesDict[species] && NEAT.speciesDict[species].champion) {
      drawBrainOfPlayer(NEAT.speciesDict[species].champion);
    } else {
      drawBrainOfPlayer(bestPlayer);
    }
  };

  function drawBrainOfPlayer(player) {

    if(!player.brain) return;

    n.background(240, 240, 240);
    n.strokeWeight(1);
    n.stroke(127, 63, 120);
    const inputYOffset = 75;
    const inputXOffset = 140;
    n.textSize(20);

    const nodeLayers = [
      [
        ...player.brain.getInputNodes(),
        player.brain.getBiasNode()
      ],
      player.brain.getHiddenNodes(),
      player.brain.getOutputNodes()
    ];

    nodeLayers.map((layer, i) => {
      let distance = height; 
      if(layer && layer.length) {
        distance = height / layer.length;
      }

      layer.map((node, j) => {
        switch (node.type) {
          case 'bias':
            n.fill(204, 101, 192, 127);
            break;
          case 'input':
            n.fill(100, 1, 192, 127);
            break;
          case 'output':
            n.fill(10, 100, 12, 127);
            break;
          default:
            n.fill(50, 150, 55, 127);
        }

        let x = 0;
        if (node.type === 'hidden') {
          x = 20 + i * inputXOffset + (j % 2 != 0 ? -10 : 10);
        } else {
          x = 20 + i * inputXOffset;
        }
        let y = 0;
        if (node.type === 'output') {
          y = height / 2;
        } else if (node.type === 'hidden'){
          y = j * distance + (i % 2 != 0 ? distance / 2 : 0);
        } else {
          y = 50 + j * inputYOffset;
        }
        n.ellipse(x, y, 20, 20);
        node.x = x;
        node.y = y;
      });
    });

    const flattMappedNodes = nodeLayers.flatMap(x => x);

    player.brain.connections.map((connection, i) => {
      n.strokeWeight(1);
      n.stroke(127, 63, 120);

      if (!connection.enabled) {
        n.stroke(255, 255, 255);
      } else {
        n.strokeWeight(n.abs(connection.weight) * 4);
        connection.weight < 0 ? n.stroke(0, 0, 255) : n.stroke(255, 0, 0);
      }

      const start = flattMappedNodes.find(x => x.id === connection.start);
      const end = flattMappedNodes.find(x => x.id === connection.end);

      n.line(start.x, start.y, end.x, end.y);
    });
  }
};

new p5(network, "network");
