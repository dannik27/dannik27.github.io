
const taskConstruct = new Image(); taskConstruct.src = "img/tasks/construct.png"


function renderTasks(renderContext, tasks) {

    let ctx = renderContext.ctx
    let tileSize = renderContext.tileSize

    for (task of tasks) {
        if (task.type == "construct") {
            ctx.drawImage(taskConstruct, 
                task.args.x * tileSize + (tileSize / 4), 
                task.args.y * tileSize + (tileSize / 4), 
                tileSize / 2, tileSize / 2)
        }
    }


}