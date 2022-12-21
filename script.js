let context = new AudioContext();
let volume = new GainNode(context,{gain:0.1});
let speed = 200;
let synths = [];
let frequency = 100;
let tick = 0;
let setup = true;
let track_matrix = [];
let col_length = 20;
let row_length = 16;
let keys = [];
let track_time = [];
let ocs_type = 'sine';
let nodes = [null, null, null, null, null, null, null];
let con_nect = true;
const detunes = ["detune_label1", "detune_label2", "detune_label3", "detune_label4"];
const types = ["type_label1", "type_label2", "type_label3", "type_label4"];
let destination = false;
let node_list = []
let maininterval;

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
    if (row_array[row].style.backgroundColor === "rgb(138,23,18)"){
        row_array[row].style.backgroundColor = "rgba(211, 20, 20, 0.21)";
    }else {
        row_array[row].style.backgroundColor = "rgb(1,133,152)";
        row_array[row].style.border = "2px rgb(2,194,222)";
        row_array[row].style.borderStyle = "solid solid dashed dashed";
    }
}
maininterval = setInterval(play, speed)
function play(){
    keys = [];
    for (let i = 0; i < track_time.length; i++){
        track_time[i].style.filter = "brightness(0.8)";
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
        track_time[i].style.filter = "brightness(1)";
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
    if (type === 'volume'){
        volume.gain.value = ocs.value / 25;
        document.getElementById('volume_label').innerHTML = "[ Volume = " + ocs.value + " ]";
    }
    if (type === 'delay'){
        speed = ocs.value;
        document.getElementById('speed_label').innerHTML = "[ Delay = " + ocs.value + "ms ]";
        clearInterval(maininterval)
        maininterval = setInterval(play, speed)
    }
    for (let x = 0; x < 4; x++){
        if (type === "toggle_ocs"){
            if (ocs.checked){
                synths[x][num].connect(volume)
                document.getElementById('toggle_' + (num + 1)).innerHTML = "ON"
                document.getElementById('toggle_' + (num + 1)).style.backgroundColor = "#FF002F35";
            }else {
                synths[x][num].disconnect(volume)
                document.getElementById('toggle_' + (num + 1)).innerHTML = "OFF"
                document.getElementById('toggle_' + (num + 1)).style.backgroundColor = "rgba(58, 13, 24, 0.45";
            }
        }
        if (type === "detune_ocs"){
            document.getElementById(detunes[num]).innerHTML = "[ Detune = " + ocs.value + " Cents ]";
            synths[x][num].detune.value =  ocs.value;
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
            document.getElementById(types[num]).innerHTML = "[ Oscillator type = " + ocs_type + " ]";
        }
        if (type === "toggle_filter" && x === 0){
            if (nodes[num] === null){
                nodes[num] = context.createBiquadFilter();
                nodes[num].frequency = 500;
                document.getElementById('toggle_filter_' + (num + 1)).innerHTML = "ON"
                document.getElementById('toggle_filter_' + (num + 1)).style.backgroundColor = "#FF002F35";
            }else {
                nodes[num] = null;
                document.getElementById('toggle_filter_' + (num + 1)).innerHTML = "OFF"
                document.getElementById('toggle_filter_' + (num + 1)).style.backgroundColor = "rgba(58, 13, 24, 0.45";
            }
            con_nect = true
        }

        if (type === 'toggle_pan' && x === 0){
            if (nodes[2] === null){
                nodes[2] = context.createStereoPanner();
                console.log('toggle_filter_' + (num + 1))
                document.getElementById("toggle_panner").innerHTML = "ON"
                document.getElementById("toggle_panner").style.backgroundColor = "#FF002F35";
            }else {
                nodes[2] = null;

                document.getElementById("toggle_panner").innerHTML = "OFF"
                document.getElementById("toggle_panner").style.backgroundColor = "rgba(58, 13, 24, 0.45";
            }
        }
        if (con_nect === true && x === 0){
            if (node_list.length > 0){
                volume.disconnect(node_list[0])
                if (node_list.length > 1){
                    for (let i = 0; i < node_list.length - 1; i++){
                        node_list[i].disconnect(node_list[i + 1])
                    }
                }
                node_list[node_list.length - 1].disconnect(context.destination)
            }
            node_list = []
            for (let i = 0; i < nodes.length; i++){
                if (nodes[i] !== null){
                    node_list.push(nodes[i])
                }
            }

            if (node_list.length === 0){
                volume.connect(context.destination)
                destination = true;
            }else {
                if (destination === true){
                    volume.disconnect(context.destination)
                    destination = false;
                }
                if (node_list.length > 1){
                    for (let i = 0; i < node_list.length; i++){
                        node_list[0].connect(node_list[1])
                    }
                }
                volume.connect(node_list[0])
                node_list[node_list.length - 1].connect(context.destination)
            }
        }

        if (nodes[num] !== null){
            if (type === 'filt_freq'){
                nodes[num].frequency.value = ocs.value;
                document.getElementById('filt_freq_label' + (num + 1) + '').innerHTML = ocs.value;
            }
            if (type === 'filt_q'){
                nodes[num].Q.value = ocs.value;
                document.getElementById('filt_q_label' + (num + 1) + '').innerHTML = ocs.value;
            }
            if (type === 'filt_pass'){
                let filtpass = 'lowpass'
                if (ocs.value === "0") {
                    filtpass = 'lowpass';
                } else if (ocs.value === "1") {
                    filtpass = 'highpass';
                } else if (ocs.value === "2") {
                    filtpass = 'bandpass';
                } else if (ocs.value === "3") {
                    filtpass = 'allpass';
                }
                nodes[num].type = filtpass;
                document.getElementById('filt_pass_label' + (num + 1) + '').innerHTML = filtpass;
            }
            if (type === 'panner'){
                nodes[2].pan.value = ocs.value;
                document.getElementById('panner_label').innerHTML = ocs.value;
            }


        }
    }
}
