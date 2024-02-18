

const tempCanvas = document.createElement("canvas")
const tempCtx = tempCanvas.getContext("2d");


let registeredShortcuts = {}

function line(ctx, color, points) {
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()
}

function textWidth(text, font) {
    tempCtx.font = font
    return tempCtx.measureText(text).width
}

function textHeight(text, font) {
    tempCtx.font = font
    var fontMeasure = tempCtx.measureText(text);
    return fontMeasure.actualBoundingBoxAscent + fontMeasure.actualBoundingBoxDescent;
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
    text: {
        calculate(args) {
            let font = args.font ?? 'bold 14px Arial'
            let padding = args.padding ?? 0

            args.width = textWidth(args.text, font) + padding * 2
            args.height = textHeight(args.text, font) + padding * 2

        },
        render(args, ctx) {

            let font = args.font ?? 'bold 14px Arial'
            let color = args.color ?? 'black'
            let padding = args.padding ?? 0
            ctx.font = font
            ctx.fillStyle = color
            ctx.textAlign="left"; 
            ctx.textBaseline="top"
            ctx.fillText(args.text , args.x + padding, args.y + padding)
            
            if (ctx.debug) {
                ctx.lineWidth = '2' 
                line(ctx, 'red', [{x: args.x, y: args.y + 5}, {x: args.x, y: args.y}, {x: args.x + 5, y: args.y}])
                line(ctx, 'red', [{x: args.x + args.width - 5, y: args.y}, {x: args.x + args.width, y: args.y}, {x: args.x + args.width, y: args.y + 5}])
                line(ctx, 'red', [{x: args.x, y: args.y + args.height - 5}, {x: args.x, y: args.y + args.height}, {x: args.x + 5, y: args.y + args.height}])
                line(ctx, 'red', [{x: args.x + args.width - 5, y: args.y + args.height}, {x: args.x + args.width, y: args.y + args.height}, 
                    {x: args.x + args.width, y: args.y + args.height - 5}])
            }
            


        },
        onPress(args, point) {

        },
        onRelease(args, point) {
            
        }
    },
    tabs: {
        calculate(args) {
            args.selectedTab = args.selectedTab ? args.selectedTab : 0
            if (!args.children || args.children.length == 0) {
                // args.width = args.width ? args.width : 0
                // args.height = args.height ? args.height : 0
                args.width = 0
                args.height = 0
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
                tabWidth = Math.max(tabWidth, minTabWidth) + 10
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

            if (!args.children || args.children.length == 0) {
                return
            }

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
        },
        onMouseMove(args, point) {
            for (child of args.children) {
                let x = absoluteX(child.args)
                let y = absoluteY(child.args)
                if (point.x > x
                        && point.x < x + child.args.width 
                        && point.y > y 
                        && point.y < y + child.args.height
                        && child.handler.onMouseMove) {
                            child.handler.onMouseMove(child.args, point)
                }
                
            }
        },
        onMouseLeave(args) {
            for (child of args.children) {
                if (child.handler.onMouseLeave) {
                    child.handler.onMouseLeave(child.args)
                }
            }
        }
    },
    rect: {
        calculate(args) {},
        render(args, ctx) {
            if (args.backgroundColor) {
                ctx.fillStyle = args.backgroundColor
                ctx.fillRect(absoluteX(args), absoluteY(args), args.width, args.height)
            }
            if (args.img) {
                ctx.drawImage(args.img, args.x + 4, args.y + 4, args.width - 8, args.height - 8)
            }
        }
    },
    button: {
        calculate(args) {

            if (args.shortcut) {
                registeredShortcuts[args.shortcut] = {
                    press: () => widgetsLibrary.button.onPress(args),
                    release: () => widgetsLibrary.button.onRelease(args)
                }
            }

        },
        render(args, ctx) {
            
            let state = args.state ? args.state : 'active'
            let x = absoluteX(args)
            let y = absoluteY(args)
            let w = args.width
            let h = args.height

            ctx.fillStyle = args.backgroundColor ?? "grey"
            ctx.fillRect(x, y, args.width, args.height)

            if (state == 'active') {
                ctx.lineWidth = '1' 
                line(ctx, 'white', [{x, y: y + h},{x, y}, {x: x + w, y}])
                line(ctx, '#CCC', [{x: x + 1, y: y + h - 1},{x: x + 1, y: y + 1}, {x: x + w - 1, y: y + 1}])
                line(ctx, '#333', [{x: x + w - 1, y: y + 1},{x: x + w - 1, y: y + h - 1}, {x: x + 1, y: y + h - 1}])
                line(ctx, 'black', [{x: x + w, y},{x: x + w, y: y + h}, {x, y: y + h}])

            } else {
                line(ctx, 'black', [{x, y: y + h},{x, y}, {x: x + w, y}])
                line(ctx, '#333', [{x: x + 1, y: y + h - 1},{x: x + 1, y: y + 1}, {x: x + w - 1, y: y + 1}])
                line(ctx, '#CCC', [{x: x + w - 1, y: y + 1},{x: x + w - 1, y: y + h - 1}, {x: x + 1, y: y + h - 1}])
                line(ctx,   'white', [{x: x + w, y},{x: x + w, y: y + h}, {x, y: y + h}])
            }

            if (args.img) {
                ctx.drawImage(args.img, x + 4, y + 4, args.width - 8, args.height - 8)
            }

            

            if (args.selected) {
                ctx.lineWidth = '2'
                ctx.strokeStyle = 'aqua'
                ctx.strokeRect(x + 4, y + 4, args.width - 8, args.height - 8)
            }

            if (args.shortcut) {
                ctx.textAlign="center"; 
                ctx.textBaseline="middle"
                ctx.fillStyle = "red";
                ctx.font="bold 14px Arial";
                ctx.fillText(args.shortcut, x + 8, y + 8);
            }
            
        },
        onPress(args, point) {
            args.state = "pressed"
            
        },
        onRelease(args, point) {
            if (args.state == "pressed" && args.action) {
                args.action()
            }
            args.state = "active"
            
        }
    }
}




let widgetsTreeCompiled = null

function isObject(item) {
    return (item && typeof item == 'object' && !Array.isArray(item) && !(item instanceof Image))
}

function deepMerge(first, second) {
    if (isObject(first) && isObject(second)) {
        for (const key in second) {
            if (isObject(second[key])) {
                deepMerge(first[key], second[key])
            } else if (Array.isArray(second[key])) {

                if(first[key].length != second[key].length) {
                    first[key] = second[key]
                } else {
                    for (let i = 0; i < second[key].length; i++) {
                        if (isObject(second[key][i])) {
                            deepMerge(first[key][i], second[key][i])
                        }
                    }
                }  

            } else {
                first[key] = second[key]
            }
        }
    }
}



function registerUIEvents(canvas) {
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

    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.x
        const y = e.clientY - rect.y
        
        widgetsLibrary.container.onMouseMove(widgetsTreeCompiled.args, {x, y})
    })

    canvas.addEventListener('mouseleave', function(e) {
        widgetsLibrary.container.onMouseLeave(widgetsTreeCompiled.args)
    })
    
    window.addEventListener('keydown', function(e) {
        let code = e.keyCode
        console.log("key pressed " + code + " " + e.key)
        if ( registeredShortcuts[e.key] ) {
            if(registeredShortcuts[e.key].press) {
                registeredShortcuts[e.key].press()
            }
        }
    })

    window.addEventListener('keyup', function(e) {
        let code = e.keyCode
        if ( registeredShortcuts[e.key] ) {
            if(registeredShortcuts[e.key].release) {
                registeredShortcuts[e.key].release()
            }
        }
    })
}


function renderUI(ctx, model) {
    if (widgetsTreeCompiled) {
        deepMerge(widgetsTreeCompiled, model)
    } else {
        widgetsTreeCompiled = model
        widgetsTreeCompiled.args.width = ctx.canvas.width
        widgetsTreeCompiled.args.height = ctx.canvas.height
        widgetsTreeCompiled.args.x = 0
        widgetsTreeCompiled.args.y = 0
    }
    
    registeredShortcuts = {}
    widgetsLibrary.container.calculate(widgetsTreeCompiled.args)
    widgetsLibrary.container.render(widgetsTreeCompiled.args, ctx)
}


let widgets = {
    for: function(items, filter, renderFunction) {
        return filter 
            ? items.filter(filter).map(renderFunction) 
            : items.map(renderFunction)
    },
    if: function(condition, renderFunction) {
        if (condition) {
            return renderFunction()
        } else {
            return []
        }
    }
}