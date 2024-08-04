const board = document.getElementById("gameBoard");

// Size
let width = 7;
let height = 7;


// Populate the Grid
function populate(){

    // Initialization
    let mines = 5;
    let grid = [];

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


    // Create the Board
    for (let i=0; i<height; i++){
        for (let j=0; j<width; j++){
            grid.push(0);
        }
    }

    // TEST side-by-side bombs
    // grid[8] = '💣';
    // grid[9] = '💣';
    // grid = markNumber(8, grid);
    // grid = markNumber(9, grid);
    // mines -= 2;


    // Randomly put mines
    while (mines != 0){

        let idx = Math.floor(Math.random() * 49);
        console.log("Index", idx);
        if (grid[idx] == 0){
            grid[idx] = '💣';

            grid = markNumber(idx, grid, sides, corners);
            mines--;
        }
    }

    console.log(grid);
    return grid;
}

// Mark tiles near bombs
function markNumber(idx, grid, sides, corners){
    if (corners.includes(idx)){
        if(idx == corners[0]){          // top-left
            grid[idx+1] += 1;
            grid[idx+width] += 1;
            grid[idx+width+1] += 1;
        } else if (idx == corners[1]){  // top-right
            grid[idx-1] += 1;
            grid[idx+width] += 1;
            grid[idx+width-1] += 1;
        } else if (idx == corners[2]){  // bottom-left
            grid[idx+1] += 1;
            grid[idx-width] += 1;
            grid[idx-width+1] += 1;
        } else {                        // bottom-right
            grid[idx-1] += 1;
            grid[idx-width] += 1;
            grid[idx-width-1] += 1;
        }
    
    } else {
        // Sides
        if (sides[1].includes(idx) || sides[3].includes(idx)){
            grid[idx-7] += 1;
            grid[idx+7] += 1;
            if (sides[1].includes(idx)){
                for(let i=-1; i<2; i++){
                    grid[idx+1+i*7] += 1;
                }
            }
            
            if (sides[3].includes(idx)){
                for (let i=-1; i<2; i++){
                    grid[idx-1+i*7] += 1;
                }
            }
        } else {
            // Inside
            grid[idx-1] += 1;
            grid[idx+1] += 1;
            for(let i=0; i<3; i++){
                if (!sides[2].includes(idx)){
                    grid[idx+6+i] += 1;
                }

                if (!sides[0].includes(idx)){
                    grid[idx-8+i] += 1;
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

    tile.setAttribute("class", "tileClicked");
    // Display the tile type
    if (tile.getAttribute("name") == "bomb"){
        tile.innerHTML = "💣"
    } else {
        let tileLabel = tile.getAttribute("name")
        tile.setAttribute("class", "t"+tileLabel)
        tile.innerHTML = tileLabel;
    }
    
}

// Draw the board
function drawboard(grid){
    for (i=0; i<grid.length; i++){
        let tile = document.createElement("div"); 
        tile.setAttribute("id", "tile"+i);
        tile.setAttribute("onclick", "tileClicked(id)");

        // Set Tile Attributes
        switch(grid[i]){
            case '💣':
                tile.setAttribute("name", "bomb");
                break;
            default:
                // FIX HERE
                tile.setAttribute("name", grid[i]);
                
        }

        board.appendChild(tile);
    }
}


// Run the functions
let grid = populate();
drawboard(grid);