class PipePair {

    constructor(offsetX = 0) {
        this.gap = 80;
        this.init(offsetX);
    }

    init(offsetX) {
        this.topHeight = floor(random(20, canvas.height - 100 - this.gap));
        this.bottomHeight = canvas.height - this.topHeight - this.gap;

        this.bottomPipe = new Pipe(false, this.bottomHeight, offsetX);
        this.topPipe = new Pipe(true, this.topHeight, offsetX);
    }

    show() {
        this.bottomPipe.show();
        this.topPipe.show();
    }

    update() {
        if(this.offScreen()){
            this.init();
            this.bottomPipe.x = canvas.width;
            this.topPipe.x = canvas.width;
        }
        this.bottomPipe.update();
        this.topPipe.update();
    }

    offScreen() {
        if(this.bottomPipe.x + this.bottomPipe.width < 0) {
            return true;
        }
        return false;
    }

    collided(p) {
        return this.bottomPipe.collided(p) || this.topPipe.collided(p);
    }

}