console.log("I'm alive!s")


let SCENE_WIDTH = 640
let SCENE_HEIGHT = 480
let TILE_SIZE = 40
let SIDE_MENU_WIDTH = 200

let SELECTED_INFO_AREA_X = SCENE_WIDTH
let SELECTED_INFO_AREA_Y = 0


let BUTTON_SIZE = 40
let BUTTONS_AREA_X = SCENE_WIDTH
let BUTTONS_AREA_Y = SCENE_HEIGHT - 2 * BUTTON_SIZE

let BUILD_BUTTONS_AREA_X = 0
let BUILD_BUTTONS_AREA_Y = SCENE_HEIGHT

const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");


canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.x
    const y = e.clientY - rect.y
    if (x < SCENE_WIDTH && y < SCENE_HEIGHT) {
        onClick(Math.floor(x / TILE_SIZE), Math.floor(y / TILE_SIZE))
    } else if (x > BUTTONS_AREA_X && y > BUTTONS_AREA_Y) {
        onButtonClick(Math.floor((x - SCENE_WIDTH) / BUTTON_SIZE))
    } else {
        onBuildButtonClick(Math.floor(x / BUTTON_SIZE))
    }
    
})


const frank = new Image(); 
frank.src = "img/people/frank.png"

const garry = new Image(); 
garry.src = "img/people/garry.png"

staticObjects = [
    {
        width: 1,
        height: 1,
        x: 3,
        y: 4,
        color: 'blue'
    },
    { width: 1,height: 1, x: 5, y: 2, color: 'blue' },
    { width: 1,height: 1, x: 5, y: 3, color: 'blue' },
    { width: 1,height: 1, x: 5, y: 4, color: 'blue' },
    { width: 1,height: 1, x: 5, y: 5, color: 'blue' },
    { width: 1,height: 1, x: 5, y: 6, color: 'blue' },
    { width: 1,height: 1, x: 5, y: 7, color: 'blue' },
    { width: 1,height: 1, x: 5, y: 8, color: 'blue' },
    { width: 1,height: 1, x: 5, y: 9, color: 'blue' },
    { width: 1,height: 1, x: 5, y: 10, color: 'blue' },
]

let plants = []

createTree(3, 3)

droppedItems = new Array(SCENE_WIDTH / TILE_SIZE); for (let i=0; i<SCENE_WIDTH / TILE_SIZE; ++i) droppedItems[i] = new Array(SCENE_HEIGHT / TILE_SIZE).fill(null);

droppedItems[8][2] = [
    {
        type: 'wood',
        qty: 5
    }
]


friends = [
    {
        name: "Frank",
        health: 100,
        width: 1,
        height: 1,
        x: 3,
        y: 7,
        color: 'blue',
        img: frank,
        speed: 1,
        skill: {
            lumberjack: 3
        },
        tasks: [],
        plan: []
    },
    {
        name: "Garry",
        health: 100,
        width: 1,
        height: 1,
        x: 12,
        y: 8,
        color: 'purple',
        img: garry,
        speed: 1,
        tasks: [
        ],
        plan: [],
        skill: {
            lumberjack: 5
        },
    }
]

let buttons = [
    {
        name: "cut",
        kind: "tree",
        text: "CUT",
        priority: 4
    }
]

let buildButtons = [
    {
        name: "tree",
        text: "bom",
        img: tree1
    }
]



let objectToBuild = null

let selectedObject = null

function objectsToRender() {
    return [...staticObjects, ...friends]
} 

let globalTasksQueue = priorityQueue()

function onClick(x, y) {
    console.log(" On click " + x + " " + y)

    if (objectToBuild) {
        if (objectToBuild.name == 'tree') {
            // createTree(x, y) 
            globalTasksQueue.push({
                type: "grow",
                args: {
                    name: "tree",
                    x,
                    y
                }
            }, 3)
        }
        objectToBuild = null
    }

    for(target of objectsToRender()) {
        if (target.x == x && target.y == y) {
            if (selectedObject == target) {
                selectedObject = null
            } else {
                selectedObject = target
                showButtons(target)
            }
            
        }
    }

}

function onButtonClick(index) {
    if (selectedObject) {
        for(button of buttons) {
            if (button.index == index) {
                
                if (button.name == "cut") {
                    globalTasksQueue.push({
                        type: "cut",
                        args: {
                            target: selectedObject
                        }
                    }, button.priority)
                }

            }
        }
    }
}

function onBuildButtonClick(index) {
    let buildButton = buildButtons[index]
    selectedObject = null
    objectToBuild = buildButton
    console.log("Button clicked " + buildButton.text)
}

