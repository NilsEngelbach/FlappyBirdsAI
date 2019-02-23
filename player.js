export default class Player {

    constructor(x,y) {
       this.x = x;
       this.y = y;
       this.velY = -4;
       this.velX = panSpeed;
       this.size = 20;
       this.score = 0;
       this.isDead = false;
       this.flapcount = 0;
    }

    show(p, sprite) {
        p.push();
        p.translate(this.x - this.size / 2 - 8, this.y - this.size / 2);
        p.rotate((this.velY - 10) * p.PI / 180);
        p.image(sprite ? sprite : p.defaultBirdSprite ,0,0);
        p.pop();
    }

    update(p) {
        this.velY += gravity;
        this.velY = p.constrain(this.velY, -10, 10);
        this.y += this.velY;
        if (pipePairA.collided(this) ||  pipePairB.collided(this) || ground.collided(this)) {
            this.isDead = true;
        }

        this.score++;
    }

    flap() {
        this.velY -= 6;
        this.flapcount++;
    }
}