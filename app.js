
// grab header and tiles elements
header = document.getElementById("header");
tiles = document.getElementById("tiles");

// set header to 8-Puzzle
header.innerText = "8-Puzzle"

// set TOTAL of squares
let TOTAL = 9;
let BOARD_ARRAY = []

const RandomizeArray = arr => {   
    // create array with solved order
    for (let i = 0; i < TOTAL - 1; i ++) {
        arr[i] = i + 1;
    }
    arr[TOTAL - 1] = 0;

    // random number between 6 and 15, zero index, len dimension of square
    let randomMoves = Math.floor(Math.random() * 10) + 6;
    let zeroIndex = TOTAL - 1;
    let len = Math.sqrt(TOTAL);
    
    for (let i = 0; i < randomMoves; i++) {
        let moveArr = [zeroIndex - 1, zeroIndex - len, zeroIndex + 1, zeroIndex + len];
        let randomMove = Math.floor(Math.random() * 4);
        let moveIndex = moveArr[randomMove];
        
        // check for top, bottom, left, right walls
        while (moveIndex < 0 || 
               moveIndex > TOTAL - 1 ||
              (moveIndex % len == 0 && randomMove == 2)||
              (moveIndex % len == len - 1 && randomMove == 0)) {
            randomMove = Math.floor(Math.random() * 4);
            moveIndex = moveArr[randomMove];
        }

        // switch values
        let hold = arr[zeroIndex];
        arr[zeroIndex] = arr[moveIndex];
        arr[moveIndex] = hold;

        zeroIndex = moveIndex;
    }
    console.log(arr);
    return arr;
    
}
// create tile function
const createTile = (TOTAL, number, order) => {

    // create tile element
    tile = document.createElement("div");
    tile.innerHTML = `<p>${number}</p>`;
    tile.setAttribute("class", "tile")
    
    // get length of square and row, col coordinates
    let length = Math.sqrt(TOTAL)
    let col = order % length + 1;
    let row = Math.floor(order / length) + 1;

    // set these in attributes of elements
    tile.setAttribute("row", row)
    tile.setAttribute("col", col)
    tile.setAttribute("order", order)

    // if zero tile set class to "zero-tile"
    // set zero position 
    if (number == 0) {
        tile.setAttribute("class", "zero-tile");
        tile.setAttribute("zero", true);
    }

    tile.setAttribute("style", `grid-area: ${row} / ${col} / span 1 / span 1`)
    
    tiles.appendChild(tile);
}

const createBoard = arr => {
    boardArray = RandomizeArray(arr);

    for (let i = 0; i < TOTAL; i++) {
        createTile(TOTAL, boardArray[i], i);
    }

    // createTile(TOTAL, 0, TOTAL - 1);
}
createBoard(BOARD_ARRAY);

const isSolved = arr => {
    console.log("checking...", arr)
    for (let i = 0; i < TOTAL - 1; i++)
    if (arr[i] != i + 1) {
        return false;
    }
    return true;
}

let zeroTile = document.getElementsByClassName("zero-tile")[0];
let tileCollection = document.getElementsByClassName("tile");

const startApp = () => {
    for (let child of tileCollection) {
        // console.log(child);
        child.addEventListener("click", onClick);
  
    }
}

const stopApp = () =>{
    for (let child of tileCollection) {
        child.removeEventListener("click", onClick)
    }
    document.documentElement.style.setProperty('--back-color', 'green');
    header.innerText = "You Solved the Puzzle!"
}

const onClick = event => {
    // event.target.style.color = "red";
    let tile = event.currentTarget;
    
    // get zero tile position
    let zeroRow = parseInt(zeroTile.getAttribute("row"), 10);
    let zeroCol = parseInt(zeroTile.getAttribute("col"), 10);
    let row = parseInt(tile.getAttribute("row"), 10);
    let col = parseInt(tile.getAttribute("col"), 10);

    if ((zeroRow == row & Math.abs(zeroCol - col) == 1) || (zeroCol == col & Math.abs(zeroRow - row) == 1)) {
        // set row, col attributes to of tile and zero tile
        tile.setAttribute("row", zeroRow)
        tile.setAttribute("col", zeroCol)
        zeroTile.setAttribute("row", row)
        zeroTile.setAttribute("col", col)

        // switch grid area
        tile.setAttribute("style", `grid-area: ${zeroRow} / ${zeroCol} / span 1 / span 1`)
        zeroTile.setAttribute("style", `grid-area: ${row} / ${col} / span 1 / span 1`)

        // switch board array
        let zeroI = (zeroCol - 1) + (zeroRow - 1) * Math.sqrt(TOTAL);
        let moveI = (col - 1) + (row - 1) * Math.sqrt(TOTAL);
        
        let hold = BOARD_ARRAY[zeroI];
        BOARD_ARRAY[zeroI] = BOARD_ARRAY[moveI];
        BOARD_ARRAY[moveI] = hold;


        if (isSolved(BOARD_ARRAY)) {
            console.log("solved");
            stopApp();
        }
    }
}

startApp();



