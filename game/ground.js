export default class Ground {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = 110;
  }

  show(p) {
    p.image(p.groundSprite, 0, this.canvas.height - this.height);
    p.groundSprite.resize(this.canvas.width, 0);
  }

  collided(p) {
    if (p.y + p.size / 2 >= this.canvas.height - this.height) {
      return true;
    }
    return false;
  }
}
