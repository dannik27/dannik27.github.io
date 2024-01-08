
const wood = new Image(); 
wood.src = "img/items/wood.png"

const sprout = new Image(); 
sprout.src = "img/items/sprout.png"

const tree0 = new Image(); tree0.src = "img/plants/tree0.png"
const tree1 = new Image(); tree1.src = "img/plants/tree1.png"
const tree2 = new Image(); tree2.src = "img/plants/tree22.png"

const bush1 = new Image(); bush1.src = "img/plants/bush1.png"
const bush2 = new Image(); bush2.src = "img/plants/bush2.png"
const bush3 = new Image(); bush3.src = "img/plants/bush3.png"

const apple = new Image(); apple.src = "img/items/apple.png"
const berry = new Image(); berry.src = "img/items/berry.png"

const bed = new Image(); bed.src = "img/construction/bed.png"

const wall = new Image(); wall.src = "img/construction/wall1.png"
const wallHorizontal = new Image(); wallHorizontal.src = "img/construction/wall8.png"
const wallVertical = new Image(); wallVertical.src = "img/construction/wall12.png"
const wallCross = new Image(); wallCross.src = "img/construction/wall6.png"
const wallNorthWest = new Image(); wallNorthWest.src = "img/construction/wall11.png"
const wallNorth = new Image(); wallNorth.src = "img/construction/wall9.png"
const wallNorthEast = new Image(); wallNorthEast.src = "img/construction/wall10.png"
const wallEast = new Image(); wallEast.src = "img/construction/wall5.png"
const wallSouthEast = new Image(); wallSouthEast.src = "img/construction/wall4.png"
const wallSouth = new Image(); wallSouth.src = "img/construction/wall3.png"
const wallSouthWest = new Image(); wallSouthWest.src = "img/construction/wall2.png"
const wallWest = new Image(); wallWest.src = "img/construction/wall7.png"

const commandCut = new Image(); commandCut.src = "img/commands/cut.png"

const surfaceDirt1 = new Image(); surfaceDirt1.src = "img/surface/dirt1.png"
const surfaceDirt2 = new Image(); surfaceDirt2.src = "img/surface/dirt2.png"
const surfaceDirt3 = new Image(); surfaceDirt3.src = "img/surface/dirt3.png"

const surfaceGrass1 = new Image(); surfaceGrass1.src = "img/surface/grass1.png"
const surfaceGrass2 = new Image(); surfaceGrass2.src = "img/surface/grass3.png"

let collections = {


    items: {

        wood: {
            img: wood
        },
        sprout: {
            img: sprout
        },
        berry: {
            img: berry
        }

    },

    objects: {
        bed: {
            text: "Кровать",
            name: 'bed',
            img: bed,
            parts: [
                {
                    type: "wood",
                    qty: 20
                }
            ],
            inventory: [
                {
                    type: "wood",
                    qty: 10
                }
            ]
        },

        wall: {
            name: 'wall',
            oriented: true,
            orientedImg: {
                default: wall,
                horizontal: wallHorizontal,
                vertical: wallVertical,
                cross: wallCross,
                north: wallNorth,
                northEast: wallNorthEast,
                east: wallEast,
                southEast: wallSouthEast,
                south: wallSouth,
                southWest: wallSouthWest,
                west: wallWest,
                northWest: wallNorthWest
            },
            parts: [{type: 'wood', qty: 5}]
        },

        tree: {
            name: "tree",
            growRate: 1,
            parts: [{type: "sprout", qty: 1}],
            img: tree0,
            feature: { plant: { level: 0, type: "tree" } },
            phases: [
                {
                    level: 0,
                    img: tree0,
                    inventory: [{ type: 'wood', qty: 3 }]
                },
                {
                    level: 40,
                    img: tree1,
                    inventory: [{ type: 'wood', qty: 8 }]
                },
                {
                    level: 90,
                    img: tree2,
                    height: 2,
                    inventory: [{ type: 'wood', qty: 12 }, { type: 'sprout', qty: 1 }]
                }
            ]

        },

        berry_bush: {
            name: "berry_bush",
            growRate: 1,
            parts: [{type: "berry", qty: 1}],
            img: bush1,
            feature: { plant: { level: 0, type: "berry_bush" } },
            phases: [
                {
                    level: 0,
                    img: bush1,
                    inventory: [{ type: 'wood', qty: 1 }]
                },
                {
                    level: 40,
                    img: bush2,
                    inventory: [{ type: 'wood', qty: 3 }]
                },
                {
                    level: 100,
                    img: bush3,
                    inventory: [
                        {
                            type: 'wood',
                            qty: 3
                        },
                        {
                            type: 'berry',
                            qty: 5
                        }
                    ]
                }
            ]
        }

    }




}