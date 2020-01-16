export default class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velY = -4;
    this.velX = 4;
    this.size = 25;
    this.score = 0;
    this.isDead = false;
    this.flapcount = 0;
  }

  show(p, sprite) {
    p.push();
    p.translate(this.x, this.y);
    p.rotate(((this.velY - 10) * p.PI) / 180);
    p.image(
      sprite ? sprite : p.defaultBirdSprite,
      -this.size * 0.75,
      -this.size / 2
    );
    p.pop();
  }

  update(p, pipePairA, pipePairB, ground) {
    this.velY += 0.75;
    this.velY = p.constrain(this.velY, -10, 10);
    this.y += this.velY;
    if (
      pipePairA.collided(this) ||
      pipePairB.collided(this) ||
      ground.collided(this)
    ) {
      this.isDead = true;
    }

    this.score++;
  }

  flap() {
    this.velY = -10;
    this.flapcount++;
  }
}
