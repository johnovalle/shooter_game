var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;
var mousePosition = {
    x: 0,
    y: 0
};

var timeStarted = Date.now();

ctx.font = '30px Arial';

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
player.vx = 10;
player.vy = 15;
player.type = "player";
player.text = "P";
player.id = "player1";
player.hp = 10;
player.bounce = true;

var entities = {};
//entities[player.id] = player;

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


function restart(){
    timeStarted = Date.now();
    player.hp = 10;
    entities = {};
    createEnemy();
    createEnemy();
    createEnemy();
}

restart();

setInterval(update, 50);

function update(){
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    var playerHit = false;
   //moveObject(player);
   //drawObject(player);
   for(var e in entities){
       var entity = entities[e];
       if(entity.type === "enemy") {
           var hittingPlayer = testPTPCollision(player, entity);
           //console.log(entities["player1"], entity);
           if(hittingPlayer){
               console.log("enemy " + entity.id, " is hitting player");
               //player.hp -= 1;
               playerHit = true;
               //entities["player1"].gettingHit = true;
           }
       }
       if(entity.type === "player"){
            
       }
       
       moveObject(entity);
       drawObject(entity);
   }
   //move this back later
   var mouseHit = testPTPCollision(player, mousePosition);
    player.gettingHit = playerHit || mouseHit;
    if(player.gettingHit){
        player.hp -= 1;
    }
    if(player.hp <= 0){
        var timeSurvived = Date.now() - timeStarted;
        console.log("died, lasted " + timeSurvived/1000 + " secs");
        restart();
    }
   
   moveObject(player);
   drawObject(player);
   
   drawMouseCords();
   ctx.fillText(player.hp + " Hp", 0, 30);
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
    ctx.save();
    if(object.gettingHit){
        ctx.fillStyle = "#ff0000";
    }
    ctx.fillText(object.text, object.x, object.y);
    ctx.restore();
}

function getDistanceBetweenPoints(point1, point2){ //point to point
    var dx = point1.x - point2.x;
    var dy = point1.y - point2.y;
    return Math.sqrt(dx*dx+dy*dy); //returns distance between two points
}

function testPTPCollision(entity1, entity2){ //point to point
    var distance = getDistanceBetweenPoints(entity1, entity2);
    return distance < 30;
}

//get mouse position information

document.onmousemove = function(mouse){
    mousePosition.x = mouse.clientX;
    mousePosition.y = mouse.clientY;
};

function drawMouseCords(){
    var text = "("+mousePosition.x+", "+mousePosition.y+")";
    ctx.save();
    ctx.font = "10px Arial";
    ctx.fillText(text, mousePosition.x, mousePosition.y);
    ctx.restore();
}