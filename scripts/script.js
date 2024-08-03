const board = document.getElementById("gameBoard");


// Populate the Grid
function populate(){
    let mines = 5;
    let grid = [];

    // Create the Board
    for (i=0; i<7; i++){
        for (j=0; j<7; j++){
            grid.push([]);
        }
    }

    // Randomly put mines
    while (mines != 0){
        let idx = Math.floor(Math.random() * 49);
        console.log("Index", idx);
        if (grid[idx].length == 0){
            grid[idx].push('💣');
            mines--;
        }
    }

    console.log(grid);
    return grid;
}

// When a tile is clicked
function tileClicked(id){
    let tile = document.getElementById(id);
    tileName = tile.getAttribute("name");

    console.log(tileName);

    // Display the tile type
    if (tile.getAttribute("name") == "bomb"){
        tile.innerHTML = "💣"
    }
    
    tile.setAttribute("class", "tileClicked");
}

// Draw the board
function drawboard(grid){
    for (i=0; i<grid.length; i++){
        let tile = document.createElement("div"); 
        tile.setAttribute("id", "tile"+i);
        tile.setAttribute("onclick", "tileClicked(id)");

        if (grid[i][0] == '💣'){
            tile.setAttribute("name", "bomb");
        } else {
            tile.setAttribute("name", "blank")
        }

        board.appendChild(tile);
    }
}


// Run the functions
let grid = populate();
drawboard(grid);