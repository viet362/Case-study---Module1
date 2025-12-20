let size = 50;

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
            this.drawImage();
        };
    }

    drawImage() {
        let imgWidth = this.image.width / this.col;
        let imgHeight = this.image.height / this.row;

        this.pen.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
        case 'left': this.indexRow = 2; break;
        case 'right': this.indexRow = 3; break;
        case 'up': this.indexRow = 1; break;
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
