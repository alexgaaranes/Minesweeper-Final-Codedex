const board = document.getElementById("gameBoard");
const resetBtn = document.getElementById("restart");
var mainGrid = [];
var sides = [[],[],[],[]];
var corners = [0]

// Check if update of corners is needed
var canUpdateCorner = 0;

// Size
let width = 7;
let height = 7;

// Bombs
const initial_mines = 5;


// Populate the Grid
function populate(){

    // Initialization
    let grid = [];

    // Create the Grid
    for (let i=0; i<height; i++){
        for (let j=0; j<width; j++){
            grid.push(0);
        }
    }
    return grid;
}


// Function to Create the GameBoard
function createBoard(grid, firstIdx){
    // Initializations
    let mines = initial_mines;
    sides = [[],[],[],[]];
    corners = [0]

    // indexes of sides excluding corners
    for (let i=1; i<width-1; i++){  // TOP [0]
        sides[0].push(i);
    }
    for (let i=width; i<width*height-width; i += width){   // LEFT [1]
        sides[1].push(i);
    }
    for (let i=width*height-width+1; i<width*height-1; i++){    // BOTTOM [2]
        sides[2].push(i);
    }
    for (let i=width*2-1; i<width*height-1; i += width){    // RIGHT [3]
        sides[3].push(i);
    }

    // top-left, top-right, bottom-left, bottom-right
    corners.push(width-1);
    corners.push(width*height-width);
    corners.push(width*height-1);

    let safeSpace = getSafeSpace(sides, corners, firstIdx);

    // Random Indexes for bombs
    bombSpace = [];
    while(mines !=0){
        let idx = Math.floor(Math.random() * (width*height - safeSpace.length));
        if(!bombSpace.includes(idx) && !safeSpace.includes(idx)){
            bombSpace.push(idx);
            mines--;
        }
    }

    // Put mines
    for (let i=0; i<bombSpace.length; i++){
        console.log("Index", bombSpace[i]);
        grid[bombSpace[i]] = '💣';
        grid = markNumber(bombSpace[i], grid, sides, corners);
    }

    return grid;
}


function getSafeSpace(sides, corners, firstIdx){
    // Safe Space
    let safeSpace = [];

    safeSpace.push(firstIdx);
    if(corners.includes(firstIdx)){
        if(firstIdx == corners[0]){
            safeSpace.push(firstIdx + 1);
            for(let i=0; i<2; i++){
                safeSpace.push(firstIdx+width+i);
            }
        } else if (firstIdx == corners[1]){
            safeSpace.push(firstIdx - 1);
            for(let i=0; i<2; i++){
                safeSpace.push(firstIdx+width-i);
            }
        } else if (firstIdx == corners[2]){
            safeSpace.push(firstIdx + 1);
            for(let i=0; i<2; i++){
                safeSpace.push(firstIdx-width+i);
            }
        } else if (firstIdx == corners[3]){
            safeSpace.push(firstIdx - 1);
            for(let i=0; i<2; i++){
                safeSpace.push(firstIdx-width-i);
            }
        }
    } else {
        if (sides[1].includes(firstIdx) || sides[3].includes(firstIdx)){
            safeSpace.push(firstIdx + width);
            safeSpace.push(firstIdx - width);
            if(sides[1].includes(firstIdx)){
                for(let i=-1; i<2; i++){
                    safeSpace.push(firstIdx+1+i*width);
                }
            }

            if(sides[3].includes(firstIdx)){
                for(let i=-1; i<2; i++){
                    safeSpace.push(firstIdx-1+i*width);
                }
            }
        } else {
            safeSpace.push(firstIdx+1);
            safeSpace.push(firstIdx-1);
            for (let i=0; i<3; i++){
                if(!sides[2].includes(firstIdx)){
                    safeSpace.push(firstIdx+width-1+i);
                }

                if(!sides[0].includes(firstIdx)){
                    safeSpace.push(firstIdx-width-1+i);
                }
            }
        }
    }
    // console.log(safeSpace);
    return safeSpace;
}


