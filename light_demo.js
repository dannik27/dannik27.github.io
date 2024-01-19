
const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");


let blockSize = 40

let points = [
    
    // { x: 400, y: 160, w: blockSize, h: blockSize },
    // { x: 360, y: 160, w: blockSize, h: blockSize },
    // {x: 400,y: 200, w: blockSize, h: blockSize},
    // {x: 520,y: 200, w: blockSize, h: blockSize},
    // {x: 320,y: 160, w: blockSize, h: blockSize},
    // { x: 160, y: 120, w: blockSize, h: blockSize},
    // { x: 160,y: 240, w: blockSize, h: blockSize},
    // { x: 160,y: 280, w: blockSize, h: blockSize},
    { x: 160,y: 320, w: blockSize, h: 21},
    // { x: 160,y: 400, w: blockSize, h: blockSize},
    // { x: 160,y: 440, w: blockSize, h: blockSize},
    // { x: 160,y: 480, w: blockSize, h: blockSize},
    // { x: 160,y: 520, w: blockSize, h: blockSize},
    // { x: 200,y: 520, w: blockSize, h: blockSize},
    // { x: 240,y: 520, w: blockSize, h: blockSize},
    // { x: 280,y: 520, w: blockSize, h: blockSize},
    // { x: 320,y: 520, w: blockSize, h: blockSize},
    // { x: 360,y: 520, w: blockSize, h: blockSize},
    // { x: 360,y: 480, w: blockSize, h: blockSize},
    // { x: 360,y: 440, w: blockSize, h: blockSize},
    // { x: 360,y: 400 , w: blockSize, h: blockSize},
    // { x: 320,y: 400 , w: blockSize, h: blockSize},
    // { x: 280,y: 400 , w: blockSize, h: blockSize},
    // { x: 200,y: 400 , w: blockSize, h: blockSize},
    // {x: 460,y: 400, w: blockSize, h: blockSize},
]

let lights = [
    // {x: 480, y: 280, radius: 120}, 
    // {x: 340, y: 460, radius: 60}, 
    // {x: 260, y: 500, radius: 60}, 
    {x: 220, y: 340, radius: 80},
    // {x: 280, y: 280, radius: 120},
    // {x: 330, y: 130, radius: 120}
]

// createLightMap(points, [{x: c.x, y: c.y, radius: R}])
let path = createLightMap(points, lights)
// createLightMap(points, [{x: 275, y: 275, radius: 120}])
// createLightMap(points, [{x: 325, y: 125, radius: 120}])
// ctx.clip()



ctx.fillStyle = 'white'
ctx.fillRect(0, 0, 600, 600)
drawObjects(points)

ctx.fillStyle = 'red'
ctx.fillRect(250, 150, 20, 20)
ctx.fillRect(250, 300, 20, 20)
// ctx.fillStyle = 'rgb(255, 255, 0, 0.4)'
// ctx.fill(path)
// ctx.stroke(path)
// ctx.clip(path)

// ctx.fillStyle = 'rgb(0, 0, 0, 0.3)'
// ctx.fillRect(0, 0, 600, 600)



var can2 = document.createElement('canvas');
can2.width = canvas.width;
can2.height = canvas.height;
var ctx2 = can2.getContext('2d');
ctx2.clip(path)
ctx2.drawImage(canvas, 0, 0)

for (light of lights) {
    
    ctx2.fillStyle = 'rgba(255, 255, 0, 0.06)'
    ctx2.beginPath()
    ctx2.arc(light.x, light.y, light.radius, 0, 2 * Math.PI, false)
    ctx2.fill() 
    ctx2.beginPath()
    ctx2.arc(light.x, light.y, light.radius - 20, 0, 2 * Math.PI, false)
    ctx2.fill() 
    ctx2.beginPath()
    ctx2.arc(light.x, light.y, light.radius - 40, 0, 2 * Math.PI, false)
    ctx2.fill() 
    ctx2.beginPath()
    ctx2.arc(light.x, light.y, light.radius - 60, 0, 2 * Math.PI, false)
    ctx2.fill() 
    
}

ctx.fillStyle = 'rgb(0, 0, 0, 0.8)'
ctx.fillRect(0, 0, 600, 600)
ctx.drawImage(can2, 0, 0);






// ctx2.drawImage(canvas, 0, 0)
// ctx.fillStyle = 'rgb(0, 0, 0, 0.5)';
// ctx.fillRect(0,0,500,500); // fill the entire first canvas
// ctx.drawImage(can2, 0, 0);


// ctx.beginPath();
// for (light of lights) {
    
//     ctx.fillStyle = 'rgba(255,255,0,0.05)'
//     ctx.arc(light.x * TILE_SIZE + (TILE_SIZE / 2), light.y * TILE_SIZE + (TILE_SIZE / 2), light.radius * TILE_SIZE, 0, 2 * Math.PI, false)
//     ctx.lineWidth = 3
//     ctx.setLineDash([])
//     // ctx.stroke()
//     ctx.closePath()
    
// }
// ctx.fill()
