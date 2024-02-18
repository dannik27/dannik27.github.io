console.log("I'm alive!")

const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");


let SCENE_WIDTH = canvas.width
let SCENE_HEIGHT = canvas.height
let TILE_SIZE = 40

let TICK_DELAY = 30
let TICKS_PER_GAME_MINUTE = 1




canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.x
    const y = e.clientY - rect.y
    if (x < SCENE_WIDTH && y < SCENE_HEIGHT) {
        onClick(Math.floor(x / TILE_SIZE), Math.floor(y / TILE_SIZE))
    }
    
})

canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.x
    const y = e.clientY - rect.y
    if (x < SCENE_WIDTH && y < SCENE_HEIGHT) {
        hoveredPoint = {
            x: Math.floor(x / TILE_SIZE),
            y: Math.floor(y / TILE_SIZE)
        }
    } else {
        hoveredPoint = null
    }
})

canvas.addEventListener('mouseleave', function(e) {
    hoveredPoint = null
})




registerUIEvents(canvas)

const frank = new Image(); 
frank.src = "img/people/frank.png"

const garry = new Image(); 
garry.src = "img/people/garry.png"

staticObjects = [
    { width: 1,height: 1, x: 5, y: 2, img: surfaceWater },
    { width: 1,height: 1, x: 5, y: 3, img: surfaceWater },
    { width: 1,height: 1, x: 5, y: 4, img: surfaceWater },
    { width: 1,height: 1, x: 6, y: 2, img: surfaceWater },
    { width: 1,height: 1, x: 6, y: 3, img: surfaceWater },
    { width: 1,height: 1, x: 7, y: 2, img: surfaceWater },
    { width: 1,height: 1, x: 7, y: 3, img: surfaceWater },
    { width: 1,height: 1, x: 8, y: 2, img: surfaceWater },
    { width: 1,height: 1, x: 8, y: 3, img: surfaceWater },
]

let plants = []

createTree(3, 3)

droppedItems = new Array(SCENE_WIDTH / TILE_SIZE); for (let i=0; i<SCENE_WIDTH / TILE_SIZE; ++i) droppedItems[i] = new Array(SCENE_HEIGHT / TILE_SIZE).fill(null);

droppedItems[8][1] = [{type: 'sprout',qty: 1}]
droppedItems[1][1] = [{type: 'wood',qty: 6}]
droppedItems[2][1] = [{type: 'wood',qty: 5}]
droppedItems[3][1] = [{type: 'wood',qty: 6}]
droppedItems[4][1] = [{type: 'wood',qty: 7}]
droppedItems[5][1] = [{type: 'wood',qty: 170}]
droppedItems[1][2] = [{type: 'berry',qty: 1}]


friends = [
    {
        name: "Frank",
        health: 100,
        satiety: 100,
        freshness: 100,
        width: 1,
        height: 1,
        x: 3,
        y: 7,
        color: 'blue',
        img: frank,
        speed: 1,
        inventory: [
            {type: 'wood', qty: 4}
        ],
        feature: {
            friend: {}
        },
        skill: {
            lumberjack: 3
        },
        tasks: [],
        plan: []
    },
    {
        name: "Garry",
        health: 100,
        satiety: 100,
        freshness: 100,
        width: 1,
        height: 1,
        x: 12,
        y: 8,
        color: 'purple',
        img: garry,
        speed: 1,
        inventory: [],
        feature: {
            friend: {}
        },
        tasks: [
        ],
        plan: [],
        skill: {
            lumberjack: 5
        },
    }
]


let hoveredPoint = null


let objectToBuild = null

let selectedObject = null

function objectsToRender() {
    return [...staticObjects, ...friends]
} 

let globalTasksQueue = tasksQueue()


function onClick(x, y) {
    console.log(" On click " + x + " " + y)

    if (objectToBuild) {
        if (objectToBuild == 'tree') {
            globalTasksQueue.push({
                type: "grow",
                args: {
                    name: "tree",
                    x,
                    y
                }
            })
        }
        if (['bed', 'berry_bush', 'wall', "torch"].includes(objectToBuild)) {
            globalTasksQueue.push({
                type: "construct",
                args: {
                    name: objectToBuild,
                    x,
                    y
                }
            })
        }
        objectToBuild = null
    }

    for(target of objectsToRender()) {
        if (target.x == x && target.y == y) {
            if (selectedObject == target) {
                selectedObject = null
            } else {
                selectedObject = target
            }

            if(friends.includes(target)) {
                console.log(target.plan)
            }
            
        }
    }

}


