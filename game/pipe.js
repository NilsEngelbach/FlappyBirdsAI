export default class Pipe {
  constructor(isTop, height, offsetX, canvas) {
    this.canvas = canvas;
    this.width = 50;
    this.height = height;
    this.x = this.canvas.width + offsetX + this.width;

    this.isTop = isTop;
    if (isTop) {
      this.topY = 0;
      this.bottomY = this.height;
    } else {
      this.topY = this.canvas.height - this.height;
      this.bottomY = this.canvas.height;
    }
  }

  show(p) {
    if (this.isTop) {
      p.pipeTopSprite.resize(this.width, 0);
      p.image(p.pipeTopSprite, this.x, this.height - p.pipeTopSprite.height);
    } else {
      p.pipeBottomSprite.resize(this.width, 0);
      p.image(p.pipeBottomSprite, this.x, this.topY);
    }
  }

  update() {
    this.x -= 4;
  }

  collided(p) {
    if (p.x + p.size / 2 >= this.x && p.x - p.size / 2 <= this.x + this.width) {
      if (!this.isTop && p.y + p.size / 2 >= this.topY) {
        return true;
      }
      if (this.isTop && p.y - p.size / 2 <= this.bottomY) {
        return true;
      }
    }
    return false;
  }
}
