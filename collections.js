
const wood = new Image(); 
wood.src = "img/items/wood.png"

const sprout = new Image(); 
sprout.src = "img/items/sprout.png"

const tree0 = new Image(); tree0.src = "img/plants/tree0.png"
const tree1 = new Image(); tree1.src = "img/plants/tree1.png"
const tree2 = new Image(); tree2.src = "img/plants/tree2.png"

const bush1 = new Image(); bush1.src = "img/plants/bush1.png"
const bush2 = new Image(); bush2.src = "img/plants/bush2.png"
const bush3 = new Image(); bush3.src = "img/plants/bush3.png"

const apple = new Image(); apple.src = "img/items/apple.png"
const berry = new Image(); berry.src = "img/items/berry.png"

const bed = new Image(); bed.src = "img/construction/bed.png"

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
            ]
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