let context = new AudioContext();
let sound = context.createOscillator();
let volume = new GainNode(context,{gain:0.1});
let frequency = 10
let tick = 0;
let grid_array = document.getElementById("body").children;
let track_matrix = [[0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0]]

sound.start()
volume.connect(context.destination)
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
    context.resume()
    sound.connect(volume)
    y = track_matrix[col]
    if (y[row] === 0){
        y[row] = 1;
    }else {
        y[row] = 0;
    }
    row_array = grid_array[col].children
    if (row_array[row].style.backgroundColor === "black"){
        row_array[row].style.backgroundColor = "white";
    }else {
        row_array[row].style.backgroundColor = "black";
    }
}
setInterval(play, 1000)
function play(){
    for (let col = 0; col < track_matrix.length; col++){
        row = track_matrix[col]
        console.log(row[tick])
        if (row[tick] === 1){
            frequency = 100 * col;
        }
    }
    if (tick === 5){
        tick = 0
    }else {
        tick += 1
    }
    sound.frequency.value = frequency;
    console.log(frequency)
}