function hitObject(target, damage) {
    target.health -= damage
    if (target.health < 0) {
        target.dead = true

        if ( target == selectedObject) {
            selectedObject = null
        }

        staticObjects = staticObjects.filter(item => item !== target)
        plants = plants.filter(item => item != target)

        if (target.inventory) {
            for (item of target.inventory) {
                console.log(target.x + " " + target.y)
                dropItem(item, target.x, target.y)
            }
        }

    }
}

function dropItem(item, x, y) {
    if (droppedItems[x][y]) {
        droppedItems[x][y].push(item)
    } else {
        droppedItems[x][y] = [item]
    }
}

function createTree(x, y) {
    let newObject = {
        name: "Дерево",
        img: tree0,
        width: 1,
        height: 1,
        x: x,
        y: y,
        health: 100,
        kind: ['tree'],
        feature: {
            plant: {
                type: "tree",
                level: 0
            }
        },
        inventory: [
            {
                type: 'wood',
                qty: 10
            },
            {
                type: 'sprout',
                qty: getRandomInt(0, 1)
            }
        ]
    }
    staticObjects.push(newObject)
    plants.push(newObject)
}

function recalculateOrientedImg(x, y, template) {
    let obj = getObjectInTile(x, y)
    if (!obj || obj.name != template.name) return

    let hasWest = isTileHasObject(x - 1, y, template.name)
    let hasEast = isTileHasObject(x + 1, y, template.name)
    let hasNorth = isTileHasObject(x, y - 1, template.name)
    let hasSouth = isTileHasObject(x, y + 1, template.name)


    let orientedProps

    if (!hasWest && !hasEast && !hasNorth && !hasSouth) orientedProps = template.oriented.default
    if (hasWest && hasEast && !hasNorth && !hasSouth) orientedProps = template.oriented.horizontal
    if (!hasWest && !hasEast && hasNorth && hasSouth) orientedProps = template.oriented.vertical
    if (hasWest && hasEast && hasNorth && hasSouth) orientedProps = template.oriented.cross

    if (hasWest && hasEast && hasNorth && !hasSouth) orientedProps = template.oriented.south
    if (!hasWest && hasEast && hasNorth && !hasSouth) orientedProps = template.oriented.southWest
    if (!hasWest && hasEast && hasNorth && hasSouth) orientedProps = template.oriented.west
    if (!hasWest && hasEast && !hasNorth && hasSouth) orientedProps = template.oriented.northWest

    if (hasWest && hasEast && !hasNorth && hasSouth) orientedProps = template.oriented.north
    if (hasWest && !hasEast && !hasNorth && hasSouth) orientedProps = template.oriented.northEast
    if (hasWest && !hasEast && hasNorth && hasSouth) orientedProps = template.oriented.east
    if (hasWest && !hasEast && hasNorth && !hasSouth) orientedProps = template.oriented.southEast

    if (hasWest && !hasEast && !hasNorth && !hasSouth) orientedProps = template.oriented.horizontal
    if (!hasWest && hasEast && !hasNorth && !hasSouth) orientedProps = template.oriented.horizontal

    if (!hasWest && !hasEast && !hasNorth && hasSouth) orientedProps = template.oriented.vertical

    if (!hasWest && !hasEast && hasNorth && !hasSouth) orientedProps = template.oriented.verticalEnd

    obj.img = orientedProps.img
    if (orientedProps.feature && orientedProps.feature.lightBlock) {
        obj.feature.lightBlock.blocks = orientedProps.feature.lightBlock.blocks
    } else {
        obj.feature.lightBlock.blocks = template.oriented.default.feature.lightBlock.blocks
    }

}

