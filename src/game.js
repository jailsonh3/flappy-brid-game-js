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
        birdCollisionPipes(pair) {
            const birdHead = global.bird.paddingY;
            const birdFoot = global.bird.paddingY + global.bird.height;

            if ((global.bird.paddingX + global.bird.width - 4) >= pair.x) {

                if(birdHead <= pair.pipeSky.y) {
                    return true;
                }

                if(birdFoot >= pair.pipefloor.y) {
                    return true;
                }
            }

            return false;
        },
        update() {
            const pairsFrames = frames % 100 === 0;

            if (pairsFrames) {
                pipes.pairs.push(
                    {
                        x: canvas.width,
                        y: 150 * (Math.random() + 1),
                        // y: 352,
                    },
                )
            }

            pipes.pairs.forEach(pair => { 
                pair.x -= 2;

                if (pipes.birdCollisionPipes(pair)) {
                    hit.play();
                    changeScreen(screens.GAME_OVER)
                }

                if (pair.x + pipes.width <= 0) {
                    pipes.pairs.shift();
                }

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
                    (-pair.y), // padding sprite
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

                pair.pipeSky = {
                    x: pair.x,
                    y: (pipes.height - pair.y)
                }

                pair.pipefloor = {
                    x: pair.x,
                    y: pipes.height + pipes.space - pair.y 
                }
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

                changeScreen(screens.GAME_OVER)
              
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

function createScore() {

    const score = {
        spots: 0,
        update() {
            global.pipes.pairs.forEach(pair => {  
                if (pair.x + global.pipes.width <= global.bird.width) {

                    const frameInterval = 20
                    const passedOnFrame = frames % frameInterval === 0

                    if (passedOnFrame) {
                        score.spots += 1;
                    }
                   
                }
            })
        },
        draw(){
            context.font = '35px "VT323"'
            context.textAlign = 'right'
            context.fillStyle = 'white'
            context.fillText(`Score: ${score.spots}`, canvas.width - 15, 35)
        }
    }

    return score;
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

const messageGameOver = {
    spriteX: 134,
    spritesY: 153,
    width: 226,
    height: 200,
    paddingX: (canvas.width / 2 ) - 226 / 2,
    paddingY: 50,
    draw(score) {
        context.drawImage(
            sprites, // file image with sprite
            messageGameOver.spriteX, 
            messageGameOver.spritesY,   // position x and y the sprite
            messageGameOver.width, 
            messageGameOver.height, // crop sprite file image
            messageGameOver.paddingX, 
            messageGameOver.paddingY, // padding sprite
            messageGameOver.width, 
            messageGameOver.height // size sprite file image
        );

        context.font = '25px "VT323"'
        context.textAlign = 'right'
        context.fillStyle = 'black'
        context.fillText(`${score}`, canvas.width - 85 , 145)
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
        initialize() {
            global.floor = createFloor();
            global.pipes = createPipes();
            global.bird = createBird();
        },
        draw() {
            background.draw()
            global.pipes.draw()
            global.floor.draw()
            global.bird.draw()
            intialScreenGame.draw()
        },
        click() {
            changeScreen(screens.GAME)
        },
        update() {
            global.floor.update()
        }
    },

    GAME: {
        initialize() { 
            global.score = createScore();
        },
        draw() {
            background.draw()
            global.pipes.draw()
            global.floor.draw()
            global.bird.draw()
            global.score.draw()
        },
        click() {
            global.bird.jumping()
        },
        update() {
            global.pipes.update()
            global.floor.update()
            global.bird.update()
            global.score.update()
        }
    },
    GAME_OVER: {
        draw() {
            messageGameOver.draw(global.score.spots)
        },
        click() {
            changeScreen(screens.BEGIN)
        },
        update() {
            //global.score.update()
        },
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

