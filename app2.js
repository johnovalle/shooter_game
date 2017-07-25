var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;
var mousePosition = {
    x: 0,
    y: 0
};

var DEBUG = false;

var timeStarted = Date.now();
var frameCount = 0;

var score = 0;

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
    color: null,
    visible: true,
    getCenterX: function(){
        return this.x - this.width/2;
    },
    getCenterY: function(){
        return this.y - this.height/2;
    }
};


var enemyCounter = 0;
var enemySpdRng = 5;
var enemySpdMin = 2;

var player = Object.create(Entity);
player.x = 20;
player.y = 20;
player.vx = 3;
player.vy = 5;
player.type = "player";
player.text = "P";
player.id = "player1";
player.hp = 10;
player.color = 'green';
player.bounce = true;
player.width = 20;
player.height = 20;


var entities = {};
var bullets = {};

//entities[player.id] = player;

function createEnemy(){
    var enemy = Object.create(Entity);
    enemy.x = genRandomInRange(CANVAS_WIDTH, 0);
    enemy.y = genRandomInRange(CANVAS_HEIGHT, 0);
    enemy.vx = genRandomInRange(enemySpdRng, enemySpdMin);
    enemy.vy = genRandomInRange(enemySpdRng, enemySpdMin);
    enemy.width = genRandomInRange(30, 10);
    enemy.height = genRandomInRange(30, 10);
    enemy.type = "enemy";
    enemy.text = "E";
    enemy.id = "E" + enemyCounter;
    enemy.color = "purple";
    enemy.bounce = true;
    enemyCounter++;
    entities[enemy.id] = enemy;
}

function createUpgrade(){
    var upgrade = Object.create(Entity);
    upgrade.x = genRandomInRange(CANVAS_WIDTH, 0);
    upgrade.y = genRandomInRange(CANVAS_HEIGHT, 0);
    upgrade.width = 20;
    upgrade.height = 20;
    upgrade.type = "upgrade";
    upgrade.id = "U" + enemyCounter;
    upgrade.color = "orange";
    enemyCounter++; //should really be entityCounter?
    entities[upgrade.id] = upgrade;
}


function createBullet(owner){
    var bullet = Object.create(Entity);
    bullet.x = player.x;
    bullet.y = player.y;
    bullet.angle = Math.random() * 360;
    //***
    bullet.vx = Math.cos(bullet.angle/180*Math.PI) * 5; // x/180*Math.PI converts degree to radians
    bullet.vy = Math.sin(bullet.angle/180*Math.PI) * 5;
    //***
    bullet.width = 20;
    bullet.height = 20;
    bullet.type = "bullet";
    bullet.id = "B" + enemyCounter;
    bullet.color = "black";
    bullet.owner = owner;
    bullet.ownerId = owner.id;
    bullet.bounce = true;
    enemyCounter++; //should really be entityCounter?
    bullets[bullet.id] = bullet;
}


function genRandomInRange(range, min){
   var base = Math.floor(Math.random() * range);
   return base + min;
}


function restart(){
    timeStarted = Date.now();
    frameCount = 0;
    score = 0;
    player.hp = 10;
    entities = {};
    bullets = {};
    createEnemy();
    createEnemy();
    createEnemy();
}

restart();

//setInterval(update, 30);

function update(){
    frameCount++;
    score++;
    
    if(frameCount % 240 === 0){ //every 2 sec
        createEnemy();
    }
    if(frameCount % 120 === 0){ // every 2 sec
        createUpgrade();
    }
    
    if(frameCount % 60 === 0){ // every 1 sec
        createBullet(player);
    }
    
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    var playerHit = false;
   //moveObject(player);
   //drawObject(player);
   for(var e in entities){
       var entity = entities[e];
       var hittingPlayer = testRTRCollision(player, entity);
       if(entity.type === "enemy") {
           
           //console.log(entities["player1"], entity);
           if(hittingPlayer){
               console.log("enemy " + entity.id, " is hitting player");
               //player.hp -= 1;
               playerHit = true;
               //entities["player1"].gettingHit = true;
           }
       }
       if(entity.type === "upgrade"){
            if(hittingPlayer){
               console.log("upgrade " + entity.id, " is hitting player");
               delete entities[e];
               score += 1000;
               //player.hp -= 1;
               //playerHit = true;
               //entities["player1"].gettingHit = true;
           }
       }
       
       moveObject(entity);
       drawObject(entity);
   }
   //should everything test whether its interacting with every other object
   //would that be too slow
   //
   for(var b in bullets){
        var bullet = bullets[b];
        for(var e in entities){
            var entity = entities[e];
            if(entity.type === "enemy" && testRTRCollision(bullet, entity)){
                delete entities[e];
                delete bullets[b];
            }
        }
        moveObject(bullet);
        drawObject(bullet);
   }
   //move this back later
   var mouseHit = testPTPCollision(player, mousePosition);
    player.gettingHit = playerHit || mouseHit;
    if(player.gettingHit  && !DEBUG){
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
   ctx.fillText("score: " + score, 200, 30);
   
   
   requestAnimationFrame(update);
}
update();

function moveObject(object){
    if(!DEBUG){
        object.x += object.vx;
        object.y += object.vy;
    }
    
    if(object.bounce){
        if(object.x + object.width/2 > CANVAS_WIDTH || object.getCenterX() < 0){
            object.vx *= -1;
        }
        if(object.y + object.height/2 > CANVAS_HEIGHT || object.getCenterY() < 0){
            object.vy *= -1;
        }
    }else {
        //remove if out of bounds but how to know if its a bullet or an enemy?
    }
}
function drawObject(object){
    ctx.save();
    ctx.fillStyle = object.color;
    if(object.gettingHit){
        ctx.fillStyle = "#ff0000";
    }
    ctx.fillRect(object.getCenterX(), object.getCenterY(), object.width, object.height);
    //ctx.fillText(object.text, object.x, object.y);
    ctx.restore();
}

function getDistanceBetweenPoints(point1, point2){ //point to point
    var dx = point1.x - point2.x;
    var dy = point1.y - point2.y;
    return Math.sqrt(dx*dx+dy*dy); //returns distance between two points
}

function testRTRCollision(rect1, rect2){
    return rect1.getCenterX() <= rect2.getCenterX() + rect2.width
        && rect2.getCenterX() <= rect1.getCenterX() + rect1.width
        && rect1.getCenterY() <= rect2.getCenterY() + rect2.height
        && rect2.getCenterY() <= rect1.getCenterY() + rect1.height;
}

function testPTPCollision(entity1, entity2){ //point to point
    var distance = getDistanceBetweenPoints(entity1, entity2);
    return distance < 30;
}

//get mouse position information

document.onmousemove = function(mouse){
    mousePosition.x = mouse.clientX - canvas.getBoundingClientRect().left;
    mousePosition.y = mouse.clientY - canvas.getBoundingClientRect().top;
    if(DEBUG){
        player.x = mousePosition.x;
        player.y = mousePosition.y;
    }
};

function drawMouseCords(){
    var text = "("+mousePosition.x+", "+mousePosition.y+")";
    ctx.save();
    ctx.font = "10px Arial";
    ctx.fillText(text, mousePosition.x, mousePosition.y);
    ctx.restore();
}