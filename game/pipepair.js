import Pipe from "./pipe.js";

export default class PipePair {
  constructor(p, offsetX = 0, canvas) {
    this.canvas = canvas;
    this.gap = 120;
    this.topHeight = 0;
    this.init(p, offsetX);
  }

  init(p, offsetX) {
    this.topHeight = p.floor(p.random(55, this.canvas.height - 165 - this.gap)); // 110 ground height
    this.bottomHeight = this.canvas.height - this.topHeight - this.gap;

    this.bottomPipe = new Pipe(false, this.bottomHeight, offsetX, this.canvas);
    this.topPipe = new Pipe(true, this.topHeight, offsetX, this.canvas);
  }

  show(p) {
    this.bottomPipe.show(p);
    this.topPipe.show(p);
  }

  update(p) {
    if (this.offScreen()) {
      this.init(p);
      this.bottomPipe.x = this.canvas.width;
      this.topPipe.x = this.canvas.width;
    }
    this.bottomPipe.update();
    this.topPipe.update();
  }

  offScreen() {
    if (this.bottomPipe.x + this.bottomPipe.width < 0) {
      return true;
    }
    return false;
  }

  getCenterY() {
    return this.topHeight + this.gap / 2;
  }

  collided(p) {
    return this.bottomPipe.collided(p) || this.topPipe.collided(p);
  }
}
