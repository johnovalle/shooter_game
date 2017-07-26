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

var enemyCounter = 0;
var enemySpdRng = 5;
var enemySpdMin = 2;

var blurEffect = false;

ctx.font = '30px Arial';


var keyMap = {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false
};

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
    timer: 0,
    atkSpd: 1, //1/s
    getCenterX: function(){
        return this.x - this.width/2;
    },
    getCenterY: function(){
        return this.y - this.height/2;
    }
};



var player = createPlayer();

function createPlayer(){
    var player = Object.create(Entity);
    player.x = 20;
    player.y = 20;
    player.vx = 0;
    player.vy = 0;
    player.speed = 5;
    player.type = "player";
    player.text = "P";
    player.id = "player1";
    player.hp = 10;
    player.color = 'green';
    player.bounce = false;
    player.width = 20;
    player.height = 20;
    player.aimAngle = 0;
    
    return player;
}



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
    enemy.aimAngle = 0;
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
    if(Math.random() >= 0.5){
        upgrade.category = "atkSpd";
        upgrade.color = "blue";
    }else{
        upgrade.category = "score";
        upgrade.color = "orange";
    }
    enemyCounter++; //should really be entityCounter?
    entities[upgrade.id] = upgrade;
}


function createBullet(owner, overrideAngle){
    var bullet = Object.create(Entity);
    bullet.x = owner.x;
    bullet.y = owner.y;
    bullet.angle = owner.aimAngle;   //Math.random() * 360;
    if(overrideAngle){
        bullet.angle = overrideAngle;
    }
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
    //alternatively could divide a base number by attack spd Math.round(60/player.atkSpd)
    //but this seems to be a bit unwieldy, at least it would be need to be limited
    player.timer += player.atkSpd;
    
    
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    var playerHit = false;
    if(blurEffect){
        drawBlur();
    }
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
               
               
                if(entity.category === "atkSpd"){
                    player.atkSpd += 0.5;
                }else if(entity.category === "score"){
                    score += 1000;
                }
               
               console.log("upgrade " + entity.id, " is hitting player");
               delete entities[e];
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
                break;
            }
        }
        
        bullet.timer++;
        if(bullet.timer > 300){
            delete bullets[b];
            continue;
        }
        
        moveObject(bullet);
        drawObject(bullet);
        
   }
   //move this back later
   //var mouseHit = testPTPCollision(player, mousePosition);
    player.gettingHit = playerHit; // || mouseHit;
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
    if(!DEBUG && object.type !== "player"){
        object.x += object.vx;
        object.y += object.vy;
    }else if(object.type === "player"){
        checkPlayerMove();
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
    }else {// this really should be for something else but I'll put the player
        //not leaving the stage logic here
        //remove if out of bounds but how to know if its a bullet or an enemy?
        if(object.x + object.width/2 > CANVAS_WIDTH) {
            object.x = CANVAS_WIDTH - object.width/2;
        }else if(object.x < 0 + object.width/2){
            object.x = 0 + object.width/2;
        }
        
        if(object.y + object.height/2 > CANVAS_HEIGHT) {
            object.y = CANVAS_HEIGHT - object.height/2;
        }else if(object.y < 0 + object.height/2){
            object.y = 0 + object.height/2;
        }
    }
}

function checkPlayerMove(){
    if((keyMap.up && keyMap.down) || (!keyMap.up && !keyMap.down)){
        player.vy = 0;
    }
    else if(keyMap.up){
        player.vy = -player.speed;
    }
    else if(keyMap.down){
        player.vy = player.speed;
    }
    
    
    if((keyMap.left && keyMap.right) || (!keyMap.left && !keyMap.right)){
        player.vx = 0;
    }
    else if(keyMap.left){
        player.vx = -player.speed;
    }
    else if(keyMap.right){
        player.vx = player.speed;
    }
}


function drawBlur(){ //this is too slow to really use....
    ctx.save();
    ctx.lineWidth=5;
    ctx.filter = 'blur(5px)';
    var object;
    
    for(var e in entities){
        object = entities[e];
        ctx.strokeStyle = object.color;
        ctx.strokeRect(object.getCenterX(), object.getCenterY(), object.width, object.height);
    }
    //should everything test whether its interacting with every other object
    //would that be too slow
    //
    for(var b in bullets){
        object = bullets[b];
        ctx.strokeStyle = object.color;
        ctx.strokeRect(object.getCenterX(), object.getCenterY(), object.width, object.height);
    }
    //move this back later
    //var mouseHit = testPTPCollision(player, mousePosition);
    object = player;
    ctx.strokeStyle = object.color;
    if(object.gettingHit){
        ctx.strokeStyle = "#ff0000";
    }
    ctx.strokeRect(object.getCenterX(), object.getCenterY(), object.width, object.height);
    
    ctx.restore();
}

