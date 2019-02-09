class Ground {
    constructor() {
        this.width = canvas.width;
        this.height = 60;
    }

    show() {
        image(groundSprite, 0, canvas.height - this.height);
        groundSprite.resize(canvas.width, 0);
    }
}