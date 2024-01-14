

const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");

let TILE_SIZE = 50

let objects = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0,],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
]

lights = [
    {
        x: 2,
        y: 4,
        radius: 3
    },
    {
        x: 4,
        y: 7,
        radius: 2
    }
]

ctx.fillStyle = 'white';
ctx.fillRect(0,0,500,500);

// for (let y = 0; y < objects.length; y++) {
//     for (let x = 0; x < objects[0].length; x++) {


//         if (objects[x][y]) {
//             ctx.fillStyle = "green";
//             ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

            
//         }

//         // ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
//         // ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        
//     }
// }


// var can2 = document.createElement('canvas');
// can2.width = canvas.width;
// can2.height = canvas.height;
// var ctx2 = can2.getContext('2d');
// ctx2.beginPath();
// for (light of lights) {
    
//     ctx2.fillStyle = 'rgba(255,255,0,0.1)'
//     ctx2.arc(light.x * TILE_SIZE + (TILE_SIZE / 2), light.y * TILE_SIZE + (TILE_SIZE / 2), light.radius * TILE_SIZE, 0, 2 * Math.PI, false)
//     ctx2.lineWidth = 3
//     ctx2.setLineDash([])
//     // ctx.stroke()
//     ctx2.closePath()
    
// }
// ctx2.clip()


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

let c = {
    x: 325,
    y: 325
}

let R = 250

// let a = {
//     x: 350,
//     y: 150
// }

// let b = {
//     x: 400,
//     y: 200
// }

// let cbX = b.x - c.x
// let cbY = c.y - b.y

// let alpha = Math.atan(cbY / cbX)
// let beta = Math.atan((c.y - a.y) / (a.x - c.x))

// let firstX = Math.cos(alpha) * R
// let firstY = Math.sin(alpha) * R


// let secondX = Math.cos(beta) * R
// let secondY = Math.sin(beta) * R

// console.log(alpha)


// ctx.fillStyle = 'green'
// ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y)


// ctx.fillStyle = 'rgb(255, 255, 0, 0.5)'
// ctx.beginPath()
// ctx.lineWidth = 5
// ctx.arc(c.x, c.y, R, -beta, -alpha, true)

// ctx.lineTo(b.x, b.y)
// ctx.lineTo(a.x, b.y)
// ctx.lineTo(a.x, a.y)
// ctx.closePath()

// ctx.stroke()
// ctx.fill()

// ctx.moveTo(a.x, a.y)
// ctx.lineTo(a.x, b.y)
// ctx.lineTo(b.x, b.y)
// // ctx.stroke()

// // ctx.moveTo(b.x, b.y)
// ctx.lineTo(c.x + firstX, c.y - firstY)
// ctx.stroke()

// ctx.moveTo(a.x, a.y)
// ctx.lineTo(c.x + secondX, c.y - secondY)
// ctx.stroke()

let points = [
    
    { x: 400, y: 150 },
    { x: 350, y: 150 },
    {x: 400,y: 200},
    {x: 500,y: 200},
    {x: 300,y: 150},
    { x: 150, y: 100},
    { x: 150,y: 300},
    { x: 150,y: 400},
    {x: 450,y: 400},
]

// points.sort((a, b) => {

//     let ax = a.x - c.x
//     let ay = c.y - a.y
    
//     let bx = b.x - c.x
//     let by = c.y - b.y

//     return (ay / ax) - (by / bx)

// })

console.log(points)


let rays = []

for (point of points) {
    rays.push({x: point.x, y: point.y, corner: true})
    rays.push({x: point.x, y: point.y + 50,  corner: true})
    rays.push({x: point.x + 50, y: point.y,  corner: true})
    rays.push({x: point.x + 50, y: point.y + 50,  corner: true})

    let x1 = point.x - c.x
    let x2 = point.x + 50 - c.x
    let y1 = c.y - point.y
    let y2 = c.y - (point.y + 50)
    let circleYinX1 = Math.sqrt(R * R - x1 * x1)
    let circleYinX2 = Math.sqrt(R * R - x2 * x2)
    if (circleYinX1 > y2 && circleYinX1 < y1) {
        rays.push({x: point.x, y: c.y - circleYinX1})
    }
    if (circleYinX2 > y2 && circleYinX2 < y1) {
        rays.push({x: point.x + 50, y: c.y - circleYinX2})
    }
}