function drawObject(object){
    //ctx.save();
    ctx.strokeStyle = object.color;
    if(object.gettingHit){
        ctx.strokeStyle = "#ff0000";
    }
    //ctx.fillRect(object.getCenterX(), object.getCenterY(), object.width, object.height);
    //ctx.save();
    ctx.lineWidth=3;
    //ctx.filter = 'blur(3px)';
    
    ctx.strokeRect(object.getCenterX(), object.getCenterY(), object.width, object.height);
    //ctx.restore();
    //ctx.shadowOffsetX = 0;
    //ctx.shadowOffsetY = 0;
    //ctx.shadowBlur = 5;
    //ctx.fillText(object.text, object.x, object.y);
   // ctx.restore();
    //ctx.save();
    //ctx.strokeStyle = object.color;
    //ctx.strokeRect(object.getCenterX(), object.getCenterY(), object.width, object.height);
    //ctx.restore();
}

function drawMouseCords(){
    var text = "("+mousePosition.x+", "+mousePosition.y+")";
    ctx.save();
    ctx.font = "10px Arial";
    ctx.fillText(text, mousePosition.x, mousePosition.y);
    ctx.restore();
}








function performAttack(entity){
    if(entity.timer > 60){ // every 1 sec
        createBullet(entity);
        entity.timer = 0;
    }
}

function performMultiAttack(entity, amount, spread){
    //triple shot
    // createBullet(player, player.aimAngle - 5);
    // createBullet(player);
    // createBullet(player, player.aimAngle + 5);
    createBullet(entity);
    for(var i = 1; i<=amount; i++){
        createBullet(entity, entity.aimAngle + spread*i);
        createBullet(entity, entity.aimAngle - spread*i);
    }
    
}

function performCircularAttack(entity, amount){
    if(entity.timer > 120){ // every 2 sec
        
        
        //circular blast
        var step = Math.floor(360/amount);
        for(var i = 0; i <= 360; i += step){
            createBullet(entity, i);
        }
        entity.timer = 0;
    }
}






//input
  //mouse
document.onmousemove = function(mouse){  //get mouse position information
    mousePosition.x = mouse.clientX - canvas.getBoundingClientRect().left;
    mousePosition.y = mouse.clientY - canvas.getBoundingClientRect().top;
    //setting this value here actually causes a glitch where if you arent moving the mouse shots will not change angle.
    player.aimAngle = Math.atan2(mousePosition.y - player.y, mousePosition.x - player.x) / Math.PI * 180; //why is this converted from radians to degrees?
                                                                                    //because it's getting converted back into radians
    if(DEBUG){
        player.x = mousePosition.x;
        player.y = mousePosition.y;
    }
};

document.onclick = function(event){
   performAttack(player);
};

document.oncontextmenu = function(event){ //right click
    event.preventDefault();
    //performCircularAttack(player, 10);
    performMultiAttack(player, 2, 5);
};

  //keyboard
document.onkeydown = function(event){
    if(event.key === "ArrowDown"){
        keyMap.down = true;
    }
    if(event.key === "ArrowUp"){
        keyMap.up = true;
    }
    if(event.key === "ArrowLeft"){
        keyMap.left = true;
    }
    if(event.key === "ArrowRight"){
        keyMap.right = true;
    }
    if(event.key === " "){
        keyMap.fire = true;
    }
};

document.onkeyup = function(event){
    if(event.key === "ArrowDown"){
        keyMap.down = false;
    }
    if(event.key === "ArrowUp"){
        keyMap.up = false;
    }
    if(event.key === "ArrowLeft"){
        keyMap.left = false;
    }
    if(event.key === "ArrowRight"){
        keyMap.right = false;
    }
    if(event.key === " "){
        keyMap.fire = false;
    }
};



//support functions

function genRandomInRange(range, min){
   var base = Math.floor(Math.random() * range);
   return base + min;
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