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
            controlMap: {},
            entities: []
        },
        start: {
            number: 5,
            controlMap: {
                "ArrowUp": increaseNumber,
                "ArrowDown": decreaseNumber
            },
            entities: []
        },
        options: {},
        play: {
            number: 50,
            controlMap: {
                "w": increaseNumber,
                "s": decreaseNumber
            },
            entities: []
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
// tell entities how to move themselves
var monster = Object.create(Entity);
monster.char = "A";
monster.x = 50;
monster.y = 100;
monster.vx = 1;

var monster2 = Object.create(Entity);
monster2.char = "B";
monster2.x = 350;
monster2.y = 400;
monster2.vy = -1;

game.screen.start.entities.push(monster);
game.screen.start.entities.push(monster2);

var monster3 = Object.create(Entity);
monster3.char = "C3";
monster3.x = 250;
monster3.y = 30;
monster3.vy = 1;

game.screen.play.entities.push(monster3);



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
});


function run(){
    update(game.state.current);
    draw(game.state.current);
    requestAnimationFrame(run);
}
run();

function update(state){
    for(let i = 0; i < state.entities.length; i++){
        let entity = state.entities[i];
        entity.x += entity.vx;
        entity.y += entity.vy;
    }
}

function draw(state){
    ctx.clearRect(0, 0, drawingSurface.width, drawingSurface.height);
    ctx.fillStyle = "rgb(" + state.colorPad.r + "," +
                              state.colorPad.g + "," +
                              state.colorPad.b + ")";
    ctx.fillRect(0, 0, drawingSurface.width, drawingSurface.height);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText(state.number,10,50);

    for(let i = 0; i < state.entities.length; i++){
        let entity = state.entities[i];
        ctx.fillText(entity.char,entity.x,entity.y);
    }
}

function degreeToRadian(degree){
    return (degree/180) * Math.PI; // degree * (Math.PI/180)
}

//colorPad.r += 1;
//colorPad.g += 2;
//colorPad.b += 3;
//for(var color in colorPad){
//    if(colorPad[color] > 255){
//        colorPad[color] -= 255;
//    }
//}