// rays.push({x: 450, y: 400, corner: true})
// rays.push({x: 200, y: 150, corner: true})
// rays.push({x: 550, y: 200, corner: true})
// rays.push({x: 150, y: 450, corner: true})
// rays.push({x: 200, y: 150, corner: true})



ctx.fillStyle = 'green'
ctx.strokeStyle = 'black'

ctx.font="12px Georgia";
ctx.textAlign="center"; 
ctx.textBaseline = "middle";

for(let i = 0; i < points.length; i++) {
    let point = points[i]
    ctx.fillStyle = 'green'
    ctx.fillRect(point.x, point.y, 50, 50)
    ctx.fillStyle = 'black'
    ctx.fillText(point.x + " " + point.y, point.x+(TILE_SIZE/2),point.y+(TILE_SIZE/2));
}

for (ray of rays) {

    ray['alpha'] = (c.y - ray.y) / (ray.x - c.x)

    let candidates = []

    for(point of points) {

        // check if point is in the same quarter
        if(((point.x + (TILE_SIZE / 2) - c.x) * (ray.x - c.x) < 0) || ((point.y + (TILE_SIZE / 2) - c.y) * (ray.y - c.y) < 0)) {
            continue
        }

        // if(((point.x + (TILE_SIZE / 2) - c.x) * (ray.x - c.x) < 0)) {
        //     continue
        // }

        let pointCandidates = [] 

        let x1 = point.x - c.x
        let x2 = point.x + 50 - c.x
        let y1 = c.y - point.y
        let y2 = c.y - (point.y + 50)
        let rayYinX1 = Math.floor(x1 * ray.alpha * 10000) / 10000
        let rayYinX2 = Math.floor(x2 * ray.alpha * 10000) / 10000
        let rayXinY1 = Math.floor(y1 / ray.alpha * 10000) / 10000
        let rayXinY2 = Math.floor(y2 / ray.alpha * 10000) / 10000
        if (rayYinX1 >= y2 && rayYinX1 <= y1) {
            pointCandidates.push({x: point.x, y: c.y - rayYinX1})
        }
        if (rayYinX2 >= y2 && rayYinX2 <= y1) {
            pointCandidates.push({x: point.x + 50, y: c.y - rayYinX2})
        }
        if (rayXinY1 > x1 && rayXinY1 < x2) {
            pointCandidates.push({x: c.x + rayXinY1, y: point.y})
        }
        if (rayXinY2 > x1 && rayXinY2 < x2) {
            pointCandidates.push({x: c.x + rayXinY2, y: point.y + 50})
        }

        if (pointCandidates.length == 1) {
            let point = pointCandidates[0]
            point.corner = true  
        }

        candidates = candidates.concat(pointCandidates)
         
    }

    candidates.sort((a, b) => {
        let x1 = c.x - a.x
        let y1 = c.y - a.y
        let hyppo1 = Math.sqrt(x1 * x1 + y1 * y1)
        // if (a.corner) hyppo1 = hyppo1 * 100

        let x2 = c.x - b.x
        let y2 = c.y - b.y
        let hyppo2 = Math.sqrt(x2 * x2 + y2 * y2)
        // if (b.corner) hyppo2 = hyppo2 * 100

        return hyppo1 - hyppo2
    })

    if (candidates.length < 1) {
        console.log("qq")
    }

    if (candidates.length == 1) {
        let point = candidates[0]
        point.corner = true

        let x = point.x - c.x
        let y = point.y - c.y
        let r = Math.sqrt(x*x + y*y)

        let X = R * x / r
        let Y = R * y / r

        point.second = {
            x: c.x + X,
            y: c.y + Y,
            arc: true
        }
        
    } else if (candidates[0].corner) {
        let nonCorner = candidates.find(cand => !cand.corner)
        if (nonCorner) {
            candidates[0].second = {
                x: nonCorner.x,
                y: nonCorner.y
            }
        }
    }

    

    ray.x = candidates[0].x
    ray.y = candidates[0].y
    ray.corner = candidates[0].corner
    ray.second = candidates[0].second

    for(candidate of candidates) {
        ctx.fillStyle = 'yellow'
        ctx.fillRect(candidate.x - 3, candidate.y - 3, 6, 6)
        
    }
}

