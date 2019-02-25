import Player from "./player.js";
import Species from "./species.js";
import CONFIG from "./config.js";
import Innovation from "./innovation.js";
import * as Activations from "./activations.js";

export default class NEAT {
    
    constructor(populationSize = 100, numInputs, numOutputs, activation = Activations.binaryStep) {
        this.population = [];
        this.populationSize = populationSize;
        this.numInputs = numInputs;
        this.numOutputs = numOutputs;
        this.activation = activation;
        this.generation = 0;
        this.speciesDict = {};

        this.initialize();
    }

    initialize() {
        //Innovation.counter = this.numOutputs + this.numInputs * this.numOutputs - 1;
        Innovation.nodeCounter = this.numInputs + this.numOutputs;

        for(let i = 0; i < this.populationSize; i++) {
            let player = new Player(this.generation, this.numInputs, this.numOutputs, this.activation);
            player.initialize();
            this.population.push(player);
        }



        this.speciesDict[0] = new Species(0, this.population[0].clone());
    }

    
    getOverallChampion() {
        return this.population.reduce((prev, current) => (prev.fitness > current.fitness) ? prev : current)
    }

    repopulate() {
        // reset organisms
        if (this.generation > 0) {
            for (let j in this.speciesDict) {
                let species = this.speciesDict[j];
                species.dropOrganisms();

                // if (species.isStagnated()) {
                //     this.population = this.population.filter(p => p.species != species.id);
                //     delete this.speciesDict[j];
                // }
            }
        }

        this.generation++;

        // assign population to species
        for (let i = 0, len = this.population.length; i < len; i++) {
            let speciesFound = false;
            for (let j in this.speciesDict) {
                let species = this.speciesDict[j];

                if (species.isCompatibleWith(this.population[i])) {
                    speciesFound = true;
                    species.assignToSpecies(this.population[i]);
                    break;
                }
            }

            if (!speciesFound) {
                const newSpeciesId = Math.max(...Object.keys(this.speciesDict).map(id => +id)) + 1;
                this.speciesDict[newSpeciesId] = new Species(newSpeciesId, this.population[i].clone());
                this.speciesDict[newSpeciesId].assignToSpecies(this.population[i]);
            }
        }
        
        // delete species with not enough organisms
        for (let key in this.speciesDict) {
            let species = this.speciesDict[key];
            
            if(species.organisms.length < 4) {
                this.population = this.population.filter(p => p.species != species.id);
                delete this.speciesDict[key];
            }
        }

        // update representative per species (for next generation)
        const uniqueSpecies = [...new Set(this.population.map(p => p.species))];
        for (let i = 0, len = uniqueSpecies.length; i < len; i++) {
            const candidates = this.speciesDict[uniqueSpecies[i]].organisms;
            const representative = candidates[Math.floor(Math.random()*candidates.length)].clone();
            this.speciesDict[uniqueSpecies[i]].representative = representative;
        }

        // sort species' organisms, drop bottom half per species, adjust fitness and declare champion
        // calculate total fitness sum
        let totalFitnessSum = 0.0;
        for (let key in this.speciesDict) {
            const species = this.speciesDict[key];
            species.sortOrganisms();
            species.cull();
            species.adjustFitness();
            species.calculateFitnessSum();
            species.getChampion();
            totalFitnessSum += species.fitnessSum;
        }

        // Decide how many off springs we need per species (based on fitness sum distribution)
        // e.g. 100 off springs in species 2
        // 25% created by cloning
        // 75% created by crossover
        //------------------------------------------------------------------------------------------------------
        let count = 0;
        for (let key in this.speciesDict) {
            const species = this.speciesDict[key];
            species.numOffsprings = Math.floor(species.fitnessSum/totalFitnessSum * this.populationSize);
            count += species.numOffsprings;
        }
        
        // assign the rest randomly
        for(let i = 0; i < this.populationSize - count; i++) {
            const keys = Object.keys(this.speciesDict);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            if(this.speciesDict[randomKey] == undefined) {
                console.log("fdas");
            }
            this.speciesDict[randomKey].numOffsprings++;
        }

        for(let key in this.speciesDict) {
            const species = this.speciesDict[key];
            if (species.organisms.length < 2) {
                species.numCloning = species.numOffsprings;
                species.numCrossover = 0;
            }else{
                species.numCloning = Math.floor(0.25 * species.numOffsprings);
                species.numCrossover = species.numOffsprings - species.numCloning;
            }
        }

        // reproduce and assign offspring to new population
        this.population = [];
        for(let key in this.speciesDict) {
            const species = this.speciesDict[key];
            if (species.numOffsprings > 0) {
                species.reproduce();
                this.population = this.population.concat(species.offsprings);
            }
        }

        if(this.population.length != this.populationSize) {
            console.log("kik");
        }

        return this.population;
    }
}
