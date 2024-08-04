const board = document.getElementById("gameBoard");
const resetBtn = document.getElementById("restart");
var mainGrid = [];

// Size
let width = 7;
let height = 7;


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
    let mines = 5;

    // indexes of sides excluding corners
    let sides = [[],[],[],[]];
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

    let corners = [0];  // top-left, top-right, bottom-left, bottom-right
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
    let tile = document.getElementById(id);

    
    // Display the tile type
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
    
    excavate(id);
}

// Excavate
function excavate(id){  // Take the id of the clicked tile and check 4 directions (up, down, left, right)
    let idx = Number(id.slice(4, id.length));
    // console.log(id, idx);
    
    if (mainGrid[idx] != 0){return;}    // base case
    
    if((idx - width > 0) && mainGrid[idx - width] != '💣'){             // Top
        const tile = document.getElementById("tile"+String(idx-width));        
        if(tile.getAttribute("class") != "t"+tile.getAttribute("name")){tileClicked("tile"+String(idx-width))};
    }

    if((idx - 1 % width != 0) && mainGrid[idx - 1] != '💣'){                // Left
        console.log(idx, idx+1);
        if(idx - 1 % width == 0){return ;}
        const tile = document.getElementById("tile"+String(idx-1));
        if(tile.getAttribute("class") != "t"+tile.getAttribute("name")){tileClicked("tile"+String(idx-1))};
    }

    if((idx + 1 % width != 0) && mainGrid[idx + 1] != '💣'){                // Right
        console.log(idx, idx+1);
        if(idx + 1 % width == 0){return ;}
        const tile = document.getElementById("tile"+String(idx+1));
        if(tile.getAttribute("class") != "t"+tile.getAttribute("name")){tileClicked("tile"+String(idx+1))};
    }

    if((idx + width < width*height) && mainGrid[idx + width] != '💣'){      // Bottom
        const tile = document.getElementById("tile"+String(idx+width));        
        if(tile.getAttribute("class") != "t"+tile.getAttribute("name")){tileClicked("tile"+String(idx+width))};
    }

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
                // FIX HERE
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
    mainGrid = cleanBoard(mainGrid);
    mainGrid = drawboard(mainGrid);
}

// Initial Start
main();
