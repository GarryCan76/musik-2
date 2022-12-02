let grid_array = document.getElementById("body").children;

loop()

function loop(){
    for (let col = 0; col < grid_array.length - 1; col++){
        row_array = grid_array[col].children
        for (let row = 0; row < row_array.length; row++){
            console.log(row_array[row])
            row_array[row].addEventListener("click", function (){ color(col, row);})
        }
    }
}

function color(col, row){
    console.log(col, row)
    row_array = grid_array[col].children
    if (row_array[row].style.backgroundColor === "black"){
        row_array[row].style.backgroundColor = "white";
    }else {
        row_array[row].style.backgroundColor = "black";
    }
}