var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var drawingSurface = {
    context: ctx,
    canvas: canvas,
    width: 500,
    height: 500
};

// incorperate code to draw tile level and place a guy and have him go from level to level
// with a start screen

// make turn based
// create update for non-play related things like background animations etc.


var game = {
    state: {
        player: null,
        current: null,
        lastMoveFinished: true,
        playerMoved: false
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
    },
    moveAniSpeed: 2,

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
    visible: true,
    nextX: null,
    nextY: null
}
// tell entities how to move themselves
var monster = Object.create(Entity);
monster.char = "A";
monster.x = 50;
monster.y = 100;
// monster.vx = 1;

var monster2 = Object.create(Entity);
monster2.char = "B";
monster2.x = 350;
monster2.y = 400;
// monster2.vy = -1;

game.screen.start.entities.push(monster);
game.screen.start.entities.push(monster2);

var monster3 = Object.create(Entity);
monster3.char = "C3";
monster3.x = 250;
monster3.y = 30;
// monster3.vy = 1;

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
    game.state.playerMoved = true;
    game.state.lastMoveFinished = false;
}

function decreaseNumber(state){
    state.number--;
    game.state.playerMoved = true;
    game.state.lastMoveFinished = false;
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
    if(!game.state.lastMoveFinished){
        update(game.state.current);
    }
    draw(game.state.current);
    requestAnimationFrame(run);
}
run();

//game.state.playerMoved = true;
//game.state.lastMoveFinished = false;
//entity.nextY
var animationCounter = 0;
function update(state){
    // this probably should be in it's own function
    if(game.state.playerMoved){
        game.state.playerMoved = false;
        moveEntities(state);
    }

    for(let i = 0; i < state.entities.length; i++){
        let entity = state.entities[i];
        if(entity.x != entity.nextX){
            entity.x += game.moveAniSpeed * entity.lastMoveX; //change the direction
        }
        if(entity.y != entity.nextY){
            entity.y += game.moveAniSpeed * entity.lastMoveY;
        }
    }
    animationCounter += game.moveAniSpeed;
    if(animationCounter === 32){
        animationCounter = 0;
        game.state.lastMoveFinished = true;
    }
}

function moveEntities(state){
    for(let i = 0; i < state.entities.length; i++){
        let entity = state.entities[i];
        tempRandomMove(entity);
        entity.nextX = entity.x + (entity.lastMoveX * 32);
        entity.nextY = entity.y + (entity.lastMoveY * 32);
    }
}

// create some random movements, replace with logic?
function tempRandomMove(entity){
    let xMove = 0;
    let yMove = 0;
    let randX = Math.random();
    let randY = Math.random();
    if(randX < 0.3){
        xMove = -1;
    } else if(randX > 0.7){
        xMove = 1;
    }
    if(randY < 0.3){
        yMove = -1;
    } else if(randY > 0.7){
        yMove = 1;
    }
    entity.lastMoveX = xMove;
    entity.lastMoveY = yMove;
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
