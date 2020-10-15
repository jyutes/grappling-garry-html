// Init app
const app = new PIXI.Application({
    backgroundColor: 0x1099bb,
    width: 350,
    height: 650
});
// Attach to html
document.body.appendChild(app.view);

// Gravity const
const g = 0.2;
const drag = 0.99



////// Garry Init //////

// Garry velocity
let garryVelocity = {
    x: 0,
    y: 7
};

let grappling = false;

// Garry speed
let garrySpeed = 0.03;

// Garry moveTo
let moveTo = {
    x: 0,
    y: 0,
    id: 0
}

let score = 0;
let combo = 1;

scoreText = new PIXI.Text(String(score));
scoreText.x = 50
scoreText.y = 50
app.stage.addChild(scoreText)

// create a new Sprite from an image path
const garry = PIXI.Sprite.from('/assets/garry.png');
// center the sprite's anchor point
garry.anchor.set(0.5);
garry.scale.set(0.1)
// move the sprite to the center of the screen
garry.x = app.screen.width / 2;
garry.y = app.screen.height / 2;
app.stage.addChild(garry);

////// Garry End Init //////


class Grapple {
    constructor(pos, id) {
        this.scored = false
        this.id = id;
        this.sprite = PIXI.Sprite.from('/assets/garry.png');
        // center the sprite's anchor point
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.1)
        // move the sprite to the center of the screen
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.cursor = 'pointer';
        this.sprite.on('click', (event) => {
            moveTo = {
                x: this.sprite.x,
                y: this.sprite.y,
                id: this.id
            }
            console.log(moveTo);
            const xDist = (moveTo.x - garry.x);
            const yDist = (moveTo.y - garry.y);
            garryVelocity.x = xDist*garrySpeed;
            garryVelocity.y = yDist*garrySpeed*-1;
            grappling = true
        })
        this.sprite.on('tap', (event) => {
            moveTo = {
                x: this.pos.x,
                y: this.pos.y,
                id: this.id
            }
            console.log(moveTo);
            const xDist = (moveTo.x - garry.x);
            const yDist = (moveTo.y - garry.y);
            garryVelocity.x = xDist*garrySpeed;
            garryVelocity.y = yDist*garrySpeed*-1;
            grappling = true
        })

        app.stage.addChild(this.sprite);
    }

    collide () {
        app.stage.removeChild(this.sprite)
        if (!this.scored) score += combo
        this.scored = true
    }
}

let grapples = []
let i = 0
let grapplesInit = 4
while (grapples.length < grapplesInit) {
    grapples.push(new Grapple({
        x: ((350 / grapplesInit) * i) + 350/(grapplesInit*2),
        y: 100
    }, grapples.length))
    i++
}

// Game update
app.ticker.add((delta) => {
    // Gravity
    if (!grappling) garryVelocity.y -= g * delta;

    // Adjust pos based on velocity
    garry.x += garryVelocity.x * delta;
    garry.y -= garryVelocity.y * delta;

    if (!grappling) garryVelocity.x *= drag * delta

    const grapple = grapples[moveTo.id]
    grapples.forEach(grap => {
        if (spritesIntersex(garry, grap.sprite)) {
            grap.collide();
        }
    });
        

    if (spritesIntersex(garry, grapple.sprite)) {
        grappling = false
        grapple.collide();
    }

    // If too low, game over
    if (garry.y > 700) {
        // Handle game over
        console.log('Game over');
        app.stop()
    }
    app.stage.removeChild(scoreText)
    scoreText = new PIXI.Text(String(score));
    scoreText.x = 50
    scoreText.y = 50
    app.stage.addChild(scoreText)
    

});

function spritesIntersex(ab, bb)
{
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}