function createObject(x, y, template) {
    let newObject = {
        name: template.name,
        img: template.img,
        inventory: template.inventory ? JSON.parse(JSON.stringify(template.inventory)): [],
        width: 1,
        height: 1,
        x: x,
        y: y,
        health: 100,
        feature: template.feature ? JSON.parse(JSON.stringify(template.feature)): {}
    }
    staticObjects.push(newObject)
    
    if(template.oriented) {
        let areaPoints = [{x: x - 1, y: y - 1},{x: x - 1, y: y},{x: x - 1, y: y + 1},
                            {x: x, y: y - 1},{x: x, y: y},{x: x, y: y + 1},
                            {x: x  + 1, y: y - 1},{x: x + 1, y: y},{x: x + 1, y: y + 1}]
        areaPoints.forEach(p => recalculateOrientedImg(p.x, p.y, template))
    }
}

function getRandomInt(min, max) {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

function isFreeTile(x, y) {
    for (obj of staticObjects) {
        if (obj.x == x && obj.y == y) {
            return false
        }
    }
    return true
}

function getObjectInTile(x, y) {
    for (obj of staticObjects) {
        if (obj.x == x && obj.y == y) {
            return obj
        }
    }
    return null
}

function isTileHasObject(x, y, name) {
    for (obj of staticObjects) {
        if (obj.x == x && obj.y == y && obj.name == name) {
            return true
        }
    }
    return false
}

function findItems(type, qty) {
    let result = []
    let qtyLeft = qty
    mainloop: for(let x = 0; x < droppedItems.length; x++) {
        for(let y = 0; y < droppedItems[x].length; y++) {
            let current = droppedItems[x][y]
            if(current && current.length > 0) {
                for (let i = 0; i < current.length; i++) {

                    if(current[i].type == type) {

                        let qtyToTake = qtyLeft < current[i].qty ? qtyLeft : current[i].qty

                        result.push({x, y, qty: qtyToTake})
                        qtyLeft = qtyLeft - qtyToTake
                        if (qtyLeft <= 0) {
                            break mainloop
                        }
                    }
                }
            }
        }
    }

    if (qtyLeft > 0) {
        console.log("Unable to find " + qtyLeft + " of " + type)
        return null
    }

    return result;
}

function hasInInventory(target, items) {
    if (!target.inventory) return false

    for(item of items) {
        let found = false
        for(ownItem of target.inventory) {
            if (ownItem.type == item.type && ownItem.qty >= item.qty) {
                found = true
            }
        }
        if(!found) return false
    }

    return true
}

function removeFromInventory(target, items) {
    if(! items) {
        return
    }
    for(item of items) {
        for(let i = 0; i < target.inventory.length; i++) {
            let ownItem = target.inventory[i]
            if (ownItem.type == item.type) { 
                if (ownItem.qty > item.qty) {
                    ownItem.qty = ownItem.qty - item.qty
                } else {
                    target.inventory.splice(i, 1)
                }
            }
        }
    }
}

function putToInventory(friend, item) {
    for (ownItem of friend.inventory) {
        if (ownItem.type == item.type) {
            ownItem.qty = ownItem.qty + item.qty
            return
        }
    }
    friend.inventory.push(item)
}


function ticker() {
    const start = performance.now();
    calculate()
    const calc = performance.now();
    render()
    const rendered = performance.now();
    // console.log("calc " + (calc - start) + " render " + (rendered - calc))
    setTimeout(ticker, TICK_DELAY)
}

let gameTime = {
    ticks: 0
}

function calculateTime() {
    gameTime.ticks += 1
    gameTime.minutes = Math.floor(gameTime.ticks / TICKS_PER_GAME_MINUTE) % 60
    gameTime.hours =  (Math.floor(gameTime.ticks / TICKS_PER_GAME_MINUTE / 60) + 8) % 24
}

function calculateTerrainGrid() {
    let grid = new Array(SCENE_WIDTH / TILE_SIZE); for (let i=0; i<SCENE_WIDTH / TILE_SIZE; ++i) grid[i] = new Array(SCENE_HEIGHT / TILE_SIZE).fill(0);
    for (staticObject of staticObjects) {
        if (staticObject.feature && staticObject.feature.obstacle) {
            grid[staticObject.x][staticObject.y] = -1
        }  
    }
    return grid
}

function calculate() {

    calculateTime()

    staticObjects.filter((obj) => obj && obj.feature && obj.feature['plant']).forEach((plant) => {
        let plantFeature = plant.feature.plant
        let plantTemplate = collections.objects[plantFeature.type]

        let growRate = plantTemplate.growRate   
        let newGrowLevel = Math.min(plantFeature.level + growRate, 100)
        let currentPhase = null
        for (phase of plantTemplate.phases) {
            if (newGrowLevel >= phase.level){
                currentPhase = phase
            }
        }

        if (currentPhase.height) {
            plant.height = currentPhase.height
        }

        plant.img = currentPhase.img
        plant.inventory = currentPhase.inventory
        plantFeature.level = newGrowLevel
    })

    for (friend of friends) {

        if (friend.plan && friend.plan.length > 0) {
            task = friend.plan[0]
            if ( task.type == 'move') {
                
                if(friend.x === task.args.x && friend.y === task.args.y) {
                    friend.plan.shift()
                    console.log(friend.name + " completed task part " + task.type)
                }

                if (friend.x > task.args.x) {
                    friend.x = friend.x - Math.min(friend.speed, friend.x - task.args.x)
                }

                if (friend.x < task.args.x) {
                    friend.x = friend.x + Math.min(friend.speed, task.args.x - friend.x)
                }

                if (friend.y > task.args.y) {
                    friend.y = friend.y - Math.min(friend.speed, friend.y - task.args.y)
                }

                if (friend.y < task.args.y) {
                    friend.y = friend.y + Math.min(friend.speed, task.args.y - friend.y)
                }
            } 
            if ( task.type == 'cut') {
                let target = task.args.target
                if (! isNear(friend, target)) {
                    friend.plan = []
                } else if (target.dead || target.health < 0) {
                    friend.plan.shift()
                    console.log(friend.name + " completed task part " + task.type)
                } else {
                    hitObject(target, friend.skill.lumberjack)
                
                }
            }
            if ( task.type == 'grow') {
                let targetPoint = {
                    x: task.args.x,
                    y: task.args.y
                }
                if (! isNear(friend, targetPoint)) {
                    friend.plan = []
                } else if (! isFreeTile(targetPoint.x, targetPoint.y)) {
                    friend.plan.shift()
                    console.log(friend.name + " completed task part " + task.type)
                } else {
                    createTree(targetPoint.x, targetPoint.y)
                }
            }
            if ( task.type == 'construct') {
                let targetPoint = {
                    x: task.args.x,
                    y: task.args.y
                }
                if (! isNear(friend, targetPoint)) {
                } else if (task.args.template.parts && !hasInInventory(friend, task.args.template.parts)) {
                    console.log("There is no enought parts in inventory")
                } else if (isTileHasObject(targetPoint.x, targetPoint.y, task.args.name)) {
                    console.log(friend.name + " completed task part " + task.type)
                } else {
                    createObject(targetPoint.x, targetPoint.y, task.args.template)
                    removeFromInventory(friend, task.args.template.parts)
                    
                }
                friend.plan = []
            }
            if ( task.type == 'take') {
                
                let items = droppedItems[friend.x][friend.y]
                let found = false
                if(items) {
                    for(let i = 0; i < items.length; i++) {
                        if (items[i].type == task.args.type) {
                            if (items[i].qty > task.args.qty) {
                                items[i].qty = items[i].qty - task.args.qty
                                putToInventory(friend, {type: task.args.type, qty: task.args.qty})
                            } else if (items[i].qty == task.args.qty) {
                                items.splice(i, 1)
                                putToInventory(friend, {type: task.args.type, qty: task.args.qty})
                            } else {
                                console.log("Not enought items")
                                friend.plan = []
                            }
                            found = true
                        }
                    }
                }

                if(found) {
                    friend.plan.shift()
                    console.log(friend.name + " completed task part " + task.type)
                } else {
                    console.log("Item not found")
                    friend.plan = []
                }

            }
        } else {

            if (friend.tasks && friend.tasks.length > 0) {
                task = friend.tasks[0]
                if ( task.type == 'move') {

                    if(friend.x === task.args.x && friend.y === task.args.y) {
                        friend.tasks[0].complete()
                        friend.tasks.shift()
                        console.log(friend.name + " completed " + task.type)
                    }
                    
                    let from = {x: friend.x, y: friend.y}
                    let to = {x: task.args.x, y: task.args.y}
                    let grid = calculateTerrainGrid()
                    let plan = aStar(grid, from, to).map(point => ({type: "move", args: {x: point.x, y: point.y}}))
                    friend.plan = plan
                }
                if ( task.type == 'cut') {
                    let target = task.args.target

                    if(target.dead || target.health < 0) {
                        friend.tasks[0].complete()
                        friend.tasks.shift()
                        console.log(friend.name + " completed " + task.type)
                    }
                    
                    let from = {x: friend.x, y: friend.y}
                    let to = {x: target.x, y: target.y}
                    let grid = calculateTerrainGrid()
                    let plan = aStar(grid, from, to, true).map(point => ({type: "move", args: {x: point.x, y: point.y}}))
                    plan.push({
                        type: "cut",
                        args: {
                            target: task.args.target
                        }
                    })
                    friend.plan = plan
                }
                if ( task.type == 'grow') {

                    if(! isFreeTile(task.args.x, task.args.y)) {
                        friend.tasks[0].complete()
                        friend.tasks.shift()
                        console.log(friend.name + " completed " + task.type)
                        continue
                    }

                    let sproutLocation = findItems('sprout', 1)
                    if (sproutLocation == null || sproutLocation.length == 0) {
                        console.log("There are no sprout. Grow task is aborted")
                        friend.tasks[0].complete()
                        friend.tasks.shift()
                        continue
                    }
                    
                    let from = {x: friend.x, y: friend.y}
                    let grid = calculateTerrainGrid()
                    let plan = aStar(grid, from, sproutLocation[0], false).map(point => ({type: "move", args: {x: point.x, y: point.y}}))

                    

                    plan.push({
                        type: "take",
                        args: {
                            type: "sprout",
                            qty: 1
                        }
                    })

                    let to = {x: task.args.x, y: task.args.y}
                    let plan2 = aStar(grid, sproutLocation[0], to, true).map(point => ({type: "move", args: {x: point.x, y: point.y}}))
                    plan.push(...plan2)

                    plan.push({
                        type: "grow",
                        args: {
                            name: task.args.name,
                            x: task.args.x,
                            y: task.args.y
                        }
                    })
                    friend.plan = plan
                }
                if ( task.type == 'construct') {

                    if(isTileHasObject(task.args.x, task.args.y, task.args.name)) {
                        friend.tasks[0].complete()
                        friend.tasks.shift()
                        console.log(friend.name + " completed " + task.type)
                        continue
                    }

                    let template = collections.objects[task.args.name]

                    let plan = []
                    let lastPoint = {x: friend.x, y: friend.y}

                    let itemsFound = true
                    if (template.parts) {
                        for(part of template.parts) {
                            let qtyToFind = part.qty
                            for (ownItem of friend.inventory) {
                                if (ownItem.type == part.type) {
                                    if (ownItem.qty < part.qty) {
                                        qtyToFind -= ownItem.qty
                                    } else {
                                        qtyToFind = 0
                                    }
                                    
                                }
                            }
    
                            if (qtyToFind == 0) {
                                continue
                            }
    
                            let locations = findItems(part.type, qtyToFind)
                            if (locations == null) {
                                console.log("[error] There are no enought " + part.type + ". Construction task is aborted")
                                itemsFound = false
                                break
                            }
    
                            for(loc of locations){
                                let from = lastPoint
                                let grid = calculateTerrainGrid()
                                plan.push(...aStar(grid, from, loc, false).map(point => ({type: "move", args: {x: point.x, y: point.y}})))
                                plan.push({
                                    type: "take",
                                    args: {
                                        type: part.type,
                                        qty: loc.qty
                                    }
                                })
                                lastPoint = loc
                            }
                        }
                    }

                    if (!itemsFound) {
                        friend.tasks[0].reject()
                        friend.tasks.shift()
                    }   else {
                        let from = lastPoint
                        let grid = calculateTerrainGrid()
                        let targetLoc = {x: task.args.x, y: task.args.y}
                        plan.push(...aStar(grid, from, targetLoc, true).map(point => ({type: "move", args: {x: point.x, y: point.y}})))
    
                        plan.push({
                            type: "construct",
                            args: {
                                name: task.args.name,
                                x: task.args.x,
                                y: task.args.y,
                                template: template
                            }
                        })
                        friend.plan = plan
                    }
             
                }
            } else {

                let nextTask = globalTasksQueue.take(friend)
                if (nextTask) {
                    friend.tasks.push(nextTask)
                    console.log("New task " + nextTask.type + " was assigned to " + friend.name)
                }
                

            }

        }

        
    }

}

function renderDark() {
    let points = []
    
    staticObjects
        .filter(obj => obj.feature && obj.feature.lightBlock)
        .forEach(obj => {
            if (obj.feature.lightBlock.blocks) {
                for (block of obj.feature.lightBlock.blocks) {
                    points.push({
                        x: obj.x * TILE_SIZE + block.x,
                        y: obj.y * TILE_SIZE + block.y,
                        w: block.w,
                        h: block.h
                    })
                }
            } else {
                    points.push({
                        x: obj.x * TILE_SIZE,
                        y: obj.y * TILE_SIZE,
                        w: TILE_SIZE,
                        h: TILE_SIZE
                    })
            }})

            // drawObjects(points)
            

    let lights = staticObjects
        .filter(obj => obj.feature && obj.feature.light)
        .map(obj => ({
            x: obj.x * TILE_SIZE + (TILE_SIZE / 2),
            y: obj.y * TILE_SIZE + (TILE_SIZE / 2),
            radius: obj.feature.light.radius
        }))

    let path = createLightMap(points, lights)

    var can2 = document.createElement('canvas');
    can2.width = canvas.width;
    can2.height = canvas.height;
    var ctx2 = can2.getContext('2d');
    ctx2.clip(path)
    ctx2.drawImage(canvas, 0, 0)

    for (light of lights) {
        
        ctx2.fillStyle = 'rgba(255, 255, 0, 0.03)'
        ctx2.beginPath()
        ctx2.arc(light.x, light.y, light.radius, 0, 2 * Math.PI, false)
        ctx2.fill() 
        ctx2.beginPath()
        ctx2.arc(light.x, light.y, light.radius - 20, 0, 2 * Math.PI, false)
        ctx2.fill() 
        if (light.radius > 40) {
            ctx2.beginPath()
            ctx2.arc(light.x, light.y, light.radius - 40, 0, 2 * Math.PI, false)
            ctx2.fill() 
        }
        if (light.radius > 60) {
            ctx2.beginPath()
            ctx2.arc(light.x, light.y, light.radius - 60, 0, 2 * Math.PI, false)
            ctx2.fill() 
        }
    }

    let darkLevel = 0
    if (gameTime.hours >= 18)
        darkLevel = '0.1'
    if (gameTime.hours >= 19 || gameTime.hours < 8)
        darkLevel = '0.2'
    if (gameTime.hours >= 20 || gameTime.hours < 7)
        darkLevel = '0.3'
    if (gameTime.hours >= 21 || gameTime.hours < 6)
        darkLevel = '0.4'
    if (gameTime.hours >= 22 || gameTime.hours < 5)
        darkLevel = '0.6'
    if (gameTime.hours >= 0 && gameTime.hours < 4)
        darkLevel = '0.8'
    ctx.fillStyle = "rgb(0, 0, 0, " + darkLevel + ")"
    ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT)
    ctx.drawImage(can2, 0, 0);
}

