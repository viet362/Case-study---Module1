let canvas = document.getElementById('myCanvas');
// resize canvas theo map
canvas.width  = map[0].length * size;
canvas.height = map.length * size;

let anim1 = new Player(canvas,'Images/character.png',4,4);
let box = new Box(canvas,'Images/box.png');
let box_on_target = new Box(canvas,'Images/box_target.png');
let wall = new Wall(canvas,'Images/wall.png');
let target = new Target(canvas,'Images/coin.png',10);
let floor = new Floor(canvas,'Images/floor.png');

let playerRow = 0;
let playerCol = 0;

// tìm player trong map
for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
        if (map[r][c] === 'P') {
            playerRow = r;
            playerCol = c;
        }
    }
}

function drawGame() {
    let pen = canvas.getContext('2d');
    pen.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            let x = c * size;
            let y = r * size;
            // vẽ nền
            floor.drawFloor(x, y);        
            // vẽ object
            if (map[r][c] === 'P'|| map[r][c] === 'Q') {
                anim1.setPostion(x, y);
                anim1.drawPlayer();
            }
            if (map[r][c] === '#') wall.drawWall(x, y);
            if (map[r][c] === 'B') box.drawBox(x, y);
            if (map[r][c] === 'X') box_on_target.drawBox(x, y);
            if (map[r][c] === 'T') target.drawTarget(x, y);
        }
    }
}


// vẽ khi load
function gameLoop() {
    drawGame();
    requestAnimationFrame(gameLoop);
}
gameLoop();

document.addEventListener('keydown', e => {
    let next_row = 0; 
    let next_col = 0;

    if (e.key === 'ArrowUp') {
        next_row = -1;
        anim1.setDirection('up');
    }
    if (e.key === 'ArrowDown') {
        next_row = 1;
        anim1.setDirection('down');
    }
    if (e.key === 'ArrowLeft') {
        next_col = -1;
        anim1.setDirection('left');
    }
    if (e.key === 'ArrowRight') {
        next_col = 1;
        anim1.setDirection('right');
    }

    if (next_row === 0 && next_col === 0) return;

    let newRow = playerRow + next_row;
    let newCol = playerCol + next_col;
    let curCell = map[playerRow][playerCol];
    let nextCell = map[newRow][newCol];

    // gặp tường
    if (nextCell === '#') return;

    // gặp box
    if (nextCell === 'B'|| nextCell === 'X') {
        let box_nextRow = newRow + next_row;
        let box_nextCol = newCol + next_col;
        let boxNext = map[box_nextRow][box_nextCol];

        // box không đẩy được
        if (boxNext === '#' || boxNext === 'B'|| boxNext === 'X') {
            return;
        }

        // đẩy box
        if( boxNext === 'T') {
            map[box_nextRow][box_nextCol] = 'X'; // box lên target
            console.log('Đẩy box lên target');
        } else {
            map[box_nextRow][box_nextCol] = 'B'; // box lên ô trống
        }
        // cập nhật vị trí player
        // box đang ở target
        if (nextCell === 'X') {
            map[newRow][newCol] = 'Q'; // player ở trên target
            console.log('Player ở trên target');
        } else {
            map[newRow][newCol] = 'P';
        }

        // gặp target sau khi đẩy box
        if( curCell === 'Q') {
            map[playerRow][playerCol] = 'T'; // player ra khỏi target
            console.log('Player ra khỏi target');
        } else {
            map[playerRow][playerCol] = ' ';
        }
    } 
    else {
        //gặp target
        if( nextCell === 'T') {
            map[newRow][newCol] = 'Q'; // player lên target
            console.log('Player lên target');
        } else {
            map[newRow][newCol] = 'P';
        }
        // rời khỏi target
        if( curCell === 'Q') {
            map[playerRow][playerCol] = 'T'; // player ra khỏi target
            console.log('Player ra khỏi target');
        } else {
            map[playerRow][playerCol] = ' ';
        }
    }

    playerRow = newRow;
    playerCol = newCol;

    anim1.updateFrame();
    drawGame();

    checkWin();
});

function checkWin() {
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 'T'|| map[r][c] === 'Q') return;
        }
    }
    alert('🎉 YOU WIN!');
}
