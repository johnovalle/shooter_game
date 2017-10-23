var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var drawingSurface = {
    context: ctx,
    canvas: canvas,
    width: 500,
    height: 500
};

var game = {
    state: {
        player: null
    },
    level: [], // example { enemies: [], powerups: [], stairs: [] },
    screen: {
        loading: {
            number: 2
        },
        start: {
            number: 5
        },
        options: {},
        play: {
            number: 50
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

var  currentState = game.screen.loading;

addEventListener("keydown", (event) => {
    console.log(event.key);
    if(event.key === "1"){
        currentState = game.screen.loading;
    } else if(event.key === "2") {
        currentState = game.screen.start;
    } else if(event.key === "3") {
        currentState = game.screen.play;
    }

    if(event.key === "ArrowDown"){
        currentState.number--;
    } else if(event.key === "ArrowUp"){
        currentState.number++;
    }
});


function update(){
    ctx.clearRect(0, 0, drawingSurface.width, drawingSurface.height);
    ctx.fillStyle = "rgb(" + currentState.colorPad.r + "," +
                              currentState.colorPad.g + "," +
                              currentState.colorPad.b + ")";


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
    ctx.fillText(currentState.number,10,50);
    requestAnimationFrame(update);
}
update();

function degreeToRadian(degree){
    return (degree/180) * Math.PI; // degree * (Math.PI/180)
}
