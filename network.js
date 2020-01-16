
var network = n => {
  const width = 600;
  const height = 340;

  n.setup = () => {
    n.frameRate(30);
    n.createCanvas(width, height);
  };

  n.draw = () => {
    n.background(240, 240, 240);
    n.strokeWeight(1);
    n.stroke(127, 63, 120);
    let inputYOffset = 75;
    let inputXOffset = 125;
    n.textSize(20);

    bestPlayer = neat.getOverallChampion();

    const nodesMap = [];

    // Input Nodes
    nodesMap.push([
      ...bestPlayer.brain.getInputNodes(),
      bestPlayer.brain.getBiasNode()
    ]);

    // Hidden Notes
    nodesMap.push(bestPlayer.brain.getHiddenNodes());

    // Output Nodes
    nodesMap.push(bestPlayer.brain.getOutputNodes());

    nodesMap.map((nodes, i) => {
      nodes.map((node, j) => {
        switch (node.type) {
          case Types.BIAS:
            n.fill(204, 101, 192, 127);
            break;
          case Types.INPUT:
            n.fill(100, 1, 192, 127);
            break;
          case Types.OUTPUT:
            n.fill(10, 100, 12, 127);
            break;
          default:
            n.fill(50, 150, 55, 127);
        }

        let x = 0;
        if (node.type === Types.HIDDEN) {
          x = 20 + i * inputXOffset + (j % 2 != 0 ? -10 : 10);
        } else {
          x = 20 + i * inputXOffset;
        }
        let y = 0;
        if (node.type === Types.OUTPUT) {
          y = (nodesMap[0].length / 2) * inputYOffset;
        } else {
          y = 20 + j * inputYOffset + (i % 2 != 0 ? inputYOffset / 2 : 0);
        }
        n.ellipse(x, y, 20, 20);
        node.x = x;
        node.y = y;
      });
    });

    const flattMappedNodes = nodesMap.flatMap(x => x);

    bestPlayer.brain.connections.map((connection, i) => {
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
  };
};

var network = new p5(network, "network");
