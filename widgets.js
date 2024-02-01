const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");


var button1Visible = true


function line(color, points) {
    ctx.lineWidth = '1' 
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()
}

function textWidth(text, font) {
    ctx.font = font
    return ctx.measureText(text).width
}

function absoluteX(args) {
    let x = args.x
    // let current = args
    // while (current.parent != null) {
    //     current = current.parent
    //     x += current.x
    // }
    return x
}

function absoluteY(args) {
    let y = args.y
    // let current = args
    // while (current.parent != null) {
    //     current = current.parent
    //     y += current.y
    // }
    return y
}

let widgetsLibrary = {
    tabs: {
        calculate(args) {
            args.selectedTab = args.selectedTab ? args.selectedTab : 0
            if (!args.children || args.children.length == 0) {
                args.width = args.width ? args.width : 0
                args.height = args.height ? args.height : 0
                return
            }

            if (!args.padding) args.padding = 5
            let padding = args.padding
            let x = args.x

            let child = args.children[args.selectedTab]
            child.handler.calculate(child.args)
            child.args.x = args.x
            child.args.y = args.y + 15 + padding * 2

            let tabFont = "bold 10px Arial"
            let minTabWidth = 20
            let maxTabWidth = 60
            let widthFromTabs = padding
            let nextX = x + padding
            for(tab of args.tabs) {
                let tabWidth = 0
                if (tab.text) {
                    tabWidth += textWidth(tab.text, tabFont)
                }
                tabWidth = Math.max(tabWidth, minTabWidth)
                tabWidth = Math.min(tabWidth, maxTabWidth)

                tab.width = tabWidth
                tab.x = nextX

                widthFromTabs += tabWidth + padding
                nextX += tabWidth + padding
            }

            args.width = Math.max(child.args.width, widthFromTabs)
            args.height = child.args.height + 15 + padding * 2

        },
        render( args, ctx) {

            ctx.fillStyle = args.backgroundColor
            ctx.fillRect(args.x, args.y, args.width, args.height)

            padding = args.padding

            for (let i = 0; i < args.tabs.length; i++) {
                let tab = args.tabs[i]
                ctx.fillStyle = 'yellow'
                ctx.fillRect(tab.x, args.y + padding, tab.width, 15)

                if(tab.text) {
                    ctx.fillStyle = "black";
                    ctx.textAlign="center"; 
                    ctx.textBaseline = "middle";
                    ctx.setLineDash([])
                    ctx.font="bold 10px Arial";
                    ctx.fillText(tab.text , tab.x + tab.width / 2, args.y + padding + 7)
                }
                
            }

            let child = args.children[args.selectedTab]
            child.handler.render(child.args, ctx)
        },
        onPress(args, point) {

            for (let i = 0; i < args.tabs.length; i++) {
                let tab = args.tabs[i]
                
                if ((point.x > tab.x)&&(point.x < tab.x + tab.width)&&(point.y > args.y + 5)&&(point.y < args.y + 15 + 5)) {
                    args.selectedTab = i
                }
            }
        },
        onRelease(args, point) {}
    },
    container: {
        calculate(args) {
            if (!args.children || args.children.length == 0) {
                args.width = args.width ? args.width : 0
                args.height = args.height ? args.height : 0
                return
            }

            let padding = args.padding ? args.padding : 0
            let gap = args.gap ? args.gap : 0
            let layout = args.layout ? args.layout : "vertical"
            let children = args.children.filter(c => (c.args.isVisible && c.args.isVisible.call(this)) || c.args.visible == null || c.args.visible)

            let x = args.x ? args.x : 0
            let y = args.y ? args.y : 0
            let width = args.width ? args.width : 0
            let height = args.height ? args.height : 0

            let nextX = x + padding
            let nextY = y + padding

            for (child of args.children) {
                child.handler.calculate(child.args)
            }

            if (layout == "vertical") {
                width = padding
                height = padding
                for (let i = 0; i < children.length; i++) {
                    children[i].args.x = nextX
                    children[i].args.y = nextY

                    let childWidth = children[i].args.width
                    let childHeight = children[i].args.height

                    height = height + childHeight + (i < children.length - 1 ? gap : 0)
                    width = Math.max(width, childWidth)
                    nextY = y + height
                }
                height += padding
                width += padding * 2
            }
            if (layout == "horizontal") {
                width = padding
                height = padding
                for (let i = 0; i < children.length; i++) {
                    children[i].args.x = nextX
                    children[i].args.y = nextY

                    let childWidth = children[i].args.width
                    let childHeight = children[i].args.height

                    width = width + childWidth + (i < children.length - 1 ? gap : 0)
                    height = Math.max(height, childHeight)
                    nextX = x + width
                }
                width += padding
                height += padding * 2
            }
            if (layout == "absolute") {
                for (let i = 0; i < children.length; i++) {
                    let child = children[i]
                    child.args.x = nextX
                    child.args.y = nextY

                    let childWidth = child.args.width
                    let childHeight = child.args.height

                    // if (child.args.right != null) {
                    //     if (child.args.left != null) {
                    //         child.args.width = width - child.args.left - child.args.right
                    //     }
                    //     child.args.x = width - child.args.width - child.args.right
                    // }

                    if (child.args.right != null && child.args.left != null) {
                        child.args.width = width - child.args.left - child.args.right
                        child.args.x = x + child.args.left
                    } else if (child.args.left != null) {
                        child.args.x = x + child.args.left
                    } else if (child.args.right != null) {
                        child.args.x = width - child.args.width - child.args.right
                    }

                    if (child.args.top != null && child.args.bottom != null) {
                        child.args.height = child.args.height = height - child.args.top - child.args.bottom
                        child.args.y = y + child.args.top
                    } else if (child.args.top != null) {
                        child.args.y = y + child.args.top
                    } else if (child.args.bottom != null) {
                        child.args.y = height - child.args.height - child.args.bottom
                    }



                    // if (child.args.bottom != null) {
                    //     if (child.args.top != null) {
                    //         child.args.height = height - child.args.top - child.args.bottom
                    //     }
                    //     child.args.y = height - child.args.height - child.args.bottom
                    // }

                    // width = width + childWidth + (i < children.length - 1 ? gap : 0)
                    // height = Math.max(height, childHeight)
    
                }
                // width += padding
                // height += padding * 2
            }

            args.width = width
            args.height = height

        },
        render(args, ctx) {
            if (!args.children || args.children.length == 0) {
                return
            }

            if ( args.backgroundColor) {
                ctx.fillStyle = args.backgroundColor
                ctx.fillRect(absoluteX(args), absoluteY(args), args.width, args.height)
            }
            let children = args.children.filter(c => (c.args.isVisible && c.args.isVisible.call(this)) || c.args.visible == null || c.args.visible)
            for (child of children) {
                child.args.parent = args
                child.handler.render(child.args, ctx)
            }
            

        },
        onPress(args, point) {
            for (child of args.children.slice().reverse()) {
                let x = absoluteX(child.args)
                let y = absoluteY(child.args)
                if (point.x > x
                        && point.x < x + child.args.width 
                        && point.y > y 
                        && point.y < y + child.args.height) {
                            child.handler.onPress(child.args, point)
                            return
                }
                
            }
        },
        onRelease(args, point) {
            if (!args.children || args.children.length == 0) {
                return
            }
            for (child of args.children) {
                if (child.handler.onRelease) {
                    child.handler.onRelease(child.args, point)
                }
                
            }
        }
    },
    rect: {
        calculate(args) {},
        render(args, ctx) {
            ctx.fillStyle = args.backgroundColor
            ctx.fillRect(absoluteX(args), absoluteY(args), args.width, args.height)
        }
    },
    button: {
        calculate(args) {},
        render(args, ctx) {
            
            let state = args.state ? args.state : 'active'
            let x = absoluteX(args)
            let y = absoluteY(args)
            let w = args.width
            let h = args.height

            ctx.fillStyle = args.backgroundColor
            ctx.fillRect(x, y, args.width, args.height)

            if (state == 'active') {
                ctx.lineWidth = '1' 
                line('white', [{x, y: y + h},{x, y}, {x: x + w, y}])
                line('#CCC', [{x: x + 1, y: y + h - 1},{x: x + 1, y: y + 1}, {x: x + w - 1, y: y + 1}])
                line('#333', [{x: x + w - 1, y: y + 1},{x: x + w - 1, y: y + h - 1}, {x: x + 1, y: y + h - 1}])
                line('black', [{x: x + w, y},{x: x + w, y: y + h}, {x, y: y + h}])

            } else {
                line('black', [{x, y: y + h},{x, y}, {x: x + w, y}])
                line('#333', [{x: x + 1, y: y + h - 1},{x: x + 1, y: y + 1}, {x: x + w - 1, y: y + 1}])
                line('#CCC', [{x: x + w - 1, y: y + 1},{x: x + w - 1, y: y + h - 1}, {x: x + 1, y: y + h - 1}])
                line('white', [{x: x + w, y},{x: x + w, y: y + h}, {x, y: y + h}])
            }

            if (args.img) {
                ctx.drawImage(args.img, x + 4, y + 4, args.width - 8, args.height - 8)
            }

            if (args.selected) {
                ctx.lineWidth = '2'
                ctx.strokeStyle = 'aqua'
                ctx.strokeRect(x + 4, y + 4, args.width - 8, args.height - 8)
            }
            
        },
        onPress(args, point) {
            args.state = "pressed"
            if (args.action) {
                args.action()
            }
        },
        onRelease(args, point) {
            args.state = "active"
        }
    }
}


