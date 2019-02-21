export default class Ground {
    constructor() {
        this.width = canvas.width;
        this.height = 110;
    }

    show() {
        image(groundSprite, 0, canvas.height - this.height);
        groundSprite.resize(canvas.width, 0);
    }

    collided(p) {
        if(p.y + p.size / 2 >= (canvas.height - this.height)) {
            return true;
        }
        return false;
    }
}