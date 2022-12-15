let context = new AudioContext();
let volume = new GainNode(context,{gain:0.1});
let synths = []
let frequency = 100
let tick = 0;
let setup = true
let track_matrix = []
let col_length = 20
let row_length = 16
let keys = []
let track_time = []
let ocs_type = 'sine'
let nodes = [null];
let con_nect = true
const detunes = ["detune_label1", "detune_label2", "detune_label3", "detune_label4"]
const types = ["type_label1", "type_label2", "type_label3", "type_label4"]
let destination = false;
let node = true;

setup_func()
function setup_func(){
    if (setup === true){
        setup = false
        for (let x = 0; x < 4; x++){
            var ocses = [];
            for (let i = 0; i < 4; i++){
                var ocs = context.createOscillator();
                ocses.push(ocs)
                ocses[i].start()
            }
            synths.push(ocses)
        }
        for (let x = 0; x < col_length; x++){
            div_col = document.createElement('div');
            div_col.classList.add('col');
            col = document.getElementById('midi').appendChild(div_col);
        }
        let cols = document.getElementsByClassName('col')
        for (let i = 0; i < cols.length; i++){
            for (let a = 0; a < row_length; a++){
                div = document.createElement('div')
                cols[i].appendChild(div)
            }
        }
        console.log(synths)

        grid_array = document.getElementById('midi').children
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
    for (let i = 0; i < track_time.length; i++){
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
    for (let i = 0; i < track_time.length; i++){
        track_time[i].style.filter = "hue-rotate(90deg)";
    }


    for (let f = 0; f < synths.length; f++){
        var current_ocs = synths[f];
        for (let s = 0; s < current_ocs.length; s++){
            if (keys[f] !== undefined){
                frequency = keys[f] * -10 + 200;
                current_ocs[s].frequency.value = frequency;
            }else {
                current_ocs[s].frequency.value = 0;
            }
        }
        synths[f] = current_ocs;
    }


    if (tick === grid_row.length - 1){
        tick = 0;
    }else {
        tick += 1;
    }
}
function synth_func(type, num, ocs){
    for (let x = 0; x < 4; x++){
        if (type === "toggle_ocs"){
            if (ocs.checked){
                synths[x][num].connect(volume)
            }else {
                synths[x][num].disconnect(volume)
            }
        }
        if (type === "detune_ocs"){
            document.getElementById(detunes[num]).innerHTML = ocs.value;
            synths[x][num].detune.value = ocs.value;
        }
        if (type === "type_ocs") {
            if (ocs.value === "0") {
                ocs_type = 'sine';
            } else if (ocs.value === "1") {
                ocs_type = 'square';
            } else if (ocs.value === "2") {
                ocs_type = 'sawtooth';
            } else if (ocs.value === "3") {
                ocs_type = 'triangle';
            }
            synths[x][num].type = ocs_type;
            document.getElementById(types[num]).innerHTML = ocs_type;
        }
        if (type === "toggle_filter" && x === 1){
            if (nodes[0] === null){
                nodes[0] = context.createBiquadFilter();
                nodes[0].frequency = 500;
            }else {
                nodes[0] = null;

            }
            con_nect = true
        }

        if (con_nect === true){
            for (let i = 1; i < nodes.length; i++){
                if (i !== !nodes.length){
                    volume.disconnect(nodes[i])
                }
            }
            if (nodes[0] === null){
                volume.connect(context.destination)
                console.log('off')
                destination = true;
            }else {
                volume.connect(nodes[0])
                nodes[nodes.length - 1].connect(context.destination)
                node = true;
                if (destination === true){
                    volume.disconnect(context.destination)
                    destination = false;
                    node = false;
                }
            }
            if (node === false){
                nodes[nodes.length - 1].disconnect(context.destination)
                console.log('on')
            }
        }
        if (type === 'filt_freq' && nodes[0] !== null){
            nodes[0].frequency.value = ocs.value;
            document.getElementById('filt_freq_label').innerHTML = ocs.value
        }
    }
}
