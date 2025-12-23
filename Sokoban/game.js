let canvas = document.getElementById('myCanvas');

function parseLevels(data) {
  const lines = data.split('\n');
  const levels = {};
  let currentMap = [];
  let currentLevel = null;

  for (let line of lines) {
    line = line.replace(/\r$/, '');

    const match = line.match(/^Level\s+(\d+)/);
    if (match) {
      if (currentLevel !== null) {
        levels[currentLevel] = normalizeMap(currentMap);
      }
      currentLevel = Number(match[1]);
      currentMap = [];
    } else if (line.trim() !== '') {
      currentMap.push(line);
    }
  }

  if (currentLevel !== null) {
    levels[currentLevel] = normalizeMap(currentMap);
  }

  return levels;
}
function normalizeMap(map) {
  let maxCols = 0;
    for (let i = 0; i < map.length; i++) {
        let row_number = map[i].length;  // Lấy độ dài của dòng hiện tại
        if (row_number > maxCols) {
            maxCols = row_number;
        }
    }
  return map.map(row => row.padEnd(maxCols, ' '));
}

const maps = parseLevels(rawData);

let index_level = 0;
// let originalMap = maps[parseInt(Math.random() * Object.keys(maps).length)].map(row => row.split(''));
let originalMap = maps[index_level].map(row => row.split(''));
let map = originalMap.map(row => [...row]);
console.log(map);
gamePlay();

function resetMap(){
    originalMap = maps[index_level].map(row => row.split(''));
    map = originalMap.map(row => [...row]);
    gamePlay();
}

function nextMap(){
    index_level++;
    originalMap = maps[index_level].map(row => row.split(''));
    map = originalMap.map(row => [...row]);
    gamePlay();
}

function selectMap(){
    let max_level = Object.keys(maps).length - 1;
    do{
        index_level = + prompt("Enter 0~" + max_level + " level");
        if(isNaN(index_level) || index_level < 0 || index_level > max_level){ alert("Level is not exit!")};
    } while (isNaN(index_level) || index_level < 0 || index_level > max_level);
    originalMap = maps[index_level].map(row => row.split(''));
    map = originalMap.map(row => [...row]);
    gamePlay();
}

function randomMap(){
    index_level = parseInt(Math.random() * Object.keys(maps).length);
    originalMap = maps[index_level].map(row => row.split(''));
    map = originalMap.map(row => [...row]);
    gamePlay();
}

function gamePlay(){
    document.getElementById("level-info").innerText = "Level " + index_level;
    // resize canvas theo map
    canvas.width  = map[0].length * size;
    canvas.height = map.length * size;

    let anim1 = new Player(canvas,'Images/character.png',4,4);
    let anim_on_target = new Player(canvas,'Images/character_target.png',1,1);
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
            if (map[r][c] === '@' || map[r][c] === '+') {
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
                if (map[r][c] !== '#') {
                    floor.drawFloor(x, y);
                }
                // vẽ object
                if (map[r][c] === '@') {
                    anim1.setPostion(x, y);
                    anim1.drawPlayer();
                }            
                if (map[r][c] === '+') {
                    anim_on_target.setPostion(x, y);
                    anim_on_target.drawPlayer();
                }
                if (map[r][c] === '#') wall.drawWall(x, y);
                if (map[r][c] === '$') box.drawBox(x, y);
                if (map[r][c] === '*') box_on_target.drawBox(x, y);
                if (map[r][c] === '.') target.drawTarget(x, y);
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

        // Tạo bản sao map
        let mapCopy = [];
        for (let i = 0; i < map.length; i++) {
            let rowCopy = [];
            for (let j = 0; j < map[i].length; j++) {
                rowCopy.push(map[i][j]);
            }
            mapCopy.push(rowCopy);
        }

        // Lưu trạng thái vào lastMove
        lastMove = {
            map: mapCopy,
            playerRow: playerRow,
            playerCol: playerCol
        };


        let newRow = playerRow + next_row;
        let newCol = playerCol + next_col;
        let curCell = map[playerRow][playerCol];
        let nextCell = map[newRow][newCol];

        // gặp tường
        if (nextCell === '#') return;

        // gặp box
        if (nextCell === '$'|| nextCell === '*') {
            let box_nextRow = newRow + next_row;
            let box_nextCol = newCol + next_col;
            let boxNext = map[box_nextRow][box_nextCol];

            // box không đẩy được
            if (boxNext === '#' || boxNext === '$'|| boxNext === '*') {
                return;
            }

            // đẩy box
            if( boxNext === '.') {
                map[box_nextRow][box_nextCol] = '*'; // box lên target
                console.log('Đẩy box lên target');
            } else {
                map[box_nextRow][box_nextCol] = '$'; // box lên ô trống
            }
            // cập nhật vị trí player
            // box đang ở target
            if (nextCell === '*') {
                map[newRow][newCol] = '+'; // player ở trên target
                console.log('Player ở trên target');
            } else {
                map[newRow][newCol] = '@';
            }

            // gặp target sau khi đẩy box
            if( curCell === '+') {
                map[playerRow][playerCol] = '.'; // player ra khỏi target
                console.log('Player ra khỏi target');
            } else {
                map[playerRow][playerCol] = ' ';
            }
        } 
        else {
            //gặp target
            if( nextCell === '.') {
                map[newRow][newCol] = '+'; // player lên target
                console.log('Player lên target');
            } else {
                map[newRow][newCol] = '@';
            }
            // rời khỏi target
            if( curCell === '+') {
                map[playerRow][playerCol] = '.'; // player ra khỏi target
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
}

function checkWin() {
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === '.'|| map[r][c] === '+') return;
        }
    }
    alert('🎉 YOU WIN!');
}

function undoMove() {
    if (!lastMove) {
        console.log("Không có bước nào để undo!");
        return;
    }

    // Phục hồi map và vị trí player
    let mapCopy = [];
    for (let i = 0; i < lastMove.map.length; i++) {
        let rowCopy = [];
        for (let j = 0; j < lastMove.map[i].length; j++) {
            rowCopy.push(lastMove.map[i][j]);
        }
        mapCopy.push(rowCopy);
    }

    map = mapCopy;
    playerRow = lastMove.playerRow;
    playerCol = lastMove.playerCol;

    // Xóa lastMove để chỉ undo được 1 bước
    lastMove = null;

    // Vẽ lại game
    drawGame();
}

