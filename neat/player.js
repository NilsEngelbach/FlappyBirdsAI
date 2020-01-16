import Genome from "./genome.js";

export default class Player {
  constructor(
    generation,
    numInputs,
    numOutputs,
    activation,
    brain = {},
    species = 0,
    isDead = false,
    fitness = 0.0
  ) {
    this.generation = generation;
    this.numInputs = numInputs;
    this.numOutputs = numOutputs;
    this.activation = activation;
    this.isDead = isDead;
    this.fitness = fitness;
    this.species = species;
    this.brain = brain;
  }

  initialize() {
    this.brain = new Genome(this.numInputs, this.numOutputs, this.activation);
    this.brain.initialize();
  }

  // tell player what he sees
  see(inputValues) {
    this.brain.setInputs(inputValues);
  }

  // get output values after activating the player's network
  think() {
    return this.brain.activateNetwork();
  }

  setFitness(fitness) {
    this.fitness = fitness;
  }

  die() {
    this.isDead = true;
    // do more stuff here like logging
  }

  clone() {
    let clone = new Player(
      this.generation,
      this.numInputs,
      this.numOutputs,
      this.activation,
      this.brain.clone(),
      this.species,
      this.isDead,
      this.fitness
    );
    return clone;
  }
}