for ( let i = 0; i < rays.length; i++) {
    let ray = rays[i]
    let x = ray.x - c.x
    let y = c.y - ray.y
    let hyppo = Math.sqrt(x * x + y * y)
    if ( hyppo > R) {
        rays.splice(i , 1)
        i--
        continue
    }

    if (ray.x > c.x && ray.y < c.y) {
        ray.angle = Math.atan(y / x)
    } else if (ray.x < c.x && ray.y < c.y) {
        ray.angle = Math.PI / 2 + Math.atan(Math.abs(x) / y)
    } else if (ray.x < c.x && ray.y > c.y) {
        ray.angle = Math.PI + Math.atan(Math.abs(y) / Math.abs(x))
    } else if (ray.x > c.x && ray.y > c.y) {
        ray.angle = 1.5 * Math.PI + Math.atan(Math.abs(x) / Math.abs(y))
    } else {
        console.log("unable to calc tan for ray " + ray)
    }

    if (ray.x == 200 && ray.y == 150) {
        console.log("kek" + ray.angle)
    }
    

    

}

rays.sort((a, b) => {
    return a.angle - b.angle
})



for (ray of rays) {

    ctx.fillStyle = 'red'
    ctx.fillRect(ray.x - 3, ray.y - 3, 6, 6)

    if (ray.second) {
        ctx.fillStyle = 'orange'
        ctx.fillRect(ray.second.x - 3, ray.second.y - 3, 6, 6)
    }

    let rayx = ray.x - c.x
    let rayy = c.y - ray.y

    let distanceToPoint = Math.sqrt(rayx * rayx + rayy * rayy)
    let rayX = rayx * R / distanceToPoint
    let rayY = rayy * R / distanceToPoint

    if (ray.corner) {
        ctx.strokeStyle = 'green'
    } else {
        ctx.strokeStyle = 'black'
    }
    
    ctx.beginPath()
    ctx.moveTo(c.x, c.y)
    ctx.lineTo(c.x + rayX, c.y - rayY)
    ctx.stroke()

    ctx.strokeStyle = 'orange'
    ctx.beginPath()
    ctx.moveTo(c.x, c.y)
    ctx.lineTo(c.x + rayx, c.y - rayy)
    ctx.stroke()
}


ctx.beginPath()
ctx.strokeStyle = 'blue'
ctx.lineWidth = 2
ctx.moveTo(rays[0].x, rays[0].y)
let first = rays.shift()
rays.push(first)
let arcStart = null
for (let i = 0; i < rays.length; i++) {
    let ray = rays[i]
    console.log(ray.x + " " + ray.y + " " + ray.angle)
    
    if (arcStart) {
        ctx.arc(c.x, c.y, R, -arcStart.angle, -ray.angle, true)
        if (ray.second) {
            ctx.lineTo(ray.x, ray.y)
        }
        arcStart = null
    } else {

        if (ray.second && !ray.second.arc) {
            ctx.lineTo(ray.second.x, ray.second.y)
            ctx.lineTo(ray.x, ray.y)
        } else if (ray.second && ray.second.arc) {
            ctx.lineTo(ray.x, ray.y)
            ctx.lineTo(ray.second.x, ray.second.y)
            arcStart = {
                x: ray.second.x,
                y: ray.second.y,
                angle: ray.angle
            }
        } else {
            ctx.lineTo(ray.x, ray.y)
        }
    }

    
}
ctx.closePath()
ctx.fillStyle = 'rgb(255, 255, 0, 0.5)'
ctx.fill()
ctx.stroke()
