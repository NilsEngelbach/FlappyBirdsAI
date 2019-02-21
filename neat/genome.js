import Types from "./types.js";
import Node from "./node.js";
import Connection from "./connection.js";
import CONFIG from "./config.js";

export default class Genome {

    constructor(numInputNodes, numOutputNodes) {
        //BIAS|INPUT1|INPUT2|OUTPUT|HIDDEN
        //0   |     1|     2|     3|     4      POSITION & ID
        this.nodes = [];
        this.connections = [];
        this.numInputNodes = numInputNodes;
        this.numOutputNodes = numOutputNodes;
    }

    // connect input and bias nodes to output nodes with random weights
    initialize() {
        // insert BIAS node
        this.nodes.push(new Node(0, Types.BIAS, 1.0));

        // insert INPUT nodes
        for (let i = 0; i < this.numInputNodes; i++) {
            this.nodes.push(new Node(this.nodes.length, Types.INPUT));
        }
        
        // insert OUTPUT nodes
        for (let i = 0; i < this.numOutputNodes; i++) {
            this.nodes.push(new Node(this.nodes.length, Types.OUTPUT));
        }

        let inputNodes = this.getInputNodes();
        let outputNodes = this.getOutputNodes();
        
        for(let i = 0; i < outputNodes.length; i++) {
            let weight = this.randomDoubleFromInterval(-CONFIG.NEW_WEIGHT_RANGE, CONFIG.NEW_WEIGHT_RANGE);
            this.connections.push(new Connection(0, i + this.numInputNodes + 1, weight, true, this.connections.length));
        }

        for(let i = 0; i < inputNodes.length; i++) {
            for(let j = 0; j < outputNodes.length; j++) {
                let weight = this.randomDoubleFromInterval(-CONFIG.NEW_WEIGHT_RANGE, CONFIG.NEW_WEIGHT_RANGE);
                this.connections.push(new Connection(i + 1, j + this.numInputNodes + 1, weight, true, this.connections.length));
            }
        }
    }

    getBiasNode() {
        return this.nodes[0];
    }

    getInputNodes() {
        return this.nodes.slice(1, 1 + this.numInputNodes);
    }

    getOutputNodes() {
        return this.nodes.slice(1 + this.numInputNodes, 1 + this.numInputNodes + this.numOutputNodes);
    }

    getHiddenNodes() {
        return this.nodes.slice(1 + this.numInputNodes + this.numOutputNodes);
    }

    // Mutation: add new node in between two nodes who were previously connected
    // disable old connection and replace it with one new node and two new connections
    // start to new node gets weight 1.0
    // new node to end gets weight of old connection
    addNode() {
        let connection = this.connections[Math.floor(Math.random() * this.connections.length)];
        connection.enabled = false;
        let newNode = new Node(this.nodes.length, Types.HIDDEN);
        this.nodes.push(newNode);
        this.connections.push(new Connection(connection.start, newNode.id, 1.0, true, this.connections.length));
        this.connections.push(new Connection(newNode.id, connection.end, connection.weight, true, this.connections.length));
    }

    // Mutation: add new connection between two unconnected nodes
    // invalid connections:
    //  - already connected nodes
    //  - two input nodes
    //  - input node and bias
    //  - same node
    addConnection() {
        // if we have no hidden nodes, dont add new connections
        if(!this.nodes.some(n => n.type == Types.HIDDEN)){
            return;
        }

        let node1 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        let node2 = this.nodes[Math.floor(Math.random() * this.nodes.length)];

        let count = 0;

        while(this.alreadyConnected(node1, node2) || this.bothInputNodes(node1, node2) || this.inputAndBiasNode(node1, node2) || this.sameNode(node1, node2)) {
            node1 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            node2 = this.nodes[Math.floor(Math.random() * this.nodes.length)];

            // only temporary, have to check whether adding a new connection is even possible
            count++;
            if(count > 30) {
                return;
            }
        }

        let weight = this.randomDoubleFromInterval(-CONFIG.NEW_WEIGHT_RANGE, CONFIG.NEW_WEIGHT_RANGE);
        this.connections.push(new Connection(node1.id, node2.id, weight, true, this.connections.length));
    }

    sameNode(node1, node2) {
        return (node1.id == node2.id);
    }

    bothInputNodes(node1, node2) {
        if(node1.type == Types.INPUT && node2.type == Types.INPUT) {
            return true;
        }else{
            return false;
        }
    }

    inputAndBiasNode(node1, node2) {
        if(node1.type == Types.INPUT && node2.type == Types.BIAS) {
            return true;
        }else if(node1.type == Types.BIAS && node2.type == Types.INPUT) {
            return true;
        }else{
            return false;
        }
    }

    alreadyConnected(node1, node2) {
        for(let i = 0; i < this.connections.length; i++) {
            if(this.connections[i].start == node1.id && this.connections[i].end == node2.id) {
                return true;
            }

            if(this.connections[i].end == node1.id && this.connections[i].start == node2.id) {
                return true;
            }
        }
        return false;
    }

    setInputs(inputValues) {
        for (let i = 1; i <= this.numInputNodes; i++) {
            this.nodes[i].outputValue = inputValues[i-1];
        }
    }
    
    activateNetwork() {
        // activate hidden nodes, then output nodes
        let hiddenNodes = this.getHiddenNodes();
        for (let i = 0; i < hiddenNodes.length; i++) {
            this.activateNode(hiddenNodes[i]);
        }
        
        let outputNodes = this.getOutputNodes();
        for (let i = 0; i < outputNodes.length; i++) {
            this.activateNode(outputNodes[i]);
        }

        // return output values
        return outputNodes.map(n => n.outputValue);
    }

    activateNode(node) {
        // do not fire if disabled
        let inputConnections = this.connections.filter(c => c.end == node.id);
        let localSum = 0.0;
        for (let j = 0; j < inputConnections.length; j++) {
            if(!inputConnections[j].enabled) {
                continue;
            }

            let startNode = this.nodes.find(n => n.id == inputConnections[j].start);
            localSum += startNode.outputValue * inputConnections[j].weight;
        }

        node.outputValue = this.sigmoid(localSum);
        // node.outputValue = this.binaryStep(localSum, 0.5);
        // node.outputValue = this.tanh(localSum);
    }

    sigmoid(x) {
        return 1.0 / (1.0 + Math.pow(Math.E, -4.9 * x));
    }

    tanh(x) {
        return Math.tanh(x);
    }

    binaryStep(x, step) {
        return x < step ? 0.0 : 1.0;
    }

    randomDoubleFromInterval(min, max) {
        return Math.random() * (max - min) + min;
    }

    clone() {
        let clone = new Genome(this.numInputNodes, this.numOutputNodes);

        for(let i = 0; i < this.nodes.length; i++) {
            clone.nodes.push(this.nodes[i].clone());
        }

        for(let i = 0; i < this.connections.length; i++) {
            clone.connections.push(this.connections[i].clone());
        }

        return clone;
    }
}
