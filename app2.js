var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;

var Entity = {
    id: null,
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    vx: 0,
    vy: 0,
    type: "",
    text: "",
    visible: true
};

var enemyCounter = 0;
var enemySpdRng = 20;
var enemySpdMin = 10;

var player = Object.create(Entity);
player.vx = 30;
player.vy = 25;
player.type = "player";
player.text = "P";
player.id = "player1";
player.bounce = true;

var entities = {};
entities[player.id] = player;

function createEnemy(){
    var enemy = Object.create(Entity);
    enemy.x = genRandomInRange(CANVAS_WIDTH, 0);
    enemy.y = genRandomInRange(CANVAS_HEIGHT, 0);
    enemy.vx = genRandomInRange(enemySpdRng, enemySpdMin);
    enemy.vy = genRandomInRange(enemySpdRng, enemySpdMin);
    enemy.type = "enemy";
    enemy.text = "E";
    enemy.id = "E" + enemyCounter;
    enemy.bounce = true;
    enemyCounter++;
    entities[enemy.id] = enemy;
}

function genRandomInRange(range, min){
   var base = Math.floor(Math.random() * range);
   return base + min;
}

createEnemy();
createEnemy();
createEnemy();

setInterval(update, 50);

function update(){
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
   //moveObject(player);
   //drawObject(player);
   for(var e in entities){
       var entity = entities[e];
       moveObject(entity);
       drawObject(entity);
   }
   
}

function moveObject(object){
    object.x += object.vx;
    object.y += object.vy;
    
    if(object.bounce){
        if(object.x > CANVAS_WIDTH || object.x < 0){
            object.vx *= -1;
        }
        if(object.y > CANVAS_HEIGHT || object.y < 0){
            object.vy *= -1;
        }
    }
}
function drawObject(object){
     ctx.fillText(object.text, object.x, object.y);
}