function showButtons(target) {
    let buttonIndex = 0
    for (button of buttons) {
        if (target.kind && target.kind.includes(button.kind)) {
            button.index = buttonIndex
            buttonIndex += 1
        } else {
            button.index = null
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


function ticker() {
    calculate()
    render()
    setTimeout(ticker, 100)
}

function calculate() {

    for (plant of plants) {
        let plantFeature = plant.feature.plant
        let plantTemplate = collections.plants[plantFeature.type]

        let growRate = plantTemplate.growRate   
        let newGrowLevel = Math.min(plantFeature.level + growRate, 100)
        let currentPhase = null
        for (phase of plantTemplate.phases) {
            if (newGrowLevel > phase.level){
                currentPhase = phase
            }
        }

        if (currentPhase.height) {
            plant.height = currentPhase.height
        }

        plant.img = currentPhase.img
        plant.inventory = currentPhase.inventory
        plantFeature.level = newGrowLevel
    }

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
        } else {

            if (friend.tasks && friend.tasks.length > 0) {
                task = friend.tasks[0]
                if ( task.type == 'move') {

                    if(friend.x === task.args.x && friend.y === task.args.y) {
                        friend.tasks.shift()
                        console.log(friend.name + " completed " + task.type)
                    }
                    
                    let from = {x: friend.x, y: friend.y}
                    let to = {x: task.args.x, y: task.args.y}
                    let grid = new Array(SCENE_HEIGHT / TILE_SIZE); for (let i=0; i<12; ++i) grid[i] = new Array(16).fill(0);
                    for (staticObject of staticObjects) {
                        grid[staticObject.y][staticObject.x] = -1
                    }
                    let plan = aStar(grid, from, to).map(point => ({type: "move", args: {x: point.x, y: point.y}}))
                    friend.plan = plan
                }
                if ( task.type == 'cut') {
                    let target = task.args.target

                    if(target.dead || target.health < 0) {
                        friend.tasks.shift()
                        console.log(friend.name + " completed " + task.type)
                    }
                    
                    let from = {x: friend.x, y: friend.y}
                    let to = {x: target.x, y: target.y}
                    let grid = new Array(SCENE_HEIGHT / TILE_SIZE); for (let i=0; i<12; ++i) grid[i] = new Array(16).fill(0);
                    for (staticObject of staticObjects) {
                        grid[staticObject.y][staticObject.x] = -1
                    }
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
                        friend.tasks.shift()
                        console.log(friend.name + " completed " + task.type)
                    }
                    
                    let from = {x: friend.x, y: friend.y}
                    let to = {x: task.args.x, y: task.args.y}
                    let grid = new Array(SCENE_HEIGHT / TILE_SIZE); for (let i=0; i<SCENE_HEIGHT / TILE_SIZE; ++i) grid[i] = new Array(SCENE_WIDTH / TILE_SIZE).fill(0);
                    for (staticObject of staticObjects) {
                        grid[staticObject.y][staticObject.x] = -1
                    }
                    let plan = aStar(grid, from, to, true).map(point => ({type: "move", args: {x: point.x, y: point.y}}))
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
            } else {

                let nextTask = globalTasksQueue.pop()
                if (nextTask) {
                    friend.tasks.push(nextTask)
                    console.log("New task " + nextTask.type + " was assigned to " + friend.name)
                }
                

            }

        }

        
    }

}

function render() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, SCENE_WIDTH + SIDE_MENU_WIDTH, SCENE_HEIGHT);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);

    

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

    if (selectedObject) {

        ctx.font="20px Georgia";
        ctx.fillStyle = "#000000";
        ctx.textAlign="left"; 
        ctx.textBaseline = "middle";
        ctx.fillText(selectedObject.name + "   " + selectedObject.health, SELECTED_INFO_AREA_X + 10, SELECTED_INFO_AREA_Y + 20);

        if (selectedObject.feature && selectedObject.feature.plant) {
            ctx.fillText("Зрелость: " + selectedObject.feature.plant.level.toFixed(2) + "%", SELECTED_INFO_AREA_X + 10, SELECTED_INFO_AREA_Y + 40);
        }

        for (button of buttons) {
            if (button.index != null) {
                let buttonX = BUTTONS_AREA_X + button.index * BUTTON_SIZE
                let buttonY = BUTTONS_AREA_Y

                ctx.fillStyle = "#abc";
                ctx.fillRect(buttonX, buttonY, BUTTON_SIZE, BUTTON_SIZE, 10);
                ctx.font="14px Georgia";
                ctx.textAlign="center"; 
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#000000";
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2
                ctx.strokeRect(buttonX, buttonY, BUTTON_SIZE, BUTTON_SIZE, 10);
                ctx.fillText(button.text, buttonX+(BUTTON_SIZE/2),buttonY+(BUTTON_SIZE/2));
            }
        }
    }

    for (let i = 0; i < buildButtons.length; i++) {
        let button = buildButtons[i]

        let buttonX = BUILD_BUTTONS_AREA_X + i * BUTTON_SIZE
        let buttonY = BUILD_BUTTONS_AREA_Y

        ctx.fillStyle = "#abc";
        ctx.fillRect(buttonX, buttonY, BUTTON_SIZE, BUTTON_SIZE, 10);
        ctx.font="14px Georgia";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2
        ctx.strokeRect(buttonX, buttonY, BUTTON_SIZE, BUTTON_SIZE, 10);

        if (button == objectToBuild) {
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 6
            ctx.strokeRect(buttonX, buttonY, BUTTON_SIZE,  BUTTON_SIZE);
        }
        

        if(button.img) {
            ctx.drawImage(button.img, buttonX, buttonY, BUTTON_SIZE, BUTTON_SIZE)
        } else {
            ctx.fillText(button.text, buttonX+(BUTTON_SIZE/2),buttonY+(BUTTON_SIZE/2));
        }


    }

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