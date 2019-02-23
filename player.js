export default class Player {

    constructor(x,y) {
       this.x = x;
       this.y = y;
       this.velY = -4;
       this.velX = panSpeed;
       this.size = 25;
       this.score = 0;
       this.isDead = false;
       this.flapcount = 0;
    }

    show(p, sprite) {
        p.push();
        p.translate(this.x, this.y);
        p.rotate((this.velY - 10) * p.PI / 180);
        p.image(sprite ? sprite : p.defaultBirdSprite , -this.size * 0.75, -this.size / 2);
        // for debugging
        // p.fill(255, 0, 0, 50);
        // p.ellipse(0, 0, this.size, this.size);     
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