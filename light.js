

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




function generateRays(objects, center, radius) {
    let rays = []

    for (obj of objects) {
        rays.push({x: obj.x, y: obj.y})
        rays.push({x: obj.x, y: obj.y + 50})
        rays.push({x: obj.x + 50, y: obj.y})
        rays.push({x: obj.x + 50, y: obj.y + 50})
    
        let x1 = obj.x - center.x
        let x2 = obj.x + 50 - center.x
        let y1 = center.y - obj.y
        let y2 = center.y - (obj.y + 50)
        let circleYinX1 = Math.floor(Math.sqrt(radius * radius - x1 * x1) * 100) / 100
        let circleYinX2 = Math.floor(Math.sqrt(radius * radius - x2 * x2) * 100) / 100
        let circleXinY1 = Math.floor(Math.sqrt(radius * radius - y1 * y1) * 100) / 100
        let circleXinY2 = Math.floor(Math.sqrt(radius * radius - y2 * y2) * 100) / 100
        if (x1 < 0) circleXinY1 = -circleXinY1
        if (x1 < 0) circleXinY2 = -circleXinY2
        if (y1 < 0) circleYinX1 = -circleYinX1
        if (y1 < 0) circleYinX2 = -circleYinX2
        if (circleYinX1 > y2 && circleYinX1 < y1) {
            rays.push({x: obj.x, y: center.y - circleYinX1, arc: true})
        }
        if (circleYinX2 > y2 && circleYinX2 < y1) {
            rays.push({x: obj.x + 50, y: center.y - circleYinX2, arc: true})
        }
        if (circleXinY1 > x1 && circleXinY1 < x2) {
            rays.push({x: center.x + circleXinY1, y: obj.y, arc: true})
        }
        if (circleXinY2 > x1 && circleXinY2 < x2) {
            rays.push({x: center.x + circleXinY2, y: obj.y + 50, arc: true})
        }
    }
    return rays
}

