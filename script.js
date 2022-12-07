let context = new AudioContext();
let volume = new GainNode(context,{gain:0.1});
const ocses = [];
let frequency = 100
let tick = 0;
let setup = true
let grid_array = document.body.children
let grid_row = grid_array[0].children
let track_matrix = []
let col_length = 25
let row_length = 16
let keys = []
let track_time = []

setup_func()
function setup_func(){
    if (setup === true){
        setup = false
        for (let i = 0; i < 10; i++){
            var ocs = context.createOscillator();
            ocses.push(ocs)
            ocses[i].start()
        }
        for (let x = 0; x < col_length; x++){
            div_col = document.createElement('div');
            div_col.classList.add('col');
            col = document.body.appendChild(div_col);
        }
        var cols = document.getElementsByClassName('col')
        for (let i = 0; i < cols.length; i++){
            for (let a = 0; a < row_length; a++){
                div = document.createElement('div')
                cols[i].appendChild(div)
            }
        }
        console.log(ocses)

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
        row_array = grid_array[col].children;
        for (let row = 0; row < row_array.length; row++){
            row_array[row].addEventListener("click", function (){ color(col, row);})
        }
    }
}

function color(col, row){
    context.resume()
    y = track_matrix[col]
    if (y[row] === 0){
        y[row] = 1;
    }else {
        y[row] = 0;
    }
    row_array = grid_array[col].children;
    if (row_array[row].style.backgroundColor === "skyblue"){
        row_array[row].style.backgroundColor = "palegreen";
    }else {
        row_array[row].style.backgroundColor = "skyblue";
    }
}
setInterval(play, 200)
function play(){
    keys = [];
    for (let i = 1; i < track_time.length; i++){
        track_time[i].style.filter = "hue-rotate(0deg)";
    }
    track_time = []
    for (let col = 0; col < track_matrix.length; col++){
        row = track_matrix[col]
        row_array = grid_array[col].children;
        track_time.push(row_array[tick])
        if (row[tick] === 1){
            keys.push(col)
        }
    }
    for (let i = 1; i < track_time.length; i++){
        track_time[i].style.filter = "hue-rotate(90deg)";
    }
    for (let f = 0; f < ocses.length; f++){
        if (keys[f] !== undefined){
            ocses[f].connect(volume).connect(context.destination)
            frequency = keys[f] * 15;
            ocses[f].frequency.value = frequency;
        }else {
            ocses[f].frequency.value = 0;
        }
    }
    if (tick === grid_row.length - 1){
        tick = 0;
    }else {
        tick += 1;
    }
}
