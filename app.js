var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var drawingSurface = {
    context: ctx,
    canvas: canvas,
    width: 500,
    height: 500
};

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

var colorPad = {
    r: 30,
    g: 150,
    b: 220
};

function update(){
    ctx.clearRect(0, 0, drawingSurface.width, drawingSurface.height);
    ctx.fillStyle = "rgb(" +colorPad.r + "," + colorPad.g + "," + colorPad.b + ")";
    colorPad.r += 1;
    colorPad.g += 2;
    colorPad.b += 3;
    for(var color in colorPad){
        if(colorPad[color] > 255){
            colorPad[color] -= 255;
        }
    }
    ctx.fillRect(0, 0, drawingSurface.width, drawingSurface.height);
    requestAnimationFrame(update);
}
update();

function degreeToRadian(degree){
    return (degree/180) * Math.PI; // degree * (Math.PI/180)
}