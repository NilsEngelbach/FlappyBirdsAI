class Pipe {
    constructor(isTop, height, offsetX) {
        this.width = 50;
        this.height = height;
        this.x = canvas.width + offsetX + this.width;

        this.isTop = isTop;
        if(isTop) {
            this.topY = 0;
            this.bottomY = this.height;
        } else {
            this.topY = canvas.height - this.height;
            this.bottomY = canvas.height;
        }
    }

    show() {
        if(this.isTop) {
            pipeTopSprite.resize(this.width, 0);
            image(pipeTopSprite, this.x, this.height - pipeTopSprite.height);
        } else {
            pipeBottomSprite.resize(this.width, 0);
            image(pipeBottomSprite, this.x, this.topY);
        }
        // fill(0, 204, 0);
        // rect(this.x, this.topY, this.width, this.height);
    }

    update() {
        this.x -= panSpeed;
    }

    collided(p) {
        if(p.x + p.size / 2 >= this.x && p.x - p.size / 2 <= this.x + this.width){
            if(!this.isTop && p.y + p.size / 2 >= this.topY){
                return true;
            }
            if(this.isTop && p.y + p.size / 2 <= this.bottomY){
                return true;
            }
        }
        return false;
    }
}