let selectedButton = 'green'

const bush = new Image(); bush.src = "img/plants/bush3.png"
const tree = new Image(); tree.src = "img/plants/tree22.png"

let widgetsTree = function () { return {
    name: "root",
    handler: widgetsLibrary.container,
    args: {
        layout: "absolute",
        backgroundColor: "yellow",
        children: [
            {
                handler: widgetsLibrary.rect,
                args: {backgroundColor: "blue",right: 0,bottom: 0,left: 0,top: 0}
            },
            {
                handler: widgetsLibrary.container,
                args: {
                    layout: 'vertical',
                    backgroundColor: "grey",
                    left: 10,
                    top: 10,
                    children: [
                        {
                            handler: widgetsLibrary.tabs,
                            args: {
                                backgroundColor: 'grey',
                                tabs: [
                                    {
                                        name: "first",
                                        text: 'первый'
                                    },
                                    {
                                        name: "second",
                                        text: "второй",
                                    }
                                ],
                                children: [
                                    {
                                        handler: widgetsLibrary.button,
                                        args: {
                                            width: 40,
                                            height: 40,
                                            backgroundColor: "blue"
                                        }
                                    },
                                    {
                                        handler: widgetsLibrary.container,
                                        args: {
                                            backgroundColor: "green",
                                            padding: 5,
                                            gap: 5,
                                            children: [
                                                {
                                                    handler: widgetsLibrary.button,
                                                    args: {
                                                        width: 40,
                                                        height: 40,
                                                        backgroundColor: "yellow"
                                                    }
                                                },
                                                {
                                                    handler: widgetsLibrary.button,
                                                    args: {
                                                        width: 150,
                                                        height: 40,
                                                        backgroundColor: "yellow"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                ]
                            }
                        }
                    ]
                }
            },
            {
                handler: widgetsLibrary.container,
                args: {
                    layout: 'horizontal',
                    gap: 3,
                    backgroundColor: "grey",
                    padding: 5,
                    left: 10,
                    bottom: 10,
                    children: [
                        {
                            handler: widgetsLibrary.button,
                            args: {
                                width: 40,
                                height: 40
                            }
                        },
                        {
                            handler: widgetsLibrary.button,
                            args: {
                                width: 40,
                                height: 40
                            }
                        },
                        {
                            handler: widgetsLibrary.button,
                            args: {
                                width: 40,
                                height: 40
                            }
                        },
                        {
                            handler: widgetsLibrary.button,
                            args: {
                                width: 40,
                                height: 40
                            }
                        }
                    ]
                }
            },
            {
                handler: widgetsLibrary.container,
                args: {
                    layout: "vertical",
                    gap: 5,
                    backgroundColor: "aqua",
                    padding: 10,
                    right: 10,
                    top: 10,
                    children: [
                        {
                            handler: widgetsLibrary.rect,
                            args: { width: 100, height: 100, backgroundColor: 'red' }
                        },
                        {
                            handler: widgetsLibrary.rect,
                            args: { width: 130, height: 50, backgroundColor: 'green', visible: button1Visible }
                        },
                        {
                            handler: widgetsLibrary.container,
                            args: {
                                layout: "horizontal",
                                gap: 10,
                                padding: 5,
                                backgroundColor: "brown",
                                children: [
                                    {
                                        handler: widgetsLibrary.rect,
                                        args: { width: 50, height: 50, backgroundColor: 'red' }
                                    },
                                    {
                                        handler: widgetsLibrary.button,
                                        args: { width: 50, height: 50, backgroundColor: 'grey', 
                                            action: ()=> {console.log("button 1 clicked"); selectedButton = 'green'},
                                            img: bush, 
                                            visible: button1Visible, selected: selectedButton == 'green' }
                                    },
                                    {
                                        handler: widgetsLibrary.button,
                                        args: { width: 50, height: 50, backgroundColor: 'grey', 
                                            action: ()=> {console.log("button 1 clicked"); selectedButton = 'blue'}, 
                                            img: tree,
                                            visible: button1Visible, selected: selectedButton == 'blue' }
                                    },
                                    {   
                                        handler: widgetsLibrary.button,
                                        args: { width: 50, height: 50, backgroundColor: 'yellow', 
                                            action: ()=> { console.log("button 2 clicked"); button1Visible = ! button1Visible} }
                                    },
                                ]
                            }
                        }
                    ]
                }
            },
            
        ]
    }
    
}}

let widgetsTreeCompiled = widgetsTree()
widgetsTreeCompiled.args.width = 600
widgetsTreeCompiled.args.height = 400
widgetsTreeCompiled.args.x = 0
widgetsTreeCompiled.args.y = 0

canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.x
    const y = e.clientY - rect.y
    
    widgetsLibrary.container.onPress(widgetsTreeCompiled.args, {x, y})
})

canvas.addEventListener('mouseup', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.x
    const y = e.clientY - rect.y
    
    widgetsLibrary.container.onRelease(widgetsTreeCompiled.args, {x, y})
})

canvas.addEventListener('mouseleave', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.x
    const y = e.clientY - rect.y
    
    widgetsLibrary.container.onRelease(widgetsTreeCompiled.args, {x, y})
})


function isObject(item) {
    return (item && typeof item == 'object' && !Array.isArray(item) && !(item instanceof Image))
}

function deepMerge(first, second) {
    if (isObject(first) && isObject(second)) {
        for (const key in second) {
            if (isObject(second[key])) {
                deepMerge(first[key], second[key])
            } else if (Array.isArray(second[key])) {

                for (let i = 0; i < second[key].length; i++) {
                    if (isObject(second[key][i])) {
                        deepMerge(first[key][i], second[key][i])
                    }
                }

            } else {
                first[key] = second[key]
            }
        }
    }
}


function ticker() {
    deepMerge(widgetsTreeCompiled, widgetsTree())
    // widgetsTreeCompiled = widgetsTree()
    
    widgetsLibrary.container.calculate(widgetsTreeCompiled.args)
    widgetsLibrary.container.render(widgetsTreeCompiled.args, ctx)

    

    setTimeout(ticker, 100)
}

ticker()