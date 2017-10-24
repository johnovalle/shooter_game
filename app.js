var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var drawingSurface = {
    context: ctx,
    canvas: canvas,
    width: 500,
    height: 500
};

// different controls on different screens
// maintain positions and stats for enemies/objects on a level
// incorperate code to draw tile level and place a guy and have him go from level to level
// with a start screen

var game = {
    state: {
        player: null,
        current: null
    },
    level: [], // example { enemies: [], powerups: [], stairs: [] },
    screen: {
        loading: {
            number: 2,
            controlMap: {}
        },
        start: {
            number: 5,
            controlMap: {
                "ArrowUp": increaseNumber,
                "ArrowDown": decreaseNumber
            }
        },
        options: {},
        play: {
            number: 50,
            controlMap: {
                "w": increaseNumber,
                "s": decreaseNumber
            }
        },
        gameOver: {}
    }
}

var Entity = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    vx: 0,
    vy: 0,
    rotation: 0,
    type: "",
    char: "",
    visible: true
}

game.screen.loading.colorPad = { //cornflower
    r: 30,
    g: 150,
    b: 220
};

game.screen.start.colorPad = { //lime
    r: 170,
    g: 220,
    b: 120
};

game.screen.play.colorPad = { //watermelon
    r: 250,
    g: 40,
    b: 70
};

game.state.current = game.screen.loading;

function increaseNumber(state){
    state.number++;
}

function decreaseNumber(state){
    state.number--;
}

addEventListener("keydown", (event) => {
    console.log(event.key);
    if(event.key === "1"){
        game.state.current = game.screen.loading;
    } else if(event.key === "2") {
        game.state.current = game.screen.start;
    } else if(event.key === "3") {
        game.state.current = game.screen.play;
    }

    if(game.state.current.controlMap[event.key]){
        game.state.current.controlMap[event.key](game.state.current);
    }
    // if(event.key === "ArrowDown"){
    //
    // } else if(event.key === "ArrowUp"){
    //
    // }
});


function update(){
    ctx.clearRect(0, 0, drawingSurface.width, drawingSurface.height);
    ctx.fillStyle = "rgb(" + game.state.current.colorPad.r + "," +
                              game.state.current.colorPad.g + "," +
                              game.state.current.colorPad.b + ")";


    //colorPad.r += 1;
    //colorPad.g += 2;
    //colorPad.b += 3;
    //for(var color in colorPad){
    //    if(colorPad[color] > 255){
    //        colorPad[color] -= 255;
    //    }
    //}
    ctx.fillRect(0, 0, drawingSurface.width, drawingSurface.height);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText(game.state.current.number,10,50);
    requestAnimationFrame(update);
}
update();

function degreeToRadian(degree){
    return (degree/180) * Math.PI; // degree * (Math.PI/180)
}
