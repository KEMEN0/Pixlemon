// Start menu and button
const targetDiv = document.getElementById("container");
const btn = document.querySelector("#startbtn button");
const introSong = document.getElementById("introSong");
const gameplaySong = document.getElementById("gameplaySong");

gameplaySong.volume = 0.5;
introSong.volume = 0.5;

// Event listener for button click
btn.addEventListener("click", function() {
    targetDiv.style.display = "none";
    introSong.pause();
    gameplaySong.play();
});

document.addEventListener("DOMContentLoaded", function() {
    introSong.play();
});


// Canvas setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
console.log(battleZonesData)


canvas.width = 1024;
canvas.height = 576;

//maping out the collisions
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 35) {
    collisionsMap.push(collisions.slice(i, 35 + i))
}
//maping out the battlezones

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 35) {
    battleZonesMap.push(battleZonesData.slice(i, 35 + i))
}


// creating objects on canvas for collisions

class Boundary {
    static width = 95 //128
    static height = 100 //128
    constructor({ position }) {

        this.position = position
        this.width = 128
        this.height = 128
    }
    draw() {
        c.fillStyle = 'rgb(0,0,0, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
const boundaries = []

const offset = {
    x: -210,
    y: -20
}


// Create boundaries from collisions
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 847)
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y,
                }
            }))
    })
})

const battleZones = []

// Create battle zones from battleZonesData
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 847)
            battleZones.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y,
                }
            }))
    })
})
console.log(battleZones)


//import background
const image = new Image();
image.src = './assets/images/sixth-map.png';

// Import player image
const playerImg = new Image();
playerImg.src = './assets/images/playerDown.png';

// Sprite class for drawing images on canvas, aka the player
class Sprite {
    constructor({ position, velocity, Image, frames = { max: 1 } }) {
        this.position = position;
        this.Image = Image;
        this.frames = {...frames, val: 0, elapsed: 0 };

        this.Image.onload = () => {
            this.width = this.Image.width / this.frames.max
            this.height = this.Image.height
        }
        this.moving = false

    }

    draw() {
        c.drawImage(
            this.Image,
            this.frames.val * this.width,
            0,
            this.Image.width / this.frames.max,
            this.Image.height,
            this.position.x,
            this.position.y,
            this.Image.width / this.frames.max,
            this.Image.height
        )

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % 10 === 0) {

            if (this.frames.val < this.frames.max - 1) {

                this.frames.val++
            } else { this.frames.val = 0 }
        }
    }
}


// Create background and player sprites
const player = new Sprite({
    position: {
        // here we use the dimententions of the img it self
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    Image: playerImg,
    frames: {
        max: 4
    }
})



const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    Image: image
});

// Object to track key presses
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
};


const moavables = [background, ...boundaries] //spread oprator ...
    // Object to track key presses
function rectangulerClollison({ rectangul1, rectangul2 }) {
    return (
        rectangul1.position.x + rectangul1.width >= rectangul2.position.x &&
        rectangul1.position.x <= rectangul2.position.x + rectangul2.width &&
        rectangul1.position.y <= rectangul2.position.y + rectangul2.height &&
        rectangul1.position.y + rectangul1.width >= rectangul2.position.y)
}

// Function to check collision with boundaries and battle zones
function checkBoundry() {
    var status = false
    battleZones.forEach((battleZone) => {
        battleZone.draw()
        if (
            rectangulerClollison({
                rectangul1: player,
                rectangul2: battleZone

            })

        ) {
            console.log(' Battle collide');
            status = true
            return true
        } else {

        }
    })



    boundaries.forEach(boundary => {
        boundary.draw()
        if (
            rectangulerClollison({
                rectangul1: player,
                rectangul2: boundary

            })

        ) {
            console.log('colliding');
            status = true
            return true
        } else {

        }
    })
    return status


}

// Animation function
function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    player.draw()
    let moving = true;

    //player movement
    if (keys.w.pressed) {

        console.log(checkBoundry())
        if (!checkBoundry()) {

            moavables.forEach(moavable => { moavable.position.y += 3 })
        }

    }
    if (keys.a.pressed) {

        moavables.forEach(moavable => { moavable.position.x += 3 })
            //}
    }
    if (keys.s.pressed) {
        console.log(checkBoundry())
        if (!checkBoundry()) {

            moavables.forEach(moavable => { moavable.position.y -= 3 })
        }
    }
    if (keys.d.pressed) {


        moavables.forEach(moavable => { moavable.position.x -= 3 })
    }

}


animate();



// Movement event listeners
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            //console.log('working!')
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 's':
            keys.s.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
    }
});
//stop movement
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});