function toTwoSigns(number) {
    if (number < 10) {
        return "0" + number
    } else {
        return number
    }
}

function renderTime() {
    ctx.font="bold 14px Arial";
    ctx.fillStyle = 'white'
    ctx.fillText(toTwoSigns(gameTime.hours) + ":" + toTwoSigns(gameTime.minutes) , 30, 10)
}

function selectObjectToBuild(name) {
    if (!name || name == objectToBuild) {
        objectToBuild = null
        return
    } else {
        objectToBuild = name
    }
}

let buildButtons = [
    { name: 'tree', img: tree1, shortcut: "1"},
    { name: 'berry_bush', img: bush3, shortcut: "2"},
    { name: 'bed', img: bed, shortcut: "3"},
    { name: 'wall', img: wall, shortcut: "4"},
    { name: 'torch', img: torch, shortcut: "5"}
]

let commands = [
    { name: 'cut', img: commandCut, shortcut: "c", features: ["plant"], action: () => {
        globalTasksQueue.push({
            type: "cut",
            args: {
                target: selectedObject
            }
        }, 5)
    }}
]

function actionApplicable(action, target) {
    if (!target || !target.feature) return false
    for(featureName of Object.keys(target.feature)) {
        if (action.features.includes(featureName)) {
            return true
        }
    }
    return false
}

