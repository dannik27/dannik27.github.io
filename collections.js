
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

const torch = new Image(); torch.src = "img/construction/torch.png"

const wall = new Image(); wall.src = "img/construction/wall1.png"
const wallHorizontal = new Image(); wallHorizontal.src = "img/construction/wall12_5.png"
const wallVertical = new Image(); wallVertical.src = "img/construction/wall12_4.png"
const wallVerticalEnd = new Image(); wallVerticalEnd.src = "img/construction/wall12_2.png"
const wallCross = new Image(); wallCross.src = "img/construction/wall6.png"
const wallNorthWest = new Image(); wallNorthWest.src = "img/construction/wall12_3.png"
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
const surfaceDirt4 = new Image(); surfaceDirt4.src = "img/surface/dirt4.png"

const surfaceGrass1 = new Image(); surfaceGrass1.src = "img/surface/grass1.png"
const surfaceGrass2 = new Image(); surfaceGrass2.src = "img/surface/grass3.png"

const surfaceWater = new Image(); surfaceWater.src = "img/surface/water.png"

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
        torch: {
            text: "Факел",
            name: 'torch',
            img: torch,
            parts: [
                {
                    type: "wood",
                    qty: 10
                }
            ],
            feature: {
                light: {
                    radius: 80
                }
            }
        },
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
            feature: {
                lightBlock: {
                    blocks: [
                        {
                            x: 15,
                            y: 0,
                            w: 10,
                            h: 40
                        }
                    ]
                },
                obstacle: {
                    type: "house_wall"
                }
            },
            oriented: {
                default: {
                    img: wall,
                    feature: {
                        lightBlock: { blocks: [{ x: 15, y: 0, w: 10, h: 40}] }
                    },
                },  
                horizontal: { img: wallHorizontal, 
                    feature: {
                        lightBlock: { blocks: [{ x: 0, y: 0, w: 40, h: 15}] }
                    }},
                vertical: { 
                    img: wallVertical, 
                    feature: {
                        lightBlock: { blocks: [{ x: 15, y: 0, w: 10, h: 40}] }
                    }},
                verticalEnd: { 
                    img: wallVerticalEnd, 
                    feature: {
                        lightBlock: { blocks: [{ x: 15, y: 0, w: 10, h: 25}] }
                    }
                },
                cross: { img: wallCross, },
                north: { img: wallNorth, },
                northEast: { img: wallNorthEast, },
                east: { img: wallEast, },
                southEast: { img: wallSouthEast, },
                south: { img: wallSouth, },
                southWest: { img: wallSouthWest, },
                west: { img: wallWest, },
                northWest: { img: wallNorthWest, 
                    feature: {
                        lightBlock: { blocks: [{ x: 15, y: 0, w: 10, h: 40}, { x: 25, y: 0, w: 15, h: 15}] }
                } },
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