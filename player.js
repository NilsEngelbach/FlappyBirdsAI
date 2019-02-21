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

    show() {
        push();
        translate(this.x - this.size / 2 - 8, this.y - this.size / 2);
        rotate((this.velY - 10) * PI / 180);
        image(birdSprite,0,0);
        pop();
        textSize(20);
        //text('Score ' + this.score, 10, canvas.height - 18);
    }

    update() {
        this.velY += gravity;
        this.velY = constrain(this.velY, -25, 25);
        this.y += this.velY;
        if (ground.collided(this)) {
            this.isDead = true;
        }

        if(this.y < 0) {
            this.isDead = true;
        }

        this.score++;
    }

    flap() {
        this.velY -= 6;
        this.flapcount++;
    }
}