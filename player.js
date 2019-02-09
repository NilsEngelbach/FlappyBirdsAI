class Player {

    constructor(x,y) {
       this.x = x;
       this.y = y; 
       this.velY = 8;
       this.velX = panSpeed;
       this.size = 20;
    }

    show() {
        push();
        translate(this.x - this.size / 2 - 8, this.y - this.size / 2);
        rotate((this.velY - 10) * PI / 180);
        image(birdSprite,0,0);
        pop();
        textSize(20);
        text('Velocity ' + this.velY, 10, canvas.height - 18);
    }

    update() {
        this.velY += gravity;
        this.velY = constrain(this.velY, -25, 25);
        this.y += this.velY;
        if(pipePairA.collided(this) ||  pipePairB.collided(this)) {
            this.y = 0;
        }
        // this.x += this.velX;
    }

    flap() {
        this.velY -= 12;
    }
}