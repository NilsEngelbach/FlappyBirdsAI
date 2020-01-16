class Innovation {
  constructor() {
    this.counter = -1;
    this.nodeCounter = 3;
    this.connectionDict = [];
    this.nodeDict = [];
  }

  getNextNodeId(connection) {
    if (this.nodeDict.some(c => c.innovation == connection.innovation)) {
      return this.nodeDict.find(c => c.innovation == connection.innovation).nodeId;
    } else {
      this.nodeCounter++;
      this.nodeDict.push({
        innovation: connection.Innovation,
        nodeId: this.nodeCounter
      });
      return this.nodeCounter;
    }
  }

  getNextInnovationNumber(start, end) {
    if (this.connectionDict.some(c => c.start == start && c.end == end)) {
      return this.connectionDict.find(c => c.start == start && c.end == end).innovation;
    } else {
      this.counter++;
      this.connectionDict.push({
        start: start,
        end: end,
        innovation: this.counter
      });
      return this.counter;
    }
  }
}

export default new Innovation();
