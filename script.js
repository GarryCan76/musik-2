let context = new AudioContext();
let sound = context.createOscillator();
let volume = new GainNode(context,{gain:0.1});
let frequency = 10
let tick = 0;
let setup = true
let grid_array = document.body.children
let grid_row = grid_array[0].children
let track_matrix = []
let col_lenght = 10
let row_lenght = 30
sound.start()
volume.connect(context.destination)
setup_func()
function setup_func(){
    if (setup === true){
        setup = false
        for (var x = 0; x < col_lenght; x++){
            div_col = document.createElement('div');
            div_col.classList.add('col');
            const col = document.body.appendChild(div_col);
        }
        var cols = document.getElementsByClassName('col')
        for (var i = 0; i < cols.length; i++){
            for (var a = 0; a < row_lenght; a++){
                div = document.createElement('div')
                cols[i].appendChild(div)
            }
        }

        grid_array = document.body.children
        grid_row = grid_array[1].children
        for (let i = 0; i < grid_array.length; i++){
            track_matrix.push([])
            for (let r = 0; r < grid_row.length; r++){
                track_matrix[i].push(0)
            }
        }
        console.log(track_matrix)
    }
}
loop()
function loop(){
    for (let col = 0; col < grid_array.length; col++){
        row_array = grid_array[col].children
        for (let row = 0; row < row_array.length; row++){
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
setInterval(play, 200)
function play(){
    for (let col = 0; col < track_matrix.length; col++){
        row = track_matrix[col]
        if (row[tick] === 1){
            frequency = 100 * col;
        }
    }
    if (tick === grid_row.length){
        tick = 0
    }else {
        tick += 1
    }
    sound.frequency.value = frequency
}