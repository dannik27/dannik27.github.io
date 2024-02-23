

function tasksQueue() {
    return {
        items: [],
        push(task, priority = 1, key = null) {
            if (key && this.items.find(t => t.status != "completed" && t.key == key)) {
                // duplicate
                return
            }
            let taskWrapper = {
                task,
                priority,
                status: 'queue',
                delay: 0,
                key
            }
            task.complete = function() {
                taskWrapper.status = 'completed'
            }
            task.reject = function() {
                taskWrapper.status = 'queue'
                taskWrapper.assignee = null
                taskWrapper.delay = 5
            }
            if (this.items.length == 0 || this.items[this.items.length - 1].priority < priority) {
                this.items.push(taskWrapper)
            } else {
                for(let i = 0; i < this.items.length; i++) {
                    if (priority <= this.items[i].priority) {
                        this.items.splice(i, 0, taskWrapper)
                        break
                    }
                }
            }
            
        },
        take(friend) {
            let freeTasks = this.items.filter(t => !t.assignee)
            for (freeTask of freeTasks) {
                if (freeTask.delay > 0) {
                    freeTask.delay = freeTask.delay - 1
                } else {
                    freeTask.assignee = friend.name
                    freeTask.status = 'assigned'
                    return freeTask.task
                }
            }
            return null
        
        },
        isEmpty() {
            return this.items.length === 0
        },
        list() {
            return this.items.map(item => item.task)
        },
        listActual() {
            return this.items.filter(item => item.status != "completed").map(item => item.task)
        },
    }

}