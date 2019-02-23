export default class Ground {
    constructor() {
        this.width = canvas.width;
        this.height = 110;
    }

    show(p) {
        p.image(p.groundSprite, 0, canvas.height - this.height);
        p.groundSprite.resize(canvas.width, 0);
    }

    collided(p) {
        if(p.y + p.size / 2 >= (canvas.height - this.height)) {
            return true;
        }
        return false;
    }
}