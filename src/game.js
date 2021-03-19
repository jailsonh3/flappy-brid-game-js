console.log('[Jailson] Flappy Bird');

let frames = 0;

const hit = new Audio();
hit.src = './sounds/hit.wav';

const sprites = new Image();
sprites.src = './assets/sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    paddingX: 0,
    paddingY: canvas.height - 204,
    draw() {
        context.fillStyle = '#70c5ce';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.drawImage(
            sprites, // file image with sprite
            background.spriteX, 
            background.spriteY,   // position x and y the sprite
            background.width, 
            background.height, // crop sprite file image
            background.paddingX, 
            background.paddingY, // padding sprite
            background.width, 
            background.height // size sprite file image
        );

        context.drawImage(
            sprites, // file image with sprite
            background.spriteX, 
            background.spriteY,   // position x and y the sprite
            background.width, 
            background.height, // crop sprite file image
            (background.paddingX + background.width), 
            background.paddingY, // padding sprite
            background.width, 
            background.height // size sprite file image
        );
    }
}

function createFloor () {
    const floor = {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112,
        paddingX: 0,
        paddingY: canvas.height - 112,
        update() {
           floor.paddingX = (floor.paddingX - 1) % (floor.width / 2);
        },
        draw() {
            context.drawImage(
                sprites, // file image with sprite
                floor.spriteX, 
                floor.spriteY,   // position x and y the sprite
                floor.width, 
                floor.height, // crop sprite file image
                floor.paddingX, 
                floor.paddingY, // padding sprite
                floor.width, 
                floor.height // size sprite file image
            );
            context.drawImage(
                sprites, // file image with sprite
                floor.spriteX, 
                floor.spriteY,   // position x and y the sprite
                floor.width, 
                floor.height, // crop sprite file image
                (floor.paddingX + floor.width), 
                floor.paddingY, // padding sprite
                floor.width, 
                floor.height // size sprite file image
            );
        }
    }

    return floor;
}


function createPipes() {

    const pipes = {
        width: 52,
        height: 400,
        floor: {
            spriteX: 0,
            spriteY: 169,
            paddingX: 220,
            paddingY: 400,
        },
        sky: {
            spriteX: 52,
            spriteY: 169,
            paddingX: 220,
            paddingY: 0,
        },
        space: 90,
        yRandom: 150,
        pairs: [],
        update() {
            const pairsFrames = frames % 100 === 0;

            if (pairsFrames) {
                pipes.pairs.push(
                    {
                        x: canvas.width,
                        y: 150 * (Math.random() + 1),
                    },
                )
            }

            pipes.pairs.forEach( pair => { 
                pair.x -= 2;
            })

        },
        draw() {
            pipes.pairs.forEach( pair => {
                context.drawImage(
                    sprites, // file image with sprite
                    pipes.sky.spriteX, pipes.sky.spriteY,   // position x and y the sprite
                    pipes.width, 
                    pipes.height, // crop sprite file image
                    pair.x, //pipes.sky.paddingX, 
                    (pipes.sky.paddingY - pair.y), // padding sprite
                    pipes.width, 
                    pipes.height // size sprite file image
                );
    
                context.drawImage(
                    sprites, // file image with sprite
                    pipes.floor.spriteX, pipes.floor.spriteY,   // position x and y the sprite
                    pipes.width, 
                    pipes.height, // crop sprite file image
                    pair.x, //pipes.floor.paddingX, 
                    (pipes.floor.paddingY + pipes.space - pair.y), // padding sprite
                    pipes.width, 
                    pipes.height // size sprite file image
                );
            })
        }
    }

    return pipes;
}

function createBird() {

    const bird = {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24,
        paddingX: 10,
        paddingY: 50,
        speed: 0,
        gravity: 0.25,
        jump: 4.6,
        currentFrame: 0,
        movement: [
            { spriteX: 0, spriteY: 0 },
            { spriteX: 0, spriteY: 26 },
            { spriteX: 0, spriteY: 52 },
        ],
        updateCurrentFrame(){
            const frameInterval = 10
            const passedOnFrame = frames % frameInterval === 0

            if(passedOnFrame) {
                bird.currentFrame = (1 + bird.currentFrame) % (bird.movement.length); 
            }
        
        },
        jumping() {
            bird.speed = - bird.jump
        },
        update() {
            if (collision(bird, global.floor)) {
                hit.play();

                setTimeout(()=> {
                    changeScreen(screens.BEGIN)
                }, 400);
                return;
            }
    
            bird.speed += this.gravity
            bird.paddingY += bird.speed
        },
        draw() {
            bird.updateCurrentFrame();

            const { spriteX, spriteY } = bird.movement[bird.currentFrame];

            context.drawImage(
                sprites, // file image with sprite
                spriteX, spriteY,   // position x and y the sprite
                bird.width, 
                bird.height, // crop sprite file image
                bird.paddingX, 
                bird.paddingY, // padding sprite
                bird.width, 
                bird.height // size sprite file image
            );
        }
    }

    return bird;
}

function collision(bird, floor) {
    if ((bird.paddingY + bird.height) >= floor.paddingY) {
        return true;
    }

    return false;
}

const intialScreenGame = {
    spriteX: 134,
    spritesY: 0,
    width: 174,
    height: 152,
    paddingX: (canvas.width / 2 ) - 174 / 2,
    paddingY: 50,
    draw() {
        context.drawImage(
            sprites, // file image with sprite
            intialScreenGame.spriteX, 
            intialScreenGame.spritesY,   // position x and y the sprite
            intialScreenGame.width, 
            intialScreenGame.height, // crop sprite file image
            intialScreenGame.paddingX, 
            intialScreenGame.paddingY, // padding sprite
            intialScreenGame.width, 
            intialScreenGame.height // size sprite file image
        );
    }
}

const global = {};
let activeScreen = {}; 

function changeScreen(newScreen) {
    activeScreen = newScreen;

    if (activeScreen.initialize) {
        activeScreen.initialize();
    }
}

const screens = {
    BEGIN: {
        initialize () {
            global.floor = createFloor();
            global.pipes = createPipes();
            global.bird = createBird();
        },
        draw() {
            background.draw()
            global.floor.draw()
            global.pipes.draw()
            global.bird.draw()
            // intialScreenGame.draw()
        },
        click() {
            changeScreen(screens.GAME)
        },
        update() {
            global.floor.update()
            global.pipes.update()
        }
    },

    GAME: {
        draw() {
            background.draw()
            global.floor.draw()
            global.pipes.draw()
            global.bird.draw()
        },
        click() {
            global.bird.jumping()
        },
        update() {
            global.floor.update()
            global.pipes.update()
            global.bird.update()
        }
    }
}

function render() { 

    activeScreen.draw();
    activeScreen.update();

    frames += 1;

    requestAnimationFrame(render);
}

window.addEventListener('click', () => {
    if (activeScreen.click()) {
        activeScreen.click()
    }
})

changeScreen(screens.BEGIN);

render();

