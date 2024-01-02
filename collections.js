
const wood = new Image(); 
wood.src = "img/items/wood.png"

const sprout = new Image(); 
sprout.src = "img/items/sprout.png"

const tree0 = new Image(); tree0.src = "img/plants/tree0.png"
const tree1 = new Image(); tree1.src = "img/plants/tree1.png"
const tree2 = new Image(); tree2.src = "img/plants/tree2.png"

let collections = {


    items: {

        wood: {
            img: wood
        },
        sprout: {
            img: sprout
        }

    },

    plants: {

        tree: {
            growRate: 1,

            phases: [
                {
                    level: 0,
                    img: tree0,
                    inventory: [
                        {
                            type: 'wood',
                            qty: 3
                        }
                    ]
                },
                {
                    level: 40,
                    img: tree1,
                    inventory: [
                        {
                            type: 'wood',
                            qty: 8
                        }
                    ]
                },
                {
                    level: 90,
                    img: tree2,
                    height: 2,
                    inventory: [
                        {
                            type: 'wood',
                            qty: 12
                        },
                        {
                            type: 'sprout',
                            qty: 1
                        }
                    ]
                }
            ]

        }

    }




}