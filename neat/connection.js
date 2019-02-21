import CONFIG from "./config.js";
export default class Connection {

    constructor(start, end, weight, enabled, innovation){
        this.start = start;
        this.end = end;
        this.weight = weight;
        this.enabled = enabled;
        this.innovation = innovation;
    }

    adjustWeight() {
        this.weight += this.randomDoubleFromInterval(-this.weight * 0.2, this.weight * 0.2);
    }

    reassignWeight() {
        this.weight = this.randomDoubleFromInterval(-CONFIG.NEW_WEIGHT_RANGE, CONFIG.NEW_WEIGHT_RANGE);
    }

    randomDoubleFromInterval(min, max) {
        return Math.random() * (max - min) + min;
    }

    clone() {
        let clone = new Connection(this.start, this.end, this.weight, this.enabled, this.innovation);
        return clone;
    }
}