// Mark tiles near bombs
function markNumber(idx, grid, sides, corners){
    // Check if there's adjacent bomb

    if (corners.includes(idx)){
        if(idx == corners[0]){          // top-left
            grid[idx+1]=='💣' ? null: grid[idx+1] += 1;
            grid[idx+width]=='💣' ? null: grid[idx+width] += 1;
            grid[idx+width+1]=='💣' ? null: grid[idx+width+1] += 1;
        } else if (idx == corners[1]){  // top-right
            grid[idx-1]=='💣' ? null: grid[idx-1] += 1;
            grid[idx+width]=='💣' ? null: grid[idx+width] += 1;
            grid[idx+width-1]=='💣' ? null: grid[idx+width-1] += 1;
        } else if (idx == corners[2]){  // bottom-left
            grid[idx+1]=='💣' ? null: grid[idx+1] += 1;
            grid[idx-width]=='💣' ? null: grid[idx-width] += 1;
            grid[idx-width+1]=='💣' ? null: grid[idx-width+1] += 1;
        } else {                        // bottom-right
            grid[idx-1]=='💣' ? null: grid[idx-1] += 1;
            grid[idx-width]=='💣' ? null: grid[idx-width] += 1;
            grid[idx-width-1]=='💣' ? null: grid[idx-width-1] += 1;
        }
    
    } else {
        // Sides
        if (sides[1].includes(idx) || sides[3].includes(idx)){
            grid[idx-width]=='💣' ? null: grid[idx-width] += 1;
            grid[idx+width]=='💣' ? null: grid[idx+width] += 1;
            if (sides[1].includes(idx)){
                for(let i=-1; i<2; i++){
                    grid[idx+1+i*width]=='💣' ? null: grid[idx+1+i*width] += 1;
                }
            }
            
            if (sides[3].includes(idx)){
                for (let i=-1; i<2; i++){
                    grid[idx-1+i*width]=='💣' ? null: grid[idx-1+i*width] += 1;
                }
            }
        } else {
            // Inside
            grid[idx-1] == '💣'? null: grid[idx-1] += 1;
            grid[idx+1] == '💣'? null: grid[idx+1] += 1;
            for(let i=0; i<3; i++){
                if (!sides[2].includes(idx)){
                    grid[idx+width-1+i]=='💣' ? null: grid[idx+width-1+i] += 1;
                }

                if (!sides[0].includes(idx)){
                    grid[idx-width-1+i]=='💣' ? null: grid[idx-width-1+i] += 1;
                }
            }
        }
    }
    // console.log(grid);
    return grid;
}

// When a tile is clicked
function tileClicked(id){
    canUpdateCorner = false;
    let tile = document.getElementById(id);

    
    // Display the tile type
    if (tile.getAttribute("name") == "bomb"){
        tile.setAttribute("class", "bomb");
        tile.innerHTML = "💣";
        let title = document.querySelector("h1");
        title.innerHTML = "You Lost!";
        title.style.color = "red";
    } else {
        let tileLabel = tile.getAttribute("name")
        tile.setAttribute("class", "t"+tileLabel)
        if (tileLabel != "0"){
            tile.innerHTML = tileLabel;
        }
    }
    
    
    excavate(id);
    if (canUpdateCorner == 0){ console.log("updating corners");updateCorner();}

    if(checkWin()){
        title = document.querySelector("h1");
    title.innerHTML = "You Won!";
    title.style.color = "green";
    }
}

function cornerClicked(id){
    let tile = document.getElementById(id);

    if (tile.getAttribute("name") == "bomb"){
        tile.setAttribute("class", "bomb");
        tile.innerHTML = "💣";
    } else {
        let tileLabel = tile.getAttribute("name")
        tile.setAttribute("class", "t"+tileLabel)
        if (tileLabel != "0"){
            tile.innerHTML = tileLabel;
        }
    }
}

// CHECK 4 DIRECTIONS
function checkTop(idx){
    if ((!sides[0].includes(idx) != (idx != corners[0]) != (idx != corners[1])) && mainGrid[idx-width] != '💣'){
        const tile = document.getElementById("tile"+String(idx-width)); 
        // console.log(tile);
        return tile.getAttribute("class") != "t"+tile.getAttribute("name") ? true : false;
    }
}

function checkLeft(idx){
    if ((!sides[1].includes(idx) != (idx != corners[0]) != (idx != corners[2])) && mainGrid[idx-1] != '💣'){
        const tile = document.getElementById("tile"+String(idx-1)); 
        // console.log(tile);
        return tile.getAttribute("class") != "t"+tile.getAttribute("name") ? true : false;
    }
}   

function checkBottom(idx){
    if ((!sides[2].includes(idx) != (idx != corners[2]) != (idx != corners[3])) && mainGrid[idx+width] != '💣'){
        const tile = document.getElementById("tile"+String(idx+width)); 
        // console.log(tile);
        return tile.getAttribute("class") != "t"+tile.getAttribute("name") ? true : false;
    }
}

function checkRight(idx){
    if ((!sides[3].includes(idx) != (idx != corners[1]) != (idx != corners[3])) && mainGrid[idx+1] != '💣'){
        const tile = document.getElementById("tile"+String(idx+1)); 
        // console.log(tile);
        return tile.getAttribute("class") != "t"+tile.getAttribute("name") ? true : false;
    }
}

function isClicked(i){
    let numbers = [1,2,3,4,5,6,7,8];
    if(!numbers.includes(mainGrid[i]) && i > width*height && i < 0){return false;}
    let id = "tile"+String(i);
    // console.log(id);
    const tile = document.getElementById(id);
    return tile.getAttribute("class") == "t"+tile.getAttribute("name") ? true : false;
}