let widgetsTree = function () { return {
    name: "root",
    handler: widgetsLibrary.container,
    args: {
        layout: "absolute",
        children: [
            {
                handler: widgetsLibrary.container,
                args: {
                    layout: 'horizontal',
                    gap: 3, padding: 5, left: 10, bottom: 10,
                    children: widgets.for(buildButtons, null, (item) => ({
                        handler: widgetsLibrary.button,
                        args: { width: 40, height: 40, img: item.img, shortcut: item.shortcut, 
                            action: () => selectObjectToBuild(item.name), selected: objectToBuild == item.name }
                    }))
                }
            },
            ...widgets.if(selectedObject != null, () => ([{
                handler: widgetsLibrary.container,
                args: {
                    top: 10, right: 10, backgroundColor: 'grey', padding: 3,
                    children: [
                        {
                            handler: widgetsLibrary.container,
                            args: {
                                layout: 'horizontal',
                                children: [
                                    {
                                        handler: widgetsLibrary.rect,
                                        args: {
                                            width: 80,
                                            height: 80,
                                            img: selectedObject?.img
                                        }
                                    },
                                    {
                                        handler: widgetsLibrary.container,
                                        args: {
                                            children: [
                                                {
                                                    handler: widgetsLibrary.text,
                                                    args: {
                                                        text: selectedObject?.name + " (" + selectedObject?.health + ")",
                                                        padding: 5
                                                    }
                                                },
                                                ...widgets.if(selectedObject?.feature?.plant, () => ([{
                                                    handler: widgetsLibrary.text,
                                                    args: {
                                                        text: "Зрелость: " + selectedObject.feature.plant.level.toFixed(2) + "%",
                                                        padding: 5
                                                    }
                                                }]))
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            handler: widgetsLibrary.tabs,
                            args: {
                                backgroundColor: 'grey',
                                tabs: [
                                    ...widgets.if(selectedObject?.feature?.friend, () => ([{ name: "status", text: 'Статус' },
                                        { name: "inventory", text: "Инвентарь"}])),
                                    ...widgets.if(selectedObject?.feature?.friend, () => ([{ name: "skills", text: "Навыки", }]))
                                ],
                                children: [
                                    ...widgets.if(selectedObject?.feature?.friend, () => ([{
                                        handler: widgetsLibrary.container,
                                        args: {
                                            padding: 5,
                                            gap: 5,
                                            children: [{
                                                handler: widgetsLibrary.text,
                                                args: {text: "Здоровье: " + selectedObject.health}
                                            },{
                                                handler: widgetsLibrary.text,
                                                args: {text: "Сытость: " + selectedObject.satiety}
                                            },{
                                                handler: widgetsLibrary.text,
                                                args: {text: "Бодрость: " + selectedObject.freshness}
                                            }]
                                        }
                                    },{
                                        handler: widgetsLibrary.container,
                                        args: {
                                            children: widgets.for(selectedObject.inventory ?? [], () => true, (item) => ({
                                                handler: widgetsLibrary.text,
                                                args: {
                                                    text: item.type + " " + item.qty,
                                                    padding: 5
                                                }
                                            }))
                                        }
                                    }])),
                                    
                                    ...widgets.if(selectedObject?.feature?.friend, () => ([{
                                        handler: widgetsLibrary.container,
                                        args: {
                                            backgroundColor: "green", padding: 5, gap: 5,
                                            children: [
                                                {
                                                    handler: widgetsLibrary.button,
                                                    args: {
                                                        width: 40, height: 40, backgroundColor: "yellow"
                                                    }
                                                },
                                                {
                                                    handler: widgetsLibrary.button,
                                                    args: {
                                                        width: 150, height: 40, backgroundColor: "yellow"
                                                    }
                                                }
                                            ]
                                        }
                                    }])),
                                ]
                            }
                        },
                        {
                            handler: widgetsLibrary.container,
                            args: {
                                layout: 'horizontal',
                                gap: 3,
                                children: widgets.for(commands, (command) => actionApplicable(command, selectedObject), (command) => ({
                                    handler: widgetsLibrary.button,
                                    args: { width: 40, height: 40, img: command.img, shortcut: command.shortcut, action: command.action }
                                            
                                }))
                            }
                        }
                    ]
                }
            }]))
        ]
    }
    
}}


function render() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);


    for (let i = 0; i < SCENE_WIDTH / TILE_SIZE; i++) {
        for (let j = 0; j < SCENE_HEIGHT / TILE_SIZE; j++) {
            ctx.drawImage(surfaceDirt4, i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        }
    }

    

    for(let x = 0; x < droppedItems.length; x++) {
        for(let y = 0; y < droppedItems[x].length; y++) {
            let current = droppedItems[x][y]
            if(current && current.length > 0) {
                for (let i = 0; i < current.length; i++) {
                    let item = current[i]

                    let itemTemplate = collections.items[item.type]

                    if(itemTemplate.img) {
                        ctx.drawImage(itemTemplate.img, x * TILE_SIZE + i * (TILE_SIZE / 2), y * TILE_SIZE, TILE_SIZE / 2, TILE_SIZE / 2)
                    } else {
                        ctx.fillStyle = itemTemplate.color;
                        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE / 2, TILE_SIZE / 2);
                    }

                    ctx.fillStyle = "black";
                    ctx.setLineDash([])
                    ctx.font="bold 14px Arial";
                    ctx.fillText(item.qty , x * TILE_SIZE + i * (TILE_SIZE / 2), y * TILE_SIZE)

                }
            }
        }
    }

    for (obj of objectsToRender()) {

        if (obj == selectedObject) {
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2
            ctx.setLineDash([6, 2])
            ctx.strokeRect(obj.x * TILE_SIZE, obj.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }

        if(obj.img) {
            ctx.drawImage(obj.img, obj.x * TILE_SIZE, obj.y * TILE_SIZE - ((obj.height - 1) * TILE_SIZE), TILE_SIZE, obj.height * TILE_SIZE)
        } else {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x * TILE_SIZE, obj.y * TILE_SIZE, obj.width * TILE_SIZE, obj.height * TILE_SIZE);
        }
        
        
    }

    renderDark()

    renderTasks({ ctx, tileSize: TILE_SIZE}, globalTasksQueue.listActual())

    renderTime()

    if (hoveredPoint) {
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(102,255,153,0.5)'
        ctx.arc(hoveredPoint.x * TILE_SIZE + (TILE_SIZE / 2), hoveredPoint.y * TILE_SIZE + (TILE_SIZE / 2), 5, 0, 2 * Math.PI, false)
        ctx.lineWidth = 3
        ctx.setLineDash([])
        ctx.stroke()
    }

    renderUI(ctx, widgetsTree())

}

ticker()

// let queue = priorityQueue()
// queue.push("qwe5", 5)
// queue.push("qwe25", 25)
// queue.push("qwe12", 12)
// queue.push("qwe3", 3)
// console.log(queue.pop())
// console.log(queue.pop())
// console.log(queue.pop())
// console.log(queue.pop())

// let grid = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, -1, -1, -1, -1, -1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
//     [0, 0, -1, -1, -1, -1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ]

// let a = {x: 4, y: 6}
// let b = {x: 8, y: 7}

// let path = aStar(grid, a, b)
// console.log(path)

// // // console.log(getNeighbors(grid, a))

// // setTimeout(aStar, 10000, grid, a, b)
// // console.log(aStar(grid, a, b))