function calculateJoinPoints(ray, objects, center, radius) {
    ray.alpha = (center.y - ray.y) / (ray.x - center.x)

    let candidates = []
    for(obj of objects) {

        // check if point is in the same quarter
        if(((obj.x + (TILE_SIZE / 2) - center.x) * (ray.x - center.x) < 0) || ((obj.y + (TILE_SIZE / 2) - center.y) * (ray.y - center.y) < 0)) {
            continue
        }

        let objCandidates = [] 

        let x1 = obj.x - center.x
        let x2 = obj.x + 50 - center.x
        let y1 = center.y - obj.y
        let y2 = center.y - (obj.y + 50)
        let rayYinX1 = Math.floor(x1 * ray.alpha * 100) / 100
        let rayYinX2 = Math.floor(x2 * ray.alpha * 100) / 100
        let rayXinY1 = Math.floor(y1 / ray.alpha * 100) / 100
        let rayXinY2 = Math.floor(y2 / ray.alpha * 100) / 100
        if (rayYinX1 >= y2 && rayYinX1 <= y1) {
            objCandidates.push({x: obj.x, y: center.y - rayYinX1})
        }
        if (rayYinX2 >= y2 && rayYinX2 <= y1) {
            objCandidates.push({x: obj.x + 50, y: center.y - rayYinX2})
        }
        if (rayXinY1 > x1 && rayXinY1 < x2) {
            objCandidates.push({x: center.x + rayXinY1, y: obj.y})
        }
        if (rayXinY2 > x1 && rayXinY2 < x2) {
            objCandidates.push({x: center.x + rayXinY2, y: obj.y + 50})
        }

        if (objCandidates.length == 1) {
            let candidate = objCandidates[0]
            candidate.corner = true  
        }

        candidates = candidates.concat(objCandidates)
         
    }

    // candidates.sort((a, b) => {
    //     let x1 = center.x - a.x
    //     let y1 = center.y - a.y
    //     let hyppo1 = Math.sqrt(x1 * x1 + y1 * y1)

    //     let x2 = center.x - b.x
    //     let y2 = center.y - b.y
    //     let hyppo2 = Math.sqrt(x2 * x2 + y2 * y2)

    //     return hyppo1 - hyppo2
    // })

    candidates = candidates.map(a => {
        let x = center.x - a.x
        let y = center.y - a.y
        let hyppo = Math.sqrt(x * x + y * y)
        return {...a, hyppo: hyppo}
    })
        // .filter(a => a.hyppo <= radius)
        .sort((a, b) => {
            return a.hyppo - b.hyppo
        })

    if (candidates.length < 1) {
        ray.blind = true
        console.log("qq")
        return ray
    }

    if (candidates.length == 1) {
        let candidate = candidates[0]
        candidate.corner = true

        let x = candidate.x - c.x
        let y = candidate.y - c.y
        let r = Math.sqrt(x*x + y*y)

        let X = radius * x / r
        let Y = radius * y / r

        candidate.second = {
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

    
    if(candidates[0].x != ray.x || candidates[0].y != ray.y) {
        ray.arc = false
    }
    ray.x = candidates[0].x
    ray.y = candidates[0].y
    ray.corner = candidates[0].corner
    ray.second = candidates[0].second
    
    // ray.arc = candidates[0].arc

    // for(candidate of candidates) {
    //     ctx.fillStyle = 'yellow'
    //     ctx.fillRect(candidate.x - 3, candidate.y - 3, 6, 6)
        
    // }

    return ray
}

function calculateRayAngle(ray, center) {
    let x = ray.x - center.x
    let y = center.y - ray.y

    if (ray.x > center.x && ray.y < center.y) {
        ray.angle = Math.atan(y / x)
    } else if (ray.x < center.x && ray.y < center.y) {
        ray.angle = Math.PI / 2 + Math.atan(Math.abs(x) / y)
    } else if (ray.x < center.x && ray.y > center.y) {
        ray.angle = Math.PI + Math.atan(Math.abs(y) / Math.abs(x))
    } else if (ray.x > center.x && ray.y > center.y) {
        ray.angle = 1.5 * Math.PI + Math.atan(Math.abs(x) / Math.abs(y))
    } else {
        console.log("unable to calc tan for ray " + ray)
    }

    return ray
}

function isBlindRay(ray, center, radius) {
    if (ray.blind) return true
    let x = ray.x - center.x
    let y = center.y - ray.y
    let hyppo = Math.sqrt(x * x + y * y)

    return Math.floor(hyppo * 1000) / 1000 > radius
}

function drawRay(ray, center, radius) {
    ctx.fillStyle = 'red'
    ctx.fillRect(ray.x - 3, ray.y - 3, 6, 6)

    if (ray.second) {
        ctx.fillStyle = 'orange'
        ctx.fillRect(ray.second.x - 3, ray.second.y - 3, 6, 6)
    }

    let rayx = ray.x - center.x
    let rayy = center.y - ray.y

    let distanceToPoint = Math.sqrt(rayx * rayx + rayy * rayy)
    let rayX = rayx * radius / distanceToPoint
    let rayY = rayy * radius / distanceToPoint

    if (ray.corner) {
        ctx.strokeStyle = 'green'
    } else {
        ctx.strokeStyle = 'black'
    }
    
    ctx.beginPath()
    ctx.moveTo(center.x, center.y)
    ctx.lineTo(center.x + rayX, center.y - rayY)
    ctx.stroke()

    ctx.strokeStyle = 'orange'
    ctx.beginPath()
    ctx.moveTo(center.x, center.y)
    ctx.lineTo(center.x + rayx, center.y - rayy)
    ctx.stroke()

    return ray
}

function buildPath(rays, radius) {
    let path = new Path2D()

    let first = rays[0]
    let raysCopy = rays.slice(1)
    raysCopy.push(first)

    path.moveTo(rays[0].x, rays[0].y)
    let arcStart = null
    for (let i = 0; i < rays.length; i++) {
        let ray = raysCopy[i]
        console.log(ray.x + " " + ray.y + " " + ray.angle)
        
        if (arcStart) {
            path.arc(c.x, c.y, radius, -arcStart.angle, -ray.angle, true)
            if (ray.second) {
                path.lineTo(ray.x, ray.y)
            }
            arcStart = null
        } else {

            if (ray.second && !ray.second.arc) {
                path.lineTo(ray.second.x, ray.second.y)
                path.lineTo(ray.x, ray.y)
            } else if (ray.second && ray.second.arc) {
                path.lineTo(ray.x, ray.y)
                path.lineTo(ray.second.x, ray.second.y)
                arcStart = {
                    x: ray.second.x,
                    y: ray.second.y,
                    angle: ray.angle
                }
            } else {
                path.lineTo(ray.x, ray.y)
                if (ray.arc) {
                    arcStart = {
                        x: ray.x,
                        y: ray.y,
                        angle: ray.angle
                    }
                }
            }
        }

        
    }
    path.closePath()
    return path
}

function drawObjects(objects) {
    ctx.fillStyle = 'green'
    ctx.strokeStyle = 'black'

    ctx.font="12px Georgia";
    ctx.textAlign="center"; 
    ctx.textBaseline = "middle";

    for(let i = 0; i < objects.length; i++) {
        let obj = objects[i]
        ctx.fillStyle = 'green'
        ctx.fillRect(obj.x, obj.y, 50, 50)
        ctx.fillStyle = 'black'
        ctx.fillText(obj.x + " " + obj.y, obj.x+(TILE_SIZE/2),obj.y+(TILE_SIZE/2));
    }
}

function filterSecondaryPoints(ray, center, radius) {
    if( ray.second && isBlindRay(ray.second, center, radius)){
        ray.second = null
    }
    return ray
}

function createLightMap(objects, lights) {

    for (light of lights) {
        let center = {
            x: light.x,
            y: light.y
        }
        let radius = light.radius

        let rays = generateRays(objects, center, radius)
            .map(ray => calculateJoinPoints(ray, objects, center, radius))
            .filter(ray => !isBlindRay(ray, center, radius))
            .map(ray => calculateRayAngle(ray, center))
            .map(ray => filterSecondaryPoints(ray, center, radius))
            .sort((a, b) => {
                return a.angle - b.angle
            })
        .map(ray => drawRay(ray, c, radius))

        drawObjects(points)

        let path = buildPath(rays, radius)
        ctx.fillStyle = 'rgb(255, 255, 0, 0.4)'
        ctx.fill(path)
        ctx.stroke(path)


    }

}


let c = {
    x: 325,
    y: 325
}

// let R = 250

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

// createLightMap(points, [{x: c.x, y: c.y, radius: R}])
createLightMap(points, [{x: 325, y: 325, radius: 150}])

// let rays = generateRays(points, c, R)




