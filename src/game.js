console.log('[Jailson] Flappy Bird');

const hit = new Audio();
hit.src = './sounds/hit.wav';

const sprites = new Image();
sprites.src = './assets/sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const background = {
    spriteX: 390,
    spritesY: 0,
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
            background.spritesY,   // position x and y the sprite
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
            background.spritesY,   // position x and y the sprite
            background.width, 
            background.height, // crop sprite file image
            (background.paddingX + background.width), 
            background.paddingY, // padding sprite
            background.width, 
            background.height // size sprite file image
        );
    }
}

const floor = {
    spriteX: 0,
    spritesY: 610,
    width: 224,
    height: 112,
    paddingX: 0,
    paddingY: canvas.height - 112,
    draw() {
        context.drawImage(
            sprites, // file image with sprite
            floor.spriteX, 
            floor.spritesY,   // position x and y the sprite
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
            floor.spritesY,   // position x and y the sprite
            floor.width, 
            floor.height, // crop sprite file image
            (floor.paddingX + floor.width), 
            floor.paddingY, // padding sprite
            floor.width, 
            floor.height // size sprite file image
        );
    }
}

function collision(bird, floor) {
    if ((bird.paddingY + bird.height) >= floor.paddingY) {
        return true;
    }

    return false;
}

function createBird() {

    const bird = {
        spriteX: 0,
        spritesY: 0,
        width: 33,
        height: 24,
        paddingX: 10,
        paddingY: 50,
        speed: 0,
        gravity: 0.25,
        jump: 4.6,
        jumping() {
            bird.speed = - bird.jump
        },
        update() {
            if (collision(bird, floor)) {
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
            context.drawImage(
                sprites, // file image with sprite
                bird.spriteX, 
                bird.spritesY,   // position x and y the sprite
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


// Screens
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
            global.bird = createBird();
        },
        draw() {
            background.draw()
            floor.draw()
            global.bird.draw()
            intialScreenGame.draw();
        },
        click() {
            changeScreen(screens.GAME)
        },
        update() {

        }
    },

    GAME: {
        draw() {
            background.draw()
            floor.draw()
            global.bird.draw()
        },
        click() {
            global.bird.jumping()
        },
        update() {
            global.bird.update()
        }
    }
}

function render() { 

    activeScreen.draw();
    activeScreen.update();

    requestAnimationFrame(render);
}

window.addEventListener('click', () => {
    if (activeScreen.click()) {
        activeScreen.click()
    }
})

changeScreen(screens.BEGIN);

render();

