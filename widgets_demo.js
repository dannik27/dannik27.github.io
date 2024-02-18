


var button1Visible = true
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
                    layout: 'vertical', backgroundColor: "grey", left: 10, top: 10,
                    children: [
                        {
                            handler: widgetsLibrary.tabs,
                            args: {
                                backgroundColor: 'grey',
                                tabs: [
                                    { name: "first", text: 'первый' },
                                    { name: "second", text: "второй", }
                                ],
                                children: [
                                    {
                                        handler: widgetsLibrary.container,
                                        args: {
                                            children: [
                                                {
                                                    handler: widgetsLibrary.button,
                                                    args: {
                                                        width: 40, height: 40, backgroundColor: "blue"
                                                    }
                                                },
                                                {
                                                    handler: widgetsLibrary.text,
                                                    args: {
                                                        text: "qwe",
                                                        color: 'black',
                                                        padding: 5
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    
                                    {
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
                            args: { width: 40, height: 40, shortcut: "1" }
                        },
                        {
                            handler: widgetsLibrary.button,
                            args: { width: 40, height: 40, shortcut: "2" }
                        },
                        {
                            handler: widgetsLibrary.button,
                            args: { width: 40, height: 40 }
                        },
                        {
                            handler: widgetsLibrary.button,
                            args: { width: 40, height: 40 }
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
                                            img: bush, shortcut: "e",
                                            visible: button1Visible, selected: selectedButton == 'green' }
                                    },
                                    {
                                        handler: widgetsLibrary.button,
                                        args: { width: 50, height: 50, backgroundColor: 'grey', 
                                            action: ()=> {console.log("button 1 clicked"); selectedButton = 'blue'}, 
                                            img: tree, shortcut: "q",
                                            visible: button1Visible, selected: selectedButton == 'blue' }
                                    },
                                    {   
                                        handler: widgetsLibrary.button,
                                        args: { width: 50, height: 50, backgroundColor: 'yellow', shortcut: "d",
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

const mainCanvas = document.querySelector("#scene")
const context2d = mainCanvas.getContext("2d");

context2d.debug = false

registerUIEvents(mainCanvas)

function ticker() {
    renderUI(context2d, widgetsTree())

    setTimeout(ticker, 100)
}

ticker()