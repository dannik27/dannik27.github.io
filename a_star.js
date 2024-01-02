

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function aStar(grid, a, b, near) {
    let frontier = priorityQueue()
    frontier.push(a, 0)
    while (! frontier.isEmpty()) {
        let current = frontier.pop()
        if (current.x == b.x && current.y == b.y) {
            return buildResult(current)
        }
        if (near && isNear(current, b)) {
            return buildResult(current)
        }
        for (next of getNeighbors(grid, current)) {
            let newCost = grid[current.y][current.x] + 1
            if (grid[next.y][next.x] == 0 || newCost < grid[next.y][next.x]) {
                grid[next.y][next.x] = newCost
                let priority = newCost + heuristic(next, b)
                frontier.push(next, priority)
                next.cameFrom = current
            }
        }
    }
}

function isNear(a, b) {
    return Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2
}

function buildResult(lastPoint) {
    let pathReversed = []

    while (lastPoint) {
        pathReversed.push({x: lastPoint.x, y: lastPoint.y})
        lastPoint = lastPoint.cameFrom    
    }
    let fullPath = pathReversed.reverse()

    let resultPath = []
    let previous = null
    let saved = null
    for (let i = 0; i < fullPath.length; i++) {
        let point = fullPath[i]

        if (previous) {
            if (saved) {
                if(point[saved.field] == saved.value) {
                    resultPath[resultPath.length -1] = point
                } else {
                    saved = null
                    resultPath.push({x: point.x, y: point.y})
                }
            } else {
                if (point.x == previous.x) {
                    saved = {
                        field: 'x',
                        value: point.x
                    }
                    resultPath.push({x: point.x, y: point.y})
                } else if (point.y == previous.y) {
                    saved = {
                        field: 'y',
                        value: point.y
                    }
                    resultPath.push({x: point.x, y: point.y})
                }
            }
        } else {
            resultPath.push({x: point.x, y: point.y})
        }
        previous = point
    }
    resultPath.shift()

    // console.log(resultPath)

    return resultPath
}

function getNeighbors(grid, a) {
    let candidates = [
        {x: a.x, y: a.y + 1},
        {x: a.x, y: a.y - 1},
        {x: a.x - 1, y: a.y},
        {x: a.x + 1, y: a.y}
    ]
    return candidates
        .filter( c => c.x >= 0 && c.y >= 0 && c.y < grid.length && c.x < grid[0].length)
        .filter( c => grid[c.y][c.x] >= 0)
}


function priorityQueue() {
    return {
        items: [],
        push(item, priority) {
            if (this.items.length == 0 || this.items[this.items.length - 1].priority < priority) {
                this.items.push({item, priority})
            } else {
                for(let i = 0; i < this.items.length; i++) {
                    if (priority <= this.items[i].priority) {
                        this.items.splice(i, 0, {item, priority})
                        break
                    }
                }
            }
            
        },
        pop() {
            if (this.items.length > 0) {
                let result = this.items[0].item
                this.items.shift()
                return result
            } else {
                return null
            }
            
        },
        isEmpty() {
            return this.items.length === 0
        }
    }

}