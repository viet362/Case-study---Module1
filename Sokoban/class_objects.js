// Sokoban game class
let imagesLoaded = 0;
const TOTAL_IMAGES = 5; // Player, Box, Wall, Target, Floor

class Player{
    constructor(canvas, imageName, row, col) {
        this.canvas = canvas;
        this.pen = canvas.getContext('2d');
        this.image = new Image();
        this.image.src = imageName;

        this.row = row;
        this.col = col;
        this.indexCol = 0;
        this.indexRow = 0;
        this.x = 0;
        this.y = 0;

        this.image.onload = () => {
            imagesLoaded++;
            checkStart();
        };
    }

    drawPlayer() {
        let imgWidth = this.image.width / this.col;
        let imgHeight = this.image.height / this.row;

        // this.pen.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.pen.drawImage(
            this.image,
            this.indexCol * imgWidth,
            this.indexRow * imgHeight,
            imgWidth,
            imgHeight,
            this.x,
            this.y,
            size,
            size,
        );
    }
    setDirection(direction) {
        switch(direction){
        case 'down': this.indexRow = 0; break;
        case 'left': this.indexRow = 1; break;
        case 'right': this.indexRow = 2; break;
        case 'up': this.indexRow = 3; break;
        }
    }
    updateFrame() {
        this.indexCol = (this.indexCol + 1) % this.col;
    }

    setPostion(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Box {
    constructor(canvas, imageName) {
        this.canvas = canvas;
        this.pen = canvas.getContext('2d');
        this.image = new Image();
        this.image.src = imageName;

        this.image.onload = () => {
            imagesLoaded++;
            checkStart();
        };
    }
    drawBox(x, y) {
        this.pen.drawImage(this.image, x, y, size, size);
    }
}

class Wall{
    constructor(canvas, imageName) {
        this.canvas = canvas;
        this.pen = canvas.getContext('2d');
        this.image = new Image();
        this.image.src = imageName;

        this.image.onload = () => {
            imagesLoaded++;
            checkStart();
        }
    }
    drawWall(x, y) {
        this.pen.drawImage(this.image, x, y, size, size);
    }
}

class Target{
    constructor(canvas, imageName, col) {
        this.canvas = canvas;
        this.pen = canvas.getContext('2d');
        this.image = new Image();
        this.image.src = imageName;

        this.col = col;
        this.indexCol = 0;
        this.lastTime = 0;
        this.frameInterval = 200; // ms → 0.2 giây / frame


        this.image.onload = () => {
            imagesLoaded++;
            checkStart();        
        }
    }
    drawTarget(x, y) {
        let frameWidth = this.image.width / this.col;
        let frameHeight = this.image.height;

        let now = performance.now();
        if (now - this.lastTime >= this.frameInterval) {
            this.indexCol = (this.indexCol + 1) % this.col;
            this.lastTime = now;
        }

        this.pen.drawImage(
            this.image,
            this.indexCol * frameWidth, // cắt frame
            0,
            frameWidth,
            frameHeight,
            x,
            y,
            size,
            size
        );
        // this.indexCol = (this.indexCol + 1) % this.col;
    }
}

class Floor{
    constructor(canvas, imageName) {
        this.canvas = canvas;
        this.pen = canvas.getContext('2d');
        this.image = new Image();
        this.image.src = imageName;

        this.image.onload = () => {
            imagesLoaded++;
            checkStart();
        }
    }
    drawFloor(x, y) {
        this.pen.drawImage(this.image, x, y, size, size);
    }
}

function checkStart() {
    if (imagesLoaded === TOTAL_IMAGES) {
        drawGame(); // 🔥 VẼ NGAY SAU KHI LOAD
    }
}