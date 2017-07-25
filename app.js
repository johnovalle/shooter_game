var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;

var Entity = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    vx: 0,
    vy: 0,
    type: "",
    visible: true
}

function update(){
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
}