// Updates Right angles
function updateCorner(){
    for(let i=0; i<mainGrid.length; i++){
        // console.log(i);
        // Base case
        if (mainGrid[i] == '💣' || mainGrid[i] == 0){continue;}

        // Check grid corners
        if (corners.includes(i)){
            if(i == corners[0]){
                isClicked(i+1) && isClicked(i+width) ? cornerClicked("tile"+String(i)): null;
            } else if (i == corners[1]){
                isClicked(i-1) && isClicked(i+width) ? cornerClicked("tile"+String(i)): null;
            } else if (i == corners[2]){
                isClicked(i+1) && isClicked(i-width) ? cornerClicked("tile"+String(i)): null;
            } else if (i == corners[3]){
                isClicked(i-1) && isClicked(i-width) ? cornerClicked("tile"+String(i)): null;
            }
        } else {
            if(sides[1].includes(i)){
                if (isClicked(i+1)){
                    isClicked(i+width) ? cornerClicked("tile"+String(i))
                    : isClicked(i-width) ? cornerClicked("tile"+String(i)) : null;
                }
            } else if (sides[3].includes(i)){
                if (isClicked(i-1)){
                    isClicked(i+width) ? cornerClicked("tile"+String(i))
                    : isClicked(i-width) ? cornerClicked("tile"+String(i)) : null;
                }
            } else if (sides[0].includes(i)){
                if (isClicked(i+width)){
                    isClicked(i-1) ? cornerClicked("tile"+String(i))
                    : isClicked(i+1) ? cornerClicked("tile"+String(i)) : null;
                }
            } else if (sides[0].includes(i)){
                if (isClicked(i-width)){
                    isClicked(i+1) ? cornerClicked("tile"+String(i))
                    : isClicked(i-1) ? cornerClicked("tile"+String(i)) : null;
                }
            } else {
                if (isClicked(i-width)){
                    isClicked(i+1) ? cornerClicked("tile"+String(i))
                    : isClicked(i-1) ? cornerClicked("tile"+String(i)) : null;
                } else if (i+width < width*height && isClicked(i+width)){
                    isClicked(i-1) ? cornerClicked("tile"+String(i))
                    : isClicked(i+1) ? cornerClicked("tile"+String(i)) : null;
                }
            }
        }
    }
}


// Excavate
function excavate(id){  // Take the id of the clicked tile and check 4 directions (up, down, left, right)
    canUpdateCorner += 1;
    let idx = Number(id.slice(4, id.length));
    // console.log(id, idx);

    if (mainGrid[idx] != 0){    // base case
        return;
    }   
    

    if(checkTop(idx)){      // Top
        tileClicked("tile"+String(idx-width));
    };

    if(checkLeft(idx)){     // Left
        tileClicked("tile"+String(idx-1));
    }

    if(checkBottom(idx)){   // Bottom
        tileClicked("tile"+String(idx+width));
    }

    if(checkRight(idx)){    // Right
        tileClicked("tile"+String(idx+1))
    }

    canUpdateCorner -=1;
}


// Initial Click (Should be Safe)
function initialClick(id){
    let firstIdx = id.slice(4, id.length);
    console.log(id, firstIdx);

    mainGrid = createBoard(mainGrid, Number(firstIdx));

    // Change the tiles' attribute
    for(let i=0; i<mainGrid.length; i++){
        let tile = document.getElementById("tile"+i);
        tile.setAttribute("onclick", "tileClicked(id)");

        // Set Tile Attributes
        switch(mainGrid[i]){
            case '💣':
                tile.setAttribute("name", "bomb");
                break;
            default:
                if (mainGrid[i] !=0 ){
                    tile.setAttribute("name", mainGrid[i]);
                } else {
                    tile.setAttribute("name", "0");
                }   
        }
    }

    // the First idx should be clicked
    tileClicked(id);
}

// check if win
function checkWin(){
    let cleared = 0;
    for (let i=0; i<mainGrid.length; i++){
        let tile = document.getElementById("tile"+i);
        if (tile.getAttribute("name") != "bomb" && tile.className){
           cleared++;
        }
    }

    return mainGrid.length-cleared == initial_mines ?true:false;
}

// Draw the board
function drawboard(grid){
    // Make the Grid
    grid = populate(grid);

    // Create Elements per tile
    for (i=0; i<grid.length; i++){
        let tile = document.createElement("div"); 
        tile.setAttribute("id", "tile"+i);
        tile.setAttribute("onclick", "initialClick(id)");
        board.appendChild(tile);
    }

    return grid;
}

function cleanBoard(grid){
    for (i=0; i<grid.length; i++){
        document.getElementById("tile"+i).remove();
    }
    return grid;
}


// Run the functions
function main(){
    let title = document.querySelector("h1");
    title.innerHTML = "Clear without clicking mines";
    title.style.color = "purple";
    mainGrid = cleanBoard(mainGrid);
    mainGrid = drawboard(mainGrid);
}

// Initial Start
main();
