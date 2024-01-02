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

const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");


canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.x
    const y = e.clientY - rect.y
    if (x < SCENE_WIDTH) {
        onClick(Math.floor(x / TILE_SIZE), Math.floor(y / TILE_SIZE))
    } else if (y > BUTTONS_AREA_Y) {
        onButtonClick(Math.floor((x - SCENE_WIDTH) / BUTTON_SIZE))
    }
    
})

const tree1 = new Image(); 
tree1.src = "img/tree1.png"

staticObjects = [
    {
        name: "Дерево",
        img: tree1,
        width: 1,
        height: 1,
        x: 3,
        y: 3,
        color: 'green',
        health: 100,
        kind: ['tree']
    },
    {
        width: 1,
        height: 1,
        x: 3,
        y: 4,
        color: 'red'
    },
    { width: 1,height: 1, x: 5, y: 2, color: 'red' },
    { width: 1,height: 1, x: 5, y: 3, color: 'red' },
    { width: 1,height: 1, x: 5, y: 4, color: 'red' },
    { width: 1,height: 1, x: 5, y: 5, color: 'red' },
    { width: 1,height: 1, x: 5, y: 6, color: 'red' },
    { width: 1,height: 1, x: 5, y: 7, color: 'red' },
    { width: 1,height: 1, x: 5, y: 8, color: 'red' },
    { width: 1,height: 1, x: 5, y: 9, color: 'red' },
    { width: 1,height: 1, x: 5, y: 10, color: 'red' },
]

friends = [
    {
        name: "Frank",
        width: 1,
        height: 1,
        x: 3,
        y: 7,
        color: 'blue',
        speed: 1,
        skill: {
            lumberjack: 5
        },
        tasks: [
            // {
            //     type: "move",
            //     args: {
            //         x: 6,
            //         y: 3
            //     }
            // },
            // {
            //     type: "move",
            //     args: {
            //         x: 2,
            //         y: 8
            //     }
            // }
        ],
        plan: []
    },
    {
        name: "Garry",
        width: 1,
        height: 1,
        x: 12,
        y: 8,
        color: 'purple',
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

let selectedObject = null

let objectToRender = [...staticObjects, ...friends]

let globalTasksQueue = priorityQueue()

function onClick(x, y) {
    console.log(" On click " + x + " " + y)

    for(target of objectToRender) {
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
        objectToRender = objectToRender.filter(item => item !== target)



    }
}



function ticker() {
    calculate()
    render()
    setTimeout(ticker, 100)
}

function calculate() {

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

    for (obj of objectToRender) {

        if(obj.img) {
            ctx.drawImage(obj.img, obj.x * TILE_SIZE, obj.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        } else {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x * TILE_SIZE, obj.y * TILE_SIZE, obj.width * TILE_SIZE, obj.height * TILE_SIZE);
        }
        
        if (obj == selectedObject) {
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 6
            ctx.strokeRect(obj.x * TILE_SIZE, obj.y * TILE_SIZE, obj.width * TILE_SIZE, obj.height * TILE_SIZE);
        }
    }

    if (selectedObject) {

        ctx.font="20px Georgia";
        ctx.fillStyle = "#000000";
        ctx.textAlign="left"; 
        ctx.textBaseline = "middle";
        ctx.fillText(selectedObject.name + "   " + selectedObject.health, SELECTED_INFO_AREA_X + 10, SELECTED_INFO_AREA_Y + 20);

        for (button of buttons) {
            if (selectedObject.kind && selectedObject.kind.includes(button.kind)) {
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